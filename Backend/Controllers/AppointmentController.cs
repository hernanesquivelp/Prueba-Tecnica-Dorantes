using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prueba_Tecnica.Data;
using Prueba_Tecnica.Models;

namespace Prueba_Tecnica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly AppDBContext _context;

        public AppointmentController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/Appointment
        [HttpGet]
        public async Task<ActionResult> GetAppointment([FromQuery] DateTime? ini, [FromQuery] DateTime? fin, [FromQuery] AppointmentStatus? Status )
        {

            if (ini > fin)
            {
                return Ok(new List<Appointment>());
            }
            try
            {
                var appointments = await _context.Appointment
                    .Include(a => a.Customer)
                    .Where(a =>
                        ((ini == null) || (ini != null && a.DateTime.Date >= ini.Value.Date))
                        &&
                        ((fin == null) || (fin != null && a.DateTime.Date <= fin.Value.Date))
                        &&
                        ((Status == null) || (Status != null && a.Status == Status))
                        ) 
                    .ToListAsync();

                return Ok(appointments);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        // GET: api/Appointment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointment.FindAsync(id);

            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

        // PUT: api/Appointment/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment(int id, AppointmentDto appointmentDto)
        {
            try
            {

                var exists = await _context.Appointment
                 .FirstOrDefaultAsync(a => a.DateTime == appointmentDto.DateTime);

                if (exists != null && exists.Id!=id) //valida que no exista una cita a la misma fecha y hora,
                    //a menos que sea la del id que se quiere actualizar
                {
                    return BadRequest();
                }

                var appointment = await _context.Appointment
                   .FirstOrDefaultAsync(a => a.Id == id);

                if (appointment == null)
                {
                    return NotFound();
                }

                appointment.DateTime = appointmentDto.DateTime;
                appointment.Status = appointmentDto.Status;
                appointment.CustomerId = appointmentDto.CustomerId;

                // Agregar producto al contexto y guardar cambios
                _context.Appointment.Update(appointment);
                await _context.SaveChangesAsync();

                return Ok(appointment);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }



        // POST: api/Appointment
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult> PostAppointment(AppointmentDto appointmentDto)
        {

            try
            {
                var exists = await _context.Appointment
                 .FirstOrDefaultAsync(a => a.DateTime == appointmentDto.DateTime);

                if (exists != null) //ya hay reservacion, no se puede reservar
                {
                   return BadRequest();
                }

                var appointment = new Appointment
                {
                    DateTime = appointmentDto.DateTime,
                    Status = appointmentDto.Status,
                    CustomerId = appointmentDto.CustomerId
                };



                // Agregar producto al contexto y guardar cambios
                _context.Appointment.Add(appointment);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetAppointment", new { id = appointment.Id }, appointment);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // DELETE: api/Appointment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointment.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            _context.Appointment.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointment.Any(e => e.Id == id);
        }
    }
}
