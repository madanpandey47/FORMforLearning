using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FormBackend.Core.Interfaces;
using FormBackend.Data;
using FormBackend.DTOs;
using FormBackend.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace FormBackend.Services
{
    public class StudentService : IStudentService
    {
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ApplicationDbContext _context;

        public StudentService(IMapper mapper, IWebHostEnvironment webHostEnvironment, IUnitOfWork unitOfWork, ApplicationDbContext context)
        {
            _mapper = mapper;
            _webHostEnvironment = webHostEnvironment;
            _unitOfWork = unitOfWork;
            _context = context;
        }

    // Get lookup data for all students
        public async Task<IEnumerable<StudentLookupDTO>> GetAllLookupAsync()
        {
            var students = await _context.Students
                .Include(s => s.AcademicEnrollment)
                .Include(s => s.SecondaryInfos)
                .Include(s => s.Citizenship)
                .AsNoTracking()
                .ToListAsync();

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
            var student = await _context.Students
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
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.PID == pid);

            if (student == null) return null;
            return _mapper.Map<StudentReadDTO>(student);
        }

        // Create a new student
        public async Task<bool> CreateAsync(CreateStudentDTO createStudentDto)
        {
            var student = _mapper.Map<Student>(createStudentDto);

            // Only store PermanentAddress; TemporaryAddress is only stored if different
            student.PermanentAddress = _mapper.Map<Address>(createStudentDto.PermanentAddress);
            student.TemporaryAddress = !createStudentDto.IsTemporaryAddressSameAsPermanent
                ? _mapper.Map<Address>(createStudentDto.TemporaryAddress)
                : null;

            if (student.SecondaryInfos == null)
            {
                student.SecondaryInfos = new SecondaryInfos();
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
            return true;
        }

        public async Task<bool> UpdateAsync(Guid pid, UpdateStudentDTO updateStudentDto)
        {
            var student = await _context.Students
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
                .FirstOrDefaultAsync(s => s.PID == pid);

            if (student == null) return false;

            _mapper.Map(updateStudentDto, student);

            // Only store PermanentAddress; TemporaryAddress is only stored if different
            if (updateStudentDto.PermanentAddress != null)
            {
                student.PermanentAddress = _mapper.Map<Address>(updateStudentDto.PermanentAddress);
            }
            
            student.TemporaryAddress = !updateStudentDto.IsTemporaryAddressSameAsPermanent && updateStudentDto.TemporaryAddress != null
                ? _mapper.Map<Address>(updateStudentDto.TemporaryAddress)
                : null;

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

            _unitOfWork.Students.Update(student);
            await _unitOfWork.SaveAsync();

            return true;
        }

        // Delete a student by PID
        public async Task<bool> DeleteAsync(Guid pid)
        {
            var student = await _context.Students
                .Include(s => s.SecondaryInfos)
                .FirstOrDefaultAsync(s => s.PID == pid);
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
            where TEntity : BaseEntity where TDto : class
        {
            if (dtoCollection == null) dtoCollection = new List<TDto>();
            // Remove items that are no longer in the DTO collection
            var itemsToRemove = existingCollection.Where(e => !dtoCollection.Any(d => (Guid)(d.GetType().GetProperty("PID")?.GetValue(d) ?? Guid.Empty) == e.PID)).ToList();
            foreach (var item in itemsToRemove)
            {
                existingCollection.Remove(item);
            }

            // Add or Update entities
            foreach (var dtoItem in dtoCollection)
            {
                // Get PID of this DTO item and if it doesnt have one, treat it as new with PID = Guid.Empty
                var pid = (Guid)(dtoItem.GetType().GetProperty("PID")?.GetValue(dtoItem) ?? Guid.Empty);
                // Checks if it exists in the current collection, if so, update it AND set StudentPID foreign key
                var existingItem = pid != Guid.Empty ? existingCollection.FirstOrDefault(e => e.PID == pid) : null;

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


        private void UpdateOwnedCollection<TEntity, TDto>(ICollection<TEntity> existingCollection, ICollection<TDto> dtoCollection)
            where TEntity : class where TDto : class
        {
            if (dtoCollection == null )
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
            }
        }
    }
}