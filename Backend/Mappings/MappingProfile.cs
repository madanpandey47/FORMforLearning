using AutoMapper;
using FormBackend.DTOs;
using FormBackend.Models;

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
            CreateMap<AcademicEnrollment, AcademicEnrollmentDTO>();
            CreateMap<Achievement, AchievementDTO>();
            CreateMap<Hobby, HobbyDTO>();
            CreateMap<Disability, DisabilityDTO>();
            CreateMap<Scholarship, ScholarshipDTO>();

            CreateMap<CreateStudentDTO, Student>()
                .ForMember(d => d.PID, opt => opt.Ignore())
                .ForMember(d => d.CreatedAt, opt => opt.Ignore())
                .ForMember(d => d.UpdatedAt, opt => opt.Ignore())
                .ForMember(d => d.ProfileImagePath, opt => opt.Ignore());

            CreateMap<AddressDTO, Address>();
            CreateMap<ParentDTO, Parent>().ForMember(d => d.Id, opt => opt.Ignore());
            CreateMap<CitizenshipDTO, Citizenship>();
            CreateMap<SecondaryInfosDTO, SecondaryInfos>().ForMember(d => d.AcademicCertificatePaths, opt => opt.Ignore());
            CreateMap<AcademicHistoryDTO, AcademicHistory>().ForMember(d => d.Id, opt => opt.Ignore());
            CreateMap<AcademicEnrollmentDTO, AcademicEnrollment>().ForMember(d => d.Id, opt => opt.Ignore());
            CreateMap<AchievementDTO, Achievement>();
            CreateMap<HobbyDTO, Hobby>();
            CreateMap<DisabilityDTO, Disability>();
            CreateMap<ScholarshipDTO, Scholarship>();

            CreateMap<UpdateStudentDTO, Student>()
                .ForMember(d => d.PID, opt => opt.Ignore())
                .ForMember(d => d.CreatedAt, opt => opt.Ignore())
                .ForMember(d => d.UpdatedAt, opt => opt.Ignore())
                .ForMember(d => d.ProfileImagePath, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
