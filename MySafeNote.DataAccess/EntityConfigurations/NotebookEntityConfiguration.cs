using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MySafeNote.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySafeNote.DataAccess.EntityConfigurations
{
    public class NotebookEntityConfiguration : IEntityTypeConfiguration<Notebook>
    {
        public void Configure(EntityTypeBuilder<Notebook> builder)
        {
            builder.ToTable("Notebooks");
            builder.HasKey(r => r.Id);
            builder.HasIndex(r => r.Name);
            builder.Property(r => r.Name).IsRequired().HasMaxLength(256);
            builder.HasOne(r => r.User)
            .WithMany(t => t.Notebooks)
            .HasForeignKey(r => r.UserId);
        }
    }
}
