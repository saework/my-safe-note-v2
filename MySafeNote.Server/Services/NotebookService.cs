﻿using MySafeNote.Core.Abstractions;
using MySafeNote.Core;
using MySafeNote.Core.Dtos;

namespace MySafeNote.Server.Services
{
    public class NotebookService : INotebookService
    {
        private readonly INotebookRepository _notebookRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<NotebookService> _logger;

        public NotebookService(INotebookRepository notebookRepository, IUserRepository userRepository, ILogger<NotebookService> logger)
        {
            _notebookRepository = notebookRepository;
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<List<NotebookDto>> GetNotebooksByUserIdAsync(int userId)
        {
            var notebooks = await _notebookRepository.GetNotebooksByUserIdAsync(userId);
            return notebooks.Select(x => new NotebookDto
            {
                Id = x.Id,
                Name = x.Name
            }).ToList();
        }

        public async Task<int> CreateOrUpdateNotebookAsync(Notebook notebookDto)
        {
            if (notebookDto == null)
            {
                throw new ArgumentException("Incorrect notebookDto data.");
            }

            var user = await _userRepository.GetByIdAsync(notebookDto.UserId);
            if (user == null)
            {
                throw new ArgumentException($"User with ID: {notebookDto.UserId} not found.");
            }

            if (notebookDto.Id == 0) // Создаем новый блокнот
            {
                var newNotebook = new Notebook
                {
                    Name = notebookDto.Name,
                    UserId = notebookDto.UserId,
                    //User = user // TODO для навигационного свойства
                };
                return await _notebookRepository.CreateAsync(newNotebook);
            }
            else // Обновляем данные заметки
            {
                var notebook = await _notebookRepository.GetByIdAsync(notebookDto.Id);
                if (notebook == null)
                    throw new ArgumentException($"Notebook with ID: {notebookDto.Id} not found.");

                notebook.Name = notebookDto.Name;
                await _notebookRepository.UpdateAsync(notebook);
                return notebook.Id;
            }
        }

        public async Task<int> DeleteNotebookByIdAsync(int id)
        {
            var deletedId = await _notebookRepository.RemoveAsync(id);
            return deletedId;
        }
    }
}
