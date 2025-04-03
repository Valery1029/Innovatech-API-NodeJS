import { Router } from "express"; 
import { showDepartamentos, showDepartamentoId, addDepartamento, updateDepartamento, deleteDepartamento } from '../controllers/departamento.controller.js'; 

const router = Router();
const apiName = '/departamento';

router.route(apiName)
  .get(showDepartamentos)
  .post(addDepartamento);

router.route(`${apiName}/:id`)
  .get(showDepartamentoId)
  .put(updateDepartamento)
  .delete(deleteDepartamento);

export default router;