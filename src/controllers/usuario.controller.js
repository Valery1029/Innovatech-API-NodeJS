import jwt from 'jsonwebtoken';
import { connect } from '../config/db/connect.js';
import { encryptPassword, comparePassword } from '../library/appBcrypt.js';


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

export const loginUsuario = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: "El usuario y la contraseña son obligatorios." });
    }


    const sqlQuery = "SELECT * FROM usuario WHERE usuario = ?";
    const [result] = await connect.query(sqlQuery, [usuario]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Usuario no registrado." });
    }

    const user = result[0];

    
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    
    if (user.estado_usuario_id !== 1) { 
      return res.status(403).json({ error: "El usuario no tiene acceso actualmente." });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id_usuario, rol: user.rol_id, estado: user.estado_usuario_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
      user: {
        id: user.id_usuario,
        nombre: `${user.primer_nombre} ${user.primer_apellido}`,
        correo: user.correo,
        usuario: user.usuario,
        rol: user.rol_id,
        estado: user.estado_usuario_id
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión.", details: error.message });
  }
};