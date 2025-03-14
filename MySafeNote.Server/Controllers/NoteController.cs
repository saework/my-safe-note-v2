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
using System.IO.Compression;

using System.IO;
using System.Text;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.EntityFrameworkCore;
using MySafeNote.DataAccess;
using System.Globalization;
//using Xceed.Words.NET;
//using Newtonsoft.Json;

namespace my_safe_note.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        //private readonly DataContext _context;
        private readonly ILogger<NoteController> _logger;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly INoteRepository _noteRepository;
        private readonly IUserRepository _userRepository;
        private readonly INotebookRepository _notebookRepository;
        public NoteController(
            //DataContext context,
            ILogger<NoteController> logger,
            INoteRepository noteRepository,
            IUserRepository userRepository,
            INotebookRepository notebookRepository)
        {
            //_context = context;
            _logger = logger;
            _passwordHasher = new PasswordHasher<User>();
            _noteRepository = noteRepository;
            _userRepository = userRepository;
            _notebookRepository = notebookRepository;
        }

        // GET: api/Note
        [HttpGet(Name = "GetNote")]
        public async Task<ActionResult<List<Note>>> GetAllNotesAsync()
        {

            //_logger.LogInformation("GetAllNotesAsync");
            //var notesDto = new List<NoteDtoGet>();
            //var notes = await _noteRepository.GetAllAsync();
            //if (notes.Any())
            //{
            //    notesDto = notes.Select(x => new NoteDtoGet
            //    {
            //        Id = x.Id,
            //        Title = x.Title,
            //        NotebookId = x.NotebookId,
            //        NotebookName = x.Notebook?.Name,
            //        CreateDate = x.CreateDate,
            //        LastChangeDate = x.LastChangeDate,
            //        NoteBody = x.NoteBody,
            //        NotePasswordHash = x.NotePasswordHash,
            //        UserId = x.UserId
            //    }).ToList();
            //}
            //return Ok(notesDto);

            _logger.LogInformation("GetAllNotesAsync");
            var notesDto = new List<NoteDtoGet>();
            var notes = await _noteRepository.GetAllAsync();
            if (notes.Any())
            {
                foreach (var note in notes)
                {
                    var notebookName = await _notebookRepository.GetNotebookNameByIdAsync(note.Id);
                    var noteDto = new NoteDtoGet
                    {
                        Id = note.Id,
                        Title = note.Title,
                        NotebookId = note.NotebookId,
                        NotebookName = notebookName,  //!!!Обработать! - заполнять через навигационное свойство! (доработать для postgree)
                        CreateDate = note.CreateDate,
                        LastChangeDate = note.LastChangeDate,
                        NoteBody = note.NoteBody,
                        NotePasswordHash = note.NotePasswordHash,
                        UserId = note.UserId
                    };
                    notesDto.Add(noteDto);
                }
            }
            return Ok(notesDto);

        }

        // DELETE api/User/email/{email}
        //[HttpDelete("email/{email}")]

        // GET: api/Note/userid/{userId}
        [HttpGet("userid/{userId}")]
        [Authorize] // Этот метод требует аутентификации
        public async Task<ActionResult<List<Note>>> GetNotesByUserIdAsync(int userId)
        {

            //_logger.LogInformation($"GetNotesByUserIdAsync userId = {userId}");
            //var notesDto = new List<NoteDtoGet>();
            //var notes = await _noteRepository.GetNotesByUserIdAsync(userId);
            //if (notes.Any())
            //{
            //    notesDto = notes.Select(x => new NoteDtoGet
            //    {
            //        Id = x.Id,
            //        Title = x.Title,
            //        CreateDate = x.CreateDate,
            //        LastChangeDate = x.LastChangeDate,
            //        NotePasswordHash = x.NotePasswordHash
            //    }).ToList();
            //}
            //return Ok(notesDto);

            _logger.LogInformation($"GetNotesByUserIdAsync userId = {userId}");
            var notesDto = new List<NoteDtoGet>();
            var notes = await _noteRepository.GetNotesByUserIdAsync(userId);
            if (notes.Any())
            {
                foreach (var note in notes)
                {
                    var notebookName = await _notebookRepository.GetNotebookNameByIdAsync(note.Id);
                    var noteDto = new NoteDtoGet
                    {
                        Id = note.Id,
                        Title = note.Title,
                        NotebookId = note.NotebookId,
                        NotebookName = notebookName,
                        CreateDate = note.CreateDate,
                        LastChangeDate = note.LastChangeDate,
                        NotePasswordHash = note.NotePasswordHash
                    };
                    notesDto.Add(noteDto);
                }
            }
            return Ok(notesDto);

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

        // Post: api/Note/notebody/
        [HttpPost("notebody/")]
        [Authorize]
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
            var notebookId = note.NotebookId;
            var notebookName = await _notebookRepository.GetNotebookNameByIdAsync(notebookId);
            
            var noteData = new NoteDataWithBodyDto
            {
                Title = note.Title,
                NotebookId = notebookId,
                NotebookName = notebookName,
                CreateDate = note.CreateDate,
                LastChangeDate = note.LastChangeDate,
                NoteBody = note.NoteBody,
                NotePasswordHash = note.NotePasswordHash
            };
            return Ok(noteData);
        }

        [HttpPost("savenote/")]
        [Authorize]
        public async Task<ActionResult<int>> CreateNoteAsync([FromBody] NoteDto noteDto)
        {
            _logger.LogInformation("CreateNoteAsync. Start");

            // Проверяем, что данные валидны
            if (noteDto == null)
            {
                return BadRequest("Некорректные данные.");
            }

            try
            {
                var noteId = noteDto.NoteId;
                var title = noteDto.Title;
                var notebookId = noteDto.NotebookId;
                var createDate = noteDto.CreateDate;
                var changeDate = noteDto.LastChangeDate;
                //var createDate = DateTime.Parse(noteDto.CreateDate); // Преобразуем строку в DateTime
                //var changeDate = DateTime.Parse(noteDto.LastChangeDate); // Преобразуем строку в DateTime
                var noteBody = noteDto.NoteBody;
                var notePasswordHash = noteDto.NotePasswordHash;
                var userId = noteDto.UserId;

                // Получаем пользователя
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                    return BadRequest($"Пользователя с ИД: {userId} не существует.");

                // Получаем блокнот
                if (notebookId == 0)
                    notebookId = null;

                Notebook? notebook = null;
                if (notebookId != null)
                { 
                    notebook = await _notebookRepository.GetByIdAsync((int)notebookId);
                    if (notebook == null)
                        return BadRequest($"Блокнот с ИД: {notebookId} не существует.");
                }

                if (noteId == 0) // Создаем новую заметку
                {
                    var newNote = new Note
                    {
                        Title = title,
                        NotebookId = notebookId,
                        //Notebook = notebook, // Устанавливаем навигационное свойство
                        CreateDate = createDate,
                        LastChangeDate = createDate,
                        NoteBody = noteBody,
                        NotePasswordHash = notePasswordHash,
                        UserId = userId,
                        //User = user // Устанавливаем навигационное свойство
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
                    note.NotebookId = notebookId;
                    //note.Notebook = notebook; // Устанавливаем навигационное свойство
                    note.LastChangeDate = changeDate;
                    note.NoteBody = noteBody;
                    note.NotePasswordHash = notePasswordHash;
                    note.UserId = userId;
                    //note.User = user; // Устанавливаем навигационное свойство

                    await _noteRepository.UpdateAsync(note);
                    _logger.LogInformation("CreateNoteAsync. Update success");
                    return Ok(note.Id);
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.Message;
                _logger.LogError("CreateNoteAsync. Ошибка: {errorMessage}", errorMessage);
                return StatusCode(500, $"Внутренняя ошибка сервера. {errorMessage}");
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
            note.Title = changedNote.Title;
            note.NotebookId = changedNote.NotebookId;
            note.LastChangeDate = changedNote.LastChangeDate;
            note.NoteBody = changedNote.NoteBody;
            var notePasswordHash = changedNote.NotePasswordHash;

            await _noteRepository.UpdateAsync(note);
            return Ok(note);
        }

        // DELETE api/Note/5
        [HttpDelete("{id}")]
        [Authorize]
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

        //// POST: api/Note/export
        //[HttpPost("export/{userId}")]
        ////[Authorize]
        //public async Task<ActionResult> ExportUserNotesToHtmlAsync(int userId)
        //{
        //    _logger.LogInformation($"Экспорт заметок для пользователя с ID: {userId}");

        //    // Получаем заметки для пользователя
        //    var notes = await _noteRepository.GetNotesByUserIdAsync(userId);
        //    if (notes == null || !notes.Any())
        //    {
        //        return NotFound($"Заметки не найдены для пользователя с ID: {userId}");
        //    }

        //    // Создаем временную директорию для хранения HTML-файлов
        //    var tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        //    Directory.CreateDirectory(tempDir);
        //    var zipFilePath = string.Empty;
        //    try
        //    {
        //        // Создаем HTML-файлы для каждой заметки
        //        foreach (var note in notes)
        //        {
        //            var notebookIdString = (note.NotebookId != null && note.NotebookId != 0) ? note.NotebookId.ToString() : string.Empty;
        //            var fileName = $"{note.Title}__{notebookIdString}.html";
        //            var filePath = Path.Combine(tempDir, fileName);
        //            var htmlContent = note.NoteBody ?? "<p>Нет содержимого</p>"; // Резервный вариант, если NoteBody равно null

        //            await System.IO.File.WriteAllTextAsync(filePath, htmlContent, Encoding.UTF8);
        //        }

        //        // Создаем zip-файл
        //        zipFilePath = Path.Combine(Path.GetTempPath(), $"UserNotes_{userId}.zip");
        //        ZipFile.CreateFromDirectory(tempDir, zipFilePath);

        //        // Читаем zip-файл и возвращаем его клиенту
        //        var zipBytes = await System.IO.File.ReadAllBytesAsync(zipFilePath);
        //        var contentType = "application/zip";
        //        var zipFileName = $"UserNotes_{userId}.zip";

        //        return File(zipBytes, contentType, zipFileName);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Произошла ошибка при экспорте заметок.");
        //        return StatusCode(500, "Внутренняя ошибка сервера при экспорте заметок.");
        //    }
        //    finally
        //    {
        //        // Удаляем временные файлы
        //        if (Directory.Exists(tempDir))
        //        {
        //            Directory.Delete(tempDir, true);
        //        }
        //        if (System.IO.File.Exists(zipFilePath))
        //        {
        //            System.IO.File.Delete(zipFilePath);
        //        }
        //    }
        //}

        // POST: api/Note/export
        [HttpPost("export/{userId}")]
        [Authorize]
        public async Task<ActionResult> ExportUserNotesToHtmlAsync(int userId)
        {
            _logger.LogInformation($"Экспорт заметок для пользователя с ID: {userId}");

            var notes = await _noteRepository.GetNotesByUserIdAsync(userId);
            if (notes == null || !notes.Any())
            {
                return NotFound($"Заметки не найдены для пользователя с ID: {userId}");
            }

            var tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            Directory.CreateDirectory(tempDir);
            var zipFilePath = string.Empty;
            try
            {
                foreach (var note in notes)
                {
                    var notebookName = string.Empty;
                    if (note.NotebookId.HasValue)
                    {
                        var notebook = await _notebookRepository.GetByIdAsync(note.NotebookId.Value);
                        if  (notebook != null)
                            notebookName = notebook.Name;
                    }
                    var notebookIdString = (note.NotebookId != null && note.NotebookId != 0) ? note.NotebookId.ToString() : string.Empty;
                    var createDateString = note.CreateDate.ToString("yyyyMMdd_HHmmss");
                    var lastChangeDateString = note.LastChangeDate.ToString("yyyyMMdd_HHmmss");
                    //var fileName = $"{note.Title}__{createDateString}__{lastChangeDateString}__{notebookIdString}.html";
                    var fileName = $"{note.Title}__{createDateString}__{lastChangeDateString}__{notebookIdString}__{notebookName}.html";
                    
                    var filePath = Path.Combine(tempDir, fileName);
                    var htmlContent = note.NoteBody ?? "<p>Нет содержимого</p>";

                    await System.IO.File.WriteAllTextAsync(filePath, htmlContent, Encoding.UTF8);
                }

                zipFilePath = Path.Combine(Path.GetTempPath(), $"UserNotes_{userId}.zip");
                ZipFile.CreateFromDirectory(tempDir, zipFilePath);

                var zipBytes = await System.IO.File.ReadAllBytesAsync(zipFilePath);
                var contentType = "application/zip";
                var zipFileName = $"UserNotes_{userId}.zip";

                return File(zipBytes, contentType, zipFileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Произошла ошибка при экспорте заметок.");
                return StatusCode(500, "Внутренняя ошибка сервера при экспорте заметок.");
            }
            finally
            {
                if (Directory.Exists(tempDir))
                {
                    Directory.Delete(tempDir, true);
                }
                if (System.IO.File.Exists(zipFilePath))
                {
                    System.IO.File.Delete(zipFilePath);
                }
            }
        }


        //// POST: api/Note/import/{userId}
        //[HttpPost("import/{userId}")]
        ////[Authorize]
        //public async Task<ActionResult> UploadNotesFromZipAsync(int userId, IFormFile file)
        //{
        //    if (file == null || file.Length == 0)
        //    {
        //        return BadRequest("Файл не выбран или пуст.");
        //    }

        //    if (Path.GetExtension(file.FileName) != ".zip")
        //    {
        //        return BadRequest("Пожалуйста, загрузите zip-файл.");
        //    }

        //    var tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        //    Directory.CreateDirectory(tempDir);

        //    try
        //    {
        //        // Сохраняем zip-файл во временной директории
        //        var zipFilePath = Path.Combine(tempDir, file.FileName);
        //        using (var stream = new FileStream(zipFilePath, FileMode.Create))
        //        {
        //            await file.CopyToAsync(stream);
        //        }

        //        // Распаковываем zip-файл
        //        ZipFile.ExtractToDirectory(zipFilePath, tempDir);

        //        // Обрабатываем все HTML-файлы в распакованной директории
        //        var htmlFiles = Directory.GetFiles(tempDir, "*.html");
        //        foreach (var htmlFile in htmlFiles)
        //        {
        //            var noteContent = await System.IO.File.ReadAllTextAsync(htmlFile);
        //            // Используем имя файла без расширения в качестве заголовка заметки
        //            var noteTitle = Path.GetFileNameWithoutExtension(htmlFile);

        //            var notebookId = 1; //!!!Обработать!!

        //            // Создаем новую заметку
        //            var newNote = new Note
        //            {
        //                Title = noteTitle,
        //                NotebookId = notebookId,
        //                CreateDate = DateTime.UtcNow,
        //                LastChangeDate = DateTime.UtcNow,
        //                NoteBody = noteContent,
        //                NotePasswordHash = string.Empty,
        //                UserId = userId
        //            };

        //            // Сохраняем заметку в базе данных
        //            await _noteRepository.CreateAsync(newNote);
        //        }

        //        return Ok("Заметки успешно загружены.");
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Ошибка при загрузке заметок из zip-файла.");
        //        return StatusCode(500, "Внутренняя ошибка сервера при загрузке заметок.");
        //    }
        //    finally
        //    {
        //        // Удаляем временные файлы и директории
        //        if (Directory.Exists(tempDir))
        //        {
        //            Directory.Delete(tempDir, true);
        //        }
        //    }
        //}

        // POST: api/Note/import/{userId}
        [HttpPost("import/{userId}")]
        [Authorize]
        public async Task<ActionResult> UploadNotesFromZipAsync(int userId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Файл не выбран или пуст.");
            }

            if (Path.GetExtension(file.FileName) != ".zip")
            {
                return BadRequest("Пожалуйста, загрузите zip-файл.");
            }

            var tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            Directory.CreateDirectory(tempDir);

            try
            {
                var zipFilePath = Path.Combine(tempDir, file.FileName);
                using (var stream = new FileStream(zipFilePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                ZipFile.ExtractToDirectory(zipFilePath, tempDir);

                var htmlFiles = Directory.GetFiles(tempDir, "*.html");
                foreach (var htmlFile in htmlFiles)
                {
                    var noteContent = await System.IO.File.ReadAllTextAsync(htmlFile);
                    var fileName = Path.GetFileNameWithoutExtension(htmlFile);
                    var parts = fileName.Split("__");

                    if (parts.Length < 3)
                    {
                        _logger.LogWarning($"Имя файла '{fileName}' не соответствует ожидаемому формату.");
                        continue; // Пропускаем файл, если формат неверный
                    }

                    var noteTitle = parts[0];
                    var createDate = DateTime.ParseExact(parts[1], "yyyyMMdd_HHmmss", CultureInfo.InvariantCulture);
                    var lastChangeDate = DateTime.ParseExact(parts[2], "yyyyMMdd_HHmmss", CultureInfo.InvariantCulture);
                    var notebookId = parts.Length > 3 && int.TryParse(parts[3], out var id) ? id : (int?)null;
                    var notebookName = parts.Length > 4 ? parts[4] : string.Empty;

                    // Проверяем, существует ли блокнот
                    Notebook ? notebook = null;
                    if (notebookId.HasValue && notebookId != 0 && !string.IsNullOrWhiteSpace(notebookName))
                    {
                        notebook = await _notebookRepository.GetByIdAsync(notebookId.Value);
                        if (notebook == null)
                        {
                            notebook = await _notebookRepository.GetNotebookByNameAndUserIdAsync(notebookName, userId);
                            if (notebook == null)
                            {
                                // Если блокнот не найден, создаем новый
                                notebook = new Notebook
                                {
                                    Name = notebookName,
                                    UserId = userId
                                };
                                var newNotebookId = await _notebookRepository.CreateAsync(notebook);
                                //notebook.Id = newNotebookId; // Устанавливаем ID нового блокнота
                            }
                        }
                    }

                    var newNote = new Note
                    {
                        Title = noteTitle,
                        //NotebookId = notebookId,
                        NotebookId = notebook != null ? notebook.Id : null,
                        CreateDate = createDate,
                        LastChangeDate = lastChangeDate,
                        NoteBody = noteContent,
                        NotePasswordHash = string.Empty,
                        UserId = userId
                    };

                    // Сохраняем заметку в базе данных
                    await _noteRepository.CreateAsync(newNote);
                }

                return Ok("Заметки успешно загружены.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при загрузке заметок из zip-файла.");
                return StatusCode(500, "Внутренняя ошибка сервера при загрузке заметок.");
            }
            finally
            {
                // Удаляем временные файлы и директории
                if (Directory.Exists(tempDir))
                {
                    Directory.Delete(tempDir, true);
                }
            }
        }


    }
}

