using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FormBackend.Models.Enum;

namespace FormBackend.Models
{
    public class AcademicHistory : BaseEntity
    {
        [Required]
        public required string InstitutionName { get; set; }
        [Required]
        public AcademicLevel Level { get; set; }
        public string? Board { get; set; }
        [Required]
        public double PercentageOrGPA { get; set; }
        [Required]
        public DateOnly PassedYear { get; set; }

        // Foreign Key to Student
        [ForeignKey("Student")]
        public Guid StudentPID { get; set; }
        public virtual Student? Student { get; set; }
    }
}
