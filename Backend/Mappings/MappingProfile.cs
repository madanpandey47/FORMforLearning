using AutoMapper;
using FormBackend.DTOs;
using FormBackend.Models;
using System.Linq;

namespace FormBackend.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Student, StudentReadDTO>();
            CreateMap<Address, AddressDTO>();
            CreateMap<Parent, ParentDTO>();
            CreateMap<Citizenship, CitizenshipDTO>();
            CreateMap<SecondaryInfos, SecondaryInfosDTO>();
            CreateMap<AcademicHistory, AcademicHistoryDTO>();
            CreateMap<Faculty, FacultyDTO>();
            CreateMap<AcademicEnrollment, AcademicEnrollmentDTO>();
            CreateMap<Achievement, AchievementDTO>();
            CreateMap<Hobby, HobbyDTO>();
            CreateMap<Disability, DisabilityDTO>();
            CreateMap<Scholarship, ScholarshipDTO>();



            // For creating (DTO -> Entity)
            CreateMap<CreateStudentDTO, Student>()
                .ForMember(dest => dest.PID, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
            
            // For updating (DTO -> Entity)
            CreateMap<UpdateStudentDTO, Student>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
            
            CreateMap<AddressDTO, Address>();
            CreateMap<ParentDTO, Parent>().ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<CitizenshipDTO, Citizenship>();
            CreateMap<SecondaryInfosDTO, SecondaryInfos>();
            CreateMap<AcademicHistoryDTO, AcademicHistory>().ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<FacultyDTO, Faculty>().ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<AcademicEnrollmentDTO, AcademicEnrollment>().ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<AchievementDTO, Achievement>();
            CreateMap<HobbyDTO, Hobby>();
            CreateMap<DisabilityDTO, Disability>();
            CreateMap<ScholarshipDTO, Scholarship>();
        }
    }
}
