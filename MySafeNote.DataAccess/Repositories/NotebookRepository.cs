﻿using System;
using Microsoft.EntityFrameworkCore;
using MySafeNote.Core.Abstractions;
using MySafeNote.Core;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MySafeNote.DataAccess.Repositories
{
    public class NotebookRepository : EfRepository<Notebook>, INotebookRepository
    {
        private readonly IUserRepository _userRepository;
        public NotebookRepository(DataContext context, IUserRepository userRepository) : base(context)
        {
            _userRepository = userRepository;
        }

        public async Task<List<Notebook>> GetNotebooksByUserIdAsync(int userId)
        {
            var notebooks = await DbSet.Where(x => x.UserId == userId).ToListAsync();
            return notebooks;
        }

        public async Task<Notebook> GetNotebookByNameAndUserIdAsync(string name, int userId)
        {
            var notebook = await DbSet.Where(x => x.UserId == userId && x.Name == name).FirstOrDefaultAsync();
            return notebook;
        }

        public async Task<string> GetNotebookNameByIdAsync(int? notebookId)
        {
            var notebookName = string.Empty;
            if (notebookId.HasValue)
            {
                var notebook = await DbSet.Where(x => x.Id == notebookId).FirstOrDefaultAsync();
                if (notebook != null)
                    notebookName = notebook.Name;
            }
            return notebookName;
        }

        public async Task<List<Notebook>> GetAllNotebooksByUserEmailAsync(string email)
        {
            var notebooks = new List<Notebook>();
            var userId = await _userRepository.GetUserIdByEmailAsync(email);
            if (userId > 0)
                notebooks = await DbSet.Where(x => x.UserId == userId).ToListAsync();
            return notebooks;
        }

        public async Task<int> DeleteAllNotebooksByUserEmailAsync(string email)
        {
            var notebooksToDelete = await GetAllNotebooksByUserEmailAsync(email);
            if (notebooksToDelete.Count > 0)
            {
                DbSet.RemoveRange(notebooksToDelete);
                return await Context.SaveChangesAsync(); // Возвращаем количество удалённых записей
            }
            return 0; // Если блокнотов не было, возвращаем 0
        }
    }
}
