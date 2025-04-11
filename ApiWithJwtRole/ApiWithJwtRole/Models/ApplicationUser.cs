using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;

namespace ApiWithJwtRole.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        public string FullName { get; set; } = string.Empty;
        public string? EnterpriseName { get; set; }
        public int? NumberOfEmployees { get; set; }
        public DateTime? ContractDate { get; set; }
        public string? Category { get; set; }

        public virtual ICollection<Site>? Sites { get; set; }
        public string? CreatedByAdminId { get; set; }
        
    }
}