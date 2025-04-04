import { Router } from "express";
import {
  showFactura,
  showFacturaId,
  addFactura,
  updateFactura,
  deleteFactura
} from "../controllers/factura.controller.js";

const router = Router();
const apiName = "/factura";

router.route(apiName)
  .get(showFactura)
  .post(addFactura)
  .put(updateFactura);

router.route(`${apiName}/:id`)
  .get(showFacturaId)
  .delete(deleteFactura);

export default router;
