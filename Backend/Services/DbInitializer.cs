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
            // _context.Database.EnsureCreated();

            if (_context.Students.Any())
            {
                return; // DB has been seeded
            }

            var faculties = new Faculty[]
            {
                new Faculty{Name="Faculty of Science and Technology"},
                new Faculty{Name="Faculty of Management"},
                new Faculty{Name="Faculty of Arts"},
                new Faculty{Name="Faculty of Social Sciences"},
                new Faculty{Name="Faculty of Engineering"},
                new Faculty{Name="Faculty of Medicine"},
                new Faculty{Name="Faculty of Law"},
                new Faculty{Name="Faculty of Education"},
                new Faculty{Name="Faculty of Agriculture"},
                new Faculty{Name="Faculty of Forestry"},
                new Faculty{Name="Faculty of Fine Arts"},
                new Faculty{Name="Faculty of Music and Drama"},
                new Faculty{Name="Faculty of Business Administration"},
                new Faculty{Name="Faculty of Public Health"},
                new Faculty{Name="Faculty of Pharmacy"},
                new Faculty{Name="Faculty of Veterinary Science"},
                new Faculty{Name="Faculty of Humanities"},
                new Faculty{Name="Faculty of Information Technology"},
                new Faculty{Name="Faculty of Architecture"},
                new Faculty{Name="Faculty of Environmental Science"}
            };
            _context.Faculties.AddRange(faculties);
            _context.SaveChanges();

            var students = new Student[]
            {
                new Student
                {
                    FirstName = "Ram",
                    LastName = "Thapa",
                    DateOfBirth = new DateTime(1998, 5, 15),
                    Gender = Gender.Male,
                    BloodGroup = BloodType.OPositive,
                    PrimaryMobile = "9841234567",
                    PrimaryEmail = "ram.thapa@example.com",
                    SecondaryInfos = new SecondaryInfos
                    {
                        MiddleName = "Bahadur",
                        AlternateMobile = null,
                        AlternateEmail = null
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
                        new AcademicHistory { InstitutionName = "Little Angels' School", Level = AcademicLevel.HighSchool, PercentageOrGPA = 85, PassedYear = new DateOnly(2014, 1, 1) },
                        new AcademicHistory { InstitutionName = "St. Xavier's College", Level = AcademicLevel.HighSchool, PercentageOrGPA = 78, PassedYear = new DateOnly(2016, 1, 1) }
                    },
                    AcademicEnrollment = new AcademicEnrollment
                    {
                        FacultyId = faculties[0].Id,
                        ProgramName = "BSc. CSIT",
                        EnrollmentDate = new DateTime(2017, 8, 1)
                    }
                },
                new Student
                {
                    FirstName = "Gita",
                    LastName = "Sharma",
                    DateOfBirth = new DateTime(2000, 2, 20),
                    Gender = Gender.Female,
                    BloodGroup = BloodType.APositive,
                    PrimaryMobile = "9818765432",
                    PrimaryEmail = "gita.sharma@example.com",
                    SecondaryInfos = new SecondaryInfos
                    {
                        MiddleName = null,
                        AlternateMobile = null,
                        AlternateEmail = null
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
                        new AcademicHistory { InstitutionName = "Sainik Awasiya Mahavidyalaya", Level = AcademicLevel.HighSchool, PercentageOrGPA = 92, PassedYear = new DateOnly(2016, 1, 1) },
                        new AcademicHistory { InstitutionName = "Prasadi Academy", Level = AcademicLevel.HighSchool, PercentageOrGPA = 85, PassedYear = new DateOnly(2018, 1, 1) }
                    },
                    AcademicEnrollment = new AcademicEnrollment
                    {
                        FacultyId = faculties[1].Id,
                        ProgramName = "BBA",
                        EnrollmentDate = new DateTime(2019, 7, 15)
                    }
                }
            };
            _context.Students.AddRange(students);
            _context.SaveChanges();
        }
    }
}
