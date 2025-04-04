import { connect } from '../config/db/connect.js';

// GET
export const showPermisos = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM permisos";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching permisos", details: error.message });
  }
};

// GET ID
export const showPermisosId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM permisos WHERE id = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Permiso not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching permiso", details: error.message });
  }
};

// POST
export const addPermisos = async (req, res) => {
  try {
    const { nombre, descripción } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "Missing required field: nombre" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = "INSERT INTO permisos (nombre, descripción, created_at) VALUES (?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [nombre, descripción, created_at]);

    res.status(201).json({
      data: { id: result.insertId, nombre, descripción, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding permiso", details: error.message });
  }
};

// PUT
export const updatePermisos = async (req, res) => {
  try {
    const { nombre, descripción } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "Missing required field: nombre" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = "UPDATE permisos SET nombre = ?, descripción = ?, updated_at = ? WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [nombre, descripción, updated_at, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Permiso not found" });

    res.status(200).json({
      data: { nombre, descripción, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating permiso", details: error.message });
  }
};

// DELETE
export const deletePermisos = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM permisos WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Permiso not found" });

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting permiso", details: error.message });
  }
};
