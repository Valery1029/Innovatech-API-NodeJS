import { connect } from '../config/db/connect.js';

// GET
export const showEnvio = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM envio";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching envio", details: error.message });
  }
};

// GET ID
export const showEnvioId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM envio WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "envio not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching envio", details: error.message });
  }
};

// POST
export const addEnvio = async (req, res) => {
  try {
    const { direccion, estado_envio_id, usuario_id } = req.body;

    if (!direccion || !estado_envio_id || !usuario_id) {
      return res.status(400).json({ error: "Missing required fields: direccion, estado_envio_id, usuario_id" });
    }

    const sqlQuery = "INSERT INTO envio (direccion, estado_envio_id, usuario_id, created_at) VALUES (?, ?, ?, ?)";
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(sqlQuery, [direccion, estado_envio_id, usuario_id, created_at]);

    res.status(201).json({
      data: { id: result.insertId, direccion, estado_envio_id, usuario_id, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding envio", details: error.message });
  }
};

// PUT
export const updateEnvio = async (req, res) => {
  try {
    const { id } = req.params;
    const { direccion, estado_envio_id, usuario_id } = req.body;

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `
      UPDATE envio
      SET direccion = ?, estado_envio_id = ?, usuario_id = ?, updated_at = ?
      WHERE id = ?
    `;

    const [result] = await connect.query(sqlQuery, [
      direccion, estado_envio_id, usuario_id, updated_at, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "envio not found" });
    }

    res.status(200).json({
      data: { id, direccion, estado_envio_id, usuario_id, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating envio", details: error.message });
  }
};

// DELETE
export const deleteEnvio = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM envio WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "envio not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting envio", details: error.message });
  }
};
