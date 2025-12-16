using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using FormBackend.Models.Enum;
using Microsoft.AspNetCore.Http;

namespace FormBackend.DTOs
{
    // Base DTOs for nested objects
    public class AddressDTO
    {
        public required string Province { get; set; }
        public required string Municipality { get; set; }
        public required string Ward { get; set; }
        public string? Street { get; set; }
        public required string Country { get; set; }
        public AddressType Type { get; set; }
    }

    public class ParentDTO
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public required string LastName { get; set; }
        public required ParentType Relation { get; set; }
        public string? Occupation { get; set; }
        public decimal? AnnualIncome { get; set; }
        public string? MobileNumber { get; set; }
        public string? Email { get; set; }
    }
    
    public class CitizenshipDTO
    {
        public required string CitizenshipNumber { get; set; }
        public required string CountryOfIssuance { get; set; }
        public DateTime DateOfIssuance { get; set; }
        public string? PlaceOfIssuance { get; set; }
    }

    public class SecondaryInfosDTO
    {
        public string? MiddleName { get; set; }
        public string? AlternateMobile { get; set; }
        public string? AlternateEmail { get; set; }
        public string? AcademicCertificatePaths { get; set; }
    }

    public class AcademicHistoryDTO
    {
        public int Id { get; set; }
        public required string InstitutionName { get; set; }
        public required AcademicLevel Level { get; set; }
        public string? Board { get; set; }
        public double PercentageOrGPA { get; set; }
        public DateOnly PassedYear { get; set; }
    }

    public class FacultyDTO
    {
        public int Id { get; set; }
        public FacultyType Type { get; set; }
        public required string ProgramName { get; set; }
    }

    public class AcademicEnrollmentDTO
    {
        public int Id { get; set; }
        public FacultyType FacultyType { get; set; }
        public virtual FacultyDTO? Faculty { get; set; }
        public required string ProgramName { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public string? StudentIdNumber { get; set; }
    }

    public class AchievementDTO
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? DateOfAchievement { get; set; }
    }

    public class HobbyDTO
    {
        public string Name { get; set; } = string.Empty;
    }

    public class DisabilityDTO
    {
        public string DisabilityType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public double? DisabilityPercentage { get; set; }
    }

    public class ScholarshipDTO
    {
        public string ScholarshipName { get; set; } = string.Empty;
        public decimal? Amount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }


    // DTO for Reading a Student
    public class StudentReadDTO
    {
        public Guid PID { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public required string PrimaryMobile { get; set; }
        public required string PrimaryEmail { get; set; }
        public BloodType BloodGroup { get; set; }
        public string? ProfileImagePath { get; set; }
        public CitizenshipDTO? Citizenship { get; set; }
        public SecondaryInfosDTO? SecondaryInfos { get; set; }
        public ICollection<AddressDTO> Addresses { get; set; } = new List<AddressDTO>();
        public ICollection<ParentDTO> Parents { get; set; } = new List<ParentDTO>();
        public ICollection<AcademicHistoryDTO> AcademicHistories { get; set; } = new List<AcademicHistoryDTO>();
        public AcademicEnrollmentDTO? AcademicEnrollment { get; set; }
        public ICollection<AchievementDTO> Achievements { get; set; } = new List<AchievementDTO>();
        public ICollection<HobbyDTO> Hobbies { get; set; } = new List<HobbyDTO>();
        public DisabilityDTO? Disability { get; set; }
        public ScholarshipDTO? Scholarship { get; set; }
    }

 public class CreateStudentDTO
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
    public required string PrimaryMobile { get; set; }

    [Required]
    public required string PrimaryEmail { get; set; }

    public BloodType BloodGroup { get; set; }

    // FILES
    public IFormFile? ProfileImage { get; set; }
    public List<IFormFile>? AcademicCertificates { get; set; }

    // NESTED DATA
    public CitizenshipDTO? Citizenship { get; set; }
    public SecondaryInfosDTO? SecondaryInfos { get; set; }

    public ICollection<AddressDTO> Addresses { get; set; } = new List<AddressDTO>();
    public ICollection<ParentDTO> Parents { get; set; } = new List<ParentDTO>();
    public ICollection<AcademicHistoryDTO> AcademicHistories { get; set; } = new List<AcademicHistoryDTO>();

    public AcademicEnrollmentDTO? AcademicEnrollment { get; set; }
    public ICollection<AchievementDTO> Achievements { get; set; } = new List<AchievementDTO>();
    public ICollection<HobbyDTO> Hobbies { get; set; } = new List<HobbyDTO>();
    public DisabilityDTO? Disability { get; set; }
    public ScholarshipDTO? Scholarship { get; set; }
}


    // DTO for lookup views in the dashboard, for easier listing
    public class StudentLookupDTO
    {

        public Guid PID { get; set; }
        public required string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public required string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public required string PrimaryMobile { get; set; }
        public required string PrimaryEmail { get; set; }
        public string? ProfileImagePath { get; set; }
        public string? ProgramName { get; set; }
        public string? Country { get; set; }
    }
    // DTO for Updating a Student
    public class UpdateStudentDTO
{
    [Required]
    public Guid PID { get; set; }

    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public Gender? Gender { get; set; }

    public string? PrimaryMobile { get; set; }
    public string? PrimaryEmail { get; set; }
    public BloodType? BloodGroup { get; set; }

    // FILES
    public IFormFile? ProfileImage { get; set; }
    public List<IFormFile>? AcademicCertificates { get; set; }

    // Keep existing if null
    public string? ProfileImagePath { get; set; }

    public CitizenshipDTO? Citizenship { get; set; }
    public SecondaryInfosDTO? SecondaryInfos { get; set; }

    public ICollection<AddressDTO>? Addresses { get; set; }
    public ICollection<ParentDTO>? Parents { get; set; }
    public ICollection<AcademicHistoryDTO>? AcademicHistories { get; set; }

    public AcademicEnrollmentDTO? AcademicEnrollment { get; set; }
    public ICollection<AchievementDTO>? Achievements { get; set; }
    public ICollection<HobbyDTO>? Hobbies { get; set; }
    public DisabilityDTO? Disability { get; set; }
    public ScholarshipDTO? Scholarship { get; set; }
}
}