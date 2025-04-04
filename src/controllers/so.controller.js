import { connect } from '../config/db/connect.js';

// GET
export const showSistemaOperativo = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM sistema_operativo");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sistema operativo", details: error.message });
  }
};

// GET ID
export const showSistemaOperativoId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM sistema_operativo WHERE id = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Sistema operativo not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sistema operativo", details: error.message });
  }
};

// POST
export const addSistemaOperativo = async (req, res) => {
  try {
    const { nom, version } = req.body;

    if (!nom || !version) {
      return res.status(400).json({ error: "Missing required fields: nom, version" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = "INSERT INTO sistema_operativo (nom, version, created_at) VALUES (?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [nom, version, created_at]);

    res.status(201).json({
      data: { id: result.insertId, nom, version, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding sistema operativo", details: error.message });
  }
};

// PUT
export const updateSistemaOperativo = async (req, res) => {
  try {
    const { nom, version } = req.body;

    if (!nom || !version) {
      return res.status(400).json({ error: "Missing required fields: nom, version" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = "UPDATE sistema_operativo SET nom = ?, version = ?, updated_at = ? WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [nom, version, updated_at, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Sistema operativo not found" });
    res.status(200).json({
      data: { nom, version, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating sistema operativo", details: error.message });
  }
};

// DELETE
export const deleteSistemaOperativo = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM sistema_operativo WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Sistema operativo not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting sistema operativo", details: error.message });
  }
};
