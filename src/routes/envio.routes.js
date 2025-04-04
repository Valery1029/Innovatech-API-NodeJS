import { Router } from "express";
import {
  showEnvio,
  showEnvioId,
  addEnvio,
  updateEnvio,
  deleteEnvio
} from '../controllers/envio.controller.js';

const router = Router();
const apiName = '/envio';

router.route(apiName)
  .get(showEnvio)
  .post(addEnvio)
  .put(updateEnvio);

router.route(`${apiName}/:id`)
  .get(showEnvioId)
  .delete(deleteEnvio);

export default router;
