import { Router } from "express"; 
import { showTiposDocumento, showTipoDocumentoId, addTipoDocumento, updateTipoDocumento, deleteTipoDocumento } from '../controllers/tipoDocumento.controller.js'; 

const router = Router();
const apiName = '/tipoDocumento';

router.route(apiName)
  .get(showTiposDocumento)
  .post(addTipoDocumento);

router.route(`${apiName}/:id`)
  .get(showTipoDocumentoId)
  .put(updateTipoDocumento)
  .delete(deleteTipoDocumento);

export default router;