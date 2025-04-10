using ApiWithJwtRole.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ApiWithJwtRole.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) 
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Simple configuration without sensor hierarchy
            builder.Entity<ApplicationUser>()
                .HasMany(u => u.Sites)
                .WithOne(s => s.ApplicationUser)
                .HasForeignKey(s => s.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        // Only include DbSets you need immediately
        public DbSet<Site> Sites { get; set; }
    }
}