﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySafeNote.Core;
using MySafeNote.Core.Abstractions;
//using MySafeNote.WebHost.Model;
//using MySafeNote.DataAccess.Repositories;
//using MySafeNote.Server;
//using System.Collections.Generic;
//using System.Linq;
//using MySafeNote.Server.Controllers;
//using MySafeNote.Server.Model;
using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Identity;
//using Xceed.Words.NET;
//using DocumentFormat.OpenXml.Packaging;
//using HtmlToOpenXml;
//using System.IO.Compression;

//using System.IO;
//using System.Text;
//using DocumentFormat.OpenXml.Spreadsheet;
//using Microsoft.EntityFrameworkCore;
//using MySafeNote.DataAccess;
//using System.Globalization;
//using Xceed.Words.NET;
//using Newtonsoft.Json;
using MySafeNote.Core.Dtos;
using DocumentFormat.OpenXml.Office2010.Excel;
using MySafeNote.Server.Services;
using System.Text.Json;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.ExtendedProperties;
//using MySafeNote.Server.Services;


//---
//using Microsoft.AspNetCore.Mvc;
//using System.Collections.Generic;
//using System.Threading.Tasks;
//using MySafeNote.Core.Abstractions;
//using MySafeNote.Core.Dtos;
//using Microsoft.AspNetCore.Authorization;
//---

//namespace my_safe_note.Controllers
namespace MySafeNote.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly INoteService _noteService;
        private readonly ILogger<NoteService> _logger;

        public NoteController(ILogger<NoteService> logger, INoteService noteService)
        {
            _noteService = noteService;
            _logger = logger;
        }

        // GET: api/Note
        [HttpGet(Name = "GetNote")]
        [Authorize]
        public async Task<ActionResult<List<NoteDtoGet>>> GetAllNotesAsync()
        {
            try
            {
                var notesDto = await _noteService.GetAllNotesAsync();
                _logger.LogDebug("GetAllNotesAsync");
                return Ok(notesDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetAllNotesAsync. Error:");
                return StatusCode(500, "Internal Server Error.");
            }
        }

        // GET: api/Note/userid/{userId}
        [HttpGet("userid/{userId}")]
        [Authorize]
        public async Task<ActionResult<List<NoteDtoGet>>> GetNotesByUserIdAsync(int userId)
        {
            //var notesDto = await _noteService.GetNotesByUserIdAsync(userId);
            //return Ok(notesDto);

            try
            {
                var notesDto = await _noteService.GetNotesByUserIdAsync(userId);
                _logger.LogDebug("GetNotesByUserIdAsync. UserId: {userId}", userId);
                return Ok(notesDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetNotesByUserIdAsync. UserId: {userId}. Error:", userId);
                return StatusCode(500, "Internal Server Error.");
            }
        }

        // GET api/Note/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Note>> GetNoteByIdAsync(int id)
        {
            //var note = await _noteService.GetNoteByIdAsync(id);
            //if (note == null)
            //{
            //    return NotFound($"Note с ID: {id} не найден.");
            //}
            //return Ok(note);
            try
            {
                var note = await _noteService.GetNoteByIdAsync(id);
                if (note == null)
                {
                    return NotFound($"Note with ID: {id} not found.");
                }
                _logger.LogDebug("GetNoteByIdAsync. NoteId: {id}", id);
                return Ok(note);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetNoteByIdAsync. NoteId: {id}. Error:", id);
                return StatusCode(500, "Internal Server Error.");
            }
        }

        // Post: api/Note/notebody/
        [HttpPost("notebody/")]
        [Authorize]
        public async Task<ActionResult<NoteDataWithBodyDto>> GetNoteBodyByIdAsync(NoteBodyDto noteDto)
        {
            try
            {
                var noteData = await _noteService.GetNoteBodyByIdAsync(noteDto);
                _logger.LogDebug("GetNoteBodyByIdAsync. UserId: {userId}, NoteId: {noteId}.", noteDto?.UserId.ToString(), noteDto?.NoteId.ToString());
                return Ok(noteData);
            }
            catch (Exception ex)
            {
                var userId = noteDto?.UserId.ToString() ?? "null";
                var noteId = noteDto?.NoteId.ToString() ?? "null";
                _logger.LogError(ex, "GetNoteBodyByIdAsync. UserId: {userId}, NoteId: {noteId}. Error:", userId, noteId);
                return StatusCode(500, "Internal Server Error.");
            }
        }

        // POST: api/Note/savenote/
        [HttpPost("savenote/")]
        [Authorize]
        public async Task<ActionResult<int>> CreateNoteAsync([FromBody] NoteDto noteDto)
        {
            //var noteId = await _noteService.CreateOrUpdateNoteAsync(noteDto);
            //return Ok(noteId);

            try
            {
                var noteId = await _noteService.CreateOrUpdateNoteAsync(noteDto);
                _logger.LogInformation("CreateNoteAsync. Create or update Note. UserId: {userId}, NoteId: {noteId}.", noteDto?.UserId.ToString(), noteDto?.NoteId.ToString());
                return Ok(noteId);
            }
            catch (Exception ex)
            {

                var userId = noteDto?.UserId.ToString() ?? "null";
                var noteId = noteDto?.NoteId.ToString() ?? "null";
                var title = noteDto?.Title ?? "null";
                //var notebookName = noteDto?.NotebookName ?? "null";
                var notebookId = noteDto?.NotebookId?.ToString() ?? "null";
                var createDate = noteDto?.CreateDate.ToString("o") ?? "null"; // Формат ISO 8601
                var lastChangeDate = noteDto?.LastChangeDate.ToString("o") ?? "null";
                //_logger.LogError(ex, "CreateNoteAsync. UserId: {userId}, NoteId: {noteId}, Title: {title}, NotebookName: {notebookName}, NotebookId: {notebookId}, CreateDate: {createDate}, LastChangeDate: {lastChangeDate}. Error:", userId, noteId, title, notebookName, notebookId, createDate, lastChangeDate);
                _logger.LogError(ex, "CreateNoteAsync. UserId: {userId}, NoteId: {noteId}, Title: {title}, NotebookId: {notebookId}, CreateDate: {createDate}, LastChangeDate: {lastChangeDate}. Error:", userId, noteId, title, notebookId, createDate, lastChangeDate);
                
                return StatusCode(500, "Internal Server Error.");
            }
        }

        // PUT api/Note/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<Note>> ChangeNoteByIdAsync(int id, [FromBody] NoteDtoChange changedNote)
        {
            try
            {
                var note = await _noteService.ChangeNoteByIdAsync(id, changedNote);
                _logger.LogDebug("ChangeNoteByIdAsync. NoteId: {id}.", id);
                return Ok(note);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ChangeNoteByIdAsync. NoteId: {id}. Error:", id);
                return StatusCode(500, "Internal Server Error.");
            }
        }

        // DELETE api/Note/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<int>> DeleteNoteByIdAsync(int id)
        {
            try
            {
                var deletedId = await _noteService.DeleteNoteByIdAsync(id);
                _logger.LogInformation("DeleteNoteByIdAsync. NoteId: {id}.", id);
                return Ok(deletedId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteNoteByIdAsync. NoteId: {id}. Error:", id);
                return StatusCode(500, "Internal Server Error.");
            }
        }

        //Post: api/Note/notedocx
        [HttpPost("notedocx/")]
        [Authorize]
        public async Task<ActionResult> ConvertNoteBodyToDocxAsync([FromBody] int noteId)
        {
            try
            {
                var fileBytes = await _noteService.ConvertNoteBodyToDocxAsync(noteId);
                var fileName = $"Note_{noteId}.docx";
                var contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                _logger.LogDebug("ConvertNoteBodyToDocxAsync. NoteId: {id}.", noteId);
                return File(fileBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ConvertNoteBodyToDocxAsync. NoteId: {id}. Error:", noteId);
                return StatusCode(500, $"Internal Server Error. {ex.Message}");
            }
        }

        [HttpPost("allnotedocx/")]
        [Authorize]
        public async Task<ActionResult> ExportNotesToDocxAsync([FromBody] int userId)
        {
            try
            {
                var zipFileBytes = await _noteService.ExportNotesToDocxAsync(userId);
                var zipFileName = "Notes.zip";
                var contentType = "application/zip";
                _logger.LogDebug("ExportNotesToDocxAsync. UserId: {id}.", userId);
                return File(zipFileBytes, contentType, zipFileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ExportNotesToDocxAsync. UserId: {id}. Error:", userId);
                return StatusCode(500, $"Internal Server Error. {ex.Message}");
            }
        }

        // POST: api/Note/export/{userId}
        [HttpPost("export/{userId}")]
        [Authorize]
        public async Task<ActionResult> ExportUserNotesToHtmlAsync(int userId)
        {
            try
            {
                var zipBytes = await _noteService.ExportUserNotesToHtmlAsync(userId);
                //var zipBytes = await System.IO.File.ReadAllBytesAsync(zipFilePath);
                var contentType = "application/zip";
                var zipFileName = $"UserNotes_{userId}.zip";

                _logger.LogDebug("ExportUserNotesToHtmlAsync. UserId: {userId}.", userId);
                return File(zipBytes, contentType, zipFileName);
                //return File(zipBytes, "application/zip", $"UserNotes_{userId}.zip");
            }
            //catch (Exception ex)
            //{
            //    return StatusCode(500, $"Внутренняя ошибка сервера. {ex.Message}");
            //}
            catch (Exception ex)
            {
                _logger.LogError(ex, "ExportUserNotesToHtmlAsync. UserId: {id}. Error:", userId);
                return StatusCode(500, $"Internal Server Error. {ex.Message}");
                //return StatusCode(500, $"Внутренняя ошибка сервера. {ex.Message}");
            }
        }

        // POST: api/Note/import/{userId}
        [HttpPost("import/{userId}")]
        [Authorize]
        public async Task<ActionResult> UploadNotesFromZipAsync(int userId, IFormFile file)
        {
            try
            {
                await _noteService.ImportNotesFromZipAsync(userId, file);
                _logger.LogDebug("UploadNotesFromZipAsync. UserId: {userId}.", userId);
                //return Ok("Заметки успешно загружены.");
                return Ok("Notes uploaded successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UploadNotesFromZipAsync. UserId: {id}. Error:", userId);
                return StatusCode(500, $"Internal Server Error. {ex.Message}");
                //return StatusCode(500, $"Внутренняя ошибка сервера. {ex.Message}");
            }
        }
    }
}


