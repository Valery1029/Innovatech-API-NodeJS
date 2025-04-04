import { connect } from '../config/db/connect.js';

// GET
export const showProductosPedido = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM productos_pedido";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching productos_pedido", details: error.message });
  }
};

// GET por ID de pedido
export const showProductosPedidoId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM productos_pedido WHERE PedidoId_Pedido = ?";
    const [result] = await connect.query(sqlQuery, [req.params.PedidoId_Pedido]);

    if (result.length === 0) return res.status(404).json({ error: "productos_pedido not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching productos_pedido by ID", details: error.message });
  }
};

// POST
export const addProductosPedido = async (req, res) => {
  try {
    const { ProductosId_Producto, PedidoId_Pedido } = req.body;

    if (!ProductosId_Producto || !PedidoId_Pedido) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `INSERT INTO productos_pedido (ProductosId_Producto, PedidoId_Pedido, created_at) VALUES (?, ?, ?)`;

    const [result] = await connect.query(sqlQuery, [ProductosId_Producto, PedidoId_Pedido, created_at]);

    res.status(201).json({
      data: { id: result.insertId, ProductosId_Producto, PedidoId_Pedido, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding productos_pedido", details: error.message });
  }
};

// PUT
export const updateProductosPedido = async (req, res) => {
  try {
    const { ProductosId_Producto, PedidoId_Pedido } = req.body;

    if (!ProductosId_Producto || !PedidoId_Pedido) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `UPDATE productos_pedido SET updated_at = ? WHERE ProductosId_Producto = ? AND PedidoId_Pedido = ?`;

    const [result] = await connect.query(sqlQuery, [updated_at, ProductosId_Producto, PedidoId_Pedido]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "productos_pedido not found" });

    res.status(200).json({
      data: { ProductosId_Producto, PedidoId_Pedido, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating productos_pedido", details: error.message });
  }
};

// DELETE
export const deleteProductosPedido = async (req, res) => {
  try {
    const { ProductosId_Producto, PedidoId_Pedido } = req.params;

    const sqlQuery = "DELETE FROM productos_pedido WHERE ProductosId_Producto = ? AND PedidoId_Pedido = ?";
    const [result] = await connect.query(sqlQuery, [ProductosId_Producto, PedidoId_Pedido]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "productos_pedido not found" });

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting productos_pedido", details: error.message });
  }
};
