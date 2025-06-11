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

router.route(`${apiName}/:id`)
  .get(showEnvioId)
  .put(updateEnvio)
  .delete(deleteEnvio);

export default router;
