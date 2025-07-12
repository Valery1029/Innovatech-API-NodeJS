import { connect } from '../config/db/connect.js';
import {encryptPassword} from '../library/appBcrypt.js';

// GET
export const showUsuarios = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM usuario";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching usuarios", details: error.message });
  }
};

// GET BY ID
export const showUsuarioId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM usuario WHERE id_usuario = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Usuario not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching usuario", details: error.message });
  }
};

// POST
export const addUsuario = async (req, res) => {
  try {
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, documento, correo, telefono1, telefono2, direccion, usuario, password, tipo_documento_id, ciudad_id, rol_id, estado_usuario_id } = req.body;
    if (!primer_nombre || !primer_apellido || !documento || !correo || !telefono1 || !direccion || !usuario || !password || !tipo_documento_id || !ciudad_id || !rol_id || !estado_usuario_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const hashedPassword = await encryptPassword(password);

    let sqlQuery = "INSERT INTO usuario (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, documento, correo, telefono1, telefono2, direccion, usuario, password, tipo_documento_id, ciudad_id, rol_id, estado_usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [
      primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, documento, correo, telefono1, telefono2, direccion, usuario, hashedPassword, tipo_documento_id, ciudad_id, rol_id, estado_usuario_id
    ]);
    res.status(201).json({
      data: { id_usuario: result.insertId, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, documento, correo, telefono1, telefono2, direccion, usuario, hashedPassword, tipo_documento_id, ciudad_id, rol_id, estado_usuario_id },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding usuario", details: error.message });
  }
};

// PUT
export const updateUsuario = async (req, res) => {
  try {
    const {
      primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
      documento, correo, telefono1, telefono2, direccion, usuario,
      tipo_documento_id, ciudad_id, rol_id, estado_usuario_id
    } = req.body;

    if (
      !primer_nombre || !primer_apellido || !documento || !correo || !telefono1 ||
      !direccion || !usuario || !tipo_documento_id || !ciudad_id || !rol_id || !estado_usuario_id
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sqlQuery = `
      UPDATE usuario 
      SET primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, 
          documento = ?, correo = ?, telefono1 = ?, telefono2 = ?, direccion = ?, usuario = ?, 
          tipo_documento_id = ?, ciudad_id = ?, rol_id = ?, estado_usuario_id = ?, updated_at = ? 
      WHERE id_usuario = ?
    `;

    const [result] = await connect.query(sqlQuery, [
      primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
      documento, correo, telefono1, telefono2, direccion, usuario,
      tipo_documento_id, ciudad_id, rol_id, estado_usuario_id,
      updated_at, req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario not found" });
    }

    res.status(200).json({
      data: {
        primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
        documento, correo, telefono1, telefono2, direccion, usuario,
        tipo_documento_id, ciudad_id, rol_id, estado_usuario_id, updated_at
      },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating usuario", details: error.message });
  }
};

// DELETE
export const deleteUsuario = async (req, res) => {
  try {
    let sqlQuery = "DELETE FROM usuario WHERE id_usuario = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Usuario not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting usuario", details: error.message });
  }
};
