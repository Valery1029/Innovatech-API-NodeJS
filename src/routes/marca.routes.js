import { Router } from "express";
import {
  showMarca,
  showMarcaId,
  addMarca,
  updateMarca,
  deleteMarca
} from '../controllers/marca.controller.js';

const router = Router();
const apiName = '/marca';

router.route(apiName)
  .get(showMarca)
  .post(addMarca);

router.route(`${apiName}/:id`)
  .get(showMarcaId)
  .put(updateMarca)
  .delete(deleteMarca);

export default router;
