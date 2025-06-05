import { connect } from '../config/db/connect.js';
import {encryptPassword, comparePassword} from '../library/appBcrypt.js';
import jwt from 'jsonwebtoken';

// GET
export const showApiUsers = async (req, res) => {
  try {
    let sqlQuery = "SELECT * FROM api_users";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching API users", details: error.message });
  }
};

// GET BY ID
export const showApiUserId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM api_users WHERE id = ?", [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "API user not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching API user", details: error.message });
  }
};

// POST
export const addApiUser = async (req, res) => {
  try {
    const { user, password, role, status } = req.body;

    if (!user || !password || !role || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const hashedPassword = await encryptPassword(password);

    let sqlQuery = "INSERT INTO api_users (api_user, api_password, api_role, api_status) VALUES (?, ?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [user, hashedPassword, role, status]);
    res.status(201).json({
      data: { id: result.insertId, user, hashedPassword, role, status },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding API user", details: error.message });
  }
};

// PUT
// PUT - actualizar usuario (con hash de password)
export const updateApiUser = async (req, res) => {
  try {
    const { user, password, role, status } = req.body;

    if (!user || !password || !role || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Hashear la nueva contraseña antes de actualizar
    const hashedPassword = await encryptPassword(password);

    let sqlQuery = "UPDATE api_users SET api_user = ?, api_password = ?, api_role = ?, api_status = ?, updated_at = ? WHERE id = ?";
    const updated_at = new Date().toLocaleString("en-CA", { timeZone: "America/Bogota" }).replace(",", "").replace("/", "-").replace("/", "-");
    const [result] = await connect.query(sqlQuery, [user, hashedPassword, role, status, updated_at, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "API user not found" });
    res.status(200).json({
      data: { user, role, status, updated_at },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating API user", details: error.message });
  }
};


// DELETE
export const deleteApiUser = async (req, res) => {
  try {
    let sqlQuery = "DELETE FROM api_users WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "API user not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting API user", details: error.message });
  }
};

// LOGIN
export const loginApiUser = async (req, res) => {
  try {
    const { api_user, api_password } = req.body;

    // Validar que los campos no estén vacíos
    if (!api_user || !api_password) {
      return res.status(400).json({ error: "El usuario y la contraseña son obligatorios." });
    }

    // Buscar el usuario por nombre
    const sqlQuery = "SELECT * FROM api_users WHERE api_user = ?";
    const [result] = await connect.query(sqlQuery, [api_user]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Usuario no registrado." });
    }

    const user = result[0];

    // Comparar contraseña
    const validPassword = await comparePassword(api_password, user.api_password);
    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    // Verificar si el usuario está activo
    if (user.api_status !== 'Active') {
      return res.status(403).json({ error: "El usuario no tiene acceso actualmente." });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, role: user.api_role, status: user.api_status },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
      user: {
        id: user.id,
        role: user.api_role,
        status: user.api_status,
        username: user.api_user
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión.", details: error.message });
  }
};
