import { connect } from '../config/db/connect.js';

// GET
export const showTiposDocumento = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM tipo_documento";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tipos de documento", details: error.message });
  }
};

// GET BY ID
export const showTipoDocumentoId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM tipo_documento WHERE id = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Tipo de documento not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tipo de documento", details: error.message });
  }
};

// POST
export const addTipoDocumento = async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }
    let sqlQuery = "INSERT INTO tipo_documento (nom) VALUES (?)";
    const [result] = await connect.query(sqlQuery, [nom]);
    res.status(201).json({
      data: { id: result.insertId, nom },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding tipo de documento", details: error.message });
  }
};

// PUT
export const updateTipoDocumento = async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }

    let sqlQuery = "UPDATE tipo_documento SET nom = ?, updated_at = ? WHERE id = ?";
    const updated_at = new Date().toLocaleString("en-CA", { timeZone: "America/Bogota" }).replace(",", "").replace("/", "-").replace("/", "-");
    const [result] = await connect.query(sqlQuery, [nom, updated_at, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Tipo de documento not found" });
    res.status(200).json({
      data: { nom, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating tipo de documento", details: error.message });
  }
};

// DELETE
export const deleteTipoDocumento = async (req, res) => {
  try {
    let sqlQuery = "DELETE FROM tipo_documento WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Tipo de documento not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting tipo de documento", details: error.message });
  }
};
