namespace ApiWithJwtRole.Models
{
    public class Sensor
    {
        public int Id { get; set; }
        public string FriendlyName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public double Precision { get; set; }
        public string MeasurementRange { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
        public DateTime LastChanged { get; set; }
        public DateTime LastReported { get; set; }
        public double Consumption { get; set; }
        public string Description { get; set; } = string.Empty;
        
        // Foreign key
        public int RaspberryId { get; set; }
        public virtual Raspberry? Raspberry { get; set; }
        
        
    }
}