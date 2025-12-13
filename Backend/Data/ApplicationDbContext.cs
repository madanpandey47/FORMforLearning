using FormBackend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace FormBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<AcademicHistory> AcademicHistories { get; set; }
        public DbSet<AcademicEnrollment> AcademicEnrollments { get; set; }
        public DbSet<Faculty> Faculties { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Parent>()
                .Property(p => p.AnnualIncome)
                .HasPrecision(18, 2);

            // Configure Student and its relationships with explicit foreign keys
            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasKey(e => e.PID);

                entity.OwnsOne(s => s.Citizenship, c => { c.ToTable("Citizenships"); });
                entity.OwnsOne(s => s.SecondaryInfos, si => { si.ToTable("SecondaryInfos"); });
                entity.OwnsOne(s => s.Disability, d => { d.ToTable("Disabilities"); });
                entity.OwnsOne(s => s.Scholarship, sch => {
                    sch.ToTable("Scholarships");
                    sch.Property(s => s.Amount).HasPrecision(18, 2);
                });

                entity.OwnsMany(s => s.Addresses, a => { a.ToTable("Addresses"); });
                entity.OwnsMany(s => s.Hobbies, h => { h.ToTable("Hobbies"); });
                entity.OwnsMany(s => s.Achievements, a => { a.ToTable("Achievements"); });

                entity.HasMany(s => s.Parents)
                      .WithOne(p => p.Student)
                      .HasForeignKey(p => p.StudentPID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(s => s.AcademicHistories)
                      .WithOne(ah => ah.Student)
                      .HasForeignKey(ah => ah.StudentPID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(s => s.AcademicEnrollment)
                      .WithOne(ae => ae.Student)
                      .HasForeignKey<AcademicEnrollment>(ae => ae.StudentPID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Faculty to AcademicEnrollment relationship
            modelBuilder.Entity<AcademicEnrollment>()
                .HasOne(ae => ae.Faculty)
                .WithMany() // No navigation property on Faculty back to AcademicEnrollment
                .HasForeignKey(ae => ae.FacultyId)
                .OnDelete(DeleteBehavior.Restrict); // Don't delete a faculty if it's in use
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var studentEntries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseStudentEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in studentEntries)
            {
                ((BaseStudentEntity)entityEntry.Entity).UpdatedAt = DateTime.UtcNow;

                if (entityEntry.State == EntityState.Added)
                {
                    ((BaseStudentEntity)entityEntry.Entity).CreatedAt = DateTime.UtcNow;
                }
            }

            var idEntries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseIdEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in idEntries)
            {
                ((BaseIdEntity)entityEntry.Entity).UpdatedAt = DateTime.UtcNow;

                if (entityEntry.State == EntityState.Added)
                {
                    ((BaseIdEntity)entityEntry.Entity).CreatedAt = DateTime.UtcNow;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}