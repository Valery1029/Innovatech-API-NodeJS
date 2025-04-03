import { connect } from '../../db/connect.js';

// GET
export const showApiUser = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM api_users";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching api user", details: error.message });
  }
};

// GET BY ID
export const showApiUserId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM api_users WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Api user not found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching api user", details: error.message });
  }
};

// POST
export const addApiUser = async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }

    const sqlQuery = "INSERT INTO api_users (nom) VALUES (?)";
    const [result] = await connect.query(sqlQuery, [nom]);

    res.status(201).json({
      data: { id: result.insertId, nom },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding api user", details: error.message });
  }
};

// PUT
export const updateApiUser = async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    const sqlQuery = "UPDATE api_users SET nom = ?, updated_at = ? WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [nom, updated_at, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Api user not found" });
    }

    res.status(200).json({
      data: { id: req.params.id, nom, updated_at },
      status: 200
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating api user", details: error.message });
  }
};

// DELETE
export const deleteApiUser = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM api_users WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Api user not found" });
    }

    res.status(200).json({
      message: "Api user deleted successfully",
      status: 200
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting api user", details: error.message });
  }
};
