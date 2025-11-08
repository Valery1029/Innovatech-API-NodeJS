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
router.put(`${apiName}/carrito/actualizar`, updateCantidadCarrito);
router.delete(`${apiName}/carrito/eliminar`, deleteProductoCarrito);

// 🧹 VACIAR CARRITO (POST)
router.post(`${apiName}/carrito/borrar/:usuario_id`, clearCarritoByUserId);
router.post(`${apiName}/carrito/clear/:usuario_id`, clearCarrito);

// 💳 PAGO
router.post(`${apiName}/carrito/preparar-pago`, prepararPago);
router.get(`${apiName}/carrito/respuesta-pago`, respuestaPago);
router.post(`${apiName}/carrito/confirmacion-pago`, confirmacionPago);

export default router;
