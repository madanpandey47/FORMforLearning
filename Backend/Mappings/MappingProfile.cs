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
            CreateMap<Address, AddressDTO>().ReverseMap();
            CreateMap<Parent, ParentDTO>().ReverseMap();
            CreateMap<Citizenship, CitizenshipDTO>().ReverseMap();
            CreateMap<SecondaryInfos, SecondaryInfosDTO>().ReverseMap();
            CreateMap<AcademicHistory, AcademicHistoryDTO>().ReverseMap();
            CreateMap<AcademicEnrollment, AcademicEnrollmentDTO>().ReverseMap();
            CreateMap<Achievement, AchievementDTO>().ReverseMap();
            CreateMap<Hobby, HobbyDTO>().ReverseMap();
            CreateMap<Disability, DisabilityDTO>().ReverseMap();
            CreateMap<Scholarship, ScholarshipDTO>().ReverseMap();

            CreateMap<CreateStudentDTO, Student>()
                .ForMember(d => d.PID, opt => opt.Ignore())
                .ForMember(d => d.CreatedAt, opt => opt.Ignore())
                .ForMember(d => d.UpdatedAt, opt => opt.Ignore())
                .ForMember(d => d.ProfileImagePath, opt => opt.Ignore())
                .ForPath(d => d.PermanentAddress, opt => opt.MapFrom(src => src.PermanentAddress))
                .ForPath(d => d.TemporaryAddress, opt => opt.MapFrom(src => src.TemporaryAddress))
                .ForPath(d => d.SecondaryInfos, opt => opt.MapFrom(src => src.SecondaryInfos))
                .ForPath(d => d.AcademicEnrollment, opt => opt.MapFrom(src => src.AcademicEnrollment))
                .ForPath(d => d.Parents, opt => opt.MapFrom(src => src.Parents))
                .ForPath(d => d.AcademicHistories, opt => opt.MapFrom(src => src.AcademicHistories))
                .ForPath(d => d.Achievements, opt => opt.MapFrom(src => src.Achievements))
                .ForPath(d => d.Hobbies, opt => opt.MapFrom(src => src.Hobbies))
                .ForPath(d => d.Disability, opt => opt.MapFrom(src => src.Disability))
                .ForPath(d => d.Scholarship, opt => opt.MapFrom(src => src.Scholarship));

            CreateMap<UpdateStudentDTO, Student>()
                .ForMember(d => d.PID, opt => opt.Ignore())
                .ForMember(d => d.CreatedAt, opt => opt.Ignore())
                .ForMember(d => d.UpdatedAt, opt => opt.Ignore())
                .ForMember(d => d.ProfileImagePath, opt => opt.Ignore())
                .ForPath(d => d.PermanentAddress, opt => opt.MapFrom(src => src.PermanentAddress))
                .ForPath(d => d.TemporaryAddress, opt => opt.MapFrom(src => src.TemporaryAddress))
                .ForPath(d => d.SecondaryInfos, opt => opt.MapFrom(src => src.SecondaryInfos))
                .ForPath(d => d.Disability, opt => opt.MapFrom(src => src.Disability))
                .ForPath(d => d.Scholarship, opt => opt.MapFrom(src => src.Scholarship))
                .ForMember(d => d.AcademicEnrollment, opt => opt.Ignore())
                .ForMember(d => d.Parents, opt => opt.Ignore())
                .ForMember(d => d.AcademicHistories, opt => opt.Ignore())
                .ForMember(d => d.Achievements, opt => opt.Ignore())
                .ForMember(d => d.Hobbies, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
