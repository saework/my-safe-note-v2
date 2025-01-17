using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MySafeNote.Core.Abstractions;
using MySafeNote.Core;
using MySafeNote.DataAccess.Repositories;
using Microsoft.AspNetCore.Authorization;
using MySafeNote.Server.Model;

namespace MySafeNote.Server.Controllers
{
    namespace my_safe_note.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        public class NotebookController : ControllerBase
        {
            private readonly ILogger<NotebookController> _logger;
            //private readonly INoteRepository _noteRepository;
            //private readonly IUserRepository _userRepository;
            private readonly INotebookRepository _notebookRepository;
            //public NotebookController(ILogger<NotebookController> logger, INoteRepository noteRepository, IUserRepository userRepository, INotebookRepository notebookRepository)
            public NotebookController(ILogger<NotebookController> logger, INotebookRepository notebookRepository)
            {
                _logger = logger;
                //_noteRepository = noteRepository;
                //_userRepository = userRepository;
                _notebookRepository = notebookRepository;
            }

            // GET: api/Notebook/userid/{userId}
            [HttpGet("userid/{userId}")]
            //[Authorize]
            public async Task<ActionResult<List<Notebook>>> GetNotebooksByUserIdAsync(int userId)
            {
                _logger.LogInformation("GetNotebooksByUserIdAsync userId = {userId}", userId);
                var notebooks = await _notebookRepository.GetNotebooksByUserIdAsync(userId);
                return Ok(notebooks);
            }

            //!!!
            //Post: api/Note/savenote
            [HttpPost("savenotebook/")]
            public async Task<ActionResult<int>> CreateNotebookAsync([FromBody] NoteDto noteDto)
            {
                _logger.LogInformation("CreateNotebookAsync. Start");
                // Проверяем, что данные в данные валидны
                if (noteDto == null)
                {
                    return BadRequest("Некорректные данные.");
                }
                try
                {
                    var noteId = noteDto.NoteId;
                    var title = noteDto.Title;
                    var notebook = noteDto.Notebook;
                    var createDate = noteDto.CreateDate;
                    var changeDate = noteDto.LastChangeDate;
                    var noteBody = noteDto.NoteBody;
                    var notePasswordHash = noteDto.NotePasswordHash;

                    //var notePasswordHash = notePassword;  //!!!зашифровать!!
                    //if (!string.IsNullOrEmpty(noteDto.NotePassword))
                    //    //шифрование пароля заметки

                    var userId = noteDto.UserId;
                    var user = await _userRepository.GetByIdAsync(userId);

                    if (user == null)
                        return BadRequest("$Пользователя с ИД: {userId} не существует.");

                    Console.WriteLine($"noteId: {noteId}");
                    if (noteId == 0) // Создаем новую заметку
                    {
                        var newNote = new Note
                        {
                            Title = title,
                            Notebook = notebook,
                            CreateDate = createDate,
                            LastChangeDate = createDate,
                            NoteBody = noteBody,
                            NotePasswordHash = notePasswordHash,
                            UserId = userId
                        };
                        var newNoteId = await _noteRepository.CreateAsync(newNote);
                        _logger.LogInformation("CreateNoteAsync. Create success");
                        return Ok(newNoteId);
                    }
                    else // Обновляем данные заметки
                    {
                        var note = await _noteRepository.GetByIdAsync(noteId);
                        if (note == null)
                        {
                            return BadRequest($"Note с ID: {noteId} не найден.");
                        }

                        note.Title = title;
                        note.Notebook = notebook;
                        note.LastChangeDate = createDate;
                        note.NoteBody = noteBody;
                        note.NotePasswordHash = notePasswordHash;

                        //if (!string.IsNullOrEmpty(changedNote.NotePassword))
                        //    //note.NotePasswordHash = Services.HashPassword(changedNote.NotePassword);
                        //    note.NotePasswordHash = _passwordHasher.HashPassword(user, changedNote.NotePassword);


                        await _noteRepository.UpdateAsync(note);
                        _logger.LogInformation("CreateNoteAsync. Update success");
                        return Ok(note.Id);
                    }

                    //return CreatedAtAction(nameof(GetNoteByIdAsync), new { id = newNoteId }, newNoteId);
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(ex.Message);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Внутренняя ошибка сервера. {ex.Message}");
                }
            }
            //!!!

        }
    }
}
