import { Router } from "express";
import {
  showIngresoProducto,
  showIngresoProductoId,
  addIngresoProducto,
  updateIngresoProducto,
  deleteIngresoProducto
} from '../controllers/ingresoProducto.controller.js';

const router = Router();
const apiName = '/ingresoProducto';

router.route(apiName)
  .get(showIngresoProducto)
  .post(addIngresoProducto)
  .put(updateIngresoProducto);

router.route(`${apiName}/:id`)
  .get(showIngresoProductoId)
  .delete(deleteIngresoProducto);

export default router;
