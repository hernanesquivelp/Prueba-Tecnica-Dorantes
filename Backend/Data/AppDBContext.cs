using Microsoft.EntityFrameworkCore;
using Prueba_Tecnica.Models;

namespace Prueba_Tecnica.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        {

        }
        public DbSet<Customer> Customer { get; set; }

        public DbSet<Appointment> Appointment { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>(tb =>
            {
                tb.HasKey(col => col.Id);
                tb.Property(col => col.Id)
                .ValueGeneratedOnAdd();
            });

            modelBuilder.Entity<Appointment>(tb =>
            {
                tb.HasKey(col => col.Id);
                tb.Property(col => col.Id)
                .ValueGeneratedOnAdd();
            });


           modelBuilder.Entity<Customer>().ToTable("Customer"); //para que se llame Usuario y no Usuarios
           modelBuilder.Entity<Appointment>().ToTable("Appointment"); //para que se llame Usuario y no Usuarios


            // Agrega esta configuración para definir la relación
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Customer) // Una cita tiene un cliente
                .WithMany(c => c.Appointments) // Un cliente tiene muchas citas
                .HasForeignKey(a => a.CustomerId); // La clave foránea es CustomerId
        }
    }
}
