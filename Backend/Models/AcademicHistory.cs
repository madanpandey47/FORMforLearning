using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class AcademicHistory
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string InstitutionName { get; set; }
        [Required]
        public required string Level { get; set; } // e.g., "High School", "Bachelor's"
        public string? Board { get; set; }
        [Required]
        public double PercentageOrGPA { get; set; }
        [Required]
        public int PassingYear { get; set; }
    }
}
