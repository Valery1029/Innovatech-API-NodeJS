import { Router } from "express";
import {
  showResolucion,
  showResolucionId,
  addResolucion,
  updateResolucion,
  deleteResolucion
} from '../controllers/resolucion.controller.js';

const router = Router();
const apiName = '/resolucion';

router.route(apiName)
  .get(showResolucion)
  .post(addResolucion);

router.route(`${apiName}/:id`)
  .get(showResolucionId)
  .put(updateResolucion)
  .delete(deleteResolucion);

export default router;
