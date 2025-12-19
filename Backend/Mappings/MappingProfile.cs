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
                .ForMember(d => d.PermanentAddress, opt => opt.Ignore())
                .ForMember(d => d.TemporaryAddress, opt => opt.Ignore())
                .ForMember(d => d.SecondaryInfos, opt => opt.Ignore());

            CreateMap<UpdateStudentDTO, Student>()
                .ForMember(d => d.PID, opt => opt.Ignore())
                .ForMember(d => d.CreatedAt, opt => opt.Ignore())
                .ForMember(d => d.UpdatedAt, opt => opt.Ignore())
                .ForMember(d => d.ProfileImagePath, opt => opt.Ignore())
                .ForMember(d => d.PermanentAddress, opt => opt.Ignore())
                .ForMember(d => d.TemporaryAddress, opt => opt.Ignore())
                .ForMember(d => d.SecondaryInfos, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
