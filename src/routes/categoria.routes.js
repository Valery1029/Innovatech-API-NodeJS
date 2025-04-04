import { Router } from "express";  
import { 
  showCategorias, 
  showCategoriaId, 
  addCategoria, 
  updateCategoria, 
  deleteCategoria 
} from '../controllers/categoria.controller.js'; 

const router = Router();
const apiName = '/categoria';

router.route(apiName)
  .get(showCategorias)
  .post(addCategoria);

router.route(`${apiName}/:id`)
  .get(showCategoriaId)
  .put(updateCategoria)
  .delete(deleteCategoria);

export default router;