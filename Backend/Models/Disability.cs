using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class Disability
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string DisabilityType { get; set; } // e.g., "Visual", "Hearing", "Mobility"
        public string? Description { get; set; }
        public double? DisabilityPercentage { get; set; }
    }
}
