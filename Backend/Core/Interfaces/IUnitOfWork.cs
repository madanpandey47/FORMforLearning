using System;
using System.Threading.Tasks;

namespace FormBackend.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IStudentRepository Students { get; }
        Task<int> SaveAsync();
    }
}