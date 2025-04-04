import { Router } from "express";
import {
  showProductosIngresoProducto,
  showProductosIngresoProductoId,
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

// Usamos ambos parámetros en el DELETE
router.route(`${apiName}/:ProductosId_Producto/:Ingreso_productoid_ingreso`)
  .delete(deleteProductosIngresoProducto);

// GET por ID de ingreso
router.route(`${apiName}/:Ingreso_productoid_ingreso`)
  .get(showProductosIngresoProductoId);

export default router;
