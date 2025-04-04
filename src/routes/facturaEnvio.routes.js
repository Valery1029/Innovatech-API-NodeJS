import { Router } from "express";
import {
  showFacturaEnvio,
  showFacturaEnvioId,
  addFacturaEnvio,
  updateFacturaEnvio,
  deleteFacturaEnvio
} from "../controllers/facturaEnvio.controller.js";

const router = Router();
const apiName = "/facturaEnvio";

router.route(apiName)
  .get(showFacturaEnvio)
  .post(addFacturaEnvio)
  .put(updateFacturaEnvio);

router.route(`${apiName}/:id`)
  .get(showFacturaEnvioId)
  .delete(deleteFacturaEnvio);

export default router;
