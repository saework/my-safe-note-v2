using System.Threading.Tasks;
using MySafeNote.Core;
using MySafeNote.Core.Abstractions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace MySafeNote.DataAccess.Repositories
{
    public class NoteRepository : EfRepository<Note>, INoteRepository
    {
        private readonly IUserRepository _userRepository;
        public NoteRepository(DataContext context, IUserRepository userRepository) : base(context)
        {
            _userRepository = userRepository;
        }
        public async Task<List<Note>> GetAllNotesByUserEmailAsync(string email)
        {
            var notes = new List<Note>();
            var userId = await _userRepository.GetUserIdByEmailAsync(email);
            if (userId != 0)
                notes = await DbSet.Where(x => x.UserId == userId).ToListAsync();
            return notes;
        }

        public async Task<int> DeleteAllNotesByUserEmailAsync(string email)
        {
            var notesToDelete = await GetAllNotesByUserEmailAsync(email);
            if (notesToDelete.Any())
            {
                DbSet.RemoveRange(notesToDelete);
                return await Context.SaveChangesAsync(); // Возвращаем количество удалённых записей
            }
            return 0; // Если заметок не было, возвращаем 0
        }
    }
}
