using FormBackend.Core.Interfaces;
using FormBackend.Data;
using FormBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FormBackend.Core.Repositories
{
    public class StudentRepository : GenericRepository<Student>, IStudentRepository
    {
        public StudentRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Student?> GetByEmailAsync(string email)
        {
            return await _dbSet
                .FirstOrDefaultAsync(s => s.PrimaryEmail == email);
        }

        public async Task<IEnumerable<Student>> GetByProgramNameAsync(string programName)
        {
            return await _dbSet
                .Include(s => s.AcademicEnrollment)
                .Where(s => s.AcademicEnrollment != null && s.AcademicEnrollment.ProgramName == programName)
                .ToListAsync();
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _dbSet
                .AnyAsync(s => s.PrimaryEmail == email);
        }
    }
}
