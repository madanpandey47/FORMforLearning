using FormBackend.Core.Interfaces;
using FormBackend.Data;
using FormBackend.Models;
using System;
using System.Threading.Tasks;

namespace FormBackend.Core.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IStudentRepository? _studentRepository;
        private IGenericRepository<Parent>? _parentRepository;
        private IGenericRepository<AcademicHistory>? _academicHistoryRepository;
        private IGenericRepository<AcademicEnrollment>? _academicEnrollmentRepository;
        private IGenericRepository<Faculty>? _facultyRepository;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IStudentRepository Students
        {
            get { return _studentRepository ??= new StudentRepository(_context); }
        }

        public IGenericRepository<Parent> Parents
        {
            get { return _parentRepository ??= new GenericRepository<Parent>(_context); }
        }

        public IGenericRepository<AcademicHistory> AcademicHistories
        {
            get { return _academicHistoryRepository ??= new GenericRepository<AcademicHistory>(_context); }
        }

        public IGenericRepository<AcademicEnrollment> AcademicEnrollments
        {
            get { return _academicEnrollmentRepository ??= new GenericRepository<AcademicEnrollment>(_context); }
        }

        public IGenericRepository<Faculty> Faculties
        {
            get { return _facultyRepository ??= new GenericRepository<Faculty>(_context); }
        }

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
