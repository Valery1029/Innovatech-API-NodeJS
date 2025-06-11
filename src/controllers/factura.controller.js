import { connect } from '../config/db/connect.js';

// GET ALL
export const showFactura = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM factura";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching factura", details: error.message });
  }
};

// GET BY ID
export const showFacturaId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM factura WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Factura not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching factura by ID", details: error.message });
  }
};

// POST
export const addFactura = async (req, res) => {
  try {
    const { valortl, metodopago, estado_factura_id, Pedidoid } = req.body;

    if (!valortl || !metodopago || !estado_factura_id || !Pedidoid) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const created_at = fecha;

    const sqlQuery = `INSERT INTO factura (fecha, valortl, metodopago, estado_factura_id, Pedidoid, created_at) VALUES (?, ?, ?, ?, ?, ?)`;

    const [result] = await connect.query(sqlQuery, [
      fecha, valortl, metodopago, estado_factura_id, Pedidoid, created_at
    ]);

    res.status(201).json({
      data: { id: result.insertId, valortl, metodopago, estado_factura_id, Pedidoid, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding factura", details: error.message });
  }
};

// PUT
export const updateFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const { valortl, metodopago, estado_factura_id, Pedidoid } = req.body;

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const fecha = updated_at;
    const sqlQuery = `UPDATE factura SET fecha=?, valortl=?, metodopago=?, estado_factura_id=?, Pedidoid=?, updated_at=? WHERE id=?`;

    const [result] = await connect.query(sqlQuery, [
      fecha, valortl, metodopago, estado_factura_id, Pedidoid, updated_at, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Factura not found" });
    }

    res.status(200).json({
      data: { id, ...req.body },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating factura", details: error.message });
  }
};

// DELETE
export const deleteFactura = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM factura WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Factura not found" });

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting factura", details: error.message });
  }
};