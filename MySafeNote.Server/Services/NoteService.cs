using MySafeNote.Core.Dtos;
//using MySafeNote.DataAccess.Repositories;
//using Microsoft.Extensions.Logging;
//using DocumentFormat.OpenXml.Packaging;
//using HtmlToOpenXml;
//using System.Collections.Generic;
//using System.IO;
using System.IO.Compression;
using System.Threading.Tasks;
using System;
using MySafeNote.Core.Abstractions;
using MySafeNote.Core;
using System.Text;
using System.Globalization;
using DocumentFormat.OpenXml.Packaging;
using HtmlToOpenXml;

//--
//using MySafeNote.Core;
//using MySafeNote.Core.Abstractions;
//using MySafeNote.Core.Dtos;
//using MySafeNote.DataAccess.Repositories;
//using Microsoft.AspNetCore.Http;
//using Microsoft.Extensions.Logging;
//using System.Collections.Generic;
//using System.IO;
//using System.IO.Compression;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using System.Globalization;
//--

namespace MySafeNote.Server.Services
{
    public class NoteService : INoteService
    {
        private readonly ILogger<NoteService> _logger;
        private readonly INoteRepository _noteRepository;
        private readonly IUserRepository _userRepository;
        private readonly INotebookRepository _notebookRepository;

        public NoteService(
            ILogger<NoteService> logger,
            INoteRepository noteRepository,
            IUserRepository userRepository,
            INotebookRepository notebookRepository)
        {
            _logger = logger;
            _noteRepository = noteRepository;
            _userRepository = userRepository;
            _notebookRepository = notebookRepository;
        }

        public async Task<List<NoteDtoGet>> GetAllNotesAsync()
        {
            _logger.LogInformation("GetAllNotesAsync");
            var notesDto = new List<NoteDtoGet>();
            var notes = await _noteRepository.GetAllAsync();
            if (notes.Any())
            {
                foreach (var note in notes)
                {
                    var notebookName = await _notebookRepository.GetNotebookNameByIdAsync(note.NotebookId);
                    var noteDto = new NoteDtoGet
                    {
                        Id = note.Id,
                        Title = note.Title,
                        NotebookId = note.NotebookId,
                        NotebookName = notebookName, //!!!Обработать! - заполнять через навигационное свойство! (доработать для postgree)
                        CreateDate = note.CreateDate,
                        LastChangeDate = note.LastChangeDate,
                        NoteBody = note.NoteBody,
                        NotePasswordHash = note.NotePasswordHash,
                        UserId = note.UserId
                    };
                    notesDto.Add(noteDto);
                }
            }
            return notesDto;
        }

        public async Task<List<NoteDtoGet>> GetNotesByUserIdAsync(int userId)
        {
            _logger.LogInformation($"GetNotesByUserIdAsync userId = {userId}");
            var notesDto = new List<NoteDtoGet>();
            var notes = await _noteRepository.GetNotesByUserIdAsync(userId);
            foreach (var note in notes)
            {
                var notebookName = await _notebookRepository.GetNotebookNameByIdAsync(note.NotebookId);
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
            return notesDto;
        }

        public async Task<Note> GetNoteByIdAsync(int id)
        {
            return await _noteRepository.GetByIdAsync(id);
        }

        public async Task<NoteDataWithBodyDto> GetNoteBodyByIdAsync(NoteBodyDto noteDto)
        {
            var noteId = noteDto.NoteId.Value;
            var note = await _noteRepository.GetByIdAsync(noteId);
            if (note == null)
            {
                throw new KeyNotFoundException($"Note с ID: {noteId} не найден.");
            }

            var notebookId = note.NotebookId;
            var notebookName = await _notebookRepository.GetNotebookNameByIdAsync(notebookId);

            return new NoteDataWithBodyDto
            {
                Title = note.Title,
                NotebookId = notebookId,
                NotebookName = notebookName,
                CreateDate = note.CreateDate,
                LastChangeDate = note.LastChangeDate,
                NoteBody = note.NoteBody,
                NotePasswordHash = note.NotePasswordHash
            };
        }

        public async Task<int> CreateOrUpdateNoteAsync(NoteDto noteDto)
        {
            _logger.LogInformation("CreateOrUpdateNoteAsync. Start");

            // Проверяем, что данные валидны
            if (noteDto == null)
            {
                throw new ArgumentException("Некорректные данные.");
            }

            var noteId = noteDto.NoteId;
            var user = await _userRepository.GetByIdAsync(noteDto.UserId);
            if (user == null)
                throw new ArgumentException($"Пользователя с ИД: {noteDto.UserId} не существует.");

            // Получаем блокнот
            Notebook? notebook = null;
            if (noteDto.NotebookId.HasValue && noteDto.NotebookId.Value != 0)
            {
                notebook = await _notebookRepository.GetByIdAsync(noteDto.NotebookId.Value);
                if (notebook == null)
                    throw new ArgumentException($"Блокнот с ИД: {noteDto.NotebookId} не существует.");
            }

            if (noteId == 0) // Создаем новую заметку
            {
                var newNote = new Note
                {
                    Title = noteDto.Title,
                    NotebookId = noteDto.NotebookId,
                    //Notebook = notebook, // Устанавливаем навигационное свойство
                    CreateDate = noteDto.CreateDate,
                    LastChangeDate = noteDto.CreateDate,
                    NoteBody = noteDto.NoteBody,
                    NotePasswordHash = noteDto.NotePasswordHash,
                    UserId = noteDto.UserId
                    //User = user // Устанавливаем навигационное свойство
                };

                var newNoteId = await _noteRepository.CreateAsync(newNote);
                _logger.LogInformation("CreateNoteAsync. Create success");
                return newNoteId;
            }
            else // Обновляем данные заметки
            {
                var note = await _noteRepository.GetByIdAsync(noteId);
                if (note == null)
                {
                    throw new KeyNotFoundException($"Note с ID: {noteId} не найден.");
                }

                note.Title = noteDto.Title;
                note.NotebookId = noteDto.NotebookId;
                //note.Notebook = notebook; // Устанавливаем навигационное свойство
                note.LastChangeDate = noteDto.LastChangeDate;
                note.NoteBody = noteDto.NoteBody;
                note.NotePasswordHash = noteDto.NotePasswordHash;
                note.UserId = noteDto.UserId;
                //note.User = user; // Устанавливаем навигационное свойство

                await _noteRepository.UpdateAsync(note);
                _logger.LogInformation("CreateNoteAsync. Update success");
                return note.Id;
            }
        }

        public async Task<Note> ChangeNoteByIdAsync(int id, NoteDtoChange changedNote)
        {
            if (changedNote == null)
            {
                throw new ArgumentException("changedNote пустой");
            }

            var note = await _noteRepository.GetByIdAsync(id);
            if (note == null)
            {
                throw new KeyNotFoundException($"Note с ID: {id} не найден.");
            }

            var user = await _userRepository.GetByIdAsync(changedNote.UserId);
            if (user == null)
                throw new ArgumentException($"Пользователя с ИД: {changedNote.UserId} не существует.");

            // Обновляем данные заметки
            note.Title = changedNote.Title;
            note.NotebookId = changedNote.NotebookId;
            note.LastChangeDate = changedNote.LastChangeDate;
            note.NoteBody = changedNote.NoteBody;
            note.NotePasswordHash = changedNote.NotePasswordHash; //!!!

            await _noteRepository.UpdateAsync(note);
            return note;
        }

        public async Task<int> DeleteNoteByIdAsync(int id)
        {
            return await _noteRepository.RemoveAsync(id);
        }

        public async Task<byte[]> ConvertNoteBodyToDocxAsync(int noteId)
        {
            var note = await _noteRepository.GetByIdAsync(noteId);
            if (note == null)
            {
                throw new ArgumentException($"Note с ID: {noteId} не найден.");
            }

            var htmlContent = note.NoteBody;
            var noteName = note.Title;

            if (string.IsNullOrEmpty(htmlContent) || string.IsNullOrEmpty(noteName))
            {
                throw new ArgumentException("Содержимое заметки пустое.");
            }
            // Создание документа DOCX
            using (var memoryStream = new MemoryStream())
            {
                using (var document = WordprocessingDocument.Create(memoryStream, DocumentFormat.OpenXml.WordprocessingDocumentType.Document))
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

                return memoryStream.ToArray();
            }
        }

            public async Task<byte[]> ExportUserNotesToHtmlAsync(int userId)
        {
            _logger.LogInformation($"Экспорт заметок для пользователя с ID: {userId}");

            var notes = await _noteRepository.GetNotesByUserIdAsync(userId);
            if (notes == null || !notes.Any())
            {
                throw new KeyNotFoundException($"Заметки не найдены для пользователя с ID: {userId}");
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
                        if (notebook != null)
                        {
                            notebookName = notebook.Name;
                        }
                    }

                    var notebookIdString = (note.NotebookId != null && note.NotebookId != 0) ? note.NotebookId.ToString() : string.Empty;
                    var createDateString = note.CreateDate.ToString("yyyyMMdd_HHmmss");
                    var lastChangeDateString = note.LastChangeDate.ToString("yyyyMMdd_HHmmss");
                    var fileName = $"{note.Title}__{createDateString}__{lastChangeDateString}__{notebookIdString}__{notebookName}.html";

                    var filePath = Path.Combine(tempDir, fileName);
                    var htmlContent = note.NoteBody ?? "<p>Нет содержимого</p>";

                    await System.IO.File.WriteAllTextAsync(filePath, htmlContent, Encoding.UTF8);
                }

                zipFilePath = Path.Combine(Path.GetTempPath(), $"UserNotes_{userId}.zip");
                ZipFile.CreateFromDirectory(tempDir, zipFilePath);

                var zipBytes = await System.IO.File.ReadAllBytesAsync(zipFilePath);
                return zipBytes; // Возвращаем байты ZIP-файла
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Произошла ошибка при экспорте заметок.");
                throw new Exception("Внутренняя ошибка сервера при экспорте заметок.", ex);
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

        public async Task ImportNotesFromZipAsync(int userId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("Файл не выбран или пуст.");
            }

            if (Path.GetExtension(file.FileName) != ".zip")
            {
                throw new ArgumentException("Пожалуйста, загрузите zip-файл.");
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
                    Notebook? notebook = null;
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
                                await _notebookRepository.CreateAsync(notebook);
                            }
                        }
                    }

                    var newNote = new Note
                    {
                        Title = noteTitle,
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

                _logger.LogInformation("Заметки успешно загружены.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при загрузке заметок из zip-файла.");
                throw new Exception("Внутренняя ошибка сервера при загрузке заметок.", ex);
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
