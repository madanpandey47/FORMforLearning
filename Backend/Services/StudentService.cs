using AutoMapper;
using FormBackend.Core.Interfaces;
using FormBackend.DTOs;
using FormBackend.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

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

        public async Task<StudentReadDTO?> UpdateStudentAsync(Guid pid, UpdateStudentDTO updateStudentDto)
        {
            var student = await _unitOfWork.Students.GetByPIDAsync(pid, q => q
                .Include(s => s.Addresses)
                .Include(s => s.Parents)
                .Include(s => s.AcademicHistories)
                .Include(s => s.AcademicEnrollment).ThenInclude(ae => ae!.Faculty)
                .Include(s => s.Achievements)
                .Include(s => s.Hobbies)
                .Include(s => s.Disability)
                .Include(s => s.Scholarship)
                .Include(s => s.Citizenship)
                .Include(s => s.SecondaryInfos)
            );

            if (student == null)
            {
                return null; // Student not found
            }

            // Handle file uploads
            updateStudentDto.ProfileImagePath = await HandleFileUpload(updateStudentDto.ProfileImage, student.ProfileImagePath);
            if (student.SecondaryInfos != null)
            {
                 student.SecondaryInfos.AcademicCertificatePaths = await HandleMultipleFileUploads(updateStudentDto.AcademicCertificates, student.SecondaryInfos.AcademicCertificatePaths);
            }
            else if (updateStudentDto.AcademicCertificates != null && updateStudentDto.AcademicCertificates.Any())
            {
                student.SecondaryInfos = new SecondaryInfos()
                {
                     AcademicCertificatePaths = await HandleMultipleFileUploads(updateStudentDto.AcademicCertificates, null)
                };
            }
            
            // Use AutoMapper to map the updated fields from the DTO to the existing student entity
            _mapper.Map(updateStudentDto, student);

            // Handle collections (add, update, remove)
            UpdateChildCollection(student.Addresses, updateStudentDto.Addresses, student.PID);
            UpdateChildCollection(student.Parents, updateStudentDto.Parents, student.PID);
            UpdateChildCollection(student.AcademicHistories, updateStudentDto.AcademicHistories, student.PID);
            UpdateChildCollection(student.Achievements, updateStudentDto.Achievements, student.PID);
            UpdateChildCollection(student.Hobbies, updateStudentDto.Hobbies, student.PID);
            
            // Handle one-to-one relationships
            student.Citizenship = UpdateOneToOne(student.Citizenship, updateStudentDto.Citizenship, student.PID);
            student.SecondaryInfos = UpdateOneToOne(student.SecondaryInfos, updateStudentDto.SecondaryInfos, student.PID);
            student.Disability = UpdateOneToOne(student.Disability, updateStudentDto.Disability, student.PID);
            student.Scholarship = UpdateOneToOne(student.Scholarship, updateStudentDto.Scholarship, student.PID);
            student.AcademicEnrollment = UpdateOneToOne(student.AcademicEnrollment, updateStudentDto.AcademicEnrollment, student.PID);

            // Update the student in the repository
            _unitOfWork.Students.Update(student);

            // Save all changes to the database
            await _unitOfWork.SaveAsync();

            // Map the updated entity back to a DTO to return
            return _mapper.Map<StudentReadDTO>(student);
        }

        // --- Helper Methods for Update ---

        private void UpdateChildCollection<TEntity, TDto>(ICollection<TEntity> existingCollection, ICollection<TDto> dtoCollection, Guid studentPid)
            where TEntity : BaseEntity where TDto : class
        {
            if (dtoCollection == null) dtoCollection = new List<TDto>();

            // Remove entities that are no longer in the DTO
            var itemsToRemove = existingCollection.Where(e => !dtoCollection.Any(d => (Guid)(d.GetType().GetProperty("PID")?.GetValue(d) ?? Guid.Empty) == e.PID)).ToList();
            foreach (var item in itemsToRemove)
            {
                existingCollection.Remove(item);
            }

            // Add or Update entities
            foreach (var dtoItem in dtoCollection)
            {
                var pid = (Guid)(dtoItem.GetType().GetProperty("PID")?.GetValue(dtoItem) ?? Guid.Empty);
                var existingItem = pid != Guid.Empty ? existingCollection.FirstOrDefault(e => e.PID == pid) : null;

                if (existingItem != null)
                {
                    // Update existing item
                    _mapper.Map(dtoItem, existingItem);
                }
                else
                {
                    // Add new item
                    var newItem = _mapper.Map<TEntity>(dtoItem);
                    newItem.GetType().GetProperty("StudentPID")?.SetValue(newItem, studentPid); // Set FK
                    existingCollection.Add(newItem);
                }
            }
        }
        
        private TEntity? UpdateOneToOne<TEntity, TDto>(TEntity? existingEntity, TDto? dtoItem, Guid studentPid)
            where TEntity : BaseEntity where TDto : class
        {
             if (dtoItem != null)
            {
                if (existingEntity == null)
                {
                    existingEntity = _mapper.Map<TEntity>(dtoItem);
                    existingEntity.GetType().GetProperty("StudentPID")?.SetValue(existingEntity, studentPid);
                }
                else
                {
                    _mapper.Map(dtoItem, existingEntity);
                }
            }
            else
            {
                existingEntity = null; // Mark for removal by EF Core if the relationship is optional
            }
            return existingEntity;
        }

        private async Task<string?> HandleFileUpload(IFormFile? file, string? existingPath)
        {
            if (file == null) return existingPath;

            string wwwRootPath = _webHostEnvironment.WebRootPath;
            string uploadPath = Path.Combine(wwwRootPath, "uploads");
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

            // Delete old file
            if (!string.IsNullOrEmpty(existingPath))
            {
                var oldFilePath = Path.Combine(wwwRootPath, existingPath.TrimStart('/'));
                if (File.Exists(oldFilePath)) File.Delete(oldFilePath);
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

        private async Task<string?> HandleMultipleFileUploads(List<IFormFile>? files, string? existingPaths)
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
                    var oldFilePath = Path.Combine(wwwRootPath, oldPath.TrimStart('/'));
                    if (File.Exists(oldFilePath)) File.Delete(oldFilePath);
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


        // Implementing other methods to make the service complete
        public async Task<StudentReadDTO> CreateStudentAsync(CreateStudentDTO createStudentDto)
        {
            var student = _mapper.Map<Student>(createStudentDto);

            // Handle file uploads
            student.ProfileImagePath = await HandleFileUpload(createStudentDto.ProfileImage, null);
            if (createStudentDto.AcademicCertificates != null && createStudentDto.AcademicCertificates.Any())
            {
                 student.SecondaryInfos ??= new SecondaryInfos();
                 student.SecondaryInfos.AcademicCertificatePaths = await HandleMultipleFileUploads(createStudentDto.AcademicCertificates, null);
            }

            // Set FKs for child collections
            foreach(var item in student.Addresses) item.StudentPID = student.PID;
            foreach(var item in student.Parents) item.StudentPID = student.PID;
            foreach(var item in student.AcademicHistories) item.StudentPID = student.PID;
            foreach(var item in student.Achievements) item.StudentPID = student.PID;
            foreach(var item in student.Hobbies) item.StudentPID = student.PID;
            
            // Set FKs for 1-to-1 relationships
            if(student.Citizenship != null) student.Citizenship.StudentPID = student.PID;
            if(student.SecondaryInfos != null) student.SecondaryInfos.StudentPID = student.PID;
            if(student.Disability != null) student.Disability.StudentPID = student.PID;
            if(student.Scholarship != null) student.Scholarship.StudentPID = student.PID;
            if(student.AcademicEnrollment != null) student.AcademicEnrollment.StudentPID = student.PID;

            await _unitOfWork.Students.AddAsync(student);
            await _unitOfWork.SaveAsync();

            return _mapper.Map<StudentReadDTO>(student);
        }

        public async Task<StudentReadDTO?> GetStudentByPIDAsync(Guid pid)
        {
            var student = await _unitOfWork.Students.GetByPIDAsync(pid, q => q
                .Include(s => s.Addresses)
                .Include(s => s.Parents)
                .Include(s => s.AcademicHistories)
                .Include(s => s.AcademicEnrollment).ThenInclude(ae => ae!.Faculty)
                .Include(s => s.Achievements)
                .Include(s => s.Hobbies)
                .Include(s => s.Disability)
                .Include(s => s.Scholarship)
                .Include(s => s.Citizenship)
                .Include(s => s.SecondaryInfos));
            
            return _mapper.Map<StudentReadDTO>(student);
        }

        public async Task<IEnumerable<StudentSummaryDTO>> GetAllStudentsAsync()
        {
            var students = await _unitOfWork.Students.GetAllAsync(q => q
                .Include(s => s.SecondaryInfos)
                .Include(s => s.AcademicEnrollment)
                .Include(s => s.Addresses));
            
            return _mapper.Map<IEnumerable<StudentSummaryDTO>>(students);
        }

        public async Task<bool> DeleteStudentAsync(Guid pid)
        {
            var student = await _unitOfWork.Students.GetByPIDAsync(pid);
            if (student == null) return false;

            _unitOfWork.Students.Remove(student);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}