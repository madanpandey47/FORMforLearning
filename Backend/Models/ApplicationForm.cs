using System;
using System.ComponentModel.DataAnnotations;

namespace FormBackend.Models
{
    public class ApplicationForm
    {
        [Key]
        public int Id { get; set; }

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
        public virtual Address PermanentAddress { get; set; }
        public virtual Address? TemporaryAddress { get; set; }

        public virtual FamilyDetails FamilyDetails { get; set; }

        public virtual AcademicDetails AcademicDetails { get; set; }

        public string? ProfileImage { get; set; }
        public List<string>? AdditionalDocuments { get; set; }


        [Required]
        public bool Agree { get; set; }
    }
}
