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
                new Faculty{ Type = FacultyType.Science, ProgramName = "BSc. CSIT"},
                new Faculty{ Type = FacultyType.Science, ProgramName = "B.Sc. Physics"},
                new Faculty{ Type = FacultyType.Engineering, ProgramName = "BE Civil"},
                new Faculty{ Type = FacultyType.Engineering, ProgramName = "BE Computer"},
                new Faculty{ Type = FacultyType.Commerce, ProgramName = "BBA"},
                new Faculty{ Type = FacultyType.Management, ProgramName = "MBA"},
                new Faculty{ Type = FacultyType.Arts, ProgramName = "BA Sociology"},
                new Faculty{ Type = FacultyType.Medicine, ProgramName = "MBBS"},
                new Faculty{ Type = FacultyType.Law, ProgramName = "BALLB"},
                new Faculty{ Type = FacultyType.Education, ProgramName = "B.Ed. Mathematics"}
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
                    Citizenship = new Citizenship
                    {
                        CitizenshipNumber = "123-456-789",
                        CountryOfIssuance = "Nepal",
                        DateOfIssuance = new DateTime(2015, 3, 10),
                        PlaceOfIssuance = "Kathmandu"
                    },
                    SecondaryInfos = new SecondaryInfos
                    {
                        MiddleName = "Bahadur",
                    },
                    Addresses = new List<Address>
                    {
                        new Address { Province = "Bagmati", Municipality = "Kathmandu", Ward = "10", Street = "Baneshwor", Country = "Nepal", Type = AddressType.Permanent },
                        new Address { Province = "Gandaki", Municipality = "Pokhara", Ward = "5", Street = "Lakeside", Country = "Nepal", Type = AddressType.Temporary }
                    },
                    Parents = new List<Parent>
                    {
                        new Parent { FirstName = "Hari", LastName = "Thapa", Relation = ParentType.Father, MobileNumber="9841111111" },
                        new Parent { FirstName = "Sita", LastName = "Thapa", Relation = ParentType.Mother, MobileNumber="9842222222" }
                    },
                    AcademicHistories = new List<AcademicHistory>
                    {
                        new AcademicHistory { InstitutionName = "Little Angels' School", Level = AcademicLevel.Secondary, PercentageOrGPA = 85, PassedYear = new DateOnly(2014, 1, 1) },
                        new AcademicHistory { InstitutionName = "St. Xavier's College", Level = AcademicLevel.HighSchool, PercentageOrGPA = 78, PassedYear = new DateOnly(2016, 1, 1) }
                    },
                    AcademicEnrollment = new AcademicEnrollment
                    {
                        FacultyId = faculties[0].Id,
                        ProgramName = "BSc. CSIT",
                        EnrollmentDate = new DateTime(2017, 8, 1),
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
                    Citizenship = new Citizenship
                    {
                        CitizenshipNumber = "987-654-321",
                        CountryOfIssuance = "Nepal",
                        DateOfIssuance = new DateTime(2017, 9, 5),
                        PlaceOfIssuance = "Biratnagar"
                    },
                    Addresses = new List<Address>
                    {
                        new Address { Province = "Province 1", Municipality = "Biratnagar", Ward = "3", Street = "Main Road", Country = "Nepal", Type = AddressType.Permanent }
                    },
                    Parents = new List<Parent>
                    {
                        new Parent { FirstName = "Shyam", LastName = "Sharma", Relation = ParentType.Father, MobileNumber="9818888888" }
                    },
                    AcademicHistories = new List<AcademicHistory>
                    {
                        new AcademicHistory { InstitutionName = "Sainik Awasiya Mahavidyalaya", Level = AcademicLevel.Secondary, PercentageOrGPA = 92, PassedYear = new DateOnly(2016, 1, 1) },
                        new AcademicHistory { InstitutionName = "Prasadi Academy", Level = AcademicLevel.HighSchool, PercentageOrGPA = 85, PassedYear = new DateOnly(2018, 1, 1) }
                    },
                    AcademicEnrollment = new AcademicEnrollment
                    {
                        FacultyId = faculties[4].Id,
                        ProgramName = "BBA",
                        EnrollmentDate = new DateTime(2019, 7, 15),
                    }
                }
            };
            _context.Students.AddRange(students);
            _context.SaveChanges();
        }
    }
}