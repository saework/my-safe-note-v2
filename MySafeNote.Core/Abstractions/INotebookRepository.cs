﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySafeNote.Core.Abstractions
{
    public interface INotebookRepository : IRepository<Notebook>
    {
        Task<List<Notebook>> GetAllNotebooksByUserEmailAsync(string email);
        Task<int> DeleteAllNotebooksByUserEmailAsync(string email);
        Task<List<Notebook>> GetNotebooksByUserIdAsync(int userId);
        Task<string> GetNotebookNameByIdAsync(int? notebookId);
        Task<Notebook> GetNotebookByNameAndUserIdAsync(string name, int userId);
    }
}
