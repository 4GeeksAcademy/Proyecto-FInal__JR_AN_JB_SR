import { NavbarMecanico } from "../components/NavbarMecanico";
import { useEffect, useState } from "react";

export const InicioMecanico = () => {

  const [ordenDeTrabajo, setOrdenDeTrabajo] = useState([])
  const [fechaTemp, setFechaTemp] = useState()

  const [ordenesFinalizadas, setOrdenesFinalizadas] = useState([]);


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


  function cerrarDropdown(id_ot) {
    const dropdown = document.getElementById(`dropdown-${id_ot}`);
    if (dropdown && dropdown.classList.contains("show")) {
      dropdown.classList.remove("show"); // cierra el menú
      const toggleBtn = dropdown.previousElementSibling;
      if (toggleBtn) {
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    }
  }

  function updateInfo(id_ot, fecha_final, estado_servicio) {

    console.log(estado_servicio)
    console.log(fecha_final)
    //ACA VA LO LOGICA, SI ESTADO ES INGRESADO O EN_PROCESO FECHA FINAL= NULL Y GENERA ALARMA
    //SI ESTADO ES FINALIZADO FECHA NO PUEDE SER NULL
    if (estado_servicio == "INGRESADO" || estado_servicio == "EN_PROCESO") {
      fecha_final = null
    }
    else {
      fecha_final = fecha_final
      setOrdenesFinalizadas((prev) => [...prev, id_ot]);
    }
    console.log("va de nuevo")
    console.log(estado_servicio)
    console.log(fecha_final)

    let newData = {
      "fecha_final": fecha_final,
      "estado_servicio": estado_servicio
    }
    console.log("estos son los nuevos datos")
    console.log(newData)

    const token = localStorage.getItem("jwt_token")
    fetch(import.meta.env.VITE_BACKEND_URL + "/modificar_orden/" + id_ot, {
      method: "PUT",
      body: JSON.stringify(newData),
      headers: {
        "Content-Type": "application/json",
        "authorization": 'Bearer ' + token
      }
    })

      .then((response) => {
        if (!response.ok) throw new Error("Error al modificar la informacion");
        return response.json()
      })
      .then((data) => {
        console.log(data.msg)

        const alertContainer = document.getElementById("alert-container");
        alertContainer.innerHTML = `
    <div class="alert alert-success" role="alert">
      Orden actualizada correctamente.
    </div>
  `;
        setTimeout(() => {
          alertContainer.innerHTML = "";
        }, 5000);

        traer_ordenes_de_servicio()
        if (estado_servicio === "FINALIZADO") {
          setOrdenesFinalizadas((prev) => [...prev, id_ot]);
        }
      })
      .catch((error) => { error })

  };



  useEffect(() => {
    traer_ordenes_de_servicio()
  }, [])

  const getEstadoBadge = (estado) => {
    if (estado === 'En proceso') {
      return <span className="badge rounded-pill bg-warning">En Proceso</span>;
    }
    else if (estado == 'Ingresado') {
      return <span className="badge rounded-pill bg-success">Ingresado</span>;
    }
    else
      return <span className="badge rounded-pill bg-danger text-light">Finalizado</span>;
  };

  return (
    <div>
      <NavbarMecanico />

      <div className="container mt-4">
        <div className="text-center mb-3">
          <h4 className="text-dark px-4 py-2 fw-bold">Ordenes Asignadas</h4>
        </div>

        <div className="">
          <div id="alert-container"></div>
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Nro. de Órden</th>
                <th>Vehículo</th>
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
                  <td>{orden.servicios_asociados.map(s => s.servicio.name_service).join(", ")}</td>
                  <td>{orden.fecha_ingreso.slice(0, 16)}</td>
                  <td>
                    {orden.fecha_final == null ? (
                      <input
                        type="date"
                        className="form-control"
                        value={fechaTemp || ""} // Mostrar la fecha temporal correctamente
                        onChange={(e) => setFechaTemp(e.target.value)}
                        disabled={ordenesFinalizadas.includes(orden.id_ot)}
                      />
                    ) : orden.fecha_final.slice(0, 16)}
                  </td>
                  <td>{getEstadoBadge(orden.estado_servicio)}</td>
                  <td>
                    <div className="dropdown">
                      <button
                        className="btn btn-primary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        disabled={ordenesFinalizadas.includes(orden.id_ot)}
                      >
                        Modificar Estado
                      </button>
                      <ul className="dropdown-menu" id={`dropdown-${orden.id_ot}`}>
                        <li><button onClick={() => {
                          setFechaTemp(null)
                          updateInfo(orden.id_ot, fechaTemp, "INGRESADO");
                        }} className="dropdown-item">Ingresado</button></li>

                        <li><button onClick={() => {
                          setFechaTemp(null)
                          updateInfo(orden.id_ot, fechaTemp, "EN_PROCESO");
                        }} className="dropdown-item">En proceso</button></li>

                        <li><button onClick={() => {
                          cerrarDropdown(orden.id_ot);
                          updateInfo(orden.id_ot, fechaTemp, "FINALIZADO");
                        }} className="dropdown-item">Finalizado</button></li>
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