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

router.route(`${apiName}/:id`)
  .get(showIngresoProductoId)
  .put(updateIngresoProducto)
  .delete(deleteIngresoProducto);

export default router;
