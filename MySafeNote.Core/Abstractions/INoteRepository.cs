using System.Threading.Tasks;
using System.Collections.Generic;

namespace MySafeNote.Core.Abstractions
{
    public interface INoteRepository : IRepository<Note>
    {
        Task<List<Note>> GetAllNotesByUserEmailAsync(string email);
        Task<int> DeleteAllNotesByUserEmailAsync(string email);
        Task<List<Note>> GetNotesByUserIdAsync(int userId);
        Task<List<Note>> GetNotesByNotebookIdAsync(int? notebookId, int userId);
    }
}
