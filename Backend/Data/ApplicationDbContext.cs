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

                entity.OwnsOne(s => s.PermanentAddress, a => { a.ToTable("PermanentAddresses"); });
                entity.OwnsOne(s => s.TemporaryAddress, a => { a.ToTable("TemporaryAddresses"); });
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
        }

        public async Task<Student?> GetStudentWithParentsByPidAsync(Guid pid, bool asNoTracking = true)
        {
            IQueryable<Student> query = Students.Include(s => s.Parents);

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }

            return await query.FirstOrDefaultAsync(s => s.PID == pid);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var baseEntityEntries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in baseEntityEntries)
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