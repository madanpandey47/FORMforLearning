using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace FormBackend.Core.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> GetAllAsync(params Expression<Func<T, object?>>[] includes);
        Task<T?> GetByPIDAsync(Guid pid, params Expression<Func<T, object?>>[] includes);

        Task AddAsync(T entity);
        void Update(T entity);
        void Remove(T entity);
    }
}