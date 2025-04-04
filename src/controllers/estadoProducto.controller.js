import { connect } from '../config/db/connect.js';

// GET
export const showEstadoProducto = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM estado_producto");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching estado_producto", details: error.message });
  }
};

// GET ID
export const showEstadoProductoId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM estado_producto WHERE id = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Estado producto not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching estado_producto", details: error.message });
  }
};

// POST
export const addEstadoProducto = async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(
      "INSERT INTO estado_producto (nom, created_at) VALUES (?, ?)",
      [nom, created_at]
    );

    res.status(201).json({
      data: { id: result.insertId, nom, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding estado_producto", details: error.message });
  }
};

// PUT
export const updateEstadoProducto = async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(
      "UPDATE estado_producto SET nom = ?, updated_at = ? WHERE id = ?",
      [nom, updated_at, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Estado producto not found" });

    res.status(200).json({
      data: { nom, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating estado_producto", details: error.message });
  }
};

// DELETE
export const deleteEstadoProducto = async (req, res) => {
  try {
    const [result] = await connect.query("DELETE FROM estado_producto WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Estado producto not found" });

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting estado_producto", details: error.message });
  }
};
