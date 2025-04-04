import { Router } from "express";
import {
  showGarantia,
  showGarantiaId,
  addGarantia,
  updateGarantia,
  deleteGarantia
} from "../controllers/garantia.controller.js";

const router = Router();
const apiName = "/garantia";

router.route(apiName)
  .get(showGarantia)
  .post(addGarantia);

router.route(`${apiName}/:id`)
  .get(showGarantiaId)
  .put(updateGarantia)
  .delete(deleteGarantia);

export default router;
