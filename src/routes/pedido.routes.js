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

router.route(`${apiName}/:id`)
  .get(showPedidoId)
  .put(updatePedido)
  .delete(deletePedido);

export default router;
