import { Router } from "express";
import {
  showOfertas,
  showOfertasId,
  addOfertas,
  updateOfertas,
  deleteOfertas
} from '../controllers/ofertas.controller.js';

const router = Router();
const apiName = '/ofertas';

router.route(apiName)
  .get(showOfertas)
  .post(addOfertas)
  .put(updateOfertas);

router.route(`${apiName}/:id`)
  .get(showOfertasId)
  .delete(deleteOfertas);

export default router;
