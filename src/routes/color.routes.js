import { Router } from "express";  
import { 
  showColors, 
  showColorId, 
  addColor, 
  updateColor, 
  deleteColor 
} from '../controllers/color.controller.js'; 

const router = Router();
const apiName = '/color';

router.route(apiName)
  .get(showColors)
  .post(addColor);

router.route(`${apiName}/:id`)
  .get(showColorId)
  .put(updateColor)
  .delete(deleteColor);

export default router;
