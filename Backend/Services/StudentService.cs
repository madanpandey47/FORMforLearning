using FormBackend.Core.Interfaces;
using FormBackend.DTOs;
using FormBackend.Models;
using FormBackend.Models.Enum;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Microsoft.AspNetCore.Http;

namespace FormBackend.Services
{
    public class StudentService : IStudentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public StudentService(IUnitOfWork unitOfWork, IWebHostEnvironment webHostEnvironment)
        {
            _unitOfWork = unitOfWork;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<StudentDTO?> CreateStudentAsync(StudentDTO studentDto, IFormFile? imageFile)
        {
            if (imageFile != null)
            {
                string wwwRootPath = _webHostEnvironment.WebRootPath;
                if (string.IsNullOrEmpty(wwwRootPath))
                {
                    wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }
                string uploadPath = Path.Combine(wwwRootPath, "uploads");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                string filePath = Path.Combine(uploadPath, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }
                if (studentDto.SecondaryInfos == null)
                {
                    studentDto.SecondaryInfos = new SecondaryInfosDTO();
                }
                studentDto.SecondaryInfos.Image = "/uploads/" + fileName;
            }

            var student = new Student
            {
                FirstName = studentDto.FirstName,
                LastName = studentDto.LastName,
                DateOfBirth = studentDto.DateOfBirth,
                Gender = studentDto.Gender,
                BloodGroup = studentDto.BloodGroup,
                PrimaryMobile = studentDto.PrimaryMobile,
                PrimaryEmail = studentDto.PrimaryEmail,
                Citizenship = studentDto.Citizenship != null ? new Citizenship
                {
                    CitizenshipNumber = studentDto.Citizenship.CitizenshipNumber,
                    CountryOfIssuance = studentDto.Citizenship.CountryOfIssuance,
                    DateOfIssuance = studentDto.Citizenship.DateOfIssuance,
                    PlaceOfIssuance = studentDto.Citizenship.PlaceOfIssuance
                } : null,
                SecondaryInfos = studentDto.SecondaryInfos != null ? new SecondaryInfos
                {
                    MiddleName = studentDto.SecondaryInfos.MiddleName,
                    AlternateMobile = studentDto.SecondaryInfos.AlternateMobile,
                    AlternateEmail = studentDto.SecondaryInfos.AlternateEmail,
                    Image = studentDto.SecondaryInfos.Image
                } : null,
                Addresses = studentDto.Addresses?.Select(a => new Address
                {
                    Province = a.Province,
                    Municipality = a.Municipality,
                    Ward = a.Ward,
                    Street = a.Street,
                    Country = a.Country,
                    Type = a.Type
                }).ToList() ?? new List<Address>(),
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
                }).ToList() ?? new List<Parent>(),
                AcademicHistories = studentDto.AcademicHistories?.Select(ah => new AcademicHistory
                {
                    InstitutionName = ah.InstitutionName!,
                    Level = ah.Level!,
                    Board = ah.Board,
                    PercentageOrGPA = ah.PercentageOrGPA,
                    PassedYear = ah.PassedYear
                }).ToList() ?? new List<AcademicHistory>(),
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
                }).ToList() ?? new List<Achievement>(),
                Hobbies = studentDto.Hobbies?.Select(h => new Hobby
                {
                    Name = h.Name!
                }).ToList() ?? new List<Hobby>(),
                Disability = studentDto.Disability != null && !string.IsNullOrEmpty(studentDto.Disability.DisabilityType) ? new Disability
                {
                    DisabilityType = studentDto.Disability.DisabilityType,
                    Description = studentDto.Disability.Description,
                    DisabilityPercentage = studentDto.Disability.DisabilityPercentage
                } : null,
                Scholarship = studentDto.Scholarship != null && !string.IsNullOrEmpty(studentDto.Scholarship.ScholarshipName) ? new Scholarship
                {
                    ScholarshipName = studentDto.Scholarship.ScholarshipName,
                    Amount = studentDto.Scholarship.Amount,
                    StartDate = studentDto.Scholarship.StartDate,
                    EndDate = studentDto.Scholarship.EndDate
                } : null
            };

            var studentAcademicEnrollment = studentDto.AcademicEnrollment; // Store AcademicEnrollment from DTO

            await _unitOfWork.GetRepository<Student>().AddAsync(student);
            
            if (studentAcademicEnrollment != null)
            {
                var faculties = await _unitOfWork.GetRepository<Faculty>()
                    .FindAsync(f => f.Id == studentAcademicEnrollment.FacultyId);
                var faculty = faculties.FirstOrDefault();

                if (faculty == null)
                {
                    throw new ArgumentException($"Faculty with ID {studentAcademicEnrollment.FacultyId} not found. Please provide a valid Faculty ID.");
                }
                if (student.AcademicEnrollment != null)
                {
                    student.AcademicEnrollment.Faculty = faculty;
                }
            }

            await _unitOfWork.CompleteAsync();

            return await GetStudentByIdAsync(student.Id);
        }

        public async Task<StudentDTO?> GetStudentByIdAsync(int id)
        {
            var students = await _unitOfWork.GetRepository<Student>().FindAsync(s => s.Id == id);
            var student = students.FirstOrDefault();
            if (student == null)
            {
                return null;
            }

            return new StudentDTO
            {
                Id = student.Id,
                FirstName = student.FirstName,
                LastName = student.LastName,
                DateOfBirth = student.DateOfBirth,
                Gender = student.Gender,
                BloodGroup = student.BloodGroup,
                PrimaryMobile = student.PrimaryMobile,
                PrimaryEmail = student.PrimaryEmail,
                Citizenship = student.Citizenship != null ? new CitizenshipDTO
                {
                    CitizenshipNumber = student.Citizenship.CitizenshipNumber,
                    CountryOfIssuance = student.Citizenship.CountryOfIssuance,
                    DateOfIssuance = student.Citizenship.DateOfIssuance,
                    PlaceOfIssuance = student.Citizenship.PlaceOfIssuance
                } : null,
                SecondaryInfos = student.SecondaryInfos != null ? new SecondaryInfosDTO
                {
                    MiddleName = student.SecondaryInfos.MiddleName,
                    AlternateMobile = student.SecondaryInfos.AlternateMobile,
                    AlternateEmail = student.SecondaryInfos.AlternateEmail,
                    Image = student.SecondaryInfos.Image
                } : null,
                Addresses = student.Addresses?.Select(a => new AddressDTO
                {
                    Province = a.Province,
                    Municipality = a.Municipality,
                    Ward = a.Ward,
                    Street = a.Street,
                    Country = a.Country,
                    Type = a.Type
                }).ToList() ?? new List<AddressDTO>(),
                Parents = student.Parents?.Select(p => new ParentDTO
                {
                    FirstName = p.FirstName,
                    MiddleName = p.MiddleName,
                    LastName = p.LastName,
                    Relation = p.Relation,
                    Occupation = p.Occupation,
                    AnnualIncome = p.AnnualIncome,
                    MobileNumber = p.MobileNumber,
                    Email = p.Email
                }).ToList() ?? new List<ParentDTO>(),
                AcademicHistories = student.AcademicHistories?.Select(ah => new AcademicHistoryDTO
                {
                    InstitutionName = ah.InstitutionName,
                    Level = ah.Level,
                    Board = ah.Board,
                    PercentageOrGPA = ah.PercentageOrGPA,
                    PassedYear = ah.PassedYear
                }).ToList() ?? new List<AcademicHistoryDTO>(),
                AcademicEnrollment = student.AcademicEnrollment != null ? new AcademicEnrollmentDTO
                {
                    FacultyId = student.AcademicEnrollment.FacultyId,
                    ProgramName = student.AcademicEnrollment.ProgramName,
                    EnrollmentDate = student.AcademicEnrollment.EnrollmentDate,
                    StudentIdNumber = student.AcademicEnrollment.StudentIdNumber
                } : null,
                Achievements = student.Achievements?.Select(a => new AchievementDTO
                {
                    Title = a.Title,
                    Description = a.Description,
                    DateOfAchievement = a.DateOfAchievement
                }).ToList() ?? new List<AchievementDTO>(),
                Hobbies = student.Hobbies?.Select(h => new HobbyDTO
                {
                    Name = h.Name
                }).ToList() ?? new List<HobbyDTO>(),
                Disability = student.Disability != null ? new DisabilityDTO
                {
                    DisabilityType = student.Disability.DisabilityType,
                    Description = student.Disability.Description,
                    DisabilityPercentage = student.Disability.DisabilityPercentage
                } : null,
                Scholarship = student.Scholarship != null ? new ScholarshipDTO
                {
                    ScholarshipName = student.Scholarship.ScholarshipName,
                    Amount = student.Scholarship.Amount,
                    StartDate = student.Scholarship.StartDate,
                    EndDate = student.Scholarship.EndDate
                } : null
            };
        }


        public async Task<List<StudentDTO>> GetAllStudentsAsync()
        {
            var students = await _unitOfWork.GetRepository<Student>().GetAllStudentsAsync();
            var studentDtos = students.Select(student => new StudentDTO
            {
                Id = student.Id,
                FirstName = student.FirstName,
                LastName = student.LastName,
                DateOfBirth = student.DateOfBirth,
                Gender = student.Gender,
                BloodGroup = student.BloodGroup,
                PrimaryMobile = student.PrimaryMobile,
                PrimaryEmail = student.PrimaryEmail,
                Citizenship = student.Citizenship != null ? new CitizenshipDTO
                {
                    CitizenshipNumber = student.Citizenship.CitizenshipNumber,
                    CountryOfIssuance = student.Citizenship.CountryOfIssuance,
                    DateOfIssuance = student.Citizenship.DateOfIssuance,
                    PlaceOfIssuance = student.Citizenship.PlaceOfIssuance
                } : null,
                SecondaryInfos = student.SecondaryInfos != null ? new SecondaryInfosDTO
                {
                    MiddleName = student.SecondaryInfos.MiddleName,
                    AlternateMobile = student.SecondaryInfos.AlternateMobile,
                    AlternateEmail = student.SecondaryInfos.AlternateEmail,
                    Image = student.SecondaryInfos.Image
                } : null,
                Addresses = student.Addresses?.Select(a => new AddressDTO
                {
                    Province = a.Province,
                    Municipality = a.Municipality,
                    Ward = a.Ward,
                    Street = a.Street,
                    Country = a.Country,
                    Type = a.Type
                }).ToList() ?? new List<AddressDTO>(),
                Parents = student.Parents?.Select(p => new ParentDTO
                {
                    FirstName = p.FirstName,
                    MiddleName = p.MiddleName,
                    LastName = p.LastName,
                    Relation = p.Relation,
                    Occupation = p.Occupation,
                    AnnualIncome = p.AnnualIncome,
                    MobileNumber = p.MobileNumber,
                    Email = p.Email
                }).ToList() ?? new List<ParentDTO>(),
                AcademicHistories = student.AcademicHistories?.Select(ah => new AcademicHistoryDTO
                {
                    InstitutionName = ah.InstitutionName,
                    Level = ah.Level,
                    Board = ah.Board,
                    PercentageOrGPA = ah.PercentageOrGPA,
                    PassedYear = ah.PassedYear
                }).ToList() ?? new List<AcademicHistoryDTO>(),
                AcademicEnrollment = student.AcademicEnrollment != null ? new AcademicEnrollmentDTO
                {
                    FacultyId = student.AcademicEnrollment.FacultyId,
                    ProgramName = student.AcademicEnrollment.ProgramName,
                    EnrollmentDate = student.AcademicEnrollment.EnrollmentDate,
                    StudentIdNumber = student.AcademicEnrollment.StudentIdNumber
                } : null,
                Achievements = student.Achievements?.Select(a => new AchievementDTO
                {
                    Title = a.Title,
                    Description = a.Description,
                    DateOfAchievement = a.DateOfAchievement
                }).ToList() ?? new List<AchievementDTO>(),
                Hobbies = student.Hobbies?.Select(h => new HobbyDTO
                {
                    Name = h.Name
                }).ToList() ?? new List<HobbyDTO>(),
                Disability = student.Disability != null ? new DisabilityDTO
                {
                    DisabilityType = student.Disability.DisabilityType,
                    Description = student.Disability.Description,
                    DisabilityPercentage = student.Disability.DisabilityPercentage
                } : null,
                Scholarship = student.Scholarship != null ? new ScholarshipDTO
                {
                    ScholarshipName = student.Scholarship.ScholarshipName,
                    Amount = student.Scholarship.Amount,
                    StartDate = student.Scholarship.StartDate,
                    EndDate = student.Scholarship.EndDate
                } : null
            }).ToList();

            return studentDtos;
        }
    }
}