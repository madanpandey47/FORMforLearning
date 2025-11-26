using System;
using System.Threading.Tasks;

namespace FormBackend.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<T> GetRepository<T>() where T : class;
        Task<int> CompleteAsync();
    }
}
