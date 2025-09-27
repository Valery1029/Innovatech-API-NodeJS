import jwt from 'jsonwebtoken';
import { connect } from '../config/db/connect.js';
import { encryptPassword, comparePassword } from '../library/appBcrypt.js';
import nodemailer from 'nodemailer';


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

// POST - Solicitar restablecimiento
export const solicitarRestablecimiento = async (req, res) => {
  try {
    const { correo } = req.body;

    // Buscar usuario por correo
    const [result] = await connect.query("SELECT * FROM usuario WHERE correo = ?", [correo]);
    if (result.length === 0) {
      return res.status(404).json({ error: "Correo no registrado." });
    }

    const user = result[0];

    // Crear token con duración de 30 min
    const token = jwt.sign(
      { id: user.id_usuario, correo: user.correo },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    // 🔗 Enlace que abrirá directamente la app con el token
    const enlace = `https://innovatech-api.onrender.com/api_v1/deeplink?token=${token}`;

    const mensajeHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Recuperación de contraseña</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 30px;">
            <h2 style="color: #0a6069; text-align: center;">🔐 Recuperación de contraseña</h2>
            <p>Hola <strong>${user.primer_nombre}</strong>,</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para continuar:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="${enlace}" style="display: inline-block; padding: 14px 30px; background-color: #048d94; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
                    Restablecer contraseña
                </a>
            </p>
            <p style="font-size: 14px;">Si tú no solicitaste este cambio, puedes ignorar este mensaje sin problema.</p>
            <p style="color: #888; font-size: 13px;">⏱ Este enlace estará disponible durante los próximos <strong>30 minutos</strong>.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="font-size: 12px; color: #aaa; text-align: center;">Innovatech Dynamic - Todos los derechos reservados</p>
        </div>
    </body>
    </html>
    `;

    // Configurar transporte de correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar correo
    await transporter.sendMail({
      from: `"Innovatech Dynamic" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "🔐 Recupera tu contraseña",
      html: mensajeHTML,
    });

    res.status(200).json({ message: "Correo de restablecimiento enviado con éxito." });
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    res.status(500).json({ error: "Error al solicitar restablecimiento", details: error.message });
  }
};

export const validarTokenReset = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, id: decoded.id, correo: decoded.correo });
  } catch (error) {
    res.status(400).json({ valid: false, error: "Token inválido o expirado." });
  }
};

// POST - Cambiar contraseña
export const restablecerPassword = async (req, res) => {
  try {
    const { token, nuevaPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await encryptPassword(nuevaPassword);

    const [result] = await connect.query(
      "UPDATE usuario SET password = ? WHERE id_usuario = ?",
      [hashedPassword, decoded.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.status(200).json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    res.status(400).json({ error: "Token inválido o expirado.", details: error.message });
  }
};