using FormBackend.DTOs;
using FormBackend.Models;
using System.Threading.Tasks;

namespace FormBackend.Core.Interfaces
{
    public interface IStudentService
    {
        Task<Student> CreateStudentAsync(StudentDTO studentDto);
        Task<StudentDTO?> GetStudentByIdAsync(int id);
    }
}
