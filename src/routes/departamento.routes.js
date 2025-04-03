import { Router } from "express"; 

const router = Router();
const apiName = '/api_v1/departamento';

router.get(apiName, (req, res) => res.send('GET data API'));//GET
router.get(apiName + '/:id', (req, res) => res.send('GET data API FOR ID'));//GET ID
router.post(apiName, (req, res) => res.send('POST data API'));//POST
router.put(apiName + '/:id', (req, res) => res.send('PUT data API FOR ID ' + req.params.id));//PUT
router.delete(apiName + '/:id', (req, res) => res.send('DELETE data API FOR ID ' + req.params.id));//DELETE ID

export default router;