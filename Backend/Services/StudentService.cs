using FormBackend.Core.Interfaces;
using FormBackend.DTOs;
using FormBackend.Models;
using System.Linq;
using System.Threading.Tasks;

namespace FormBackend.Services
{
    public class StudentService : IStudentService
    {
        private readonly IUnitOfWork _unitOfWork;

        public StudentService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Student> CreateStudentAsync(StudentDTO studentDto)
        {
            var student = new Student
            {
                FirstName = studentDto.FirstName,
                MiddleName = studentDto.MiddleName,
                LastName = studentDto.LastName,
                DateOfBirth = studentDto.DateOfBirth,
                Gender = studentDto.Gender,
                BloodGroup = studentDto.BloodGroup,
                Citizenship = studentDto.Citizenship != null ? new Citizenship
                {
                    CitizenshipNumber = studentDto.Citizenship.CitizenshipNumber,
                    CountryOfIssuance = studentDto.Citizenship.CountryOfIssuance,
                    DateOfIssuance = studentDto.Citizenship.DateOfIssuance,
                    PlaceOfIssuance = studentDto.Citizenship.PlaceOfIssuance
                } : null,
                ContactInfo = studentDto.ContactInfo != null ? new ContactInfo
                {
                    PrimaryMobile = studentDto.ContactInfo.PrimaryMobile,
                    AlternateMobile = studentDto.ContactInfo.AlternateMobile,
                    PrimaryEmail = studentDto.ContactInfo.PrimaryEmail,
                    AlternateEmail = studentDto.ContactInfo.AlternateEmail
                } : null,
                Addresses = studentDto.Addresses?.Select(a => new Address
                {
                    Province = a.Province,
                    Municipality = a.Municipality,
                    Ward = a.Ward,
                    Street = a.Street,
                    Country = a.Country,
                    AddressTypeId = a.AddressTypeId
                }).ToList(),
                Parents = studentDto.Parents?.Select(p => new Parent
                {
                    FirstName = p.FirstName!,
                    MiddleName = p.MiddleName,
                    LastName = p.LastName!,
                    Relation = p.Relation!,
                    Occupation = p.Occupation,
                    AnnualIncome = p.AnnualIncome,
                    MobileNumber = p.MobileNumber,
                    Email = p.Email
                }).ToList(),
                AcademicHistories = studentDto.AcademicHistories?.Select(ah => new AcademicHistory
                {
                    InstitutionName = ah.InstitutionName!,
                    Level = ah.Level!,
                    Board = ah.Board,
                    PercentageOrGPA = ah.PercentageOrGPA,
                    PassingYear = ah.PassingYear
                }).ToList(),
                AcademicEnrollment = studentDto.AcademicEnrollment != null ? new AcademicEnrollment
                {
                    FacultyId = studentDto.AcademicEnrollment.FacultyId,
                    ProgramName = studentDto.AcademicEnrollment.ProgramName,
                    EnrollmentDate = studentDto.AcademicEnrollment.EnrollmentDate,
                    StudentIdNumber = studentDto.AcademicEnrollment.StudentIdNumber
                } : null,
                Achievements = studentDto.Achievements?.Select(a => new Achievement
                {
                    Title = a.Title!,
                    Description = a.Description,
                    DateOfAchievement = a.DateOfAchievement
                }).ToList(),
                Hobbies = studentDto.Hobbies?.Select(h => new Hobby
                {
                    Name = h.Name!
                }).ToList(),
                Disability = studentDto.Disability != null ? new Disability
                {
                    DisabilityType = studentDto.Disability.DisabilityType!,
                    Description = studentDto.Disability.Description,
                    DisabilityPercentage = studentDto.Disability.DisabilityPercentage
                } : null,
                BankDetails = studentDto.BankDetails != null ? new BankDetails
                {
                    BankName = studentDto.BankDetails.BankName,
                    AccountNumber = studentDto.BankDetails.AccountNumber,
                    AccountHolderName = studentDto.BankDetails.AccountHolderName,
                    Branch = studentDto.BankDetails.Branch,
                    SwiftCode = studentDto.BankDetails.SwiftCode
                } : null,
                FinancialDetails = studentDto.FinancialDetails != null ? new FinancialDetails
                {
                    AnnualIncome = studentDto.FinancialDetails.AnnualIncome,
                    IncomeSource = studentDto.FinancialDetails.IncomeSource,
                    IsTaxPayer = studentDto.FinancialDetails.IsTaxPayer,
                    PanNumber = studentDto.FinancialDetails.PanNumber
                } : null,
                Scholarship = studentDto.Scholarship != null ? new Scholarship
                {
                    ScholarshipName = studentDto.Scholarship.ScholarshipName,
                    Amount = studentDto.Scholarship.Amount,
                    StartDate = studentDto.Scholarship.StartDate,
                    EndDate = studentDto.Scholarship.EndDate
                } : null
            };

            await _unitOfWork.GetRepository<Student>().AddAsync(student);
            await _unitOfWork.CompleteAsync();

            return student;
        }
    }
}
