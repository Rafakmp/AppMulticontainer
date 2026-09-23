const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

function calcularEstado(horaProgramada, horaReal) {
  return horaReal <= horaProgramada ? "PUNTUAL" : "ATRASO";
}

function validar(body) {
  const campos = [
    "codigo_empleado", "nombre_empleado", "fecha",
    "hora_ingreso_programada", "hora_ingreso_real",
    "hora_salida_programada", "hora_salida_real"
  ];
  for (const c of campos) {
    if (!body[c]) return `Campo obligatorio: ${c}`;
  }
  if (body.hora_salida_real < body.hora_ingreso_real) {
    return "La hora de salida no puede ser anterior a la hora de ingreso";
  }
  return null;
}

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch {
    res.status(500).json({ status: "error" });
  }
});

app.get("/api/marcaciones", async (req, res) => {
  try {
    const { empleado, fecha } = req.query;
    let sql = "SELECT * FROM marcaciones";
    const params = [];
    const conditions = [];

    if (empleado) {
      params.push(empleado);
      conditions.push(`codigo_empleado = $${params.length}`);
    }
    if (fecha) {
      params.push(fecha);
      conditions.push(`fecha = $${params.length}`);
    }
    if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
    sql += " ORDER BY fecha DESC, id DESC";

    const result = await pool.query(sql, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/api/marcaciones/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM marcaciones WHERE id = $1",
      [req.params.id]
    );
    if (!result.rowCount)
      return res.status(404).json({ error: "Marcación no encontrada" });
    res.status(200).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/api/marcaciones", async (req, res) => {
  try {
    const error = validar(req.body);
    if (error) return res.status(400).json({ error });

    const estado = calcularEstado(
      req.body.hora_ingreso_programada,
      req.body.hora_ingreso_real
    );

    const sql = `INSERT INTO marcaciones
      (codigo_empleado, nombre_empleado, fecha,
       hora_ingreso_programada, hora_ingreso_real,
       hora_salida_programada, hora_salida_real,
       estado, observacion)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`;

    const values = [
      req.body.codigo_empleado, req.body.nombre_empleado, req.body.fecha,
      req.body.hora_ingreso_programada, req.body.hora_ingreso_real,
      req.body.hora_salida_programada, req.body.hora_salida_real,
      estado, req.body.observacion || null
    ];

    const result = await pool.query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.put("/api/marcaciones/:id", async (req, res) => {
  try {
    const error = validar(req.body);
    if (error) return res.status(400).json({ error });

    const estado = calcularEstado(
      req.body.hora_ingreso_programada,
      req.body.hora_ingreso_real
    );

    const result = await pool.query(
      `UPDATE marcaciones SET
       codigo_empleado=$1, nombre_empleado=$2, fecha=$3,
       hora_ingreso_programada=$4, hora_ingreso_real=$5,
       hora_salida_programada=$6, hora_salida_real=$7,
       estado=$8, observacion=$9
       WHERE id=$10 RETURNING *`,
      [
        req.body.codigo_empleado, req.body.nombre_empleado, req.body.fecha,
        req.body.hora_ingreso_programada, req.body.hora_ingreso_real,
        req.body.hora_salida_programada, req.body.hora_salida_real,
        estado, req.body.observacion || null, req.params.id
      ]
    );

    if (!result.rowCount)
      return res.status(404).json({ error: "Marcación no encontrada" });

    res.status(200).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.delete("/api/marcaciones/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM marcaciones WHERE id=$1 RETURNING id",
      [req.params.id]
    );
    if (!result.rowCount)
      return res.status(404).json({ error: "Marcación no encontrada" });
    res.status(200).json({ message: "Marcación eliminada" });
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API ejecutándose en puerto ${PORT}`));