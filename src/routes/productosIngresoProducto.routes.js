import { Router } from "express";
import {
  showProductosIngresoProducto,
  showProductosIngresoProductoIngresoId,
  addProductosIngresoProducto,
  updateProductosIngresoProducto,
  deleteProductosIngresoProducto
} from '../controllers/productosIngresoProducto.controller.js';

const router = Router();
const apiName = '/productosIngresoProducto';

router.route(apiName)
  .get(showProductosIngresoProducto)
  .post(addProductosIngresoProducto)
  .put(updateProductosIngresoProducto);

router.route(`${apiName}/:id`)
  .get(showProductosIngresoProductoIngresoId)
  .delete(deleteProductosIngresoProducto);

export default router;