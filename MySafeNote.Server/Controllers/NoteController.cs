using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySafeNote.Core;
using MySafeNote.Core.Abstractions;
using MySafeNote.WebHost.Model;
using MySafeNote.DataAccess.Repositories;

namespace my_safe_note.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly INoteRepository _noteRepository;
        private readonly IUserRepository _userRepository;
        public NoteController(INoteRepository noteRepository, IUserRepository userRepository)
        {
            _noteRepository = noteRepository;
            _userRepository = userRepository;
        }

        // GET: api/Note
        [HttpGet]
        public async Task<ActionResult<List<Note>>> GetAllNotesAsync()
        {
            var notes = await _noteRepository.GetAllAsync();
            return Ok(notes);
        }

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
                var number = noteDto.Number;
                var title = noteDto.Title;
                var bodyLink = noteDto.BodyLink;
                var notePassword = noteDto.NotePassword;
                var createDate = noteDto.CreateDate;
                var notePasswordHash = string.Empty;
                if (!string.IsNullOrEmpty(notePassword))
                    notePasswordHash = Services.HashPassword(notePassword);
                var userId = noteDto.UserId;

                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                    return BadRequest("$Пользователя с ИД: {userId} не существует.");

                var newNote = new Note
                {
                    Number = number,
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
            // Обновляем данные заметки
            note.Number = changedNote.Number;
            note.Title = changedNote.Title;
            note.BodyLink = changedNote.BodyLink;
            note.LastChangeDate = changedNote.LastChangeDate;
            //var notePasswordHash = string.Empty;

            if (!string.IsNullOrEmpty(changedNote.NotePassword))
                note.NotePasswordHash = Services.HashPassword(changedNote.NotePassword);

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

