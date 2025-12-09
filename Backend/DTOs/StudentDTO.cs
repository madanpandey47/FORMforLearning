using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using FormBackend.Models;
using FormBackend.Models.Enum;
using Microsoft.AspNetCore.Http;

namespace FormBackend.DTOs
{
        public class StudentDTO
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public required string PrimaryMobile { get; set; }
        public required string PrimaryEmail { get; set; }
        public BloodType BloodGroup { get; set; }
        public string? ProfileImagePath { get; set; }

        // Relationships
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
}
