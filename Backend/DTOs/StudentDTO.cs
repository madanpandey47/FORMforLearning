using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FormBackend.DTOs
{
    public class AddressDTO
    {
        public string Province { get; set; }
        public string Municipality { get; set; }
        public string Ward { get; set; }
        public string? Street { get; set; }
        public string Country { get; set; }
        public int AddressTypeId { get; set; }
    }

    public class ParentDTO
    {
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public string Relation { get; set; }
        public string? Occupation { get; set; }
        public decimal? AnnualIncome { get; set; }
        public string? MobileNumber { get; set; }
        public string? Email { get; set; }
    }

    public class AcademicHistoryDTO
    {
        public string InstitutionName { get; set; }
        public string Level { get; set; }
        public string? Board { get; set; }
        public double PercentageOrGPA { get; set; }
        public int PassingYear { get; set; }
    }

    public class StudentDTO
    {
        // Personal Details
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string? BloodGroup { get; set; }

        // Relationships
        public CitizenshipDTO? Citizenship { get; set; }
        public ContactInfoDTO? ContactInfo { get; set; }
        public ICollection<AddressDTO> Addresses { get; set; }
        public ICollection<ParentDTO> Parents { get; set; }
        public ICollection<AcademicHistoryDTO> AcademicHistories { get; set; }
        public AcademicEnrollmentDTO? AcademicEnrollment { get; set; }
        public ICollection<AchievementDTO> Achievements { get; set; }
        public ICollection<HobbyDTO> Hobbies { get; set; }
        public DisabilityDTO? Disability { get; set; }
        public BankDetailsDTO? BankDetails { get; set; }
        public FinancialDetailsDTO? FinancialDetails { get; set; }
        public ScholarshipDTO? Scholarship { get; set; }
    }

    public class CitizenshipDTO
    {
        public string CitizenshipNumber { get; set; }
        public string CountryOfIssuance { get; set; }
        public DateTime DateOfIssuance { get; set; }
        public string? PlaceOfIssuance { get; set; }
    }

    public class ContactInfoDTO
    {
        public string PrimaryMobile { get; set; }
        public string? AlternateMobile { get; set; }
        public string PrimaryEmail { get; set; }
        public string? AlternateEmail { get; set; }
    }

    public class AcademicEnrollmentDTO
    {
        public int FacultyId { get; set; }
        public string ProgramName { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public string? StudentIdNumber { get; set; }
    }

    public class AchievementDTO
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DateOfAchievement { get; set; }
    }

    public class HobbyDTO
    {
        public string Name { get; set; }
    }

    public class DisabilityDTO
    {
        public string DisabilityType { get; set; }
        public string? Description { get; set; }
        public double? DisabilityPercentage { get; set; }
    }

    public class BankDetailsDTO
    {
        public string BankName { get; set; }
        public string AccountNumber { get; set; }
        public string AccountHolderName { get; set; }
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
        public string ScholarshipName { get; set; }
        public decimal? Amount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
