import { connect } from "../config/db/connect.js";

// GET
export const showProductosIngresoProducto = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM productos_ingreso_producto";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching productos_ingreso_producto", details: error.message });
  }
};

// GET by Ingreso_productoid_ingreso
export const showProductosIngresoProductoId = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM productos_ingreso_producto WHERE Ingreso_productoid_ingreso = ?`;
    const [result] = await connect.query(sqlQuery, [req.params.Ingreso_productoid_ingreso]);

    if (result.length === 0) return res.status(404).json({ error: "No entries found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching productos_ingreso_producto", details: error.message });
  }
};

// POST
export const addProductosIngresoProducto = async (req, res) => {
  try {
    const { ProductosId_Producto, Ingreso_productoid_ingreso, cantidad } = req.body;

    if (!ProductosId_Producto || !Ingreso_productoid_ingreso || !cantidad) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    const sqlQuery = `INSERT INTO productos_ingreso_producto (ProductosId_Producto, Ingreso_productoid_ingreso, cantidad, created_at) VALUES (?, ?, ?, ?)`;

    const [result] = await connect.query(sqlQuery, [
      ProductosId_Producto,
      Ingreso_productoid_ingreso,
      cantidad,
      created_at
    ]);

    res.status(201).json({
      data: {
        id: result.insertId,
        ProductosId_Producto,
        Ingreso_productoid_ingreso,
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
    const { ProductosId_Producto, Ingreso_productoid_ingreso, cantidad } = req.body;

    if (!ProductosId_Producto || !Ingreso_productoid_ingreso || !cantidad) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    const sqlQuery = `UPDATE productos_ingreso_producto SET cantidad = ?, updated_at = ? WHERE ProductosId_Producto = ? AND Ingreso_productoid_ingreso = ?`;

    const [result] = await connect.query(sqlQuery, [
      cantidad,
      updated_at,
      ProductosId_Producto,
      Ingreso_productoid_ingreso
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Entry not found" });

    res.status(200).json({
      data: {
        ProductosId_Producto,
        Ingreso_productoid_ingreso,
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
    const { ProductosId_Producto, Ingreso_productoid_ingreso } = req.params;

    const sqlQuery = `DELETE FROM productos_ingreso_producto WHERE ProductosId_Producto = ? AND Ingreso_productoid_ingreso = ?`;

    const [result] = await connect.query(sqlQuery, [
      ProductosId_Producto,
      Ingreso_productoid_ingreso
    ]);

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
