import { Router } from "express";  
import { 
  showRam, 
  showRamId, 
  addRam, 
  updateRam, 
  deleteRam 
} from '../controllers/ram.controller.js'; 

const router = Router();
const apiName = '/ram';

router.route(apiName)
  .get(showRam)
  .post(addRam);

router.route(`${apiName}/:id`)
  .get(showRamId)
  .put(updateRam)
  .delete(deleteRam);

export default router;
