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

router.post(`${apiName}/login`, loginUsuario);
router.post(`${apiName}/solicitar-reset`, solicitarRestablecimiento);
router.get(`${apiName}/validar-token`, validarTokenReset);
router.post(`${apiName}/restablecer-password`, restablecerPassword);
router.route(apiName)
  .get(verifyToken, showUsuarios)
  .post(addUsuario);

router.get(`${apiName}/:id`, showUsuarioId);
router.route(`${apiName}/:id`)
  .put(verifyToken, updateUsuario)
  .delete(verifyToken, deleteUsuario);

router.get('/deeplink', (req, res) => {
  const { token } = req.query;
  res.redirect(`myapp://restablecer-password/${token}`);
});

export default router;
