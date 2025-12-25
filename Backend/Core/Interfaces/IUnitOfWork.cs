using System;
using System.Threading.Tasks;
using FormBackend.Core.Repositories;
using FormBackend.Models;

namespace FormBackend.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        StudentRepository Students { get; }
        IGenericRepository<Parent> Parents { get; }
        IGenericRepository<AcademicHistory> AcademicHistories { get; }
        IGenericRepository<AcademicEnrollment> AcademicEnrollments { get; }
        Task<int> SaveAsync();
    }
}