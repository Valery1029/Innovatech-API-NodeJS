import { connect } from '../config/db/connect.js';

// GET
export const showDepartamentos = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM departamento";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching departamentos", details: error.message });
  }
};

// GET BY ID
export const showDepartamentoId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM departamento WHERE id = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Departamento not found" });
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
    let sqlQuery = "INSERT INTO departamento (nom) VALUES (?)";
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

    let sqlQuery = "UPDATE departamento SET nom = ?, updated_at = ? WHERE id = ?";
    const updated_at = new Date().toLocaleString("en-CA", { timeZone: "America/Bogota" }).replace(",", "").replace("/", "-").replace("/", "-");
    const [result] = await connect.query(sqlQuery, [nom, updated_at, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Departamento not found" });
    res.status(200).json({
      data: { nom, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating departamento", details: error.message });
  }
};

// DELETE
export const deleteDepartamento = async (req, res) => {
  try {
    let sqlQuery = "DELETE FROM departamento WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Departamento not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting departamento", details: error.message });
  }
};