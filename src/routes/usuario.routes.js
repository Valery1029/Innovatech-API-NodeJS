import { Router } from "express"; 
import { 
  showUsuarios, 
  showUsuarioId, 
  addUsuario, 
  updateUsuario, 
  deleteUsuario, 
  loginUsuario   
} from '../controllers/usuario.controller.js'; 

import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();
const apiName = '/usuario';


router.post(`${apiName}/login`, loginUsuario);

router.route(apiName)
  .get(verifyToken, showUsuarios)
  .post(addUsuario);

router.route(`${apiName}/:id`)
  .get(verifyToken, showUsuarioId)
  .put(verifyToken, updateUsuario)
  .delete(verifyToken, deleteUsuario);

export default router;
