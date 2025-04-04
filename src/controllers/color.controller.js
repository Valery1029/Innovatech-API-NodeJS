import { connect } from '../config/db/connect.js';

// GET
export const showColors = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM color";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching colors", details: error.message });
  }
};

// GET ID
export const showColorId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM color WHERE id_color = ?", [req.params.id]);
    
    if (result.length === 0) return res.status(404).json({ error: "Color not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching color", details: error.message });
  }
};

// POST
export const addColor = async (req, res) => {
  try {
    const { nom } = req.body;
    
    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }
    
    let sqlQuery = "INSERT INTO color (nom, created_at) VALUES (?, ?)";
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(sqlQuery, [nom, created_at]);
    
    res.status(201).json({
      data: { id_color: result.insertId, nom, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding color", details: error.message });
  }
};

// PUT
export const updateColor = async (req, res) => {
  try {
    const { nom } = req.body;
    
    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }
    
    let sqlQuery = "UPDATE color SET nom = ?, updated_at = ? WHERE id_color = ?";
    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(sqlQuery, [nom, updated_at, req.params.id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ error: "Color not found" });
    res.status(200).json({
      data: { nom, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating color", details: error.message });
  }
};

// DELETE
export const deleteColor = async (req, res) => {
  try {
    let sqlQuery = "DELETE FROM color WHERE id_color = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ error: "Color not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting color", details: error.message });
  }
};