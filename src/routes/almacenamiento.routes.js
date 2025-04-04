import { Router } from "express";
import { 
  showAlmacenamientos, 
  showAlmacenamientoId, 
  addAlmacenamiento, 
  updateAlmacenamiento, 
  deleteAlmacenamiento 
} from '../controllers/almacenamiento.controller.js';

const router = Router();
const apiName = '/almacenamiento';

router.route(apiName)
  .get(showAlmacenamientos)
  .post(addAlmacenamiento);

router.route(`${apiName}/:id`)
  .get(showAlmacenamientoId)
  .put(updateAlmacenamiento)
  .delete(deleteAlmacenamiento);

export default router;
