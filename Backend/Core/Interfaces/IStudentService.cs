using FormBackend.DTOs;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace FormBackend.Core.Interfaces
{
    public interface IStudentService
    {
        Task<StudentReadDTO> CreateStudentAsync(CreateStudentDTO createStudentDto);
        Task<StudentReadDTO?> GetStudentByPIDAsync(Guid pid);
        Task<IEnumerable<StudentReadDTO>> GetAllStudentsAsync();
        Task<StudentReadDTO?> UpdateStudentAsync(Guid pid, UpdateStudentDTO updateStudentDto);
        Task<bool> DeleteStudentAsync(Guid pid);
    }
}
