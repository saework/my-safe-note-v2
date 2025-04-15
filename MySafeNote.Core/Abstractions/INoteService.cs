using Microsoft.AspNetCore.Http;
using MySafeNote.Core.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySafeNote.Core.Abstractions
{
    public interface INoteService
    {
        Task<List<NoteDtoGet>> GetAllNotesAsync();
        Task<List<NoteDtoGet>> GetNotesByUserIdAsync(int userId);
        Task<Note> GetNoteByIdAsync(int id);
        Task<NoteDataWithBodyDto> GetNoteBodyByIdAsync(NoteBodyDto noteDto);
        Task<int> CreateOrUpdateNoteAsync(NoteDto noteDto);
        Task<Note> ChangeNoteByIdAsync(int id, NoteDtoChange changedNote);
        Task<int> DeleteNoteByIdAsync(int id);
        Task<byte[]> ConvertNoteBodyToDocxAsync(int noteId);
        Task<byte[]> ExportNotesToDocxAsync(int userId);
        Task<byte[]> ExportUserNotesToHtmlAsync(int userId);
        Task ImportNotesFromZipAsync(int userId, IFormFile file);
    }
}
