import { connect } from '../config/db/connect.js';

// GET
export const showIngresoProducto = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM ingreso_producto";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching ingreso_producto", details: error.message });
  }
};

// GET ID
export const showIngresoProductoId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM ingreso_producto WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "ingreso_producto not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching ingreso_producto", details: error.message });
  }
};

// POST
export const addIngresoProducto = async (req, res) => {
  try {
    const { factura, usuario_id } = req.body;

    if (!factura || !usuario_id) {
      return res.status(400).json({ error: "Missing required fields: factura, usuario_id" });
    }

    const sqlQuery = "INSERT INTO ingreso_producto (factura, usuario_id, created_at) VALUES (?, ?, ?)";
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(sqlQuery, [factura, usuario_id, created_at]);

    res.status(201).json({
      data: { id: result.insertId, factura, usuario_id, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding ingreso_producto", details: error.message });
  }
};

// PUT
export const updateIngresoProducto = async (req, res) => {
  try {
    const { id, factura, usuario_id } = req.body;

    if (!id || !factura || !usuario_id) {
      return res.status(400).json({ error: "Missing required fields: id, factura, usuario_id" });
    }

    const sqlQuery = "UPDATE ingreso_producto SET factura = ?, usuario_id = ?, updated_at = ? WHERE id = ?";
    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(sqlQuery, [factura, usuario_id, updated_at, id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "ingreso_producto not found" });
    res.status(200).json({
      data: { id, factura, usuario_id, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating ingreso_producto", details: error.message });
  }
};

// DELETE
export const deleteIngresoProducto = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM ingreso_producto WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "ingreso_producto not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting ingreso_producto", details: error.message });
  }
};
