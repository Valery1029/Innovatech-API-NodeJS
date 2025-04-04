import { Router } from "express"; 
import { showUsuarios, showUsuarioId, addUsuario, updateUsuario, deleteUsuario } from '../controllers/usuario.controller.js'; 

const router = Router();
const apiName = '/usuario';

router.route(apiName)
  .get(showUsuarios)
  .post(addUsuario);

router.route(`${apiName}/:id`)
  .get(showUsuarioId)
  .put(updateUsuario)
  .delete(deleteUsuario);

export default router;
