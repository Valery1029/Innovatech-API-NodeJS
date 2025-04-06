import { connect } from "../config/db/connect.js";

// GET all
export const showProductosIngresoProducto = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM productos_ingreso_producto";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching productos_ingreso_producto", details: error.message });
  }
};

// GET by ingreso_producto_id
export const showProductosIngresoProductoIngresoId = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM productos_ingreso_producto WHERE ingreso_producto_id = ?`;
    const [result] = await connect.query(sqlQuery, [req.params.ingreso_producto_id]);

    if (result.length === 0) return res.status(404).json({ error: "No entries found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching productos_ingreso_producto", details: error.message });
  }
};

// POST
export const addProductosIngresoProducto = async (req, res) => {
  try {
    const { producto_id, ingreso_producto_id, cantidad } = req.body;

    if (!producto_id || !ingreso_producto_id || !cantidad) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    const sqlQuery = `INSERT INTO productos_ingreso_producto (producto_id, ingreso_producto_id, cantidad, created_at) VALUES (?, ?, ?, ?)`;

    const [result] = await connect.query(sqlQuery, [
      producto_id,
      ingreso_producto_id,
      cantidad,
      created_at
    ]);

    res.status(201).json({
      data: {
        id: result.insertId,
        producto_id,
        ingreso_producto_id,
        cantidad,
        created_at
      },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding productos_ingreso_producto", details: error.message });
  }
};

// PUT
export const updateProductosIngresoProducto = async (req, res) => {
  try {
    const { id, cantidad } = req.body;

    if (!id || !cantidad) {
      return res.status(400).json({ error: "Missing required fields: id, cantidad" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    const sqlQuery = `UPDATE productos_ingreso_producto SET cantidad = ?, updated_at = ? WHERE id = ?`;

    const [result] = await connect.query(sqlQuery, [
      cantidad,
      updated_at,
      id
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Entry not found" });

    res.status(200).json({
      data: {
        id,
        cantidad,
        updated_at
      },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating productos_ingreso_producto", details: error.message });
  }
};

// DELETE
export const deleteProductosIngresoProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const sqlQuery = `DELETE FROM productos_ingreso_producto WHERE id = ?`;
    const [result] = await connect.query(sqlQuery, [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Entry not found" });

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting productos_ingreso_producto", details: error.message });
  }
};