import { connect } from '../config/db/connect.js';

// GET
export const showSalidaProducto = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM salida_producto";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching salida_producto", details: error.message });
  }
};

// GET ID
export const showSalidaProductoId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM salida_producto WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "salida_producto not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching salida_producto", details: error.message });
  }
};

// POST
export const addSalidaProducto = async (req, res) => {
  try {
    const { Fecha, Cantidad, Precio, facturaid, Productosid } = req.body;

    if (!Fecha || !Cantidad || !Precio || !facturaid || !Productosid) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `INSERT INTO salida_producto (Fecha, Cantidad, Precio, facturaid, Productosid, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await connect.query(sqlQuery, [
      Fecha, Cantidad, Precio, facturaid, Productosid, created_at
    ]);

    res.status(201).json({
      data: { id: result.insertId, Fecha, Cantidad, Precio, facturaid, Productosid, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding salida_producto", details: error.message });
  }
};

// PUT
export const updateSalidaProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { Fecha, Cantidad, Precio, facturaid, Productosid } = req.body;

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `UPDATE salida_producto SET Fecha=?, Cantidad=?, Precio=?, facturaid=?, Productosid=?, updated_at=? WHERE id=?`;

    const [result] = await connect.query(sqlQuery, [
      Fecha, Cantidad, Precio, facturaid, Productosid, updated_at, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "salida_producto not found" });
    }

    res.status(200).json({
      data: { id, ...req.body },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating salida_producto", details: error.message });
  }
};

// DELETE
export const deleteSalidaProducto = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM salida_producto WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "salida_producto not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting salida_producto", details: error.message });
  }
};
