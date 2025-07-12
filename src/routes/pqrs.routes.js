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

router.route(`${apiName}/:id`)
  .get(showPqrsId)
  .put(updatePqrs)
  .delete(deletePqrs);

export default router;