import { connect } from '../config/db/connect.js';

// GET
export const showAlmacenamientos = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM almacenamiento");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching almacenamiento", details: error.message });
  }
};

// GET BY ID
export const showAlmacenamientoId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM almacenamiento WHERE id = ?", [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Almacenamiento not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching almacenamiento", details: error.message });
  }
};

// POST
export const addAlmacenamiento = async (req, res) => {
  try {
    const { num, unidadestandar } = req.body;

    if (!num || !unidadestandar) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const created_at = new Date();
    const sqlQuery = "INSERT INTO almacenamiento (num, unidadestandar, created_at) VALUES (?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [num, unidadestandar, created_at]);

    res.status(201).json({
      data: { id: result.insertId, num, unidadestandar, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding almacenamiento", details: error.message });
  }
};

// PUT
export const updateAlmacenamiento = async (req, res) => {
  try {
    const { num, unidadestandar } = req.body;

    if (!num || !unidadestandar) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updated_at = new Date();
    const sqlQuery = "UPDATE almacenamiento SET num = ?, unidadestandar = ?, updated_at = ? WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [num, unidadestandar, updated_at, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Almacenamiento not found" });

    res.status(200).json({
      data: { num, unidadestandar, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating almacenamiento", details: error.message });
  }
};

// DELETE
export const deleteAlmacenamiento = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM almacenamiento WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Almacenamiento not found" });

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting almacenamiento", details: error.message });
  }
};