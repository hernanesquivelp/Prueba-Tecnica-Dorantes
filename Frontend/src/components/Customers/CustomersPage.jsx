import React, { useState, useEffect } from "react";
import DataTable from "../Datatable/Datatable";
import { Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomersPage = () => {
  // Estado para la lista de clientes que se muestra en la tabla
  const [customers, setCustomers] = useState([]);

  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);

  // Estado para manejar errores en la API
  const [error, setError] = useState(null);

  // Estado para forzar una recarga de datos cuando se crea, edita o elimina un cliente
  const [refreshKey, setRefreshKey] = useState(0);

  // Estado que controla si el modal está abierto o cerrado
  const [show, setShow] = useState(false);

  // Estado para guardar temporalmente el cliente que se está editando
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Estado que guarda los datos del formulario (para crear o editar)
  const [formCustomer, setFormCustomer] = useState({
    name: "",
    email: "",
  });

  // Cierra el modal y reinicia los estados del formulario
  const handleClose = () => {
    setShow(false);
    setEditingCustomer(null);
    setFormCustomer({
      name: "",
      email: "",
    });
  };

  // Abre el modal y prepara el formulario. Si recibe un cliente, lo usa para editar.
  const handleShow = (customerToEdit = null) => {
    setEditingCustomer(customerToEdit);
    if (customerToEdit) {
      setFormCustomer(customerToEdit);
    } else {
      setFormCustomer({
        name: "",
        email: "",
      });
    }
    setShow(true);
  };

  // Maneja el cambio en los inputs del formulario y actualiza el estado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormCustomer({
      ...formCustomer,
      [name]: value,
    });
  };

  // Maneja el envío del formulario, determina si es un POST o PUT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = editingCustomer !== null;
    const method = isEditing ? "PUT" : "POST";
    const API_URL = isEditing
      ? /*? `https://localhost:44382/api/Customer/${editingCustomer.id}`
      : "https://localhost:44382/api/Customer"; */

        `/backend/api/Customer/${editingCustomer.id}`
      : "/backend/api/Customer";
    try {
      const response = await fetch(API_URL, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formCustomer),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      handleClose();
      // Incrementa el refreshKey para forzar que useEffect recargue los datos
      setRefreshKey((prevKey) => prevKey + 1);
      alert(`Cliente ${isEditing ? "actualizado" : "agregado"} con éxito.`);
    } catch (error) {
      alert(
        `Hubo un error al ${isEditing ? "actualizar" : "agregar"} el cliente.`
      );
    }
  };

  // Define las columnas para la tabla. El render permite poner botones de acción.
  const customerColumns = [
    { header: "Nombre", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Acciones",
      render: (customer) => (
        <>
          <Button
            variant="warning"
            className="me-2"
            // Llama a handleShow con los datos del cliente para llenar el formulario
            onClick={() => handleShow(customer)}
          >
            Editar
          </Button>
          <Button variant="danger" onClick={() => handleDelete(customer.id)}>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  // para obtener los clientes de la API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      //const API_URL = "https://localhost:44382/api/Customer";
      const API_URL = "/backend/api/Customer";

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error en la red: ${response.statusText}`);
      }
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
      console.error("Error al obtener los clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  // para eliminar un cliente por ID
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar este cliente?"
    );
    if (confirmed) {
      try {
        //const API_URL = `https://localhost:44382/api/Customer/${id}`;
        const API_URL = `/backend/api/Customer/${id}`;
        const response = await fetch(API_URL, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Error al eliminar: ${response.statusText}`);
        }
        setRefreshKey((prevKey) => prevKey + 1);
        alert("Cliente eliminado con éxito.");
      } catch (err) {
        alert("Hubo un error al eliminar el cliente.");
      }
    }
  };

  // useEffect se ejecuta cada vez que 'refreshKey' cambia para recargar la lista
  useEffect(() => {
    fetchCustomers();
  }, [refreshKey]);

  //if (loading) return <div>Cargando clientes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container col-md-10 mx-auto mt-4 mt-4">
      <h2 className="mb-3">Lista de Clientes</h2>
      <Button variant="success" onClick={() => handleShow()} className="mb-3">
        + Nuevo
      </Button>

      <DataTable columns={customerColumns} data={customers} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {/* El título del modal cambia si se está editando o creando */}
          <Modal.Title>
            {editingCustomer ? "Editar Cliente" : "Crear Nuevo Cliente"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formCustomer.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formCustomer.email}
                onChange={handleChange}
                required
              />
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

export default CustomersPage;
