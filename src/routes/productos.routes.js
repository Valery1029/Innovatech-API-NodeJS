import { Router } from "express";
import {
  showProductos,
  showProductosId,
  addProductos,
  updateProductos,
  deleteProductos,
  getCategoriasConProductos,
  searchProductos,
  getCarritoUsuario,   
  addProductoAlCarrito,
  updateCantidadCarrito,
  deleteProductoCarrito,
  clearCarrito,
  clearCarritoByUserId,
  prepararPago,
  respuestaPago,
  confirmacionPago
} from "../controllers/productos.controller.js";

import { prepararPago } from "../controllers/pago.controller.js";

const router = Router();
const apiName = "/productos";

// 📦 CRUD productos
router.route(apiName)
  .get(showProductos)
  .post(addProductos);

router.get(`${apiName}/buscar`, searchProductos);
router.get(`${apiName}/categorias-con-productos`, getCategoriasConProductos);

router.route(`${apiName}/:id`)
  .get(showProductosId)
  .put(updateProductos)
  .delete(deleteProductos);

// 🛒 CARRITO
router.get(`${apiName}/carrito/:usuario_id`, getCarritoUsuario); 
router.post(`${apiName}/carrito/agregar`, addProductoAlCarrito);

// ✏️ Actualizar cantidad de producto en carrito
router.put(`${apiName}/carrito/actualizar`, updateCantidadCarrito);

// 🗑️ Eliminar producto del carrito
router.delete(`${apiName}/carrito/eliminar`, deleteProductoCarrito);

router.post(`${apiName}/carrito/preparar-pago`, prepararPago);
router.get('/carrito/respuesta-pago', respuestaPago);
router.post('/carrito/confirmacion-pago', confirmacionPago);

router.post(`${apiName}/carrito/clear`, clearCarrito);

router.delete('/carrito/:usuario_id', clearCarritoByUserId); 

export default router;
