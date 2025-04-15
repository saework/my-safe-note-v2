using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySafeNote.Core.Dtos;

namespace MySafeNote.Core.Abstractions
{
    public interface INotebookService
    {
        Task<List<NotebookDto>> GetNotebooksByUserIdAsync(int userId);
        Task<int> CreateOrUpdateNotebookAsync(Notebook notebookDto);
        Task<int> DeleteNotebookByIdAsync(int id);
    }
}
