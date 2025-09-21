import { Router } from "express";
import {
  showProductos,
  showProductosId,
  addProductos,
  updateProductos,
  deleteProductos,
  getCategoriasConProductos,
  searchProductos 
} from "../controllers/productos.controller.js";

const router = Router();
const apiName = "/productos";

// 🔹 Rutas principales
router.route(apiName)
  .get(showProductos)
  .post(addProductos);


router.get(`${apiName}/categorias-con-productos`, getCategoriasConProductos);


router.get(`${apiName}/buscar`, searchProductos);


router.route(`${apiName}/:id`)
  .get(showProductosId)
  .put(updateProductos)
  .delete(deleteProductos);

export default router;
