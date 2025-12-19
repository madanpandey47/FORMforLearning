using AutoMapper;
using FormBackend.Core.Interfaces;
using FormBackend.DTOs;
using FormBackend.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace FormBackend.Services
{
    public class StudentService : IStudentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public StudentService(IUnitOfWork unitOfWork, IMapper mapper, IWebHostEnvironment webHostEnvironment)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _webHostEnvironment = webHostEnvironment;
        }

    // Get lookup data for all students
        public async Task<IEnumerable<StudentLookupDTO>> GetAllLookupAsync()
        {
            var students = await _unitOfWork.Students.GetAllAsync(query => query
                .AsNoTracking()
                .Include(s => s.AcademicEnrollment)
                .Include(s => s.SecondaryInfos)
                .Include(s => s.Citizenship)
            );

            return students.Select(s => new StudentLookupDTO
            {
                PID = s.PID,
                FirstName = s.FirstName,
                MiddleName = s.SecondaryInfos?.MiddleName,
                LastName = s.LastName,
                DateOfBirth = s.DateOfBirth,
                Gender = s.Gender,
                PrimaryMobile = s.PrimaryMobile,
                PrimaryEmail = s.PrimaryEmail,
                BloodGroup = s.BloodGroup,
                ProfileImagePath = s.ProfileImagePath,
                ProgramName = s.AcademicEnrollment?.ProgramName,
                Country = s.Citizenship?.CountryOfIssuance
            });
        }

        // Get student by PID with related data
        public async Task<StudentReadDTO?> GetByIdAsync(Guid pid)
        {
            var student = await _unitOfWork.Students.GetByPIDAsync(pid, query => query
                .Include(s => s.AcademicEnrollment)
                .Include(s => s.PermanentAddress)
                .Include(s => s.TemporaryAddress)
                .Include(s => s.Parents)
                .Include(s => s.AcademicHistories)
                .Include(s => s.Achievements)
                .Include(s => s.Hobbies)
                .Include(s => s.Disability)
                .Include(s => s.Scholarship)
                .Include(s => s.Citizenship)
                .Include(s => s.SecondaryInfos)
            );

            if (student == null) return null;
            return _mapper.Map<StudentReadDTO>(student);
        }

        // Create a new student
        public async Task<StudentReadDTO> CreateAsync(CreateStudentDTO createStudentDto)
        {
            var student = _mapper.Map<Student>(createStudentDto);

            // Handle Address
            if (createStudentDto.IsTemporaryAddressSameAsPermanent)
            {
                student.PermanentAddress = _mapper.Map<Address>(createStudentDto.TemporaryAddress);
                student.TemporaryAddress = _mapper.Map<Address>(createStudentDto.TemporaryAddress);
            }
            else
            {
                student.PermanentAddress = _mapper.Map<Address>(createStudentDto.PermanentAddress);
                student.TemporaryAddress = _mapper.Map<Address>(createStudentDto.TemporaryAddress);
            }

            // Handle Academic Enrollment
            if (createStudentDto.AcademicEnrollment != null)
            {
                student.AcademicEnrollment = _mapper.Map<AcademicEnrollment>(createStudentDto.AcademicEnrollment);
            }

            if (student.SecondaryInfos == null)
            {
                student.SecondaryInfos = new SecondaryInfos();
            }

            // Copy secondary info metadata (name/alternate contacts)
            if (createStudentDto.SecondaryInfos != null)
            {
                student.SecondaryInfos.MiddleName = createStudentDto.SecondaryInfos.MiddleName;
                student.SecondaryInfos.AlternateMobile = createStudentDto.SecondaryInfos.AlternateMobile;
                student.SecondaryInfos.AlternateEmail = createStudentDto.SecondaryInfos.AlternateEmail;
            }

            // Handle file uploads
            if (createStudentDto.ProfileImage != null)
            {
                student.ProfileImagePath = await HandleFileUploadAsync(createStudentDto.ProfileImage, null);
            }

            if (createStudentDto.CitizenshipImage != null)
            {
                student.SecondaryInfos.CitizenshipImagePath = await HandleFileUploadAsync(createStudentDto.CitizenshipImage, null);
            }
            if (createStudentDto.BoardCertificateImage != null)
            {
                student.SecondaryInfos.BoardCertificateImagePath = await HandleFileUploadAsync(createStudentDto.BoardCertificateImage, null);
            }
            if (createStudentDto.StudentIdCardImage != null)
            {
                student.SecondaryInfos.StudentIdCardPath = await HandleFileUploadAsync(createStudentDto.StudentIdCardImage, null);
            }


            await _unitOfWork.Students.AddAsync(student);
            await _unitOfWork.SaveAsync();

            return _mapper.Map<StudentReadDTO>(student);
        }

        public async Task<bool> UpdateAsync(Guid pid, UpdateStudentDTO updateStudentDto)
        {
            var student = await _unitOfWork.Students.GetByPIDAsync(pid, query => query
                .Include(s => s.AcademicEnrollment)
                .Include(s => s.PermanentAddress)
                .Include(s => s.TemporaryAddress)
                .Include(s => s.Parents)
                .Include(s => s.AcademicHistories)
                .Include(s => s.Achievements)
                .Include(s => s.Hobbies)
                .Include(s => s.Disability)
                .Include(s => s.Scholarship)
                .Include(s => s.Citizenship)
                .Include(s => s.SecondaryInfos)
            );

            if (student == null) return false;

            // Handle Address
            if (updateStudentDto.IsTemporaryAddressSameAsPermanent)
            {
                student.PermanentAddress = _mapper.Map<Address>(updateStudentDto.TemporaryAddress);
                student.TemporaryAddress = _mapper.Map<Address>(updateStudentDto.TemporaryAddress);
            }
            else
            {
                student.PermanentAddress = _mapper.Map<Address>(updateStudentDto.PermanentAddress);
                student.TemporaryAddress = _mapper.Map<Address>(updateStudentDto.TemporaryAddress);
            }

            // Handle Academic Enrollment
            if (updateStudentDto.AcademicEnrollment != null)
            {
                if (student.AcademicEnrollment != null)
                {
                    student.AcademicEnrollment.Faculty = updateStudentDto.AcademicEnrollment.Faculty;
                    student.AcademicEnrollment.ProgramName = updateStudentDto.AcademicEnrollment.ProgramName;
                    student.AcademicEnrollment.EnrollmentDate = updateStudentDto.AcademicEnrollment.EnrollmentDate;
                    student.AcademicEnrollment.StudentIdNumber = updateStudentDto.AcademicEnrollment.StudentIdNumber;
                }
                else
                {
                    student.AcademicEnrollment = _mapper.Map<AcademicEnrollment>(updateStudentDto.AcademicEnrollment);
                }
            }
            
            // Handle file upload for ProfileImage
            if (updateStudentDto.ProfileImage != null)
            {
                student.ProfileImagePath = await HandleFileUploadAsync(updateStudentDto.ProfileImage, student.ProfileImagePath);
            }

            if (updateStudentDto.FirstName != null) student.FirstName = updateStudentDto.FirstName;
            if (updateStudentDto.LastName != null) student.LastName = updateStudentDto.LastName;
            if (updateStudentDto.DateOfBirth.HasValue) student.DateOfBirth = updateStudentDto.DateOfBirth.Value;
            if (updateStudentDto.Gender.HasValue) student.Gender = updateStudentDto.Gender.Value;
            if (updateStudentDto.PrimaryMobile != null) student.PrimaryMobile = updateStudentDto.PrimaryMobile;
            if (updateStudentDto.PrimaryEmail != null) student.PrimaryEmail = updateStudentDto.PrimaryEmail;
            if (updateStudentDto.BloodGroup.HasValue) student.BloodGroup = updateStudentDto.BloodGroup.Value;

            if (updateStudentDto.Citizenship != null) student.Citizenship = _mapper.Map<Citizenship>(updateStudentDto.Citizenship);
            
            // Initialize SecondaryInfos if null (required for document images)
            if (student.SecondaryInfos == null)
            {
                student.SecondaryInfos = new SecondaryInfos();
            }
            
            if (updateStudentDto.SecondaryInfos != null)
            {
                // Update metadata without replacing the owned instance
                student.SecondaryInfos.MiddleName = updateStudentDto.SecondaryInfos.MiddleName;
                student.SecondaryInfos.AlternateMobile = updateStudentDto.SecondaryInfos.AlternateMobile;
                student.SecondaryInfos.AlternateEmail = updateStudentDto.SecondaryInfos.AlternateEmail;
            }
            
            if (updateStudentDto.Disability != null) student.Disability = _mapper.Map<Disability>(updateStudentDto.Disability);
            if (updateStudentDto.Scholarship != null) student.Scholarship = _mapper.Map<Scholarship>(updateStudentDto.Scholarship);
            
            if (updateStudentDto.Parents != null)
            {
                UpdateChildCollection(student.Parents, updateStudentDto.Parents, student.PID);
            }
            if (updateStudentDto.AcademicHistories != null)
            {
                UpdateChildCollection(student.AcademicHistories, updateStudentDto.AcademicHistories, student.PID);
            }
            if (updateStudentDto.Hobbies != null)
            {
                UpdateOwnedCollection(student.Hobbies, updateStudentDto.Hobbies);
            }
            if (updateStudentDto.Achievements != null)
            {
                UpdateOwnedCollection(student.Achievements, updateStudentDto.Achievements);
            }

            if (student.SecondaryInfos != null)
            {
                if (updateStudentDto.CitizenshipImage != null)
                {
                    student.SecondaryInfos.CitizenshipImagePath = await HandleFileUploadAsync(updateStudentDto.CitizenshipImage, student.SecondaryInfos.CitizenshipImagePath);
                }
                if (updateStudentDto.BoardCertificateImage != null)
                {
                    student.SecondaryInfos.BoardCertificateImagePath = await HandleFileUploadAsync(updateStudentDto.BoardCertificateImage, student.SecondaryInfos.BoardCertificateImagePath);
                }
                if (updateStudentDto.StudentIdCardImage != null)
                {
                    student.SecondaryInfos.StudentIdCardPath = await HandleFileUploadAsync(updateStudentDto.StudentIdCardImage, student.SecondaryInfos.StudentIdCardPath);
                }
            }
            await _unitOfWork.SaveAsync();

            return true;
        }

        // Delete a student by PID
        public async Task<bool> DeleteAsync(Guid pid)
        {
            var student = await _unitOfWork.Students.GetByPIDAsync(pid);
            if (student == null) return false;

            if (!string.IsNullOrEmpty(student.ProfileImagePath))
            {
                DeleteFile(student.ProfileImagePath);
            }

            if (student.SecondaryInfos != null)
            {
                if (!string.IsNullOrEmpty(student.SecondaryInfos.CitizenshipImagePath))
                {
                    DeleteFile(student.SecondaryInfos.CitizenshipImagePath);
                }
                if (!string.IsNullOrEmpty(student.SecondaryInfos.BoardCertificateImagePath))
                {
                    DeleteFile(student.SecondaryInfos.BoardCertificateImagePath);
                }
                if (!string.IsNullOrEmpty(student.SecondaryInfos.StudentIdCardPath))
                {
                    DeleteFile(student.SecondaryInfos.StudentIdCardPath);
                }
            }

            _unitOfWork.Students.Remove(student);
            await _unitOfWork.SaveAsync();
            return true;
        }

        private void UpdateChildCollection<TEntity, TDto>(ICollection<TEntity> existingCollection, ICollection<TDto> dtoCollection, Guid studentPid)
            where TEntity : BaseIdEntity where TDto : class
        {
            if (dtoCollection == null) dtoCollection = new List<TDto>();
            // Remove items that are no longer in the DTO collection
            var itemsToRemove = existingCollection.Where(e => !dtoCollection.Any(d => (int)(d.GetType().GetProperty("Id")?.GetValue(d) ?? 0) == e.Id)).ToList();
            foreach (var item in itemsToRemove)
            {
                existingCollection.Remove(item);
            }

            // Add or Update entities
            foreach (var dtoItem in dtoCollection)
            {
                var id = (int)(dtoItem.GetType().GetProperty("Id")?.GetValue(dtoItem) ?? 0);
                var existingItem = id != 0 ? existingCollection.FirstOrDefault(e => e.Id == id) : null;

                if (existingItem != null)
                {
                    _mapper.Map(dtoItem, existingItem);
                }
                else
                {
                    var newItem = _mapper.Map<TEntity>(dtoItem);
                    newItem.GetType().GetProperty("StudentPID")?.SetValue(newItem, studentPid);
                    existingCollection.Add(newItem);
                }
            }
        }

        // Update owned collection (no Id)
        // e.g., Addresses, Hobbies, Achievements
        private void UpdateOwnedCollection<TEntity, TDto>(ICollection<TEntity> existingCollection, ICollection<TDto> dtoCollection)
            where TEntity : class where TDto : class
        {
            if (dtoCollection == null || !dtoCollection.Any())
            {
                existingCollection.Clear();
                return;
            }

            // Remove items that are no longer in the DTO collection
            var itemsToRemove = existingCollection.ToList();
            foreach (var item in itemsToRemove)
            {
                existingCollection.Remove(item);
            }

            // Add all items from DTO
            foreach (var dtoItem in dtoCollection)
            {
                var newEntity = _mapper.Map<TEntity>(dtoItem);
                existingCollection.Add(newEntity);
            }
        }

        private async Task<string?> HandleFileUploadAsync(IFormFile? file, string? existingPath)
        {
            if (file == null) return existingPath;

            string wwwRootPath = _webHostEnvironment.WebRootPath;
            string uploadPath = Path.Combine(wwwRootPath, "uploads");
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

            // Delete old file
            if (!string.IsNullOrEmpty(existingPath))
            {
                DeleteFile(existingPath);
            }

            // Save new file
            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            string newFilePath = Path.Combine(uploadPath, fileName);
            using (var fileStream = new FileStream(newFilePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }
            return "/uploads/" + fileName;
        }

        private async Task<string?> HandleMultipleFileUploadsAsync(List<IFormFile>? files, string? existingPaths)
        {
            if (files == null || !files.Any()) return existingPaths;

            string wwwRootPath = _webHostEnvironment.WebRootPath;
            string uploadPath = Path.Combine(wwwRootPath, "uploads");
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

            // Delete old files
            if (!string.IsNullOrEmpty(existingPaths))
            {
                foreach (var oldPath in existingPaths.Split(',', StringSplitOptions.RemoveEmptyEntries))
                {
                    DeleteFile(oldPath);
                }
            }

            // Save new files
            var newPaths = new List<string>();
            foreach (var file in files)
            {
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                string newFilePath = Path.Combine(uploadPath, fileName);
                using (var fileStream = new FileStream(newFilePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                newPaths.Add("/uploads/" + fileName);
            }
            return string.Join(",", newPaths);
        }

        private void DeleteFile(string filePath)
        {
            try
            {
                string wwwRootPath = _webHostEnvironment.WebRootPath;
                var fullPath = Path.Combine(wwwRootPath, filePath.TrimStart('/'));
                if (File.Exists(fullPath)) File.Delete(fullPath);
            }
            catch
            {
                // Log error if needed
            }
        }
    }
}