import { Router } from "express";
import {
  showSistemaOperativo,
  showSistemaOperativoId,
  addSistemaOperativo,
  updateSistemaOperativo,
  deleteSistemaOperativo
} from '../controllers/so.controller.js';

const router = Router();
const apiName = '/sistemaOperativo';

router.route(apiName)
  .get(showSistemaOperativo)
  .post(addSistemaOperativo);

router.route(`${apiName}/:id`)
  .get(showSistemaOperativoId)
  .put(updateSistemaOperativo)
  .delete(deleteSistemaOperativo);

export default router;
