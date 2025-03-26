using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MySafeNote.Core;

namespace MySafeNote.DataAccess.EntityConfigurations
{
    public class NoteEntityConfiguration : IEntityTypeConfiguration<Note>
    {
        public void Configure(EntityTypeBuilder<Note> builder)
        {
            builder.ToTable("Notes");
            builder.HasKey(r => r.Id);

            builder.HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Удаление пользователя приведет к удалению его заметок

            builder.HasOne(n => n.Notebook)
                .WithMany()
                .HasForeignKey(n => n.NotebookId)
                .OnDelete(DeleteBehavior.SetNull); // Удаление блокнота обнулит NotebookId
        }
    }
}
