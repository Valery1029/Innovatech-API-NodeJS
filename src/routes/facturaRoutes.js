import { Router } from 'express';
import {
  crearFactura,
  consultarFactura,
  descargarPDF,
} from '../controllers/facturaController.js';

const router = Router();

router.post('/facturas', crearFactura);
router.get('/facturas/:numero', consultarFactura);
router.get('/facturas/:numero/pdf', descargarPDF);

export default router;
