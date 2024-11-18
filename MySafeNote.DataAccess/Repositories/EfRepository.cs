using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySafeNote.Core.Abstractions;
using MySafeNote.Core;
using Microsoft.EntityFrameworkCore;

namespace MySafeNote.DataAccess.Repositories
{
    public class EfRepository<T> : IRepository<T> where T : BaseEntity
    {
        protected DbContext Context { get; }
        protected DbSet<T> DbSet { get; }

        protected EfRepository(DbContext context)
        {
            Context = context;
            DbSet = Context.Set<T>();
        }

        public async Task<int> CreateAsync(T entity)
        {
            await DbSet.AddAsync(entity);
            await SaveChanges();
            return entity.Id;
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await DbSet.AsNoTracking().ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await DbSet.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<int> RemoveAsync(int id)
        {
            var item = await DbSet.FirstOrDefaultAsync(e => e.Id == id);
            if (item != null)
            {
                DbSet.Remove(item);
                await SaveChanges();
                return id;
            }
            else
                return 0;
        }

        public async Task<T> UpdateAsync(T entity)
        {
            DbSet.Update(entity);
            await SaveChanges();
            return entity;
            //return await DbSet.FirstOrDefaultAsync(e => e.Id == entity.Id);
        }

        private async Task SaveChanges()
        {
            await Context.SaveChangesAsync();
        }
    }
}
