using FormBackend.Core.Interfaces;
using FormBackend.Data;
using FormBackend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using FormBackend.Models.Enum;

namespace FormBackend.Services
{
    public class DbInitializer : IDbInitializer
    {
        private readonly ApplicationDbContext _context;

        public DbInitializer(ApplicationDbContext context)
        {
            _context = context;
        }

        public void Initialize()
        {
            _context.Database.EnsureCreated(); // Ensure database and tables exist

            if (_context.Students.Any())
            {
                return; // DB has been seeded
            }

            var faculties = new Faculty[]
            {
                new Faculty{PID = Guid.NewGuid(), Type = FacultyType.Science, ProgramName = "BSc. CSIT"},
                new Faculty{PID = Guid.NewGuid(), Type = FacultyType.Science, ProgramName = "B.Sc. Physics"},
                new Faculty{PID = Guid.NewGuid(), Type = FacultyType.Engineering, ProgramName = "BE Civil"},
                new Faculty{PID = Guid.NewGuid(), Type = FacultyType.Engineering, ProgramName = "BE Computer"},
                new Faculty{PID = Guid.NewGuid(), Type = FacultyType.Commerce, ProgramName = "BBA"},
                new Faculty{PID = Guid.NewGuid(), Type = FacultyType.Management, ProgramName = "MBA"},
                new Faculty{PID = Guid.NewGuid(), Type = FacultyType.Arts, ProgramName = "BA Sociology"},
                new Faculty{PID = Guid.NewGuid(), Type = FacultyType.Medicine, ProgramName = "MBBS"},
                new Faculty{PID = Guid.NewGuid(), Type = FacultyType.Law, ProgramName = "BALLB"},
                new Faculty{PID = Guid.NewGuid(), Type = FacultyType.Education, ProgramName = "B.Ed. Mathematics"}
            };
            _context.Faculties.AddRange(faculties);
            _context.SaveChanges();

            var students = new Student[]
            {
                new Student
                {
                    PID = Guid.NewGuid(),
                    FirstName = "Ram",
                    LastName = "Thapa",
                    DateOfBirth = new DateTime(1998, 5, 15),
                    Gender = Gender.Male,
                    BloodGroup = BloodType.OPositive,
                    PrimaryMobile = "9841234567",
                    PrimaryEmail = "ram.thapa@example.com",
                    SecondaryInfos = new SecondaryInfos
                    {
                        PID = Guid.NewGuid(),
                        MiddleName = "Bahadur",
                        StudentPID = Guid.Empty
                    },
                    Addresses = new List<Address>
                    {
                        new Address { PID = Guid.NewGuid(), Province = "Bagmati", Municipality = "Kathmandu", Ward = "10", Street = "Baneshwor", Country = "Nepal", Type = AddressType.Permanent, StudentPID = Guid.Empty },
                        new Address { PID = Guid.NewGuid(), Province = "Gandaki", Municipality = "Pokhara", Ward = "5", Street = "Lakeside", Country = "Nepal", Type = AddressType.Temporary, StudentPID = Guid.Empty }
                    },
                    Parents = new List<Parent>
                    {
                        new Parent { PID = Guid.NewGuid(), FirstName = "Hari", LastName = "Thapa", Relation = ParentType.Father, MobileNumber="9841111111", StudentPID = Guid.Empty },
                        new Parent { PID = Guid.NewGuid(), FirstName = "Sita", LastName = "Thapa", Relation = ParentType.Mother, MobileNumber="9842222222", StudentPID = Guid.Empty }
                    },
                    AcademicHistories = new List<AcademicHistory>
                    {
                        new AcademicHistory { PID = Guid.NewGuid(), InstitutionName = "Little Angels' School", Level = AcademicLevel.HighSchool, PercentageOrGPA = 85, PassedYear = new DateOnly(2014, 1, 1), StudentPID = Guid.Empty },
                        new AcademicHistory { PID = Guid.NewGuid(), InstitutionName = "St. Xavier's College", Level = AcademicLevel.HighSchool, PercentageOrGPA = 78, PassedYear = new DateOnly(2016, 1, 1), StudentPID = Guid.Empty }
                    },
                    AcademicEnrollment = new AcademicEnrollment
                    {
                        PID = Guid.NewGuid(), // AcademicEnrollment also gets a PID
                        FacultyPID = faculties[0].PID, // Use Faculty's PID
                        ProgramName = "BSc. CSIT",
                        EnrollmentDate = new DateTime(2017, 8, 1),
                        StudentPID = Guid.Empty // Placeholder
                    }
                },
                new Student
                {
                    PID = Guid.NewGuid(),
                    FirstName = "Gita",
                    LastName = "Sharma",
                    DateOfBirth = new DateTime(2000, 2, 20),
                    Gender = Gender.Female,
                    BloodGroup = BloodType.APositive,
                    PrimaryMobile = "9818765432",
                    PrimaryEmail = "gita.sharma@example.com",
                    SecondaryInfos = new SecondaryInfos
                    {
                        PID = Guid.NewGuid(),
                        MiddleName = null,
                        AlternateMobile = null,
                        AlternateEmail = null,
                        StudentPID = Guid.Empty
                    },
                    Addresses = new List<Address>
                    {
                        new Address { PID = Guid.NewGuid(), Province = "Province 1", Municipality = "Biratnagar", Ward = "3", Street = "Main Road", Country = "Nepal", Type = AddressType.Permanent, StudentPID = Guid.Empty }
                    },
                    Parents = new List<Parent>
                    {
                        new Parent { PID = Guid.NewGuid(), FirstName = "Shyam", LastName = "Sharma", Relation = ParentType.Father, MobileNumber="9818888888", StudentPID = Guid.Empty }
                    },
                    AcademicHistories = new List<AcademicHistory>
                    {
                        new AcademicHistory { PID = Guid.NewGuid(), InstitutionName = "Sainik Awasiya Mahavidyalaya", Level = AcademicLevel.HighSchool, PercentageOrGPA = 92, PassedYear = new DateOnly(2016, 1, 1), StudentPID = Guid.Empty },
                        new AcademicHistory { PID = Guid.NewGuid(), InstitutionName = "Prasadi Academy", Level = AcademicLevel.HighSchool, PercentageOrGPA = 85, PassedYear = new DateOnly(2018, 1, 1), StudentPID = Guid.Empty }
                    },
                    AcademicEnrollment = new AcademicEnrollment
                    {
                        PID = Guid.NewGuid(), // AcademicEnrollment also gets a PID
                        FacultyPID = faculties[1].PID, // Use Faculty's PID
                        ProgramName = "BBA",
                        EnrollmentDate = new DateTime(2019, 7, 15),
                        StudentPID = Guid.Empty // Placeholder
                    }
                }
            };
            _context.Students.AddRange(students);
            _context.SaveChanges();
        }
    }
}