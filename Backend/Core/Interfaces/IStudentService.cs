using FormBackend.DTOs;
using FormBackend.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace FormBackend.Core.Interfaces
{
    public interface IStudentService
    {
        Task<StudentDTO?> CreateStudentAsync(StudentDTO studentDto, List<IFormFile>? imageFiles);
        Task<StudentDTO?> GetStudentByIdAsync(int id);
        Task<List<StudentDTO>> GetAllStudentsAsync();
    }
}
