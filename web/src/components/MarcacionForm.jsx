function MarcacionForm({
  formulario,
  editando,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form-grid">
        <div className="field">
          <label>Código de empleado *</label>
 
          <input
            type="text"
            name="codigo_empleado"
            value={formulario.codigo_empleado}
            onChange={onChange}
            placeholder="EMP001"
            required
          />
        </div>
 
        <div className="field">
          <label>Nombre completo *</label>
 
          <input
            type="text"
            name="nombre_empleado"
            value={formulario.nombre_empleado}
            onChange={onChange}
            placeholder="Ana Pérez"
            required
          />
        </div>
 
        <div className="field">
          <label>Fecha *</label>
 
          <input
            type="date"
            name="fecha"
            value={formulario.fecha}
            onChange={onChange}
            required
          />
        </div>
 
        <div className="field">
          <label>Ingreso programado *</label>
 
          <input
            type="time"
            name="hora_ingreso_programada"
            value={formulario.hora_ingreso_programada}
            onChange={onChange}
            required
          />
        </div>
 
        <div className="field">
          <label>Ingreso real *</label>
 
          <input
            type="time"
            name="hora_ingreso_real"
            value={formulario.hora_ingreso_real}
            onChange={onChange}
            required
          />
        </div>
 
        <div className="field">
          <label>Salida programada *</label>
 
          <input
            type="time"
            name="hora_salida_programada"
            value={formulario.hora_salida_programada}
            onChange={onChange}
            required
          />
        </div>
 
        <div className="field">
          <label>Salida real *</label>
 
          <input
            type="time"
            name="hora_salida_real"
            value={formulario.hora_salida_real}
            onChange={onChange}
            required
          />
        </div>
 
        <div className="field field-full">
          <label>Observación</label>
 
          <textarea
            name="observacion"
            value={formulario.observacion}
            onChange={onChange}
            placeholder="Comentario opcional"
            rows="3"
          />
        </div>
      </div>
 
      <div className="form-actions">
        {editando && (
          <button
            type="button"
            className="btn secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
 
        <button type="submit" className="btn primary">
          {editando
            ? "Guardar cambios"
            : "Registrar marcación"}
        </button>
      </div>
    </form>
  );
}
 
export default MarcacionForm;
 