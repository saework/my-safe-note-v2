using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySafeNote.Core.Abstractions
{
    public interface IRepository<T> where T : BaseEntity
    {
        //Task<ICollection<T>> GetAllAsync();
        Task<List<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task<int> CreateAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task<int> RemoveAsync(int id);
    }
}
