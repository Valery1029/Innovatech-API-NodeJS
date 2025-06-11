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

router.route(`${apiName}/:id`)
  .get(showProductosId)
  .put(updateProductos)
  .delete(deleteProductos);

export default router;
