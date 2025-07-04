import { Router } from "express";
import {
  showProductosPedido,
  showProductosPedidoId,
  addProductosPedido,
  updateProductosPedido,
  deleteProductosPedido
} from "../controllers/productosPedido.controller.js";

const router = Router();
const apiName = "/productosPedido";

router.route(apiName)
  .get(showProductosPedido)
  .post(addProductosPedido);

router.route(`${apiName}/:id`)
  .get(showProductosPedidoId)
  .put(updateProductosPedido)
  .delete(deleteProductosPedido);

export default router;
