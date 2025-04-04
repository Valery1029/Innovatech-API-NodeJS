import { connect } from '../config/db/connect.js';

// GET
export const showRoles = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM rol";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching roles", details: error.message });
  }
};

// GET BY ID
export const showRolId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM rol WHERE id = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Rol not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching rol", details: error.message });
  }
};

// POST
export const addRol = async (req, res) => {
  try {
    const { nom, descripcion } = req.body;

    if (!nom || !descripcion) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }
    let sqlQuery = "INSERT INTO rol (nom, descripcion) VALUES (?, ?)";
    const [result] = await connect.query(sqlQuery, [nom, descripcion]);
    res.status(201).json({
      data: { id: result.insertId, nom, descripcion },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding rol", details: error.message });
  }
};

// PUT
export const updateRol = async (req, res) => {
  try {
    const { nom, descripcion } = req.body;

    if (!nom || !descripcion) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }

    let sqlQuery = "UPDATE rol SET nom = ?, descripcion = ?, updated_at = ? WHERE id = ?";
    const updated_at = new Date().toLocaleString("en-CA", { timeZone: "America/Bogota" }).replace(",", "").replace("/", "-").replace("/", "-");
    const [result] = await connect.query(sqlQuery, [nom, descripcion, updated_at, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Rol not found" });
    res.status(200).json({
      data: { nom, descripcion, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating rol", details: error.message });
  }
};

// DELETE
export const deleteRol = async (req, res) => {
  try {
    let sqlQuery = "DELETE FROM rol WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Rol not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting rol", details: error.message });
  }
};
