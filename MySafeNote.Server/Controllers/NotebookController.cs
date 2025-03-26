using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MySafeNote.Core.Abstractions;
using MySafeNote.Core;
using MySafeNote.DataAccess.Repositories;
using Microsoft.AspNetCore.Authorization;
using MySafeNote.Server.Model;

namespace MySafeNote.Server.Controllers
{
    //namespace my_safe_note.Controllers
    //{
        [Route("api/[controller]")]
        [ApiController]
        public class NotebookController : ControllerBase
        {
            private readonly ILogger<NotebookController> _logger;
            private readonly IUserRepository _userRepository;
            private readonly INotebookRepository _notebookRepository;
            public NotebookController(ILogger<NotebookController> logger, INotebookRepository notebookRepository, IUserRepository userRepository)
            {
                _logger = logger;
                _userRepository = userRepository;
                _notebookRepository = notebookRepository;
            }

            // GET: api/notebook/userid/{userId}
            [HttpGet("userid/{userId}")]
            [Authorize]
            public async Task<ActionResult<List<NotebookDto>>> GetNotebooksByUserIdAsync(int userId)
            {
                _logger.LogInformation("GetNotebooksByUserIdAsync userId = {userId}", userId);
                var notebooksDto = new List<NotebookDto>();
                var notebooks = await _notebookRepository.GetNotebooksByUserIdAsync(userId);
                //return Ok(notebooks);
                if (notebooks.Any())

                {
                    notebooksDto = notebooks.Select(x => new NotebookDto
                    {
                        Id = x.Id,
                        Name = x.Name
                    }).ToList();
                }
                return notebooksDto;
            }

            //Post: api/notebook/savenotebook
            [HttpPost("savenotebook/")]
            [Authorize]
            public async Task<ActionResult<int>> CreateNotebookAsync([FromBody] Notebook notebookDto)
            {
                _logger.LogInformation("CreateNotebookAsync. Start");
                if (notebookDto == null)
                {
                    return BadRequest("Некорректные данные.");
                }
                try
                {
                    var notebookId = notebookDto.Id;
                    var name = notebookDto.Name;
                    var userId = notebookDto.UserId;
                    var user = await _userRepository.GetByIdAsync(userId);

                    if (user == null)
                        return BadRequest("$Пользователя с ИД: {userId} не существует.");

                    if (notebookId == 0) // Создаем новый блокнот
                    {
                        var newNotebook = new Notebook
                        {
                            Name = name,
                            UserId = userId,
                            //User = user
                        };
                        var newNotebookId = await _notebookRepository.CreateAsync(newNotebook);
                        _logger.LogInformation("CreateNotebookAsync. Create success");
                        return Ok(newNotebookId);
                    }
                    else // Обновляем данные заметки
                    {
                        var notebook = await _notebookRepository.GetByIdAsync(notebookId);
                        if (notebook == null)
                        {
                            return BadRequest($"Note с ID: {notebookId} не найден.");
                        }

                        notebook.Name = name;

                        await _notebookRepository.UpdateAsync(notebook);
                        _logger.LogInformation("CreateNotebookAsync. Update success");
                        return Ok(notebook.Id);
                    }
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

            // DELETE api/notebook/5
            [HttpDelete("{id}")]
            [Authorize]
            public async Task<ActionResult<int>> DeleteNotebookByIdAsync(int id)
            {
                var deletedId = await _notebookRepository.RemoveAsync(id);
                return Ok(deletedId);
            }
        }
    //}
}
