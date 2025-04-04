import { connect } from '../config/db/connect.js';

// GET
export const showFacturaEnvio = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM factura_envio";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching factura_envio", details: error.message });
  }
};

// GET ID
export const showFacturaEnvioId = async (req, res) => {
  try {
    const { FacturaId_Factura, EnvioId_Envio } = req.params;
    const sqlQuery = "SELECT * FROM factura_envio WHERE FacturaId_Factura = ? AND EnvioId_Envio = ?";
    const [result] = await connect.query(sqlQuery, [FacturaId_Factura, EnvioId_Envio]);

    if (result.length === 0) return res.status(404).json({ error: "factura_envio not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching factura_envio", details: error.message });
  }
};

// POST
export const addFacturaEnvio = async (req, res) => {
  try {
    const { FacturaId_Factura, EnvioId_Envio } = req.body;

    if (!FacturaId_Factura || !EnvioId_Envio) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `INSERT INTO factura_envio (FacturaId_Factura, EnvioId_Envio, created_at) VALUES (?, ?, ?)`;
    const [result] = await connect.query(sqlQuery, [FacturaId_Factura, EnvioId_Envio, created_at]);

    res.status(201).json({
      data: { FacturaId_Factura, EnvioId_Envio, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding factura_envio", details: error.message });
  }
};

// PUT
export const updateFacturaEnvio = async (req, res) => {
  try {
    const { FacturaId_Factura, EnvioId_Envio, newFacturaId_Factura, newEnvioId_Envio } = req.body;

    if (!FacturaId_Factura || !EnvioId_Envio || !newFacturaId_Factura || !newEnvioId_Envio) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `UPDATE factura_envio SET FacturaId_Factura = ?, EnvioId_Envio = ?, updated_at = ? WHERE FacturaId_Factura = ? AND EnvioId_Envio = ?`;
    const [result] = await connect.query(sqlQuery, [newFacturaId_Factura, newEnvioId_Envio, updated_at, FacturaId_Factura, EnvioId_Envio]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "factura_envio not found" });
    res.status(200).json({
      data: { newFacturaId_Factura, newEnvioId_Envio, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating factura_envio", details: error.message });
  }
};

// DELETE
export const deleteFacturaEnvio = async (req, res) => {
  try {
    const { FacturaId_Factura, EnvioId_Envio } = req.params;
    const sqlQuery = "DELETE FROM factura_envio WHERE FacturaId_Factura = ? AND EnvioId_Envio = ?";
    const [result] = await connect.query(sqlQuery, [FacturaId_Factura, EnvioId_Envio]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "factura_envio not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting factura_envio", details: error.message });
  }
};

