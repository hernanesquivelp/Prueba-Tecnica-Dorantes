using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Prueba_Tecnica.Models
{

    public class GetAppointmentsDto
    {
      
        public DateTime ? fecha_inicio { get; set; }

        public DateTime ? fecha_fin { get; set; }

        [Required]
        public AppointmentStatus ? Status { get; set; } //0, 1, 2

    }

    public class AppointmentDto
    {
        [Required]
        public DateTime DateTime { get; set; }

        [Required]
        public AppointmentStatus Status { get; set; }

        public int CustomerId { get; set; }
    }

    public enum AppointmentStatus
    {
        Scheduled,
        Done,
        Cancelled
    }

    public class Appointment
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public DateTime DateTime { get; set; }

        [Required]
        public AppointmentStatus Status { get; set; }


        public int CustomerId { get; set; }

        // Propiedad de navegación (la relación)
        public Customer Customer { get; set; }
    }
}