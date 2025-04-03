import { connect } from '../../db/connect.js';

// GET
export const showDepartamentos = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM departamento";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching departamentos", details: error.message });
  }
};

// GET BY ID
export const showDepartamentoId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM departamento WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Departamento not found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching departamento", details: error.message });
  }
};

// POST
export const addDepartamento = async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }

    const sqlQuery = "INSERT INTO departamento (nom) VALUES (?)";
    const [result] = await connect.query(sqlQuery, [nom]);

    res.status(201).json({
      data: { id: result.insertId, nom },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding departamento", details: error.message });
  }
};

// PUT
export const updateDepartamento = async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) {
      return res.status(400).json({ error: "Missing required field: nom" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    const sqlQuery = "UPDATE departamento SET nom = ?, updated_at = ? WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [nom, updated_at, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Departamento not found" });
    }

    res.status(200).json({
      data: { id: req.params.id, nom, updated_at },
      status: 200
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating departamento", details: error.message });
  }
};

// DELETE
export const deleteDepartamento = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM departamento WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Departamento not found" });
    }

    res.status(200).json({
      message: "Departamento deleted successfully",
      status: 200
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting departamento", details: error.message });
  }
};
