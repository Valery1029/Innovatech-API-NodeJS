import { connect } from '../config/db/connect.js';

// GET
export const showPedido = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM pedido";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pedido", details: error.message });
  }
};

// GET ID
export const showPedidoId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM pedido WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "pedido not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pedido", details: error.message });
  }
};

// POST
export const addPedido = async (req, res) => {
  try {
    const { valortl, UsuarioId_usuario } = req.body;

    if (!valortl || !UsuarioId_usuario) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const created_at = fecha;
    const sqlQuery = `INSERT INTO pedido (valortl, UsuarioId_usuario, fecha, created_at) VALUES (?, ?, ?, ?)`;
    const [result] = await connect.query(sqlQuery, [valortl, UsuarioId_usuario, fecha, created_at]);

    res.status(201).json({
      data: { id: result.insertId, valortl, UsuarioId_usuario, fecha, created_at },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding pedido", details: error.message });
  }
};

// PUT
export const updatePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { valortl, UsuarioId_usuario } = req.body;

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const fecha = updated_at;
    const sqlQuery = `UPDATE pedido SET valortl=?, UsuarioId_usuario=?, fecha=?, updated_at=? WHERE id=?`;

    const [result] = await connect.query(sqlQuery, [
      valortl, UsuarioId_usuario, fecha, updated_at, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "pedido not found" });
    }

    res.status(200).json({
      data: { id, ...req.body },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating pedido", details: error.message });
  }
};

// DELETE
export const deletePedido = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM pedido WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "pedido not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting pedido", details: error.message });
  }
};
