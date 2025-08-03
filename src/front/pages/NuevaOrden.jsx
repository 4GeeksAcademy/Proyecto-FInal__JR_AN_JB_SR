import React, { useState, useEffect } from "react";

export const NuevaOrden = () => {
    const [formData, setFormData] = useState({
        fecha_ingreso: "",
        estado_servicio: "",
        usuario_id: "",
        vehiculo_id: "",
        mecanico: "",
        servicios: []  // <-- aquí guardaremos los ID de los servicios seleccionados
    });

    const [identificacion, setIdentificacion] = useState("");
    const [usuario, setUsuario] = useState(null);
    const [vehiculos, setVehiculos] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [mecanicos, setMecanicos] = useState([]);
    const [id_orden, setId_Orden] = useState([]);


    const [servicioSeleccionado, setServicioSeleccionado] = useState("");//*************** */

    const handleChangeServicios = (e) => {
        const valoresSeleccionados = Array.from(e.target.selectedOptions, option => option.index+1);
        console.log("IDs seleccionados:", valoresSeleccionados);
        setServicioSeleccionado(valoresSeleccionados)
    };

    //  Cargar servicios al montar el componente
    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "servicios")
            .then((res) => res.json())
            .then((data) => setServicios(data))
            .catch((err) => console.error("❌ Error cargando servicios:", err));

        // Mecanicos
        fetch(import.meta.env.VITE_BACKEND_URL + "mecanicos")
            .then((res) => res.json())
            .then((data) => setMecanicos(data))
            .catch((err) => console.error("❌ Error cargando mecanicos:", err));
    }, []);



    //  Buscar usuario y cargar sus vehículos
    const buscarUsuario = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "usuarios/" + `${identificacion}`);
            const data = await response.json();

            if (response.ok) {
                setUsuario(data);
                setFormData({ ...formData, usuario_id: data.id_user });

                // Traer vehículos del usuario
                const vehiculosRes = await fetch(import.meta.env.VITE_BACKEND_URL + "usuarios/" + `${data.id_user}/vehiculos`);
                const vehiculosData = await vehiculosRes.json();
                setVehiculos(vehiculosData);
            } else {
                alert("❌ Usuario no encontrado");
                setUsuario(null);
                setVehiculos([]);
            }
        } catch (error) {
            console.error("❌ Error buscando usuario:", error);
        }
    };

    // 🔄 Manejar cambios en campos simples
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Manejar selección múltiple de servicios
    const handleServiciosChange = (e) => {
        const opciones = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData({ ...formData, servicios: opciones });
    };

    // ✅ Manejar selección Mecanicos
    const handleMecanicosChange = (e) => {
        const opciones = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData({ ...formData, mecanico: opciones });
    };




    // 📤 Enviar la orden
    const handleSubmit = async (e) => {
        e.preventDefault();
         let id_orden_nuevo = null
        try {
             
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "ordenes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ Orden creada con éxito");
                console.log(data.orden.id_ot);
                id_orden_nuevo = data.orden.id_ot
                //setId_Orden(data.orden.id_ot);
            } else {
                alert("❌ Error: " + data.message);
            }
        } catch (error) {
            console.error("❌ Error enviando la orden:", error);
        }

        //aca va un fetch para crear la orden auxiliar con las variables id_orden y servicioSeleccionado

        fetch(import.meta.env.VITE_BACKEND_URL + "asociar-servicios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                orden_id: id_orden_nuevo,
                servicios: servicioSeleccionado
            })
        })
        .then((response)=>{
            if(!response.ok){
                alert("problemas al asociar el servicio")
            }
            return response.json()
        })
        .then((data)=>{
            console.log(data)
        })
        .catch((err)=>{err})
        
    };

    return (
        <div className="container mt-4">
            <h2>📄 Nueva Orden de Servicio</h2>

            {/* 🔍 Buscar usuario */}
            <div className="mb-3 d-flex">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Ingrese identificación del usuario"
                    value={identificacion}
                    onChange={(e) => setIdentificacion(e.target.value)}
                />
                <button type="button" className="btn btn-info text-white" onClick={buscarUsuario}>
                    Buscar Usuario
                </button>
            </div>

            {/* ✅ Mostrar info del usuario en pantalla */}
            {usuario && (
                <div className="alert alert-success">
                    <h5>✅ Datos del Cliente</h5>
                    <p><strong>Nombre:</strong> {usuario.nombre}</p>
                    <p><strong>Email:</strong> {usuario.email}</p>
                    <p><strong>Teléfono:</strong> {usuario.telefono}</p>
                </div>
            )}

            {/*  Formulario de orden */}
            <form onSubmit={handleSubmit}>
                {/* Fecha */}
                <div className="mb-3">
                    <label className="form-label">Fecha de Ingreso</label>
                    <input type="date" name="fecha_ingreso" className="form-control" onChange={handleChange} value={formData.fecha_ingreso} />
                </div>

                {/* Estado */}
                <div className="mb-3">
                    <label className="form-label">Estado del Servicio</label>
                    <select name="estado_servicio" className="form-control" onChange={handleChange} value={formData.estado_servicio}>
                        <option value="">Seleccione</option>
                        <option value="INGRESADO">Pendiente</option>
                        <option value="EN_PROCESO">En Proceso</option>
                        <option value="FINALIZADO">Finalizado</option>
                    </select>
                </div>

                {/* Vehículos del usuario */}
                <div className="mb-3">
                    <label className="form-label">Vehículo</label>
                    <select name="vehiculo_id" className="form-control" onChange={handleChange} value={formData.vehiculo_id}>
                        <option value="">Seleccione un vehículo</option>
                        {vehiculos.map((v) => (
                            <option key={v.id_vehiculo} value={v.id_vehiculo}>
                                {v.marca} {v.modelo} - {v.matricula}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Mecánico */}
                <div className="mb-3">
                    <label className="form-label">Mecánico</label>
                    <select name="mecanico_id" className="form-control" onChange={handleChange} value={formData.mecanico_id}>
                        <option value="">Seleccione un mecánico</option>
                        {mecanicos.map((m) => (
                            <option key={m.id_user} value={m.id_user}>
                                {m.nombre} - {m.email}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Servicios múltiples */}
                <div className="mb-3">
                    <label className="form-label">Servicios</label>
                    <select name="servicios" className="form-control" multiple onChange={handleChangeServicios}>
                        {servicios.map((s) => (
                            <option key={s.id_service} value={s.id_service}>
                                {s.name_service} - ${s.price}
                            </option>
                        ))}
                    </select>
                    <small className="form-text text-muted">Puedes seleccionar varios servicios (Ctrl+Click)</small>
                </div>

                <button type="submit" className="btn btn-primary">
                    Crear Orden
                </button>
            </form>
        </div>
    );
};

export default NuevaOrden;