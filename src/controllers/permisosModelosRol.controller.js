import { connect } from '../config/db/connect.js';

// GET
export const showPermisosModelosRol = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM permisos_modelos_rol";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching permisos_modelos_rol", details: error.message });
  }
};

// GET ID
export const showPermisosModelosRolId = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM permisos_modelos_rol WHERE id = ?`;
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "permisos_modelos_rol not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching permisos_modelos_rol", details: error.message });
  }
};

// POST
export const addPermisosModelosRol = async (req, res) => {
  try {
    const { Permisosid, ModelosRolId } = req.body;

    if (!Permisosid || !ModelosRolId) {
      return res.status(400).json({ error: "Missing required fields: Permisosid, ModelosRolId" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `INSERT INTO permisos_modelos_rol (Permisosid, ModelosRolId, created_at) VALUES (?, ?, ?)`;
    const [result] = await connect.query(sqlQuery, [Permisosid, ModelosRolId, created_at]);

    res.status(201).json({
      data: { id: result.insertId, Permisosid, ModelosRolId, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding permisos_modelos_rol", details: error.message });
  }
};

// PUT
export const updatePermisosModelosRol = async (req, res) => {
  try {
    const { Permisosid, ModelosRolId } = req.body;

    if (!Permisosid || !ModelosRolId) {
      return res.status(400).json({ error: "Missing required fields: Permisosid, ModelosRolId" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `UPDATE permisos_modelos_rol SET Permisosid = ?, ModelosRolId = ?, updated_at = ? WHERE id = ?`;
    const [result] = await connect.query(sqlQuery, [Permisosid, ModelosRolId, updated_at, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "permisos_modelos_rol not found" });

    res.status(200).json({
      data: { id: req.params.id, Permisosid, ModelosRolId, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating permisos_modelos_rol", details: error.message });
  }
};

// DELETE
export const deletePermisosModelosRol = async (req, res) => {
  try {
    const sqlQuery = `DELETE FROM permisos_modelos_rol WHERE id = ?`;
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "permisos_modelos_rol not found" });

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting permisos_modelos_rol", details: error.message });
  }
};
