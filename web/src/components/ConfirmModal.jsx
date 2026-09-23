function ConfirmModal({
  marcacion,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Eliminar marcación</h2>
 
        <p>
          ¿Estás seguro de que deseas eliminar la
          marcación de{" "}
          <strong>{marcacion.nombre_empleado}</strong>?
        </p>
 
        <div className="modal-actions">
          <button
            className="btn secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
 
          <button
            className="btn danger"
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default ConfirmModal;
 