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
    const { id, nom, departamentoid, code } = req.body;

    if (!id || !nom || !departamentoid || !code) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "INSERT INTO ciudad (id, name, department, code) VALUES (?, ?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [id, nom, departamentoid, code]);

    res.status(201).json({
      data: { id, nom, departamentoid, code },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding ciudad", details: error.message });
  }
};

// PUT
export const updateCiudad = async (req, res) => {
  try {
    const { id, nom, departamentoid, code } = req.body;

    if (!id || !nom || !departamentoid || !code) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fecha con formato compatible con MySQL
    const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");

    const sqlQuery = `
      UPDATE ciudad 
      SET name = ?, department = ?, code = ?, updated_at = ? 
      WHERE id = ?
    `;

    const [result] = await connect.query(sqlQuery, [nom, departamentoid, code, updated_at, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ciudad not found" });
    }

    res.status(200).json({
      data: { id, nom, departamentoid, code, updated_at },
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
