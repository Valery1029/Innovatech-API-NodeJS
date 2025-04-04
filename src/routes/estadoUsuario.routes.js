import { Router } from "express"; 
import { showEstadosUsuario, showEstadoUsuarioId, addEstadoUsuario, updateEstadoUsuario, deleteEstadoUsuario } from '../controllers/estadoUsuario.controller.js'; 

const router = Router();
const apiName = '/estadoUsuario';

router.route(apiName)
  .get(showEstadosUsuario)
  .post(addEstadoUsuario);

router.route(`${apiName}/:id`)
  .get(showEstadoUsuarioId)
  .put(updateEstadoUsuario)
  .delete(deleteEstadoUsuario);

export default router;
