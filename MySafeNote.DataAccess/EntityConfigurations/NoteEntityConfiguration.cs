using System;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MySafeNote.Core;

namespace MySafeNote.DataAccess.EntityConfigurations
{
    public class NoteEntityConfiguration : IEntityTypeConfiguration<Note>
    {
        public void Configure(EntityTypeBuilder<Note> builder)
        {
            //builder.ToTable("Notes");
            //builder.HasKey(r => r.Id);
            ////builder.HasIndex(r => r.Number);
            ////builder.Property(r => r.Number).IsRequired();
            ////builder.Property(r => r.CreateDate).IsRequired();
            ////builder.Property(r => r.UserId).IsRequired();
            //builder.Property(r => r.Title).IsRequired();

            //builder.HasOne(r => r.User)
            //            .WithMany(t => t.Notes)
            //            .HasForeignKey(r => r.UserId);

            //builder.HasOne(r => r.Notebook)
            //            .WithMany(t => t.Notes)
            //            .HasForeignKey(r => r.NotebookId);

            //builder.ToTable("Notes"); 
            //builder.HasKey(r => r.Id); 
            //builder.Property(r => r.Title)
            //       .IsRequired() 
            //       .HasMaxLength(256);

            //builder.Property(r => r.CreateDate)
            //       .IsRequired(); 

            //builder.Property(r => r.LastChangeDate)
            //       .IsRequired(); 

            //builder.Property(r => r.NoteBody)
            //       .IsRequired(false); 

            //builder.Property(r => r.NotePasswordHash)
            //       .IsRequired(false);

            //builder.Property(r => r.UserId)
            //       .IsRequired(); 

            //// Настраиваем связи
            //builder.HasOne(r => r.User)
            //       .WithMany(t => t.Notes)
            //       .HasForeignKey(r => r.UserId);

            //builder.HasOne(r => r.Notebook)
            //       .WithMany(t => t.Notes)
            //       .HasForeignKey(r => r.NotebookId);


            //builder.ToTable("Notes");
            //builder.HasKey(r => r.Id);


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
