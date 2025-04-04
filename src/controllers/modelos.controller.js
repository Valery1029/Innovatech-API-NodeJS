import { connect } from '../config/db/connect.js';

// GET
export const showModelos = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM modelos";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching modelos", details: error.message });
  }
};

// GET ID
export const showModelosId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM modelos WHERE id = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Modelo not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching modelo", details: error.message });
  }
};

// POST
export const addModelos = async (req, res) => {
  try {
    const { Ruta, Descripción } = req.body;

    if (!Ruta) {
      return res.status(400).json({ error: "Missing required field: Ruta" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let sqlQuery = "INSERT INTO modelos (Ruta, Descripción, created_at) VALUES (?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [Ruta, Descripción || null, created_at]);

    res.status(201).json({
      data: { id: result.insertId, Ruta, Descripción, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding modelo", details: error.message });
  }
};

// PUT
export const updateModelos = async (req, res) => {
  try {
    const { Ruta, Descripción } = req.body;

    if (!Ruta) {
      return res.status(400).json({ error: "Missing required field: Ruta" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let sqlQuery = "UPDATE modelos SET Ruta = ?, Descripción = ?, updated_at = ? WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [Ruta, Descripción || null, updated_at, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Modelo not found" });
    res.status(200).json({
      data: { Ruta, Descripción, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating modelo", details: error.message });
  }
};

// DELETE
export const deleteModelos = async (req, res) => {
  try {
    let sqlQuery = "DELETE FROM modelos WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Modelo not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting modelo", details: error.message });
  }
};
