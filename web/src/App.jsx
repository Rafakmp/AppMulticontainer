import { useEffect, useState } from "react";

const empty = {
  codigo_empleado: "", nombre_empleado: "", fecha: "",
  hora_ingreso_programada: "08:00", hora_ingreso_real: "",
  hora_salida_programada: "16:00", hora_salida_real: "",
  observacion: ""
};

export default function App() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [filtro, setFiltro] = useState("");

  async function cargar() {
    const url = filtro
      ? `/api/marcaciones?empleado=${encodeURIComponent(filtro)}`
      : "/api/marcaciones";
    const r = await fetch(url);
    setRows(await r.json());
  }

  useEffect(() => { cargar(); }, []);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar(e) {
    e.preventDefault();
    const r = await fetch("/api/marcaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (!r.ok) {
      const data = await r.json();
      alert(data.error);
      return;
    }
    setForm(empty);
    cargar();
  }

  async function eliminar(id) {
    if (!confirm("¿Eliminar registro?")) return;
    await fetch(`/api/marcaciones/${id}`, { method: "DELETE" });
    cargar();
  }

  return (
    <main>
      <h1>RRHH - Marcaciones</h1>

      <form onSubmit={guardar}>
        {Object.keys(form).map(k => (
          <input key={k} name={k} value={form[k]}
            onChange={change} placeholder={k}
            type={k.includes("hora") ? "time" : k === "fecha" ? "date" : "text"}
            required={!["observacion"].includes(k)} />
        ))}
        <button>Registrar</button>
      </form>

      <hr />
      <input value={filtro} onChange={e => setFiltro(e.target.value)}
        placeholder="Filtrar por EMP001" />
      <button onClick={cargar}>Buscar</button>

      <table border="1">
        <thead><tr>
          <th>ID</th><th>Empleado</th><th>Fecha</th>
          <th>Ingreso</th><th>Salida</th><th>Estado</th><th>Acción</th>
        </tr></thead>
        <tbody>
          {rows.map(r => <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.codigo_empleado} - {r.nombre_empleado}</td>
            <td>{r.fecha}</td>
            <td>{r.hora_ingreso_real}</td>
            <td>{r.hora_salida_real}</td>
            <td>{r.estado}</td>
            <td><button onClick={() => eliminar(r.id)}>Eliminar</button></td>
          </tr>)}
        </tbody>
      </table>
    </main>
  );
}
