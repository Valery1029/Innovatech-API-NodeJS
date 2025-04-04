import { connect } from '../config/db/connect.js';

// GET
export const showRam = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM almacenamiento_aleatorio";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching almacenamientos aleatorios", details: error.message });
  }
};

// GET ID
export const showRamId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM almacenamiento_aleatorio WHERE id = ?", [req.params.id]);
    
    if (result.length === 0) return res.status(404).json({ error: "Almacenamiento aleatorio not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching almacenamiento aleatorio", details: error.message });
  }
};

// POST
export const addRam = async (req, res) => {
  try {
    const { num, unidadestandar } = req.body;
    
    if (!num || !unidadestandar) {
      return res.status(400).json({ error: "Missing required fields: num, unidadestandar" });
    }
    
    let sqlQuery = "INSERT INTO almacenamiento_aleatorio (num, unidadestandar, created_at) VALUES (?, ?, ?)";
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(sqlQuery, [num, unidadestandar, created_at]);
    
    res.status(201).json({
      data: { id: result.insertId, num, unidadestandar, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding almacenamiento aleatorio", details: error.message });
  }
};

// PUT
export const updateRam = async (req, res) => {
  try {
    const { num, unidadestandar } = req.body;
    
    if (!num || !unidadestandar) {
      return res.status(400).json({ error: "Missing required fields: num, unidadestandar" });
    }
    
    let sqlQuery = "UPDATE almacenamiento_aleatorio SET num = ?, unidadestandar = ?, updated_at = ? WHERE id = ?";
    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await connect.query(sqlQuery, [num, unidadestandar, updated_at, req.params.id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ error: "Almacenamiento aleatorio not found" });
    res.status(200).json({
      data: { num, unidadestandar, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating almacenamiento aleatorio", details: error.message });
  }
};

// DELETE
export const deleteRam = async (req, res) => {
  try {
    let sqlQuery = "DELETE FROM almacenamiento_aleatorio WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ error: "Almacenamiento aleatorio not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting almacenamiento aleatorio", details: error.message });
  }
};
