using FormBackend.Core.Interfaces;
using FormBackend.DTOs;
using FormBackend.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

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

            var studentAcademicEnrollment = studentDto.AcademicEnrollment; // Store AcademicEnrollment from DTO

            await _unitOfWork.GetRepository<Student>().AddAsync(student);
            
            // After adding the student, ensure AcademicEnrollment's Faculty is correctly handled
            if (studentAcademicEnrollment != null)
            {
                var faculty = await _unitOfWork.GetRepository<Faculty>()
                                            .GetByIdAsync(studentAcademicEnrollment.FacultyId);

                if (faculty == null)
                {
                    throw new ArgumentException($"Faculty with ID {studentAcademicEnrollment.FacultyId} not found. Please provide a valid Faculty ID.");
                }
                // Assign the retrieved Faculty object to the navigation property
                // This assumes AcademicEnrollment is already part of the student object after AddAsync
                student.AcademicEnrollment.Faculty = faculty;
            }

            await _unitOfWork.CompleteAsync();

            return student;
        }

        public async Task<StudentDTO?> GetStudentByIdAsync(int id)
        {
            var student = await _unitOfWork.GetRepository<Student>()
                                            .GetByIdAsync(id, includeProperties: "Citizenship,ContactInfo,Addresses.AddressType,Parents,AcademicHistories,AcademicEnrollment.Faculty,Achievements,Hobbies,Disability,BankDetails,FinancialDetails,Scholarship");

            if (student == null)
            {
                return null;
            }

            // Map Student entity to StudentDTO
            var studentDto = new StudentDTO
            {
                // Personal Details
                FirstName = student.FirstName,
                MiddleName = student.MiddleName,
                LastName = student.LastName,
                DateOfBirth = student.DateOfBirth,
                Gender = student.Gender,
                BloodGroup = student.BloodGroup,

                // Relationships - map to respective DTOs
                Citizenship = student.Citizenship != null ? new CitizenshipDTO
                {
                    CitizenshipNumber = student.Citizenship.CitizenshipNumber,
                    CountryOfIssuance = student.Citizenship.CountryOfIssuance,
                    DateOfIssuance = student.Citizenship.DateOfIssuance,
                    PlaceOfIssuance = student.Citizenship.PlaceOfIssuance
                } : null,
                ContactInfo = student.ContactInfo != null ? new ContactInfoDTO
                {
                    PrimaryMobile = student.ContactInfo.PrimaryMobile,
                    AlternateMobile = student.ContactInfo.AlternateMobile,
                    PrimaryEmail = student.ContactInfo.PrimaryEmail,
                    AlternateEmail = student.ContactInfo.AlternateEmail
                } : null,
                Addresses = student.Addresses?.Select(a => new AddressDTO
                {
                    Province = a.Province,
                    Municipality = a.Municipality,
                    Ward = a.Ward,
                    Street = a.Street,
                    Country = a.Country,
                    AddressTypeId = a.AddressTypeId // Include AddressTypeId
                }).ToList(),
                Parents = student.Parents?.Select(p => new ParentDTO
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
                AcademicHistories = student.AcademicHistories?.Select(ah => new AcademicHistoryDTO
                {
                    InstitutionName = ah.InstitutionName!,
                    Level = ah.Level!,
                    Board = ah.Board,
                    PercentageOrGPA = ah.PercentageOrGPA,
                    PassingYear = ah.PassingYear
                }).ToList(),
                AcademicEnrollment = student.AcademicEnrollment != null ? new AcademicEnrollmentDTO
                {
                    FacultyId = student.AcademicEnrollment.FacultyId,
                    ProgramName = student.AcademicEnrollment.ProgramName,
                    EnrollmentDate = student.AcademicEnrollment.EnrollmentDate,
                    StudentIdNumber = student.AcademicEnrollment.StudentIdNumber
                } : null,
                Achievements = student.Achievements?.Select(a => new AchievementDTO
                {
                    Title = a.Title!,
                    Description = a.Description,
                    DateOfAchievement = a.DateOfAchievement
                }).ToList(),
                Hobbies = student.Hobbies?.Select(h => new HobbyDTO
                {
                    Name = h.Name!
                }).ToList(),
                Disability = student.Disability != null ? new DisabilityDTO
                {
                    DisabilityType = student.Disability.DisabilityType!,
                    Description = student.Disability.Description,
                    DisabilityPercentage = student.Disability.DisabilityPercentage
                } : null,
                BankDetails = student.BankDetails != null ? new BankDetailsDTO
                {
                    BankName = student.BankDetails.BankName,
                    AccountNumber = student.BankDetails.AccountNumber,
                    AccountHolderName = student.BankDetails.AccountHolderName,
                    Branch = student.BankDetails.Branch,
                    SwiftCode = student.BankDetails.SwiftCode
                } : null,
                FinancialDetails = student.FinancialDetails != null ? new FinancialDetailsDTO
                {
                    AnnualIncome = student.FinancialDetails.AnnualIncome,
                    IncomeSource = student.FinancialDetails.IncomeSource,
                    IsTaxPayer = student.FinancialDetails.IsTaxPayer,
                    PanNumber = student.FinancialDetails.PanNumber
                } : null,
                Scholarship = student.Scholarship != null ? new ScholarshipDTO
                {
                    ScholarshipName = student.Scholarship.ScholarshipName,
                    Amount = student.Scholarship.Amount,
                    StartDate = student.Scholarship.StartDate,
                    EndDate = student.Scholarship.EndDate
                } : null
            };

            return studentDto;
        }
    }
}