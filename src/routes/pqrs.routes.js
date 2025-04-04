import { Router } from "express";
import {
  showPqrs,
  showPqrsId,
  addPqrs,
  updatePqrs,
  deletePqrs
} from "../controllers/pqrs.controller.js";

const router = Router();
const apiName = "/pqrs";

router.route(apiName)
  .get(showPqrs)
  .post(addPqrs)
  .put(updatePqrs);

router.route(`${apiName}/:id`)
  .get(showPqrsId)
  .delete(deletePqrs);

export default router;