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

// Rutas generales (GET all, POST, PUT general)
router.route(apiName)
  .get(showModelosRol)
  .post(addModelosRol);

// Rutas por ID (GET, PUT, DELETE)
router.route(`${apiName}/:id`)
  .get(showModelosRolId)
  .put(updateModelosRol)
  .delete(deleteModelosRol);

export default router;