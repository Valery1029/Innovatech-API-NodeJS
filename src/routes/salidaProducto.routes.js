import { Router } from "express";
import {
  showSalidaProducto,
  showSalidaProductoId,
  addSalidaProducto,
  updateSalidaProducto,
  deleteSalidaProducto
} from "../controllers/salidaProducto.controller.js";

const router = Router();
const apiName = "/salidaProducto";

router.route(apiName)
  .get(showSalidaProducto)
  .post(addSalidaProducto)

router.route(`${apiName}/:id`)
  .get(showSalidaProductoId)
  .put(updateSalidaProducto)
  .delete(deleteSalidaProducto);

export default router;
