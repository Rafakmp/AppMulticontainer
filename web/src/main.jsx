import { useEffect, useState } from "react";
import Header from "./components/Header";
import MarcacionForm from "./components/MarcacionForm";
import MarcacionTable from "./components/MarcacionTable";
import Filtros from "./components/Filtros";
import ConfirmModal from "./components/ConfirmModal";
import {
  obtenerMarcaciones,
  crearMarcacion,
  actualizarMarcacion,
  eliminarMarcacion,
} from "./services/api";
 
const formularioInicial = {
  codigo_empleado: "",
  nombre_empleado: "",
  fecha: "",
  hora_ingreso_programada: "08:00",
  hora_ingreso_real: "",
  hora_salida_programada: "16:00",
  hora_salida_real: "",
  observacion: "",
};
 
function App() {
  const [marcaciones, setMarcaciones] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [editando, setEditando] = useState(null);
  const [eliminando, setEliminando] = useState(null);
 
  const [filtroEmpleado, setFiltroEmpleado] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
 
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
 
  useEffect(() => {
    cargarMarcaciones();
  }, []);
 
  async function cargarMarcaciones(filtros = {}) {
    try {
      setCargando(true);
      setError("");
 
      const data = await obtenerMarcaciones(filtros);
 
      setMarcaciones(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }
 
  function manejarCambio(e) {
    const { name, value } = e.target;
 
    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  }
 
  async function manejarGuardar(e) {
    e.preventDefault();
 
    try {
      setError("");
      setMensaje("");
 
      if (editando) {
        await actualizarMarcacion(editando.id, formulario);
        setMensaje("Marcación modificada correctamente.");
      } else {
        await crearMarcacion(formulario);
        setMensaje("Marcación registrada correctamente.");
      }
 
      setFormulario(formularioInicial);
      setEditando(null);
 
      await cargarMarcaciones({
        empleado: filtroEmpleado,
        fecha: filtroFecha,
      });
    } catch (err) {
      setError(err.message);
    }
  }
 
  function manejarEditar(marcacion) {
    setEditando(marcacion);
 
    setFormulario({
      codigo_empleado: marcacion.codigo_empleado || "",
      nombre_empleado: marcacion.nombre_empleado || "",
      fecha: formatearFecha(marcacion.fecha),
      hora_ingreso_programada: limpiarHora(
        marcacion.hora_ingreso_programada
      ),
      hora_ingreso_real: limpiarHora(marcacion.hora_ingreso_real),
      hora_salida_programada: limpiarHora(
        marcacion.hora_salida_programada
      ),
      hora_salida_real: limpiarHora(marcacion.hora_salida_real),
      observacion: marcacion.observacion || "",
    });
 
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
 
  function cancelarEdicion() {
    setEditando(null);
    setFormulario(formularioInicial);
  }
 
  async function confirmarEliminacion() {
    if (!eliminando) return;
 
    try {
      setError("");
      setMensaje("");
 
      await eliminarMarcacion(eliminando.id);
 
      setMensaje("Marcación eliminada correctamente.");
      setEliminando(null);
 
      await cargarMarcaciones({
        empleado: filtroEmpleado,
        fecha: filtroFecha,
      });
    } catch (err) {
      setError(err.message);
    }
  }
 
  async function manejarBuscar() {
    await cargarMarcaciones({
      empleado: filtroEmpleado,
      fecha: filtroFecha,
    });
  }
 
  async function limpiarFiltros() {
    setFiltroEmpleado("");
    setFiltroFecha("");
 
    await cargarMarcaciones();
  }
 
  return (
    <div className="app">
      <Header />
 
      <main className="container">
        {mensaje && (
          <div className="alert success">
            {mensaje}
          </div>
        )}
 
        {error && (
          <div className="alert error">
            {error}
          </div>
        )}
 
        <section className="card">
          <div className="section-header">
            <div>
              <h2>
                {editando
                  ? "Modificar marcación"
                  : "Registrar marcación"}
              </h2>
 
              <p>
                Registra los horarios de ingreso y salida del empleado.
              </p>
            </div>
          </div>
 
          <MarcacionForm
            formulario={formulario}
            editando={editando}
            onChange={manejarCambio}
            onSubmit={manejarGuardar}
            onCancel={cancelarEdicion}
          />
        </section>
 
        <section className="card">
          <div className="section-header">
            <div>
              <h2>Consultar marcaciones</h2>
 
              <p>
                Filtra los registros por empleado o fecha.
              </p>
            </div>
          </div>
 
          <Filtros
            empleado={filtroEmpleado}
            fecha={filtroFecha}
            onEmpleadoChange={setFiltroEmpleado}
            onFechaChange={setFiltroFecha}
            onBuscar={manejarBuscar}
            onLimpiar={limpiarFiltros}
          />
        </section>
 
        <section className="card">
          <div className="section-header">
            <div>
              <h2>Marcaciones registradas</h2>
 
              <p>
                {marcaciones.length} registro
                {marcaciones.length !== 1 ? "s" : ""}
              </p>
            </div>
 
            <button
              className="btn secondary"
              onClick={() =>
                cargarMarcaciones({
                  empleado: filtroEmpleado,
                  fecha: filtroFecha,
                })
              }
            >
              Actualizar
            </button>
          </div>
 
          {cargando ? (
            <div className="loading">
              Cargando marcaciones...
            </div>
          ) : (
            <MarcacionTable
              marcaciones={marcaciones}
              onEditar={manejarEditar}
              onEliminar={setEliminando}
            />
          )}
        </section>
      </main>
 
      {eliminando && (
        <ConfirmModal
          marcacion={eliminando}
          onConfirm={confirmarEliminacion}
          onCancel={() => setEliminando(null)}
        />
      )}
    </div>
  );
}
 
function limpiarHora(valor) {
  if (!valor) return "";
 
  return String(valor).substring(0, 5);
}
 
function formatearFecha(valor) {
  if (!valor) return "";
 
  return String(valor).substring(0, 10);
}
 
export default App;
 
