import { connect } from '../config/db/connect.js';

// GET
export const showCiudades = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM ciudad";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching ciudades", details: error.message });
  }
};

// GET BY ID
export const showCiudadId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM ciudad WHERE id = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Ciudad not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching ciudad", details: error.message });
  }
};

// POST
export const addCiudad = async (req, res) => {
  try {
    const { nom, departamentoid } = req.body;

    if (!nom || !departamentoid) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let sqlQuery = "INSERT INTO ciudad (nom, departamentoid) VALUES (?, ?)";
    const [result] = await connect.query(sqlQuery, [nom, departamentoid]);
    res.status(201).json({
      data: { id: result.insertId, nom, departamentoid },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding ciudad", details: error.message });
  }
};

// PUT
export const updateCiudad = async (req, res) => {
  try {
    const { nom, departamentoid } = req.body;

    if (!nom || !departamentoid) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let sqlQuery = "UPDATE ciudad SET nom = ?, departamentoid = ?, updated_at = ? WHERE id = ?";
    const updated_at = new Date().toLocaleString("en-CA", { timeZone: "America/Bogota" }).replace(",", "").replace("/", "-").replace("/", "-");
    const [result] = await connect.query(sqlQuery, [nom, departamentoid, updated_at, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Ciudad not found" });
    res.status(200).json({
      data: { nom, departamentoid, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating ciudad", details: error.message });
  }
};

// DELETE
export const deleteCiudad = async (req, res) => {
  try {
    let sqlQuery = "DELETE FROM ciudad WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Ciudad not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting ciudad", details: error.message });
  }
};
