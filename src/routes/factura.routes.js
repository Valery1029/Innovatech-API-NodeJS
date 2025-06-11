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

router.route(`${apiName}/:id`)
  .get(showFacturaId)
  .put(updateFactura)
  .delete(deleteFactura);

export default router;
