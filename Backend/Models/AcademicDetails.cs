using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class AcademicDetails
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string SchoolName { get; set; }

        public string? CollegeName { get; set; }

        [Required]
        public virtual Address SchoolAddress { get; set; }

        [Required]
        public string PreviousGrade { get; set; }

        [Required]
        public double Percentage { get; set; }

        public int? PassingYear { get; set; }

        public string? ExtraCurricular { get; set; }
    }
}
