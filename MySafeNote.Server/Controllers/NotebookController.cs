using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MySafeNote.Core.Abstractions;
using MySafeNote.Core;
using MySafeNote.DataAccess.Repositories;
using Microsoft.AspNetCore.Authorization;
//using MySafeNote.Server.Model;
using MySafeNote.Core.Dtos;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Office2010.Excel;

namespace MySafeNote.Server.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class NotebookController : ControllerBase
    {
        private readonly ILogger<NotebookController> _logger;
        private readonly INotebookService _notebookService;

        public NotebookController(ILogger<NotebookController> logger, INotebookService notebookService)
        {
            _logger = logger;
            _notebookService = notebookService;
        }

        [HttpGet("userid/{userId}")]
        [Authorize]
        public async Task<ActionResult<List<NotebookDto>>> GetNotebooksByUserIdAsync(int userId)
        {
            try
            {
                var notebooksDto = await _notebookService.GetNotebooksByUserIdAsync(userId);
                _logger.LogDebug("GetNotebooksByUserIdAsync. UserId: {userId}", userId);
                return Ok(notebooksDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetNotebooksByUserIdAsync. UserId: {id}. Error:", userId);
                return StatusCode(500, $"Internal Server Error. {ex.Message}");
            }
        }

        [HttpPost("savenotebook/")]
        [Authorize]
        public async Task<ActionResult<int>> CreateNotebookAsync([FromBody] Notebook notebookDto)
        {
            try
            {
                var notebookId = await _notebookService.CreateOrUpdateNotebookAsync(notebookDto);
                _logger.LogInformation("CreateNotebookAsync. NotebookId: {notebookId}", notebookId);
                return Ok(notebookId);
            }
            catch (Exception ex)
            {
                var userId = notebookDto?.UserId.ToString() ?? "null";
                var notebookId = notebookDto?.Id.ToString() ?? "null";
                var notebookName = notebookDto?.Name ?? "null";

                _logger.LogError(ex, "CreateNotebookAsync. UserId: {userId}, NotebookId: {notebookId}, NotebookName: {notebookName}. Error:", userId, notebookId, notebookName);
                return StatusCode(500, $"Internal Server Error. {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<int>> DeleteNotebookByIdAsync(int id)
        {
            try
            {
                var deletedId = await _notebookService.DeleteNotebookByIdAsync(id);
                _logger.LogInformation("DeleteNotebookByIdAsync. NotebookId: {notebookId}", id);
                return Ok(deletedId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteNotebookByIdAsync. NotebookId: {id}. Error:", id);
                return StatusCode(500, $"Internal Server Error. {ex.Message}");
            }
        }
    }

}
