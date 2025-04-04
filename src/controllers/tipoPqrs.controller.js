import { connect } from '../config/db/connect.js';

// GET
export const showTipoPqrs = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM tipo_pqrs");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tipos pqrs", details: error.message });
  }
};

// GET ID
export const showTipoPqrsId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM tipo_pqrs WHERE id = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Tipo PQRS not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tipo pqrs", details: error.message });
  }
};

// POST
export const addTipoPqrs = async (req, res) => {
  try {
    const { nom, descripcion } = req.body;

    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = "INSERT INTO tipo_pqrs (nom, descripcion, created_at) VALUES (?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [nom, descripcion, created_at]);

    res.status(201).json({
      data: { id: result.insertId, nom, descripcion, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding tipo pqrs", details: error.message });
  }
};

// PUT
export const updateTipoPqrs = async (req, res) => {
  try {
    const { nom, descripcion } = req.body;

    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = "UPDATE tipo_pqrs SET nom = ?, descripcion = ?, updated_at = ? WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [nom, descripcion, updated_at, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Tipo PQRS not found" });
    res.status(200).json({
      data: { nom, descripcion, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating tipo pqrs", details: error.message });
  }
};

// DELETE
export const deleteTipoPqrs = async (req, res) => {
  try {
    const [result] = await connect.query("DELETE FROM tipo_pqrs WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Tipo PQRS not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting tipo pqrs", details: error.message });
  }
};
