import { connect } from '../config/db/connect.js';

// GET ALL
export const showFacturaEnvio = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM factura_envio";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching factura_envio", details: error.message });
  }
};

// GET BY ID
export const showFacturaEnvioId = async (req, res) => {
  try {
    const { id } = req.params;
    const sqlQuery = "SELECT * FROM factura_envio WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [id]);

    if (result.length === 0) return res.status(404).json({ error: "factura_envio not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching factura_envio", details: error.message });
  }
};

// POST
export const addFacturaEnvio = async (req, res) => {
  try {
    const { factura_id, envio_id } = req.body;

    if (!factura_id || !envio_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `INSERT INTO factura_envio (factura_id, envio_id, created_at) VALUES (?, ?, ?)`;
    const [result] = await connect.query(sqlQuery, [factura_id, envio_id, created_at]);

    res.status(201).json({
      data: { id: result.insertId, factura_id, envio_id, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding factura_envio", details: error.message });
  }
};

// PUT
export const updateFacturaEnvio = async (req, res) => {
  try {
    const { id } = req.params;
    const { factura_id, envio_id } = req.body;

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `UPDATE factura_envio SET factura_id=?, envio_id=?, updated_at=? WHERE id=?`;

    const [result] = await connect.query(sqlQuery, [
      factura_id, envio_id, updated_at, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "factura_envio not found" });
    }

    res.status(200).json({
      data: { id, ...req.body },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating factura_envio", details: error.message });
  }
};

// DELETE
export const deleteFacturaEnvio = async (req, res) => {
  try {
    const { id } = req.params;
    const sqlQuery = "DELETE FROM factura_envio WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "factura_envio not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting factura_envio", details: error.message });
  }
};
