using System.ComponentModel.DataAnnotations;
using FormBackend.Models.Enum;

namespace FormBackend.Models
{
    public class AcademicHistory
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string InstitutionName { get; set; }
        [Required]
        public AcademicLevel Level { get; set; }
        public string? Board { get; set; }
        [Required]
        public double PercentageOrGPA { get; set; }
        [Required]
        public DateOnly PassedYear { get; set; }
    }
}
