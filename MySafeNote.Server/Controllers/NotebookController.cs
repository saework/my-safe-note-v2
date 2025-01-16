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
        }
    }
}
