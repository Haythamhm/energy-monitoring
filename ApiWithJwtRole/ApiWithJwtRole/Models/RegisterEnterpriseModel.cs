namespace ApiWithJwtRole.Models
{
    public class RegisterEnterpriseModel
    {
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string EnterpriseName { get; set; } = string.Empty;
        public int NumberOfEmployees { get; set; }
        public DateTime ContractDate { get; set; }
        public string Category { get; set; } = string.Empty;
    }
}