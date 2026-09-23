function Filtros({
  empleado,
  fecha,
  onEmpleadoChange,
  onFechaChange,
  onBuscar,
  onLimpiar,
}) {
  return (
    <div className="filters">
      <div className="field">
        <label>Empleado</label>
 
        <input
          type="text"
          value={empleado}
          onChange={(e) => onEmpleadoChange(e.target.value)}
          placeholder="EMP001"
        />
      </div>
 
      <div className="field">
        <label>Fecha</label>
 
        <input
          type="date"
          value={fecha}
          onChange={(e) => onFechaChange(e.target.value)}
        />
      </div>
 
      <div className="filter-actions">
        <button
          className="btn primary"
          onClick={onBuscar}
        >
          Buscar
        </button>
 
        <button
          className="btn secondary"
          onClick={onLimpiar}
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
 
export default Filtros;
 