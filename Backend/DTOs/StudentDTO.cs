using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using FormBackend.Models;
using FormBackend.Models.Enum;

namespace FormBackend.DTOs
{
    public class AddressDTO
    {
        public required string Province { get; set; }
        public required string Municipality { get; set; }
        public required string Ward { get; set; }
        public string? Street { get; set; }
        public required string Country { get; set; } = "Nepal";
        public AddressType Type { get; set; }
    }

    public class ParentDTO
    {
        public required string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public required string LastName { get; set; }
        public required string Relation { get; set; }
        public string? Occupation { get; set; }
        public decimal? AnnualIncome { get; set; }
        public string? MobileNumber { get; set; }
        public string? Email { get; set; }
    }

    public class AcademicHistoryDTO
    {
        public required string InstitutionName { get; set; }
        public required AcademicLevel Level { get; set; }
        public string? Board { get; set; }
        public double PercentageOrGPA { get; set; }
        public int PassingYear { get; set; }
    }

    public class StudentDTO
    {
        public int Id { get; set; }
        // Personal Details
        public required string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public required string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public BloodType BloodGroup { get; set; }

        // Relationships
        public CitizenshipDTO? Citizenship { get; set; }
        public ContactInfoDTO? ContactInfo { get; set; }
        public ICollection<AddressDTO> Addresses { get; set; } = new List<AddressDTO>();
        public ICollection<ParentDTO> Parents { get; set; } = new List<ParentDTO>();
        public ICollection<AcademicHistoryDTO> AcademicHistories { get; set; } = new List<AcademicHistoryDTO>();
        public AcademicEnrollmentDTO? AcademicEnrollment { get; set; }
        public ICollection<AchievementDTO> Achievements { get; set; } = new List<AchievementDTO>();
        public ICollection<HobbyDTO> Hobbies { get; set; } = new List<HobbyDTO>();
        public DisabilityDTO? Disability { get; set; }
        public ScholarshipDTO? Scholarship { get; set; }
    }

    public class CitizenshipDTO
    {
        public required string CitizenshipNumber { get; set; }
        public required string CountryOfIssuance { get; set; }
        public DateTime DateOfIssuance { get; set; }
        public string? PlaceOfIssuance { get; set; }
    }

    public class ContactInfoDTO
    {
        public required string PrimaryMobile { get; set; }
        public string? AlternateMobile { get; set; }
        public required string PrimaryEmail { get; set; }
        public string? AlternateEmail { get; set; }
    }

    public class AcademicEnrollmentDTO
    {
        public int FacultyId { get; set; }
        public required string ProgramName { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public string? StudentIdNumber { get; set; }
    }

    public class AchievementDTO
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DateOfAchievement { get; set; }
    }

    public class HobbyDTO
    {
        public string? Name { get; set; }
    }

    public class DisabilityDTO
    {
        public string? DisabilityType { get; set; }
        public string? Description { get; set; }
        public double? DisabilityPercentage { get; set; }
    }

    public class ScholarshipDTO
    {
        public string? ScholarshipName { get; set; }
        public decimal? Amount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
