namespace ApiWithJwtRole.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Floor { get; set; }
        
        // Foreign keys
        public int SiteId { get; set; }
        public virtual Site? Site { get; set; }
        
        public virtual Raspberry? Raspberry { get; set; }
    }
}