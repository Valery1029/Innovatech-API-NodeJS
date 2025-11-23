import { Router } from 'express';
import {
  crearFactura,
  consultarFactura,
  descargarPDF,
} from '../controllers/facturaController.js';

const router = Router();

// Crear factura
router.post('/facturas', crearFactura);

// Consultar factura
router.get('/facturas/:numero', consultarFactura);

// Descargar PDF
router.get('/facturas/:numero/pdf', descargarPDF);

export default router;
