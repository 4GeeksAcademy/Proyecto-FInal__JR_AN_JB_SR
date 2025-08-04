import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import logoB from "../assets/img/logoB.svg";

export const NavbarUser = ({ onSectionChange, activeSection }) => { 

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

  const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    navigate("/");
    };

    const handleConfirmLogout = () => {
        handleLogout();
        handleCloseModal(); // Cierra el modal después de cerrar la sesión
    };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm mt-2 ms-2 me-2 px-3" style={{ backgroundColor: '#003366', borderRadius: '15px' }}>
      <div className="container-fluid">
        <img src={logoB} alt="Logo" width={200} />

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <a className={`nav-link ${activeSection === 'Inicio' ? 'active-custom' : ''}`} href="#" onClick={() => onSectionChange('Inicio')}>Inicio</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${activeSection === 'Vehiculos' ? 'active-custom' : ''}`} href="#" onClick={() => onSectionChange('Vehiculos')}>Vehículos</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${activeSection === 'Perfil' ? 'active-custom' : ''}`} href="#" onClick={() => onSectionChange('Perfil')}>Perfil</a>
            </li>
            <li className="nav-item">
              <button onClick={handleShowModal} className="text-white btn btn-info ms-3">LogOut</button>
            </li>
          </ul>
          <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Cerrar Sesión</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>¿Estás seguro de querer cerrar tu sesión?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleConfirmLogout}>
                                Sí
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </nav>
  );
};