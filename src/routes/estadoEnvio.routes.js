import { Router } from "express";  
import { 
  showEstadoEnvios, 
  showEstadoEnvioId, 
  addEstadoEnvio, 
  updateEstadoEnvio, 
  deleteEstadoEnvio 
} from '../controllers/estadoEnvio.controller.js'; 

const router = Router();
const apiName = '/estadoEnvio';

router.route(apiName)
  .get(showEstadoEnvios)
  .post(addEstadoEnvio);

router.route(`${apiName}/:id`)
  .get(showEstadoEnvioId)
  .put(updateEstadoEnvio)
  .delete(deleteEstadoEnvio);

export default router;
