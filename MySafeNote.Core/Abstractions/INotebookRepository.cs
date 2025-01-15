using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySafeNote.Core.Abstractions
{
    public interface INotebookRepository : IRepository<Notebook>
    {
        //Task<List<Notebook>> GetAllNotebooksByUserEmailAsync(string email);
        //Task<int> DeleteAllNotebookByUserEmailAsync(string email);
        //Task<List<Note>> GetNotebooksByUserIdAsync(int userId);
    }
}
