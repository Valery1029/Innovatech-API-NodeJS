import { Router } from "express";
import {
  showEstadoPqrs,
  showEstadoPqrsId,
  addEstadoPqrs,
  updateEstadoPqrs,
  deleteEstadoPqrs
} from '../controllers/estadoPqrs.controller';

const router = Router();
const apiName = '/estadoPqrs';

router.route(apiName)
  .get(showEstadoPqrs)
  .post(addEstadoPqrs);

router.route(`${apiName}/:id`)
  .get(showEstadoPqrsId)
  .put(updateEstadoPqrs)
  .delete(deleteEstadoPqrs);

export default router;
