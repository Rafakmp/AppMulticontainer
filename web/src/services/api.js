const API = "/api";
 
async function procesarRespuesta(response) {
  const data = await response.json().catch(() => ({}));
 
  if (!response.ok) {
    throw new Error(
      data.error || `Error HTTP ${response.status}`
    );
  }
 
  return data;
}
 
export async function obtenerMarcaciones(filtros = {}) {
  const params = new URLSearchParams();
 
  if (filtros.empleado) {
    params.append("empleado", filtros.empleado);
  }
 
  if (filtros.fecha) {
    params.append("fecha", filtros.fecha);
  }
 
  const query = params.toString();
 
  const response = await fetch(
    `${API}/marcaciones${query ? `?${query}` : ""}`
  );
 
  return procesarRespuesta(response);
}
 
export async function obtenerMarcacion(id) {
  const response = await fetch(`${API}/marcaciones/${id}`);
 
  return procesarRespuesta(response);
}
 
export async function crearMarcacion(datos) {
  const response = await fetch(`${API}/marcaciones`, {
    method: "POST",
 
    headers: {
      "Content-Type": "application/json",
    },
 
    body: JSON.stringify(datos),
  });
 
  return procesarRespuesta(response);
}
 
export async function actualizarMarcacion(id, datos) {
  const response = await fetch(`${API}/marcaciones/${id}`, {
    method: "PUT",
 
    headers: {
      "Content-Type": "application/json",
    },
 
    body: JSON.stringify(datos),
  });
 
  return procesarRespuesta(response);
}
 
export async function eliminarMarcacion(id) {
  const response = await fetch(`${API}/marcaciones/${id}`, {
    method: "DELETE",
  });
 
  return procesarRespuesta(response);
}
 
