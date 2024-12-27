using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySafeNote.Core;
using MySafeNote.Core.Abstractions;
using MySafeNote.WebHost.Model;
using MySafeNote.DataAccess.Repositories;
using MySafeNote.Server;
using System.Collections.Generic;
using System.Linq;
using MySafeNote.Server.Controllers;
using MySafeNote.Server.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
//using Xceed.Words.NET;
using DocumentFormat.OpenXml.Packaging;
using HtmlToOpenXml;

using System.IO;
using System.Text;
using DocumentFormat.OpenXml.Spreadsheet;
//using Xceed.Words.NET;
//using Newtonsoft.Json;

namespace my_safe_note.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly ILogger<NoteController> _logger;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly INoteRepository _noteRepository;
        private readonly IUserRepository _userRepository;
        public NoteController(ILogger<NoteController> logger, INoteRepository noteRepository, IUserRepository userRepository)
        {
            _logger = logger;
            _passwordHasher = new PasswordHasher<User>();
            _noteRepository = noteRepository;
            _userRepository = userRepository;
        }

        //// GET: api/Note
        //[HttpGet]
        //public async Task<ActionResult<List<Note>>> GetAllNotesAsync()
        //{
        //    var notes = await _noteRepository.GetAllAsync();
        //    return Ok(notes);
        //}


        //// GET: api/Note
        //[HttpGet(Name = "GetNote")]
        //public async Task<ActionResult<List<Note>>> GetAllNotesAsync()
        //{
        //    var notes = await _noteRepository.GetAllAsync();
        //    return Ok(notes);
        //}

        //!!!
        // GET: api/Note
        [HttpGet(Name = "GetNote")]
        public async Task<ActionResult<List<Note>>> GetAllNotesAsync()
        {
            _logger.LogInformation("GetAllNotesAsync");
            var notesDto = new List<NoteDtoGet>();
            var notes = await _noteRepository.GetAllAsync();
            if (notes.Any())
            {
                notesDto = notes.Select(x => new NoteDtoGet
                {
                    Id = x.Id,
                    Title = x.Title,
                    Notebook = x.Notebook,
                    CreateDate = x.CreateDate,
                    LastChangeDate = x.LastChangeDate,
                    NoteBody = x.NoteBody,
                    NotePasswordHash = x.NotePasswordHash,
                    UserId = x.UserId
                }).ToList();
            }
            return Ok(notesDto);
        }

        // DELETE api/User/email/{email}
        //[HttpDelete("email/{email}")]

        // GET: api/Note/userid/{id}
        [HttpGet("userid/{userId}")]
        [Authorize] // Этот метод требует аутентификации
        public async Task<ActionResult<List<Note>>> GetNotesByUserIdAsync(int userId)
        {
            _logger.LogInformation($"GetNotesByUserIdAsync userId = {userId}");
            var notesDto = new List<NoteDtoGet>();
            var notes = await _noteRepository.GetNotesByUserIdAsync(userId);
            if (notes.Any())
            {
                notesDto = notes.Select(x => new NoteDtoGet
                {
                    Id = x.Id,
                    Title = x.Title,
                    CreateDate = x.CreateDate,
                    LastChangeDate = x.LastChangeDate
                }).ToList();
            }
            return Ok(notesDto);
        }
        //!!!

        //        private static readonly string[] Summaries = new[]
        //{
        //                    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        //                };

        //        [HttpGet(Name = "GetNote")]
        //        public IEnumerable<WeatherForecast> Get()
        //        {
        //            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //            {
        //                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
        //                TemperatureC = Random.Shared.Next(-20, 55),
        //                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        //            })
        //            .ToArray();
        //        }

        // GET api/Note/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Note>> GetNoteByIdAsync(int id)
        {
            var note = await _noteRepository.GetByIdAsync(id);
            if (note == null)
            {
                return NotFound($"Note с ID: {id} не найден.");
            }
            return Ok(note);
        }

        //[HttpPost("login/")]
        //public async Task<IActionResult> LoginUserByEmail(UserDto userLoginData)

        // Post: api/Note/notebody/
        [HttpPost("notebody/")]
        //public async Task<ActionResult<string>> GetNoteBodyByIdAsync([FromBody] NoteBodyDto noteDto)
        public async Task<ActionResult<NoteDataWithBodyDto>> GetNoteBodyByIdAsync(NoteBodyDto noteDto)
        {
            if (noteDto == null)
            {
                return BadRequest("Некорректные данные.");
            }
            if (noteDto.NoteId == null)
            {
                return BadRequest("Не передан noteId.");
            }
            if (noteDto.UserId == null)
            {
                return BadRequest("Не передан userId.");
            }
            var noteId = noteDto.NoteId.Value;
            var note = await _noteRepository.GetByIdAsync(noteId);
            if (note == null)
            {
                return NotFound($"Note с ID: {noteId} не найден.");
            }

            var noteData = new NoteDataWithBodyDto
            {
                Title = note.Title,
                Notebook = note.Notebook,
                CreateDate = note.CreateDate,
                LastChangeDate = note.LastChangeDate,
                NoteBody = note.NoteBody,
            };
            return Ok(noteData);
        }

        //[HttpPost]
        //public async Task<ActionResult<int>> CreateNoteAsync([FromBody] NoteDtoCreate noteDto)
        //{
        //    // Проверяем, что данные в данные валидны
        //    if (noteDto == null)
        //    {
        //        return BadRequest("Некорректные данные.");
        //    }
        //    try
        //    {
        //        //var number = noteDto.Number;
        //        var title = noteDto.Title;
        //        //var bodyLink = noteDto.BodyLink;
        //        var notebook = noteDto.Notebook;
        //        var notePassword = noteDto.NotePassword;
        //        var createDate = noteDto.CreateDate;
        //        var notePasswordHash = string.Empty;  //!!!зашифровать!!
        //        var noteBody = noteDto.NoteBody;
        //        //if (!string.IsNullOrEmpty(notePassword))
        //        //    notePasswordHash = Services.HashPassword(notePassword);
        //        var userId = noteDto.UserId;

        //        var user = await _userRepository.GetByIdAsync(userId);
        //        if (user == null)
        //            return BadRequest("$Пользователя с ИД: {userId} не существует.");

        //        if (!string.IsNullOrEmpty(notePassword))
        //            //notePasswordHash = Services.HashPassword(user, notePassword);
        //            _passwordHasher.HashPassword(user, notePassword);

        //        var newNote = new Note
        //        {
        //            //Number = number,
        //            Title = title,
        //            //BodyLink = bodyLink,
        //            Notebook = notebook,
        //            NotePasswordHash = notePasswordHash,
        //            CreateDate = createDate,
        //            LastChangeDate = createDate,
        //            NoteBody = noteBody,
        //            UserId = userId
        //        };
        //        var newNoteId = await _noteRepository.CreateAsync(newNote);
        //        return Ok(newNoteId);
        //        //return CreatedAtAction(nameof(GetNoteByIdAsync), new { id = newNoteId }, newNoteId);
        //    }
        //    catch (ArgumentException ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Внутренняя ошибка сервера. {ex.Message}");
        //    }
        //}

        //Post: api/Note/savenote
        [HttpPost("savenote/")]
        public async Task<ActionResult<int>> CreateNoteAsync([FromBody] NoteDto noteDto)
        {
            //Console.WriteLine($"Received NoteDto: {JsonConvert.SerializeObject(noteDto)}");
            Console.WriteLine($"Received NoteDto: {noteDto}");
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
                var notePassword = noteDto.NotePassword;

                var notePasswordHash = notePassword;  //!!!зашифровать!!
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

        // PUT api/Note/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Note>> ChangeNoteByIdAsync(int id, [FromBody] NoteDtoChange changedNote)
        {
            if (changedNote is null)
            {
                return BadRequest("changedNote пустой");
            }
            var note = await _noteRepository.GetByIdAsync(id);
            if (note == null)
            {
                return BadRequest($"Note с ID: {id} не найден.");
            }

            var userId = changedNote.UserId;

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return BadRequest("$Пользователя с ИД: {userId} не существует.");

            // Обновляем данные заметки
            //note.Number = changedNote.Number;
            note.Title = changedNote.Title;
            //note.BodyLink = changedNote.BodyLink;
            note.Notebook = changedNote.Notebook;
            note.LastChangeDate = changedNote.LastChangeDate;
            note.NoteBody = changedNote.NoteBody;
            //var notePasswordHash = string.Empty;

            if (!string.IsNullOrEmpty(changedNote.NotePassword))
                //note.NotePasswordHash = Services.HashPassword(changedNote.NotePassword);
                note.NotePasswordHash = _passwordHasher.HashPassword(user, changedNote.NotePassword);
            

            await _noteRepository.UpdateAsync(note);
            return Ok(note);
        }

        // DELETE api/Note/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<int>> DeleteNoteByIdAsync(int id)
        {
            var deletedId = await _noteRepository.RemoveAsync(id);
            return Ok(deletedId);
        }

        //Post: api/Note/notedocx
        [HttpPost("notedocx/")]
        [Authorize]
        public async Task<ActionResult> ConvertNoteBodyToDocxAsync([FromBody] int noteId) 
        {
            try
            {
                var note = await _noteRepository.GetByIdAsync(noteId);
                if (note == null)
                {
                    return BadRequest($"Note с ID: {noteId} не найден.");
                }
                var htmlContent = note.NoteBody;
                var noteName = note.Title;

                if (htmlContent != null && noteName != null)
                {
                    string fileName = noteName + ".docx";
                    // Путь к выходному файлу
                    string filePath = Path.Combine(Path.GetTempPath(), fileName);

                    // Создание документа DOCX
                    using (var document = WordprocessingDocument.Create(filePath, DocumentFormat.OpenXml.WordprocessingDocumentType.Document))
                    {
                        // Добавление основного документа
                        var mainPart = document.AddMainDocumentPart();
                        mainPart.Document = new DocumentFormat.OpenXml.Wordprocessing.Document();
                        var body = new DocumentFormat.OpenXml.Wordprocessing.Body();

                        // Конвертация HTML в Open XML
                        var converter = new HtmlConverter(mainPart);
                        var paragraphs = converter.Parse(htmlContent);

                        // Добавление параграфов в тело документа
                        foreach (var paragraph in paragraphs)
                        {
                            body.Append(paragraph);
                        }

                        mainPart.Document.Append(body);
                        mainPart.Document.Save();
                    }

                    // Чтение файла и возврат его в ответе
                    var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                    var contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    return File(fileBytes, contentType, fileName);
                }
                return BadRequest("Содержимое заметки пустое.");
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


    }
}

