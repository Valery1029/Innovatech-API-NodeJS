import { connect } from '../config/db/connect.js';

// GET
export const showGarantia = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM garantia";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching garantias", details: error.message });
  }
};

// GET ID
export const showGarantiaId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM garantia WHERE id = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Garantia not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching garantia", details: error.message });
  }
};

// POST
export const addGarantia = async (req, res) => {
  try {
    const { numero_mes_año, mes_año } = req.body;

    if (numero_mes_año == null || mes_año == null) {
      return res.status(400).json({ error: "Missing required fields: numero_mes_año, mes_año" });
    }

    let sqlQuery = "INSERT INTO garantia (numero_mes_año, mes_año, created_at) VALUES (?, ?, ?)";
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(sqlQuery, [numero_mes_año, mes_año, created_at]);

    res.status(201).json({
      data: { id: result.insertId, numero_mes_año, mes_año, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding garantia", details: error.message });
  }
};

// PUT
export const updateGarantia = async (req, res) => {
  try {
    const { numero_mes_año, mes_año } = req.body;

    if (numero_mes_año == null || mes_año == null) {
      return res.status(400).json({ error: "Missing required fields: numero_mes_año, mes_año" });
    }

    let sqlQuery = "UPDATE garantia SET numero_mes_año = ?, mes_año = ?, updated_at = ? WHERE id = ?";
    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(sqlQuery, [numero_mes_año, mes_año, updated_at, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Garantia not found" });
    res.status(200).json({
      data: { numero_mes_año, mes_año, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating garantia", details: error.message });
  }
};

// DELETE
export const deleteGarantia = async (req, res) => {
  try {
    let sqlQuery = "DELETE FROM garantia WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Garantia not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting garantia", details: error.message });
  }
};
