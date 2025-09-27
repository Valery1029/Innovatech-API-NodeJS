import { Router } from "express";
import {
  showPqrs,
  showPqrsId,
  addPqrs,
  updatePqrs,
  deletePqrs,
  showPqrsByUser  
} from "../controllers/pqrs.controller.js";

const router = Router();
const apiName = "/pqrs";

// 🔹 Rutas generales
router.route(apiName)
  .get(showPqrs)
  .post(addPqrs);

router.route(`${apiName}/:id`)
  .get(showPqrsId)
  .put(updatePqrs)
  .delete(deletePqrs);


router.get(`${apiName}/usuario/:usuario_id`, showPqrsByUser);

export default router;
