import { Router } from "express";
import { 
  getComprasByUsuario, 
  getFacturaByNumero, 
  getComprasStats,
  getComprasByFecha 
} from '../controllers/comprasController.js';

const router = Router();

router.get('/usuario/compras/:id/stats', getComprasStats);
router.get('/usuario/compras/:id/fecha', getComprasByFecha);
router.get('/usuario/compras/:id', getComprasByUsuario);
router.get('/factura/:numero', getFacturaByNumero);

export default router;
