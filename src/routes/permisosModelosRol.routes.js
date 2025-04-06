import { Router } from "express";
import {
  showPermisosModelosRol,
  showPermisosModelosRolId,
  addPermisosModelosRol,
  updatePermisosModelosRol,
  deletePermisosModelosRol
} from '../controllers/permisosModelosRol.controller.js';

const router = Router();
const apiName = '/permisosModelosRol';

router.route(apiName)
  .get(showPermisosModelosRol)
  .post(addPermisosModelosRol);

router.route(`${apiName}/:id`)
  .get(showPermisosModelosRolId)
  .put(updatePermisosModelosRol)
  .delete(deletePermisosModelosRol);

export default router;