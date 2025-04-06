import { connect } from '../config/db/connect.js';

// GET: Obtener todos los registros
export const showProductosPedido = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM productos_pedido";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching productos_pedido", details: error.message });
  }
};

// GET: Obtener por ID de pedido
export const showProductosPedidoId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM productos_pedido WHERE pedido_id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.pedido_id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "productos_pedido not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching productos_pedido by pedido_id", details: error.message });
  }
};

// POST: Crear nuevo registro
export const addProductosPedido = async (req, res) => {
  try {
    const { producto_id, pedido_id } = req.body;

    if (!producto_id || !pedido_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `INSERT INTO productos_pedido (producto_id, pedido_id, created_at) VALUES (?, ?, ?)`;

    const [result] = await connect.query(sqlQuery, [producto_id, pedido_id, created_at]);

    res.status(201).json({
      data: { id: result.insertId, producto_id, pedido_id, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding productos_pedido", details: error.message });
  }
};

// PUT: Actualizar registro (solo marca update_at por ahora)
export const updateProductosPedido = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing ID field" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `UPDATE productos_pedido SET updated_at = ? WHERE id = ?`;

    const [result] = await connect.query(sqlQuery, [updated_at, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "productos_pedido not found" });
    }

    res.status(200).json({
      data: { id, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating productos_pedido", details: error.message });
  }
};

// DELETE: Eliminar por ID
export const deleteProductosPedido = async (req, res) => {
  try {
    const { id } = req.params;

    const sqlQuery = "DELETE FROM productos_pedido WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "productos_pedido not found" });
    }

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting productos_pedido", details: error.message });
  }
};
