using FormBackend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace FormBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<AcademicHistory> AcademicHistories { get; set; }
        public DbSet<AcademicEnrollment> AcademicEnrollments { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<Citizenship> Citizenships { get; set; }
        public DbSet<SecondaryInfos> SecondaryInfos { get; set; }
        public DbSet<Disability> Disabilities { get; set; }
        public DbSet<Hobby> Hobbies { get; set; }
        public DbSet<Faculty> Faculties { get; set; }
        public DbSet<Scholarship> Scholarships { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Parent>()
                .Property(p => p.AnnualIncome)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Scholarship>()
                .Property(s => s.Amount)
                .HasPrecision(18, 2);

            // Configure Student and its relationships with explicit foreign keys
            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasKey(e => e.PID);

                entity.HasOne(s => s.Citizenship)
                      .WithOne(c => c.Student)
                      .HasForeignKey<Citizenship>(c => c.StudentPID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(s => s.SecondaryInfos)
                      .WithOne(si => si.Student)
                      .HasForeignKey<SecondaryInfos>(si => si.StudentPID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(s => s.Addresses)
                      .WithOne(a => a.Student)
                      .HasForeignKey(a => a.StudentPID)
                      .OnDelete(DeleteBehavior.Cascade);

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
                
                entity.HasMany(s => s.Achievements)
                      .WithOne(a => a.Student)
                      .HasForeignKey(a => a.StudentPID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(s => s.Hobbies)
                      .WithOne(h => h.Student)
                      .HasForeignKey(h => h.StudentPID)
                      .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(s => s.Disability)
                      .WithOne(d => d.Student)
                      .HasForeignKey<Disability>(d => d.StudentPID)
                      .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(s => s.Scholarship)
                      .WithOne(sch => sch.Student)
                      .HasForeignKey<Scholarship>(sch => sch.StudentPID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Faculty to AcademicEnrollment relationship
            modelBuilder.Entity<AcademicEnrollment>()
                .HasOne(ae => ae.Faculty)
                .WithMany() // No navigation property on Faculty back to AcademicEnrollment
                .HasForeignKey(ae => ae.FacultyPID)
                .OnDelete(DeleteBehavior.Restrict); // Don't delete a faculty if it's in use
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.UtcNow;

                if (entityEntry.State == EntityState.Added)
                {
                    ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.UtcNow;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}