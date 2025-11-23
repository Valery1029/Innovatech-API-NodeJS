import { Router } from "express";
import { 
  getComprasByUsuario, 
  getFacturaByNumero, 
  getComprasStats,
  getComprasByFecha 
} from '../controllers/comprasController.js';

const router = Router();

/**
 * Rutas de compras por usuario
 * IMPORTANTE: Las rutas más específicas deben ir PRIMERO
 */

// Ruta para estadísticas (debe ir ANTES de /:id para evitar conflictos)
router.get('/usuario/compras/:id/stats', getComprasStats);

// Ruta para compras filtradas por fecha
router.get('/usuario/compras/:id/fecha', getComprasByFecha);

// Ruta principal de compras por usuario
router.get('/usuario/compras/:id', getComprasByUsuario);

// Ruta para obtener factura por número
router.get('/factura/:numero', getFacturaByNumero);

export default router;
