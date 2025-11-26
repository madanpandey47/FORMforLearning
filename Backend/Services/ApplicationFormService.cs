using FormBackend.Core.Interfaces;
using FormBackend.DTOs;
using FormBackend.Models;
using System.Threading.Tasks;

namespace FormBackend.Services
{
    public class ApplicationFormService : IApplicationFormService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ApplicationFormService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApplicationForm> CreateApplicationFormAsync(ApplicationFormDTO applicationFormDto)
        {
            var permanentAddress = new Address
            {
                Province = applicationFormDto.PermanentAddress.Province,
                Municipality = applicationFormDto.PermanentAddress.Municipality,
                Ward = applicationFormDto.PermanentAddress.Ward,
                Street = applicationFormDto.PermanentAddress.Street,
                Country = applicationFormDto.PermanentAddress.Country
            };

            var temporaryAddress = applicationFormDto.TemporaryAddress != null ? new Address
            {
                Province = applicationFormDto.TemporaryAddress.Province,
                Municipality = applicationFormDto.TemporaryAddress.Municipality,
                Ward = applicationFormDto.TemporaryAddress.Ward,
                Street = applicationFormDto.TemporaryAddress.Street,
                Country = applicationFormDto.TemporaryAddress.Country
            } : null;

            var familyDetails = new FamilyDetails
            {
                PrimaryContact = applicationFormDto.FamilyDetails.PrimaryContact,
                FatherName = applicationFormDto.FamilyDetails.FatherName,
                FatherMobile = applicationFormDto.FamilyDetails.FatherMobile,
                FatherOccupation = applicationFormDto.FamilyDetails.FatherOccupation,
                MotherName = applicationFormDto.FamilyDetails.MotherName,
                MotherMobile = applicationFormDto.FamilyDetails.MotherMobile,
                MotherOccupation = applicationFormDto.FamilyDetails.MotherOccupation,
                GuardianName = applicationFormDto.FamilyDetails.GuardianName,
                GuardianRelation = applicationFormDto.FamilyDetails.GuardianRelation,
                GuardianMobile = applicationFormDto.FamilyDetails.GuardianMobile,
                AnnualIncome = applicationFormDto.FamilyDetails.AnnualIncome,
                FamilyType = applicationFormDto.FamilyDetails.FamilyType
            };

            var schoolAddress = new Address
            {
                Province = applicationFormDto.AcademicDetails.SchoolAddress.Province,
                Municipality = applicationFormDto.AcademicDetails.SchoolAddress.Municipality,
                Ward = applicationFormDto.AcademicDetails.SchoolAddress.Ward,
                Street = applicationFormDto.AcademicDetails.SchoolAddress.Street,
                Country = applicationFormDto.AcademicDetails.SchoolAddress.Country
            };

            var academicDetails = new AcademicDetails
            {
                SchoolName = applicationFormDto.AcademicDetails.SchoolName,
                CollegeName = applicationFormDto.AcademicDetails.CollegeName,
                SchoolAddress = schoolAddress,
                PreviousGrade = applicationFormDto.AcademicDetails.PreviousGrade,
                Percentage = applicationFormDto.AcademicDetails.Percentage,
                PassingYear = applicationFormDto.AcademicDetails.PassingYear,
                ExtraCurricular = applicationFormDto.AcademicDetails.ExtraCurricular
            };

            var applicationForm = new ApplicationForm
            {
                Firstname = applicationFormDto.Firstname,
                Middlename = applicationFormDto.Middlename,
                Lastname = applicationFormDto.Lastname,
                Dob = applicationFormDto.Dob,
                Nationality = applicationFormDto.Nationality,
                CitizenshipNumber = applicationFormDto.CitizenshipNumber,
                Email = applicationFormDto.Email,
                AlternateEmail = applicationFormDto.AlternateEmail,
                Gender = applicationFormDto.Gender,
                Bloodgroup = applicationFormDto.Bloodgroup,
                PrimaryMobile = applicationFormDto.PrimaryMobile,
                AlternateMobile = applicationFormDto.AlternateMobile,
                EmergencyContact = applicationFormDto.EmergencyContact,
                EmergencyRelation = applicationFormDto.EmergencyRelation,
                PreferredContactMethod = applicationFormDto.PreferredContactMethod,
                PermanentAddress = permanentAddress,
                TemporaryAddress = temporaryAddress,
                FamilyDetails = familyDetails,
                AcademicDetails = academicDetails,
                ProfileImage = applicationFormDto.ProfileImage,
                AdditionalDocuments = applicationFormDto.AdditionalDocuments,
                Agree = applicationFormDto.Agree
            };

            await _unitOfWork.GetRepository<ApplicationForm>().AddAsync(applicationForm);
            await _unitOfWork.CompleteAsync();

            return applicationForm;
        }
    }
}
