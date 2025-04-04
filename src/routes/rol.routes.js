import { Router } from "express"; 
import { showRoles, showRolId, addRol, updateRol, deleteRol } from '../controllers/rol.controller.js'; 

const router = Router();
const apiName = '/rol';

router.route(apiName)
  .get(showRoles)
  .post(addRol);

router.route(`${apiName}/:id`)
  .get(showRolId)
  .put(updateRol)
  .delete(deleteRol);

export default router;
