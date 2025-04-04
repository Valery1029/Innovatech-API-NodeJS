import { Router } from "express";
import {
  showPedido,
  showPedidoId,
  addPedido,
  updatePedido,
  deletePedido
} from "../controllers/pedido.controller.js";

const router = Router();
const apiName = '/pedido';

router.route(apiName)
  .get(showPedido)
  .post(addPedido)
  .put(updatePedido);

router.route(`${apiName}/:id`)
  .get(showPedidoId)
  .delete(deletePedido);

export default router;
