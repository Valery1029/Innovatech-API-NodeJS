import { connect } from "../config/db/connect.js";

// GET
export const showPqrs = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM pqrs";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pqrs", details: error.message });
  }
};

// GET ID
export const showPqrsId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM pqrs WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "pqrs not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pqrs", details: error.message });
  }
};

// POST
export const addPqrs = async (req, res) => {
  try {
    const { descripcion, comentario_respuesta, tipo_pqrs_id, usuario_id, estado_pqrs_id } = req.body;

    if (!descripcion || !tipo_pqrs_id || !usuario_id || !estado_pqrs_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `INSERT INTO pqrs (descripcion, comentario_respuesta, tipo_pqrs_id, usuario_id, estado_pqrs_id, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await connect.query(sqlQuery, [
      descripcion, comentario_respuesta, tipo_pqrs_id, usuario_id, estado_pqrs_id, created_at
    ]);

    res.status(201).json({
      data: { id: result.insertId, descripcion, comentario_respuesta, tipo_pqrs_id, usuario_id, estado_pqrs_id, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding pqrs", details: error.message });
  }
};

// PUT
export const updatePqrs = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, comentario_respuesta, tipo_pqrs_id, usuario_id, estado_pqrs_id } = req.body;

    if (!descripcion || !tipo_pqrs_id || !usuario_id || !estado_pqrs_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sqlQuery = `
      UPDATE pqrs 
      SET descripcion = ?, comentario_respuesta = ?, tipo_pqrs_id = ?, 
          usuario_id = ?, estado_pqrs_id = ?, updated_at = ? 
      WHERE id = ?
    `;

    const [result] = await connect.query(sqlQuery, [
      descripcion, comentario_respuesta, tipo_pqrs_id, usuario_id, estado_pqrs_id, updated_at, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "pqrs not found" });
    }

    res.status(200).json({
      data: {
        id,
        descripcion,
        comentario_respuesta,
        tipo_pqrs_id,
        usuario_id,
        estado_pqrs_id,
        updated_at
      },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating pqrs", details: error.message });
  }
};

// DELETE
export const deletePqrs = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM pqrs WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "pqrs not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting pqrs", details: error.message });
  }
};

export const showPqrsByUser = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const sqlQuery = `
      SELECT p.id, p.descripcion, p.comentario_respuesta, p.tipo_pqrs_id, 
             p.usuario_id, p.estado_pqrs_id, p.created_at, p.updated_at,
             t.nom AS tipo_pqrs, e.nom AS estado_pqrs
      FROM pqrs p
      INNER JOIN tipo_pqrs t ON p.tipo_pqrs_id = t.id
      INNER JOIN estado_pqrs e ON p.estado_pqrs_id = e.id
      WHERE p.usuario_id = ? 
      ORDER BY p.created_at DESC
    `;

    const [result] = await connect.query(sqlQuery, [usuario_id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "No hay PQRS registradas para este usuario" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pqrs by user", details: error.message });
  }
};