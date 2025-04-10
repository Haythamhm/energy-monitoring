namespace ApiWithJwtRole.Models
{
    public class Site
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public double Altitude { get; set; }
        public double Longitude { get; set; }
        
        // Foreign key
        public string ApplicationUserId { get; set; } = string.Empty;
        public virtual ApplicationUser? ApplicationUser { get; set; }
        
        public virtual ICollection<Room>? Rooms { get; set; }
    }
}