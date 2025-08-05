import { useEffect, useState } from "react";
import { NavbarUser } from "../components/NavbarUser";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export const InicioUser = () => {
  const navigate = useNavigate();

  const [ordenDeTrabajo, setOrdenDeTrabajo] = useState([])
  const [vehiculosUsuario, setVehiculosUsuario] = useState([]);
  const [isLoadingVehiculos, setIsLoadingVehiculos] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

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

  const traerVehiculosUsuario = async () => {
    setIsLoadingVehiculos(true);
    const token = localStorage.getItem("jwt_token");
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "mis_vehiculos",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token
          }
        }
      );
      if (!response.ok) {
        console.error("Error al traer vehículos:", await response.json());
        setVehiculosUsuario([]);
        return;
      }
      const data = await response.json();
      setVehiculosUsuario(data.vehiculos);
    } catch (error) {
      console.error("❌ Error fetching mis_vehiculos:", error);
      setVehiculosUsuario([]);
    } finally {
      setIsLoadingVehiculos(false);
    }
  };

  useEffect(() => {
    traer_ordenes_de_servicio();
    traerVehiculosUsuario();
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

  const handleGenerarNuevaOrdenClick = () => {
    if (isLoadingVehiculos) {
      // Si los vehículos aún están cargando, avisamos al usuario a través del modal
      setErrorMessage("Cargando información de vehículos, por favor espere...");
      setShowErrorModal(true);
      return;
    }
    if (vehiculosUsuario.length === 0) {
      setErrorMessage("Primero debes registrar un vehículo en la sección Vehículos del menú principal para generar una Nueva Orden");
      setShowErrorModal(true);
    } else {
      // Si tiene vehículos, lo redirigimos a la página de nueva orden
      navigate("/nuevaOrden");
    }
  };

  return (
    <div>

      <div className="container mt-4">
        <div className="text-center mb-3 pt-4">
          <button
            className="btn btn-info text-white px-4 py-2 fw-bold"
            onClick={handleGenerarNuevaOrdenClick}
            disabled={isLoadingVehiculos}
          >
            Generar Nueva Órden
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Nro. de Órden</th>
                <th>Vehículo</th>
                <th>Mecanico</th>
                <th>Servicios</th>
                <th>Fecha de ingreso</th>
                <th>Fecha de salida</th>
                <th>Estado</th>
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
                  <td>{orden.fecha_final}</td>
                  <td>{getEstadoBadge(orden.estado_servicio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={`modal fade ${showErrorModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Aviso</h5> {/* Título genérico para avisos */}
              <button type="button" className="btn-close" onClick={handleCloseErrorModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>{errorMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};