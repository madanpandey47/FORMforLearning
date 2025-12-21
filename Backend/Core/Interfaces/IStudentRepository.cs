using FormBackend.Models;

namespace FormBackend.Core.Interfaces
{
    public interface IStudentRepository : IGenericRepository<Student>
    {
        Task<Student?> GetByEmailAsync(string email);
        Task<IEnumerable<Student>> GetByProgramNameAsync(string programName);
        Task<bool> ExistsByEmailAsync(string email);
    }
}
