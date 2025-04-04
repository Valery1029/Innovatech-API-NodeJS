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
  .post(addProductosPedido)
  .put(updateProductosPedido);

router.route(`${apiName}/:PedidoId_Pedido`)
  .get(showProductosPedidoId);

router.route(`${apiName}/:ProductosId_Producto/:PedidoId_Pedido`)
  .delete(deleteProductosPedido);

export default router;
