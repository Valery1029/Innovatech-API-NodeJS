import { connect } from '../config/db/connect.js';

// GET
export const showResolucion = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM resolucion";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching resoluciones", details: error.message });
  }
};

// GET ID
export const showResolucionId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM resolucion WHERE id = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Resolución not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching resolución", details: error.message });
  }
};

// POST
export const addResolucion = async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }

    let sqlQuery = "INSERT INTO resolucion (nom, created_at) VALUES (?, ?)";
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(sqlQuery, [nom, created_at]);

    res.status(201).json({
      data: { id: result.insertId, nom, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding resolución", details: error.message });
  }
};

// PUT
export const updateResolucion = async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }

    let sqlQuery = "UPDATE resolucion SET nom = ?, updated_at = ? WHERE id = ?";
    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(sqlQuery, [nom, updated_at, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Resolución not found" });
    res.status(200).json({
      data: { nom, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating resolución", details: error.message });
  }
};

// DELETE
export const deleteResolucion = async (req, res) => {
  try {
    let sqlQuery = "DELETE FROM resolucion WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Resolución not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting resolución", details: error.message });
  }
};
