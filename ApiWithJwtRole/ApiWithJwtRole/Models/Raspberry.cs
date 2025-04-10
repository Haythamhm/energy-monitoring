namespace ApiWithJwtRole.Models
{
    public class Raspberry
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime UpdateDate { get; set; }
        public DateTime InstallationDate { get; set; }
        
        // Foreign key
        public int RoomId { get; set; }
        public virtual Room? Room { get; set; }
        
        public virtual ICollection<Sensor>? Sensors { get; set; }
    }
}