using FormBackend.Core.Interfaces;
using FormBackend.Data;
using FormBackend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

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
            _context.Database.EnsureCreated();

            if (_context.Students.Any())
            {
                return; // DB has been seeded
            }

            var addressTypes = new AddressType[]
            {
                new AddressType{Type="Permanent"},
                new AddressType{Type="Temporary"}
            };
            _context.AddressTypes.AddRange(addressTypes);
            _context.SaveChanges();

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
                    MiddleName = "Bahadur",
                    LastName = "Thapa",
                    DateOfBirth = new DateTime(1998, 5, 15),
                    Gender = "Male",
                    BloodGroup = "O+",
                    ContactInfo = new ContactInfo
                    {
                        PrimaryMobile = "9841234567",
                        PrimaryEmail = "ram.thapa@example.com"
                    },
                    Addresses = new List<Address>
                    {
                        new Address { Province = "Bagmati", Municipality = "Kathmandu", Ward = "10", Street = "Baneshwor", Country = "Nepal", AddressTypeId = addressTypes[0].Id },
                        new Address { Province = "Gandaki", Municipality = "Pokhara", Ward = "5", Street = "Lakeside", Country = "Nepal", AddressTypeId = addressTypes[1].Id }
                    },
                    Parents = new List<Parent>
                    {
                        new Parent { FirstName = "Hari", LastName = "Thapa", Relation = "Father", MobileNumber="9841111111" },
                        new Parent { FirstName = "Sita", LastName = "Thapa", Relation = "Mother", MobileNumber="9842222222" }
                    },
                    AcademicHistories = new List<AcademicHistory>
                    {
                        new AcademicHistory { InstitutionName = "Little Angels' School", Level = "SEE", PercentageOrGPA = 85, PassingYear = 2014 },
                        new AcademicHistory { InstitutionName = "St. Xavier's College", Level = "+2", PercentageOrGPA = 78, PassingYear = 2016 }
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
                    Gender = "Female",
                    BloodGroup = "A+",
                    ContactInfo = new ContactInfo
                    {
                        PrimaryMobile = "9818765432",
                        PrimaryEmail = "gita.sharma@example.com"
                    },
                    Addresses = new List<Address>
                    {
                        new Address { Province = "Province 1", Municipality = "Biratnagar", Ward = "3", Street = "Main Road", Country = "Nepal", AddressTypeId = addressTypes[0].Id }
                    },
                    Parents = new List<Parent>
                    {
                        new Parent { FirstName = "Shyam", LastName = "Sharma", Relation = "Father", MobileNumber="9818888888" }
                    },
                    AcademicHistories = new List<AcademicHistory>
                    {
                        new AcademicHistory { InstitutionName = "Sainik Awasiya Mahavidyalaya", Level = "SEE", PercentageOrGPA = 92, PassingYear = 2016 },
                        new AcademicHistory { InstitutionName = "Prasadi Academy", Level = "+2", PercentageOrGPA = 85, PassingYear = 2018 }
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
