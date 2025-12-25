using FormBackend.Core.Interfaces;
using FormBackend.Data;
using FormBackend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FormBackend.Core.Repositories
{
    public class StudentRepository : GenericRepository<Student>
    {
        public StudentRepository(ApplicationDbContext context) : base(context)
        {
        }

        // Get student with all related data for full display
        public async Task<Student?> GetStudentForReadAsync(Guid pid)
        {
            return await _context.Students
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
        }

        // Get all students with data for lookup/list display
        public async Task<IEnumerable<Student>> GetStudentsForLookupAsync()
        {
            return await _context.Students
                .Include(s => s.AcademicEnrollment)
                .Include(s => s.SecondaryInfos)
                .Include(s => s.Citizenship)
                .AsNoTracking()
                .ToListAsync();
        }

        // Get student for deletion (with file paths)
        public async Task<Student?> GetStudentForDeleteAsync(Guid pid)
        {
            return await _context.Students
                .Include(s => s.SecondaryInfos)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.PID == pid);
        }

        // Get student for update (all related data)
        public async Task<Student?> GetStudentForUpdateAsync(Guid pid)
        {
            return await _context.Students
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
        }
    }
}
