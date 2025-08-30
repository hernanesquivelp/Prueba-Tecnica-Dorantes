using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Prueba_Tecnica.Models
{

    public class CustomerDto
    {
        [Required]
        [MaxLength(120)]
        public string Name { get; set; }

        [MaxLength(255)]
        public string ? Email { get; set; }
    }

    public class Customer
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        [MaxLength(120)]
        public string Name { get; set; }

  
        [MaxLength(255)]
        public string ? Email { get; set; }



        [JsonIgnore] //Para la seriazlizacion JSON y evitar relaciones cíclicas
        public ICollection<Appointment> Appointments { get; set; }
    }
}
