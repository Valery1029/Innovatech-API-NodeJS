import { Router } from "express";
import {
  showModelosRol,
  showModelosRolId,
  addModelosRol,
  updateModelosRol,
  deleteModelosRol
} from '../controllers/modelosRol.controller.js';

const router = Router();
const apiName = '/modelosRol';

router.route(apiName)
  .get(showModelosRol)
  .post(addModelosRol)
  .put(updateModelosRol);

router.route(`${apiName}/:Rolid`)
  .get(showModelosRolId)
  .delete(deleteModelosRol);

export default router;