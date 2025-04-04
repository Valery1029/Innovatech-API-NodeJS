import { connect } from '../config/db/connect.js';

// GET
export const showModelosRol = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM modelos_rol";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching modelos_rol", details: error.message });
  }
};

// GET ID
export const showModelosRolId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM modelos_rol WHERE Modelosid = ? AND Rolid = ?";
    const [result] = await connect.query(sqlQuery, [req.params.Modelosid, req.params.Rolid]);

    if (result.length === 0) return res.status(404).json({ error: "modelos_rol not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching modelos_rol", details: error.message });
  }
};

// POST
export const addModelosRol = async (req, res) => {
  try {
    const { Modelosid, Rolid } = req.body;

    if (!Modelosid || !Rolid) {
      return res.status(400).json({ error: "Missing required fields: Modelosid, Rolid" });
    }

    const sqlQuery = "INSERT INTO modelos_rol (Modelosid, Rolid, created_at) VALUES (?, ?, ?)";
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(sqlQuery, [Modelosid, Rolid, created_at]);

    res.status(201).json({
      data: { Modelosid, Rolid, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding modelos_rol", details: error.message });
  }
};

// PUT
export const updateModelosRol = async (req, res) => {
  try {
    const { Modelosid, Rolid } = req.body;

    if (!Modelosid || !Rolid) {
      return res.status(400).json({ error: "Missing required fields: Modelosid, Rolid" });
    }

    const sqlQuery = "UPDATE modelos_rol SET updated_at = ? WHERE Modelosid = ? AND Rolid = ?";
    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(sqlQuery, [updated_at, Modelosid, Rolid]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "modelos_rol not found" });
    res.status(200).json({
      data: { Modelosid, Rolid, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating modelos_rol", details: error.message });
  }
};

// DELETE
export const deleteModelosRol = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM modelos_rol WHERE Modelosid = ? AND Rolid = ?";
    const [result] = await connect.query(sqlQuery, [req.params.Modelosid, req.params.Rolid]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "modelos_rol not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting modelos_rol", details: error.message });
  }
};
