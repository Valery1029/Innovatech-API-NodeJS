import { Router } from "express";
import {
  showProductos,
  showProductosId,
  addProductos,
  updateProductos,
  deleteProductos
} from '../controllers/productos.controller.js';

const router = Router();
const apiName = '/productos';

router.route(apiName)
  .get(showProductos)
  .post(addProductos)
  .put(updateProductos);

router.route(`${apiName}/:id`)
  .get(showProductosId)
  .delete(deleteProductos);

export default router;
