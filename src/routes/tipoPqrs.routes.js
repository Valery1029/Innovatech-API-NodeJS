import { Router } from "express";
import {
  showTipoPqrs,
  showTipoPqrsId,
  addTipoPqrs,
  updateTipoPqrs,
  deleteTipoPqrs
} from "../controllers/tipoPqrs.controller.js";

const router = Router();
const apiName = "/tipoPqrs";

router.route(apiName)
  .get(showTipoPqrs)
  .post(addTipoPqrs);

router.route(`${apiName}/:id`)
  .get(showTipoPqrsId)
  .put(updateTipoPqrs)
  .delete(deleteTipoPqrs);

export default router;
