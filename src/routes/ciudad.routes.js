import { Router } from "express"; 
import { showCiudades, showCiudadId, addCiudad, updateCiudad, deleteCiudad } from '../controllers/ciudad.controller.js'; 

const router = Router();
const apiName = '/ciudad';

router.route(apiName)
  .get(showCiudades)
  .post(addCiudad);

router.route(`${apiName}/:id`)
  .get(showCiudadId)
  .put(updateCiudad)
  .delete(deleteCiudad);

export default router;
