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

// 📩 --- NUEVAS RUTAS DE RESTABLECIMIENTO DE CONTRASEÑA ---
// Paso 1: Enviar correo con enlace de restablecimiento
router.post(`${apiName}/solicitar-reset`, solicitarRestablecimiento);

// Paso 2: Validar token (opcional)
router.get(`${apiName}/validar-token`, validarTokenReset);

// Paso 3: Restablecer la contraseña
router.post(`${apiName}/restablecer-password`, restablecerPassword);

// 👤 CRUD usuarios
router.route(apiName)
  .get(verifyToken, showUsuarios)
  .post(addUsuario);

router.route(`${apiName}/:id`)
  .get(verifyToken, showUsuarioId)
  .put(verifyToken, updateUsuario)
  .delete(verifyToken, deleteUsuario);

// 🌐 NUEVA RUTA para redirigir desde el correo al deep link de la app
router.get('/deeplink', (req, res) => {
  const { token } = req.query;
  // Redirige al esquema personalizado de tu app Flutter
  res.redirect(`myapp://restablecer-password/${token}`);
});

export default router;
