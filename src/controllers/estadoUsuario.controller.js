import { connect } from '../config/db/connect.js';

// GET
export const showEstadosUsuario = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM estado_usuario";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching estados de usuario", details: error.message });
  }
};

// GET BY ID
export const showEstadoUsuarioId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM estado_usuario WHERE id = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Estado de usuario not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching estado de usuario", details: error.message });
  }
};

// POST
export const addEstadoUsuario = async (req, res) => {
  try {
    const { nom, descripcion } = req.body;

    if (!nom || !descripcion) {
      return res.status(400).json({ error: "Missing required field: Nombre" });
    }
    let sqlQuery = "INSERT INTO estado_usuario (Nombre, Descripción) VALUES (?, ?)";
    const [result] = await connect.query(sqlQuery, [nom, descripcion]);
    res.status(201).json({
      data: { id: result.insertId, nom, descripcion },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding estado de usuario", details: error.message });
  }
};

// PUT
export const updateEstadoUsuario = async (req, res) => {
  try {
    const { nom, descripcion } = req.body;

    if (!nom || !descripcion) {
      return res.status(400).json({ error: "Missing required field: Nombre" });
    }
    const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");

    let sqlQuery = "UPDATE estado_usuario SET Nombre = ?, Descripción = ?, updated_at = ? WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [nom, descripcion, updated_at, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Estado de usuario not found" });
    }

    res.status(200).json({
      data: { nom, descripcion, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating estado de usuario", details: error.message });
  }
};

// DELETE
export const deleteEstadoUsuario = async (req, res) => {
  try {
    let sqlQuery = "DELETE FROM estado_usuario WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Estado de usuario not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting estado de usuario", details: error.message });
  }
};
