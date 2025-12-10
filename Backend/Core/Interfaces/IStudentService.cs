using FormBackend.DTOs;
using FormBackend.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace FormBackend.Core.Interfaces
{
    public interface IStudentService
    {
        Task<StudentDTO?> CreateStudentAsync(StudentDTO studentDto, IFormFile? profileImage, List<IFormFile>? academicCertificates);
        Task<StudentDTO?> GetStudentByIdAsync(int id);
        Task<List<StudentDTO>> GetAllStudentsAsync();
        Task<StudentDTO?> UpdateStudentAsync(int id, StudentDTO studentDto, IFormFile? profileImage, List<IFormFile>? academicCertificates);
        Task<bool> DeleteStudentAsync(int id);
    }
}
