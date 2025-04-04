import { Router } from "express";
import {
  showEstadoFacturas,
  showEstadoFacturaId,
  addEstadoFactura,
  updateEstadoFactura,
  deleteEstadoFactura
} from '../controllers/estadoFactura.controller.js';

const router = Router();
const apiName = '/estadoFactura';

router.route(apiName)
  .get(showEstadoFacturas)
  .post(addEstadoFactura);

router.route(`${apiName}/:id`)
  .get(showEstadoFacturaId)
  .put(updateEstadoFactura)
  .delete(deleteEstadoFactura);

export default router;
