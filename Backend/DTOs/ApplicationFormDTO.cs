using System.ComponentModel.DataAnnotations;

namespace FormBackend.DTOs
{
    public class AddressDTO
    {
        [Required]
        public string Province { get; set; }
        [Required]
        public string Municipality { get; set; }
        [Required]
        public string Ward { get; set; }
        public string? Street { get; set; }
        [Required]
        public string Country { get; set; }
    }

    public class FamilyDetailsDTO
    {
        [Required]
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

    public class AcademicDetailsDTO
    {
        [Required]
        public string SchoolName { get; set; }
        public string? CollegeName { get; set; }
        [Required]
        public AddressDTO SchoolAddress { get; set; }
        [Required]
        public string PreviousGrade { get; set; }
        [Required]
        public double Percentage { get; set; }
        public int? PassingYear { get; set; }
        public string? ExtraCurricular { get; set; }
    }

    public class ApplicationFormDTO
    {
        [Required]
        public string Firstname { get; set; }
        public string? Middlename { get; set; }
        [Required]
        public string Lastname { get; set; }
        [Required]
        public string Dob { get; set; }
        public string? Nationality { get; set; }
        public string? CitizenshipNumber { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [EmailAddress]
        public string? AlternateEmail { get; set; }
        [Required]
        public string Gender { get; set; }
        public string? Bloodgroup { get; set; }
        [Required]
        public string PrimaryMobile { get; set; }
        public string? AlternateMobile { get; set; }
        [Required]
        public string EmergencyContact { get; set; }
        [Required]
        public string EmergencyRelation { get; set; }
        public string? PreferredContactMethod { get; set; }
        [Required]
        public AddressDTO PermanentAddress { get; set; }
        public AddressDTO? TemporaryAddress { get; set; }
        [Required]
        public FamilyDetailsDTO FamilyDetails { get; set; }
        [Required]
        public AcademicDetailsDTO AcademicDetails { get; set; }
        public string? ProfileImage { get; set; }
        public List<string>? AdditionalDocuments { get; set; }
        [Required]
        public bool Agree { get; set; }
    }
}