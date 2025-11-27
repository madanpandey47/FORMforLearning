using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FormBackend.DTOs
{
    public class AddressDTO
    {
        public required string Province { get; set; }
        public required string Municipality { get; set; }
        public required string Ward { get; set; }
        public string? Street { get; set; }
        public required string Country { get; set; }
        public int AddressTypeId { get; set; }
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
        public required string Level { get; set; }
        public string? Board { get; set; }
        public double PercentageOrGPA { get; set; }
        public int PassingYear { get; set; }
    }

    public class StudentDTO
    {
        // Personal Details
        public required string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public required string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public required string Gender { get; set; }
        public string? BloodGroup { get; set; }

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
        public BankDetailsDTO? BankDetails { get; set; }
        public FinancialDetailsDTO? FinancialDetails { get; set; }
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
        public required string Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DateOfAchievement { get; set; }
    }

    public class HobbyDTO
    {
        public required string Name { get; set; }
    }

    public class DisabilityDTO
    {
        public required string DisabilityType { get; set; }
        public string? Description { get; set; }
        public double? DisabilityPercentage { get; set; }
    }

    public class BankDetailsDTO
    {
        public required string BankName { get; set; }
        public required string AccountNumber { get; set; }
        public required string AccountHolderName { get; set; }
        public string? Branch { get; set; }
        public string? SwiftCode { get; set; }
    }

    public class FinancialDetailsDTO
    {
        public decimal? AnnualIncome { get; set; }
        public string? IncomeSource { get; set; }
        public bool? IsTaxPayer { get; set; }
        public string? PanNumber { get; set; }
    }

    public class ScholarshipDTO
    {
        public required string ScholarshipName { get; set; }
        public decimal? Amount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
