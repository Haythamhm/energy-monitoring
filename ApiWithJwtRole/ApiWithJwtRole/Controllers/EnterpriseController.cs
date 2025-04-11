// Controllers/EnterpriseController.cs
using ApiWithJwtRole.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ApiWithJwtRole.Controllers
{
    [Authorize(Roles = UserRoles.Admin + "," + UserRoles.SuperAdmin)]
    [Route("api/[controller]")]
    [ApiController]
    public class EnterpriseController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public EnterpriseController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEnterprises()
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEnterpriseById(string id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized(new { message = "User not authenticated" });

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null)
                return Unauthorized(new { message = "User not found" });

            var userRoles = await _userManager.GetRolesAsync(currentUser);
            var isSuperAdmin = userRoles.Contains(UserRoles.SuperAdmin);

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "Enterprise not found" });

            var isEnterprise = await _userManager.IsInRoleAsync(user, UserRoles.Enterprise);
            if (!isEnterprise)
                return BadRequest(new { message = "User is not an enterprise" });

            if (!isSuperAdmin && user.CreatedByAdminId != currentUserId)
                return Forbid("You can only access enterprises you created");

            return Ok(new
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
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEnterprise(string id, [FromBody] UpdateEnterpriseModel model)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized(new { message = "User not authenticated" });

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null)
                return Unauthorized(new { message = "User not found" });

            var userRoles = await _userManager.GetRolesAsync(currentUser);
            var isSuperAdmin = userRoles.Contains(UserRoles.SuperAdmin);

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "Enterprise not found" });

            var isEnterprise = await _userManager.IsInRoleAsync(user, UserRoles.Enterprise);
            if (!isEnterprise)
                return BadRequest(new { message = "User is not an enterprise" });

            if (!isSuperAdmin && user.CreatedByAdminId != currentUserId)
                return Forbid("You can only update enterprises you created");

            user.Email = model.Email;
            user.FullName = model.FullName;
            user.EnterpriseName = model.EnterpriseName;
            user.NumberOfEmployees = model.NumberOfEmployees;
            user.ContractDate = model.ContractDate;
            user.Category = model.Category;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = "Enterprise updated successfully!", user });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnterprise(string id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized(new { message = "User not authenticated" });

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null)
                return Unauthorized(new { message = "User not found" });

            var userRoles = await _userManager.GetRolesAsync(currentUser);
            var isSuperAdmin = userRoles.Contains(UserRoles.SuperAdmin);

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "Enterprise not found" });

            var isEnterprise = await _userManager.IsInRoleAsync(user, UserRoles.Enterprise);
            if (!isEnterprise)
                return BadRequest(new { message = "User is not an enterprise" });

            if (!isSuperAdmin && user.CreatedByAdminId != currentUserId)
                return Forbid("You can only delete enterprises you created");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = "Enterprise deleted successfully!" });
        }
    }
}