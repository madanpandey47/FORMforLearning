using FormBackend.DTOs;

namespace FormBackend.Core.Interfaces
{
    public interface IStudentService
    {
        Task<IEnumerable<StudentReadDTO>> GetAllAsync();
        Task<IEnumerable<StudentLookupDTO>> GetAllLookupAsync();
        Task<StudentReadDTO?> GetByIdAsync(Guid pid);
        Task<StudentReadDTO> CreateAsync(CreateStudentDTO createStudentDto);
        Task<bool> UpdateAsync(Guid pid, UpdateStudentDTO updateStudentDto);
        Task<bool> DeleteAsync(Guid pid);
    }
}
