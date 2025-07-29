import { NavbarMecanico } from "../components/NavbarMecanico";
import { useEffect, useState } from "react";

export const InicioMecanico = () => {

  const [ordenDeTrabajo, setOrdenDeTrabajo] = useState([])

  function traer_ordenes_de_servicio() {

    const token = localStorage.getItem("jwt_token")
    fetch(import.meta.env.VITE_BACKEND_URL + "ordenes_de_trabajo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": 'Bearer ' + token
      }
    })
      .then((response) => {
        if (!response.ok) alert("Error al traer la informacion")
        return response.json()
      })
      .then((data) => {
        console.log(data.ordenes_de_trabajo)
        setOrdenDeTrabajo(data.ordenes_de_trabajo)
      })
      .catch((error) => { error })
  }

  useEffect(() => {
    traer_ordenes_de_servicio()
  }, [])

  const getEstadoBadge = (estado) => {
    if (estado === 'En Proceso') {
      return <span className="badge rounded-pill bg-warning">En Proceso</span>;
    }
    else if (estado == 'Ingresado') {
      return <span className="badge rounded-pill bg-danger">Ingresado</span>;
    }
    else
      return <span className="badge rounded-pill bg-success text-light">Finalizado</span>;
  };

  return (
    <div>
      <NavbarMecanico />

      <div className="container mt-4">
        <div className="text-center mb-3">
          <h4 className="text-dark px-4 py-2 fw-bold">Ordenes Asignadas</h4>
        </div>

        <div className="">
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Nro. de Órden</th>
                <th>Vehículo</th>
                <th>Mecanico</th>
                <th>Servicios asignados</th>
                <th>Fecha de ingreso</th>
                <th>Fecha de salida</th>
                <th>Estado</th>
                <th>Cambiar estado de la orden</th>
              </tr>
            </thead>
            <tbody>
              {ordenDeTrabajo.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.id_ot}</td>
                  <td>{orden.matricula_vehiculo}</td>
                  <td>{orden.nombre_mecanico}</td>
                  <td>{orden.servicios_asociados.map(s => s.servicio.name_service).join(", ")}</td>
                  <td>{orden.fecha_ingreso}</td>
                  <td>  <input
                    type="date"
                    className="form-control"
                    value={orden.fecha_final}
                    onChange={(e) => handleFechaChange(e, orden.id)}
                  /></td>
                  <td>{getEstadoBadge(orden.estado_servicio)}</td>
                  <td>
                    <div className="dropdown">
                      <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Modificar Estado
                      </button>
                      <ul className="dropdown-menu">
                        <li><button className="dropdown-item">Ingresado</button></li>
                        <li><button className="dropdown-item">En proceso</button></li>
                        <li><button className="dropdown-item">Finalizado</button></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};