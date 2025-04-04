import { Router } from "express";
import {
  showEstadoProducto,
  showEstadoProductoId,
  addEstadoProducto,
  updateEstadoProducto,
  deleteEstadoProducto
} from '../controllers/estadoProducto.controller';

const router = Router();
const apiName = '/estadoProducto';

router.route(apiName)
  .get(showEstadoProducto)
  .post(addEstadoProducto);

router.route(`${apiName}/:id`)
  .get(showEstadoProductoId)
  .put(updateEstadoProducto)
  .delete(deleteEstadoProducto);

export default router;
