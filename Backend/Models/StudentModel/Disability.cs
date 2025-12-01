using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class Disability
    {
        [Key]
        public int Id { get; set; }
        public string DisabilityType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public double? DisabilityPercentage { get; set; }
    }
}
