using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using FormBackend.Models.Enum;

namespace FormBackend.Models
{
    public class Student : BaseEntity
    {
        [Required]
        public required string FirstName { get; set; }
        [Required]
        public required string LastName { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public Gender Gender { get; set; }
        [Required]
        [Phone]
        public required string PrimaryMobile { get; set; }
        [Required]
        [EmailAddress]
        public required string PrimaryEmail { get; set; }
        [Required]
        public BloodType BloodGroup { get; set; }
        public string? ProfileImagePath { get; set; }

        // Relationships
        public virtual Citizenship? Citizenship { get; set; }
        public virtual SecondaryInfos? SecondaryInfos { get; set; }
        public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();
        public virtual ICollection<Parent> Parents { get; set; } = new List<Parent>();
        public virtual ICollection<AcademicHistory> AcademicHistories { get; set; } = new List<AcademicHistory>();
        public virtual AcademicEnrollment? AcademicEnrollment { get; set; }
        public virtual ICollection<Achievement> Achievements { get; set; } = new List<Achievement>();
        public virtual ICollection<Hobby> Hobbies { get; set; } = new List<Hobby>();
        public virtual Disability? Disability { get; set; }
        public virtual Scholarship? Scholarship { get; set; }
    }
}
