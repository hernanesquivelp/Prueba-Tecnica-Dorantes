import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import MyNavbar from "./components/common/NavBar";
import CustomersPage from "./components/Customers/CustomersPage";
import AppointmentsPage from "./components/Appointments/AppointmentsPage";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div className="">
        {" "}
        {/* Contenedor principal para el navbar */}
        <div className="row">
          {/* La clase col-md-8 establece el ancho y mx-auto lo centra */}
          <div className="col-md-12 mx-auto">
            <MyNavbar />
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h2>Bienvenidos</h2>} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
