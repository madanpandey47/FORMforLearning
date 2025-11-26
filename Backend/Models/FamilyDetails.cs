using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class FamilyDetails
    {
        [Key]
        public int Id { get; set; }

        public string PrimaryContact { get; set; }

        [Required]
        public string FatherName { get; set; }

        [Required]
        public string FatherMobile { get; set; }

        public string? FatherOccupation { get; set; }

        [Required]
        public string MotherName { get; set; }

        [Required]
        public string MotherMobile { get; set; }

        public string? MotherOccupation { get; set; }

        public string? GuardianName { get; set; }

        public string? GuardianRelation { get; set; }

        public string? GuardianMobile { get; set; }

        [Required]
        public string AnnualIncome { get; set; }

        public string? FamilyType { get; set; }
    }
}
