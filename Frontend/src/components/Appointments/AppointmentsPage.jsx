import React, { useState, useEffect } from "react";
import DataTable from "../Datatable/Datatable";
import { Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [show, setShow] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const [formAppointment, setFormAppointment] = useState({
    dateTime: "",
    status: 0, //Se inicializa el estado a 0 (Scheduled)
    customerId: "",
  });

  //Estado para los filtros de búsqueda
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "", // Valor vacío para la opción 'Todos'
  });

  const handleClose = () => {
    setShow(false);
    setEditingAppointment(null);
    setFormAppointment({
      dateTime: "",
      status: 0, // 👈 Se reinicia el estado a 0
      customerId: "",
    });
  };

  const handleShow = (appointmentToEdit = null) => {
    setEditingAppointment(appointmentToEdit);
    if (appointmentToEdit) {
      const formattedDateTime = appointmentToEdit.dateTime.substring(0, 16);
      setFormAppointment({
        ...appointmentToEdit,
        dateTime: formattedDateTime,
        status: appointmentToEdit.status, // El estado ya es un número de la API
      });
    } else {
      setFormAppointment({
        dateTime: "",
        status: 0, // 👈 Se establece el valor 0 para una nueva cita
        customerId: "",
      });
    }
    setShow(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Se convierte el valor del select a número si el nombre es 'status' o 'customerId'
    const finalValue =
      name === "status" || name === "customerId" ? parseInt(value) : value;
    setFormAppointment({
      ...formAppointment,
      [name]: finalValue,
    });
  };

  //FUNCIÓN: Maneja los cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = editingAppointment !== null;
    const method = isEditing ? "PUT" : "POST";
    const API_URL = isEditing
      ? /*? `https://localhost:44382/api/Appointment/${editingAppointment.id}`
      : "https://localhost:44382/api/Appointment"; */

        `/backend/api/Appointment/${editingAppointment.id}`
      : "/backend/api/Appointment";
    const appointmentData = {
      id: isEditing ? editingAppointment.id : 0,
      dateTime: formAppointment.dateTime,
      status: formAppointment.status, // Ya es un número
      customerId: formAppointment.customerId, // Ya es un número
    };

    try {
      const response = await fetch(API_URL, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
        //console.log(response.statusText);
      }

      handleClose();
      setRefreshKey((prevKey) => prevKey + 1);
      alert(`Cita ${isEditing ? "actualizada" : "agregada"} con éxito.`);
    } catch (error) {
      alert(
        `Hubo un error al ${isEditing ? "actualizar" : "agregar"} la cita.`
      );
    }
  };

  // ... (El resto del código de DataTable y fetchFunctions es el mismo) ...
  // Objeto de mapeo para traducir los valores numéricos a texto
  const statusMap = {
    0: "Scheduled",
    1: "Done",
    2: "Cancelled",
  };

  const appointmentColumns = [
    {
      header: "Fecha y Hora",
      accessor: "dateTime",
      render: (appointment) => {
        const date = new Date(appointment.dateTime);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      header: "Estado",
      accessor: "status",
      render: (appointment) => statusMap[appointment.status],
    },
    {
      header: "Cliente",
      accessor: "customer.name",
      render: (appointment) => {
        return appointment.customer?.name || "";
      },
    },
    {
      header: "Acciones",
      render: (appointment) => (
        <>
          <Button
            variant="warning"
            className="me-2"
            onClick={() => handleShow(appointment)}
          >
            Editar
          </Button>
          <Button variant="danger" onClick={() => handleDelete(appointment.id)}>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  //Fetch con parámetros de búsqueda para los filtros
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      //let url = "https://localhost:44382/api/Appointment";
      let url = "/backend/api/Appointment";
      const queryParams = new URLSearchParams();

      if (filters.startDate) {
        queryParams.append("ini", filters.startDate);
      }
      if (filters.endDate) {
        queryParams.append("fin", filters.endDate);
      }
      if (filters.status !== "") {
        // Comprueba si el valor del filtro no es la opción "Todos"
        queryParams.append("Status", filters.status);
      }

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        //throw new Error(`Error en la red: ${response.statusText}`);
        console.log(response.statusText);
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
      console.error("Error al obtener las citas:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      //const API_URL = "https://localhost:44382/api/Customer";
      const API_URL = "/backend/api/Customer";

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(
          `Error al obtener los clientes: ${response.statusText}`
        );
      }
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      console.error("Error al obtener los clientes:", err);
    }
  };

  // Función para eliminar un cliente por ID
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar esta cita?"
    );
    if (confirmed) {
      try {
        //const API_URL = `https://localhost:44382/api/Appointment/${id}`;
        const API_URL = `/backend/api/Appointment/${id}`;

        const response = await fetch(API_URL, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Error al eliminar: ${response.statusText}`);
        }
        setRefreshKey((prevKey) => prevKey + 1);
        alert("Cita eliminada con éxito.");
      } catch (err) {
        alert("Hubo un error al eliminar la cita.");
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchCustomers();
  }, [refreshKey]);

  //if (loading) return <div>Cargando citas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container col-md-10 mx-auto mt-4 mt-4">
      <h2 className="mb-3">Lista de Citas</h2>

      <Button variant="success" onClick={() => handleShow()} className="mb-3">
        + Nueva
      </Button>

      <Form className="mb-3">
        <div className="row">
          <Form.Group className="col-md-3">
            <Form.Label>Fecha de Inicio</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </Form.Group>
          <Form.Group className="col-md-3">
            <Form.Label>Fecha de Fin</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </Form.Group>
          <Form.Group className="col-md-3">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value={0}>Scheduled</option>
              <option value={1}>Done</option>
              <option value={2}>Cancelled</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="col-md-3">
            <Button
              variant="primary"
              onClick={fetchAppointments}
              className="mt-4"
            >
              Buscar
            </Button>
          </Form.Group>
        </div>
      </Form>

      <DataTable columns={appointmentColumns} data={appointments} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAppointment ? "Editar Cita" : "Crear Nueva Cita"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                as="select"
                name="customerId"
                value={formAppointment.customerId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un cliente...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha y Hora</Form.Label>
              <Form.Control
                type="datetime-local"
                name="dateTime"
                value={formAppointment.dateTime}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formAppointment.status}
                onChange={handleChange}
                required
              >
                <option value={0}>Scheduled</option>
                <option value={1}>Done</option>
                <option value={2}>Cancelled</option>
              </Form.Control>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-2"
              >
                Cerrar
              </Button>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
