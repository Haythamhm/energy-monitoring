// Controllers/AccountController.cs
using ApiWithJwtRole.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ApiWithJwtRole.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AccountController> _logger;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ILogger<AccountController> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("register-first-admin")]
        public async Task<IActionResult> RegisterFirstAdmin([FromBody] RegisterAdminModel model)
        {
            if ((await _userManager.GetUsersInRoleAsync(UserRoles.SuperAdmin)).Any())
            {
                return BadRequest(new { message = "Initial admin already exists" });
            }

            var user = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email,
                FullName = model.FullName
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded) return BadRequest(new { errors = result.Errors });

            if (!await _roleManager.RoleExistsAsync(UserRoles.SuperAdmin))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.SuperAdmin));

            await _userManager.AddToRoleAsync(user, UserRoles.SuperAdmin);
            return Ok(new { message = "Initial SuperAdmin created" });
        }

        [HttpPost("register-admin")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterAdminModel model)
        {
            var userExists = await _userManager.FindByNameAsync(model.UserName);
            if (userExists != null)
                return BadRequest(new { message = "User already exists!" });

            var user = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email,
                FullName = model.FullName,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors });

            if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));

            await _userManager.AddToRoleAsync(user, UserRoles.Admin);

            return Ok(new { message = "Admin created successfully!" });
        }

        [HttpPost("register-enterprise")]
        [Authorize(Roles = "SuperAdmin,Admin")] // Allow both SuperAdmin and Admin
        public async Task<IActionResult> RegisterEnterprise([FromBody] RegisterEnterpriseModel model)
        {
            var userExists = await _userManager.FindByNameAsync(model.UserName);
            if (userExists != null)
                return BadRequest(new { message = "Enterprise already exists!" });

            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized(new { message = "User not authenticated" });

            var user = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email,
                FullName = model.FullName,
                EnterpriseName = model.EnterpriseName,
                NumberOfEmployees = model.NumberOfEmployees,
                ContractDate = model.ContractDate,
                Category = model.Category,
                SecurityStamp = Guid.NewGuid().ToString(),
                CreatedByAdminId = currentUserId // Set the creator
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors });

            if (!await _roleManager.RoleExistsAsync(UserRoles.Enterprise))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Enterprise));

            await _userManager.AddToRoleAsync(user, UserRoles.Enterprise);

            return Ok(new { message = "Enterprise registered successfully!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.UserName))
                    return BadRequest(new { message = "Username is required" });
                if (string.IsNullOrEmpty(model.Password))
                    return BadRequest(new { message = "Password is required" });

                var user = await _userManager.FindByNameAsync(model.UserName);
                if (user == null)
                {
                    _logger.LogWarning($"Login failed: User {model.UserName} not found");
                    return Unauthorized(new { message = "Invalid credentials" });
                }

                _logger.LogInformation($"Attempting login for user: {user.UserName}");
                _logger.LogDebug($"Stored hash: {user.PasswordHash}");

                var passwordValid = await _userManager.CheckPasswordAsync(user, model.Password);
                if (!passwordValid)
                {
                    _logger.LogWarning($"Invalid password for user: {user.UserName}");
                    return Unauthorized(new { message = "Invalid credentials" });
                }

                var userRoles = await _userManager.GetRolesAsync(user);

                if (string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(user.Email))
                {
                    _logger.LogError("User data is incomplete (username or email is null)");
                    return BadRequest(new { message = "User data is incomplete" });
                }

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                };

                authClaims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")));

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
                );

                _logger.LogInformation($"Successful login for user: {user.UserName}");

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    roles = userRoles,
                    userId = user.Id,
                    userName = user.UserName,
                    email = user.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Login error for username: {model.UserName}");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        [HttpGet("claims")]
        [Authorize]
        public IActionResult GetClaims()
        {
            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            return Ok(claims);
        }

        [HttpGet("enterprises")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> GetEnterprises()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized(new { message = "User not authenticated" });

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null)
                return Unauthorized(new { message = "User not found" });

            var userRoles = await _userManager.GetRolesAsync(currentUser);
            var isSuperAdmin = userRoles.Contains(UserRoles.SuperAdmin);

            var enterprises = await _userManager.GetUsersInRoleAsync(UserRoles.Enterprise);
            var filteredEnterprises = enterprises;

            // If the user is not a SuperAdmin, filter enterprises by the Admin who created them
            if (!isSuperAdmin)
            {
                filteredEnterprises = enterprises.Where(e => e.CreatedByAdminId == currentUserId).ToList();
            }

            var enterpriseList = filteredEnterprises.Select(user => new
            {
                id = user.Id,
                userName = user.UserName,
                email = user.Email,
                fullName = user.FullName,
                enterpriseName = user.EnterpriseName,
                numberOfEmployees = user.NumberOfEmployees,
                contractDate = user.ContractDate,
                category = user.Category,
                createdByAdminId = user.CreatedByAdminId
            }).ToList();

            return Ok(enterpriseList);
        }

        [HttpPut("enterprises/{userId}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> UpdateEnterprise(string userId, [FromBody] RegisterEnterpriseModel model)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized(new { message = "User not authenticated" });

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null)
                return Unauthorized(new { message = "User not found" });

            var userRoles = await _userManager.GetRolesAsync(currentUser);
            var isSuperAdmin = userRoles.Contains(UserRoles.SuperAdmin);

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || !(await _userManager.IsInRoleAsync(user, UserRoles.Enterprise)))
                return NotFound(new { message = "Enterprise user not found" });

            // Check if the current Admin is allowed to update this Enterprise user
            if (!isSuperAdmin && user.CreatedByAdminId != currentUserId)
                return Forbid("You can only update enterprises you created");

            user.UserName = model.UserName;
            user.Email = model.Email;
            user.FullName = model.FullName;
            user.EnterpriseName = model.EnterpriseName;
            user.NumberOfEmployees = model.NumberOfEmployees;
            user.ContractDate = model.ContractDate;
            user.Category = model.Category;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = "Enterprise updated successfully!" });
        }

        [HttpDelete("enterprises/{userId}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> DeleteEnterprise(string userId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized(new { message = "User not authenticated" });

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null)
                return Unauthorized(new { message = "User not found" });

            var userRoles = await _userManager.GetRolesAsync(currentUser);
            var isSuperAdmin = userRoles.Contains(UserRoles.SuperAdmin);

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || !(await _userManager.IsInRoleAsync(user, UserRoles.Enterprise)))
                return NotFound(new { message = "Enterprise user not found" });

            // Check if the current Admin is allowed to delete this Enterprise user
            if (!isSuperAdmin && user.CreatedByAdminId != currentUserId)
                return Forbid("You can only delete enterprises you created");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = "Enterprise deleted successfully!" });
        }

        [HttpGet("client-stats")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> GetClientStats()
        {
            var users = await _userManager.GetUsersInRoleAsync(UserRoles.Enterprise);

            var active = users.Count(u => u.EmailConfirmed); // ou toute logique "actif"
            var inactive = users.Count(u => !u.EmailConfirmed); // ou `!u.LockoutEnabled` selon ta logique
            var installing = users.Count(u => string.IsNullOrEmpty(u.Category)); // exemple : pas encore complètement rempli

            return Ok(new
            {
                activeClients = active,
                inactiveClients = inactive,
                installingClients = installing
            });
        }

    }
}