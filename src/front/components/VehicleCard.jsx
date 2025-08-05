import React from 'react'
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import car_side from "../assets/img/car_side.png";


export const VehicleCard = (props) => {

  const navigate = useNavigate()

  function eliminarVehiculo(id_vehiculo) {
    const token = localStorage.getItem("jwt_token")
    fetch(import.meta.env.VITE_BACKEND_URL + `eliminar_vehiculo/${id_vehiculo}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token //localStorage.getItem('token') // JWT
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.msg === 'Vehículo eliminado correctamente') {
          //alert('Vehículo eliminado con éxito')
          console.log("Navegando a /vehiculos...")
          props.onDelete();
          //navigate('/vehiculos') //window.location.href = '/vehiculos'
          console.log("despues de navigate")
        } else {
          alert(data.msg)
        }
      })
      .catch(error => {
        console.error('Error:', error)
        //alert('Hubo un error al intentar eliminar el vehículo')

        const alertContainer = document.getElementById("alert-container");
        alertContainer.innerHTML = `
    <div class="alert alert-danger" role="alert">
      El vehiculo no pudo ser eliminado porque esta asociado a una orden de trabajo.
    </div>
  `;
        setTimeout(() => {
          alertContainer.innerHTML = "";
        }, 5000);


      })
  }
  return (
    <div className="card shadow-sm mb-3 rounded-4" style={{ border: '1px solid #e0e0e0' }}>
      <div id="alert-container" className="position-absolute w-100" style={{ top: '0', left: '0', zIndex: '10' }}></div>

      <div className="d-flex g-0">
        <div className="col-2 d-flex align-items-center ps-5">
          <img src={car_side} alt="Car Icon" style={{ width: '90px', height: 'auto' }} />
        </div>
        <div className="col-8 py-4 text-start">
          <h4 className="card-title mb-1 fw-bold text-dark">{props.marca}</h4>
          <p className="card-text text-muted mb-0" style={{ fontSize: '0.9rem' }}>{props.matricula}</p>
          <p className="card-text text-muted mb-0" style={{ fontSize: '0.9rem' }}>{props.modelo}</p>
          <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>{props.year}</p>
        </div>
        <div className="col-2 pe-5 d-flex justify-content-end align-items-center">
          <button onClick={() => {
            console.log(props.id_vehiculo)
            eliminarVehiculo(props.id_vehiculo)
          }} className='btn btn border-0'>
            <i className="fa-solid fa-trash-can" style={{ fontSize: '1.5rem', color: '#dc3545' }}></i>
          </button>
        </div>
      </div>
      <hr className="my-0" style={{ borderColor: '#e0e0e0' }} />
    </div>
  );
}