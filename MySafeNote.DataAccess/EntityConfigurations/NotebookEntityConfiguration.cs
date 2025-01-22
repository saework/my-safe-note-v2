using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MySafeNote.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Reflection.Emit;

namespace MySafeNote.DataAccess.EntityConfigurations
{
    public class NotebookEntityConfiguration : IEntityTypeConfiguration<Notebook>
    {
        public void Configure(EntityTypeBuilder<Notebook> builder)
        {
            //builder.ToTable("Notebooks");
            //builder.HasKey(r => r.Id);
            //builder.HasIndex(r => r.Name);
            //builder.Property(r => r.Name).IsRequired().HasMaxLength(256);
            //builder.HasOne(r => r.User)
            //.WithMany(t => t.Notebooks)
            //.HasForeignKey(r => r.UserId);


            //builder.ToTable("Notebooks");
            //builder.HasKey(r => r.Id);
            //builder.HasIndex(r => r.Name);
            //builder.Property(r => r.Name).IsRequired().HasMaxLength(256);

            //builder.HasOne(r => r.User)
            //       .WithMany(t => t.Notebooks)
            //       .HasForeignKey(r => r.UserId);

            //builder.HasMany(r => r.Notes)
            //       .WithOne(t => t.Notebook)
            //       .HasForeignKey(t => t.NotebookId);


            //builder.ToTable("Notebooks");
            //builder.HasKey(r => r.Id);
            //builder.HasIndex(r => r.Name);
            //builder.Property(r => r.Name).HasMaxLength(256);

            //builder.HasMany(n => n.Notes)
            //    .WithOne(n => n.Notebook)
            //    .HasForeignKey(n => n.NotebookId)
            //    .OnDelete(DeleteBehavior.SetNull); //При удалении Notebook, связанные Notes будут иметь NotebookId установленным в null


            builder.ToTable("Notebooks");
            builder.HasKey(r => r.Id);
            builder.HasIndex(r => r.Name);
            //builder.Property(r => r.Name).HasMaxLength(256);

            builder.HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Удаление пользователя приведет к удалению его блокнотов
        }
    }
}
