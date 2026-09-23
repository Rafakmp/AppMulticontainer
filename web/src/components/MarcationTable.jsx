function MarcacionTable({
  marcaciones,
  onEditar,
  onEliminar,
}) {
  if (marcaciones.length === 0) {
    return (
      <div className="empty">
        No existen marcaciones registradas.
      </div>
    );
  }
 
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Empleado</th>
            <th>Fecha</th>
            <th>Ingreso</th>
            <th>Salida</th>
            <th>Estado</th>
            <th>Observación</th>
            <th>Acciones</th>
          </tr>
        </thead>
 
        <tbody>
          {marcaciones.map((marcacion) => (
            <tr key={marcacion.id}>
              <td>{marcacion.id}</td>
 
              <td>
                <strong>
                  {marcacion.codigo_empleado}
                </strong>
 
                <small>
                  {marcacion.nombre_empleado}
                </small>
              </td>
 
              <td>
                {formatearFecha(marcacion.fecha)}
              </td>
 
              <td>
                <div className="time-cell">
                  <span className="programado">
                    {limpiarHora(
                      marcacion.hora_ingreso_programada
                    )}
                  </span>
 
                  <span>
                    {limpiarHora(
                      marcacion.hora_ingreso_real
                    )}
                  </span>
                </div>
              </td>
 
              <td>
                <div className="time-cell">
                  <span className="programado">
                    {limpiarHora(
                      marcacion.hora_salida_programada
                    )}
                  </span>
 
                  <span>
                    {limpiarHora(
                      marcacion.hora_salida_real
                    )}
                  </span>
                </div>
              </td>
 
              <td>
                <span
                  className={`badge ${obtenerClaseEstado(
                    marcacion.estado
                  )}`}
                >
                  {marcacion.estado}
                </span>
              </td>
 
              <td>
                {marcacion.observacion || "-"}
              </td>
 
              <td>
                <div className="actions">
                  <button
                    className="btn small edit"
                    onClick={() => onEditar(marcacion)}
                  >
                    Editar
                  </button>
 
                  <button
                    className="btn small danger"
                    onClick={() => onEliminar(marcacion)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 
function limpiarHora(valor) {
  if (!valor) return "-";
 
  return String(valor).substring(0, 5);
}
 
function formatearFecha(valor) {
  if (!valor) return "-";
 
  return String(valor).substring(0, 10);
}
 
function obtenerClaseEstado(estado) {
  switch (estado) {
    case "PUNTUAL":
      return "punctual";
 
    case "ATRASO":
      return "late";
 
    case "INCOMPLETO":
      return "incomplete";
 
    default:
      return "other";
  }
}
 
export default MarcacionTable;
 