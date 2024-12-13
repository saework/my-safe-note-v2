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
            var notesDto = new List<NoteDtoGet>();
            var notes = await _noteRepository.GetAllAsync();
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

        // DELETE api/User/email/{email}
        //[HttpDelete("email/{email}")]

        // GET: api/Note/userid/{id}
        [HttpGet("userid/{userId}")]
        [Authorize] // Этот метод требует аутентификации
        public async Task<ActionResult<List<Note>>> GetNotesByUserIdAsync(int userId)
        {
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

        [HttpPost]
        public async Task<ActionResult<int>> CreateNoteAsync([FromBody] NoteDtoCreate noteDto)
        {
            // Проверяем, что данные в данные валидны
            if (noteDto == null)
            {
                return BadRequest("Некорректные данные.");
            }
            try
            {
                //var number = noteDto.Number;
                var title = noteDto.Title;
                var bodyLink = noteDto.BodyLink;
                var notePassword = noteDto.NotePassword;
                var createDate = noteDto.CreateDate;
                var notePasswordHash = string.Empty;
                //if (!string.IsNullOrEmpty(notePassword))
                //    notePasswordHash = Services.HashPassword(notePassword);
                var userId = noteDto.UserId;

                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                    return BadRequest("$Пользователя с ИД: {userId} не существует.");

                if (!string.IsNullOrEmpty(notePassword))
                    //notePasswordHash = Services.HashPassword(user, notePassword);
                    _passwordHasher.HashPassword(user, notePassword);

                var newNote = new Note
                {
                    //Number = number,
                    Title = title,
                    BodyLink = bodyLink,
                    NotePasswordHash = notePasswordHash,
                    CreateDate = createDate,
                    LastChangeDate = createDate,
                    UserId = userId
                };
                var newNoteId = await _noteRepository.CreateAsync(newNote);
                return Ok(newNoteId);
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
            note.BodyLink = changedNote.BodyLink;
            note.LastChangeDate = changedNote.LastChangeDate;
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
    }
}

