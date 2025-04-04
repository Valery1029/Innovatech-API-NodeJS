import { Router } from "express";
import {
  showPermisosModelosRol,
  showPermisosModelosRolId,
  addPermisosModelosRol,
  updatePermisosModelosRol,
  deletePermisosModelosRol
} from "../controllers/permisosModelosRol.controller.js";

const router = Router();
const apiName = "/permisosModelosRol";

router.route(apiName)
  .get(showPermisosModelosRol)
  .post(addPermisosModelosRol)
  .put(updatePermisosModelosRol);

router.route(`${apiName}/:Permisosid/:Modelos_RolModelosid/:Modelos_RolRolid`)
  .get(showPermisosModelosRolId)
  .delete(deletePermisosModelosRol);

export default router;
