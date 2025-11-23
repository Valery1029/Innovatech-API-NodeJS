import { Router } from "express"; 
import { 
  showUsuarios, 
  showUsuarioId, 
  addUsuario, 
  updateUsuario, 
  deleteUsuario, 
  loginUsuario,
  solicitarRestablecimiento,
  validarTokenReset,
  restablecerPassword
} from '../controllers/usuario.controller.js'; 

import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();
const apiName = '/usuario';

// 🔐 Login
router.post(`${apiName}/login`, loginUsuario);

// 📩 Restablecimiento de contraseña
router.post(`${apiName}/solicitar-reset`, solicitarRestablecimiento);
router.get(`${apiName}/validar-token`, validarTokenReset);
router.post(`${apiName}/restablecer-password`, restablecerPassword);

// 👤 CRUD usuarios
router.route(apiName)
  .get(verifyToken, showUsuarios)
  .post(addUsuario);

// 🆕 Ruta para obtener usuario por ID (SIN protección de token)
// Necesaria para la facturación
router.get(`${apiName}/:id`, showUsuarioId);

// Rutas protegidas para actualizar y eliminar
router.route(`${apiName}/:id`)
  .put(verifyToken, updateUsuario)
  .delete(verifyToken, deleteUsuario);

// 🌐 Deep link
router.get('/deeplink', (req, res) => {
  const { token } = req.query;
  res.redirect(`myapp://restablecer-password/${token}`);
});

export default router;
