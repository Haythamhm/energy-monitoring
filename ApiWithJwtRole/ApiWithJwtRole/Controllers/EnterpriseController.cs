// Controllers/EnterpriseController.cs
using ApiWithJwtRole.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiWithJwtRole.Controllers
{
    [Authorize(Roles = UserRoles.Admin)]
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
            var enterprises = await _userManager.GetUsersInRoleAsync(UserRoles.Enterprise);
            var enterpriseList = enterprises.Select(user => new
            {
                id = user.Id,
                userName = user.UserName,
                email = user.Email,
                fullName = user.FullName,
                enterpriseName = user.EnterpriseName,
                numberOfEmployees = user.NumberOfEmployees,
                contractDate = user.ContractDate,
                category = user.Category
            }).ToList();
            return Ok(enterpriseList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEnterpriseById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "Enterprise not found" });

            var isEnterprise = await _userManager.IsInRoleAsync(user, UserRoles.Enterprise);
            if (!isEnterprise)
                return BadRequest(new { message = "User is not an enterprise" });

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEnterprise(string id, [FromBody] UpdateEnterpriseModel model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "Enterprise not found" });

            var isEnterprise = await _userManager.IsInRoleAsync(user, UserRoles.Enterprise);
            if (!isEnterprise)
                return BadRequest(new { message = "User is not an enterprise" });

            user.Email = model.Email;
            user.FullName = model.FullName;
            user.EnterpriseName = model.EnterpriseName;
            user.NumberOfEmployees = model.NumberOfEmployees;
            user.ContractDate = model.ContractDate;
            user.Category = model.Category;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = "Enterprise updated successfully!", user }); // Return JSON
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnterprise(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "Enterprise not found" });

            var isEnterprise = await _userManager.IsInRoleAsync(user, UserRoles.Enterprise);
            if (!isEnterprise)
                return BadRequest(new { message = "User is not an enterprise" });

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = "Enterprise deleted successfully!" }); // Return JSON
        }
    }
}