import { Router } from "express";
import {
  showModelos,
  showModelosId,
  addModelos,
  updateModelos,
  deleteModelos
} from "../controllers/modelos.controller.js";

const router = Router();
const apiName = '/modelos';

router.route(apiName)
  .get(showModelos)
  .post(addModelos);

router.route(`${apiName}/:id`)
  .get(showModelosId)
  .put(updateModelos)
  .delete(deleteModelos);

export default router;
