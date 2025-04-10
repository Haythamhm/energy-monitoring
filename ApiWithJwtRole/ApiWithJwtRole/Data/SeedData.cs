using ApiWithJwtRole.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ApiWithJwtRole.Data
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<AppDbContext>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            // Migrate the database
            await context.Database.MigrateAsync();

            // Seed roles
            if (!await roleManager.RoleExistsAsync(UserRoles.SuperAdmin))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.SuperAdmin));

            if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));

            if (!await roleManager.RoleExistsAsync(UserRoles.Enterprise))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.Enterprise));

            // Seed super admin
            var superAdminEmail = "superadmin@freetrained.com";
            var superAdmin = await userManager.FindByEmailAsync(superAdminEmail);
            if (superAdmin == null)
            {
                var user = new ApplicationUser
                {
                    UserName = "superadmin",
                    Email = superAdminEmail,
                    FullName = "Super Admin",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(user, "SuperAdmin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, UserRoles.SuperAdmin);
                }
            }
        }
    }
}