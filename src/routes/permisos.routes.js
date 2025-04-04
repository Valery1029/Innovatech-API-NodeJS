import { Router } from "express";
import {
  showPermisos,
  showPermisosId,
  addPermisos,
  updatePermisos,
  deletePermisos
} from '../controllers/permisos.controller.js';

const router = Router();
const apiName = '/permisos';

router.route(apiName)
  .get(showPermisos)
  .post(addPermisos);

router.route(`${apiName}/:id`)
  .get(showPermisosId)
  .put(updatePermisos)
  .delete(deletePermisos);

export default router;
