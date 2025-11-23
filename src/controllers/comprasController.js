import { connect } from '../config/db/connect.js';

/**
 * Obtiene todas las compras/facturas de un usuario específico
 * 
 * @route GET /api_v1/usuario/compras/:id
 * @param {number} id - ID del usuario
 * @returns {Array} Lista de facturas con factura_json parseado
 */
export const getComprasByUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        error: "ID de usuario es requerido" 
      });
    }

    const sqlQuery = `
      SELECT 
        id,
        usuario_id,
        reference_code,
        factura_json,
        numero,
        created_at,
        updated_at
      FROM facturas_compras
      WHERE usuario_id = ? 
      ORDER BY created_at DESC
    `;

    const [result] = await connect.query(sqlQuery, [id]);

    if (result.length === 0) {
      console.log(`ℹ️ No hay compras para usuario ID ${id}`);
      return res.status(200).json([]); // Devolver array vacío
    }

    // Parsear factura_json si está como string
    const compras = result.map(compra => {
      let facturaJson = compra.factura_json;

      // Si factura_json es un string, parsearlo
      if (typeof facturaJson === 'string') {
        try {
          facturaJson = JSON.parse(facturaJson);
        } catch (e) {
          console.error(`❌ Error parseando factura_json para factura ${compra.numero}:`, e);
          facturaJson = {
            numbering_range: {},
            items: []
          };
        }
      }

      return {
        id: compra.id,
        numero: compra.numero || '',
        reference_code: compra.reference_code,
        factura_json: facturaJson,
        usuario_id: compra.usuario_id,
        created_at: compra.created_at,
        updated_at: compra.updated_at
      };
    });

    console.log(`✅ ${compras.length} compras encontradas para usuario ID ${id}`);

    res.status(200).json(compras);

  } catch (error) {
    console.error("❌ Error al obtener compras:", error);
    res.status(500).json({ 
      error: "Error al obtener compras del usuario", 
      details: error.message 
    });
  }
};

/**
 * Obtiene una factura específica por su número
 * 
 * @route GET /api_v1/factura/:numero
 * @param {string} numero - Número de la factura (ej: SETP990015266)
 * @returns {Object} Factura con factura_json parseado
 */
export const getFacturaByNumero = async (req, res) => {
  try {
    const { numero } = req.params;

    if (!numero) {
      return res.status(400).json({ 
        error: "Número de factura es requerido" 
      });
    }

    const sqlQuery = `
      SELECT 
        id,
        usuario_id,
        reference_code,
        factura_json,
        numero,
        created_at,
        updated_at
      FROM facturas_compras
      WHERE numero = ?
    `;

    const [result] = await connect.query(sqlQuery, [numero]);

    if (result.length === 0) {
      return res.status(404).json({ 
        error: "Factura no encontrada" 
      });
    }

    const factura = result[0];
    let facturaJson = factura.factura_json;

    // Parsear factura_json si está como string
    if (typeof facturaJson === 'string') {
      try {
        facturaJson = JSON.parse(facturaJson);
      } catch (e) {
        console.error(`❌ Error parseando factura_json:`, e);
        facturaJson = {};
      }
    }

    res.status(200).json({
      id: factura.id,
      numero: factura.numero,
      reference_code: factura.reference_code,
      factura_json: facturaJson,
      usuario_id: factura.usuario_id,
      created_at: factura.created_at,
      updated_at: factura.updated_at
    });

  } catch (error) {
    console.error("❌ Error al obtener factura:", error);
    res.status(500).json({ 
      error: "Error al obtener factura", 
      details: error.message 
    });
  }
};

/**
 * Obtiene estadísticas de compras de un usuario
 * 
 * @route GET /api_v1/usuario/compras/:id/stats
 * @param {number} id - ID del usuario
 * @returns {Object} Estadísticas (total compras, monto total, última compra)
 */
export const getComprasStats = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        error: "ID de usuario es requerido" 
      });
    }

    const sqlQuery = `
      SELECT 
        COUNT(*) as total_compras,
        MAX(created_at) as ultima_compra
      FROM facturas_compras
      WHERE usuario_id = ?
    `;

    const [result] = await connect.query(sqlQuery, [id]);

    if (result[0].total_compras === 0) {
      return res.status(200).json({
        stats: {
          total_compras: 0,
          monto_total: 0,
          ultima_compra: null
        }
      });
    }

    // Obtener todas las facturas para calcular monto total
    const [compras] = await connect.query(
      "SELECT factura_json FROM facturas_compras WHERE usuario_id = ?",
      [id]
    );

    let montoTotal = 0;

    compras.forEach(compra => {
      let facturaJson = compra.factura_json;
      
      if (typeof facturaJson === 'string') {
        try {
          facturaJson = JSON.parse(facturaJson);
        } catch (e) {
          console.error("Error parseando factura_json:", e);
          return;
        }
      }

      // Calcular total desde items
      if (facturaJson.items && Array.isArray(facturaJson.items)) {
        facturaJson.items.forEach(item => {
          const precio = parseFloat(item.price || 0);
          const cantidad = parseInt(item.quantity || 0);
          montoTotal += precio * cantidad;
        });
      }
    });

    res.status(200).json({
      stats: {
        total_compras: result[0].total_compras,
        monto_total: montoTotal,
        ultima_compra: result[0].ultima_compra
      }
    });

  } catch (error) {
    console.error("❌ Error al obtener estadísticas:", error);
    res.status(500).json({ 
      error: "Error al obtener estadísticas", 
      details: error.message 
    });
  }
};

/**
 * Obtiene compras filtradas por rango de fechas
 * 
 * @route GET /api_v1/usuario/compras/:id/fecha?desde=2025-01-01&hasta=2025-12-31
 * @param {number} id - ID del usuario
 * @query {string} desde - Fecha inicio (YYYY-MM-DD)
 * @query {string} hasta - Fecha fin (YYYY-MM-DD)
 * @returns {Array} Lista de compras en el rango de fechas
 */
export const getComprasByFecha = async (req, res) => {
  try {
    const { id } = req.params;
    const { desde, hasta } = req.query;

    if (!id) {
      return res.status(400).json({ 
        error: "ID de usuario es requerido" 
      });
    }

    let sqlQuery = `
      SELECT 
        id,
        usuario_id,
        reference_code,
        factura_json,
        numero,
        created_at,
        updated_at
      FROM facturas_compras
      WHERE usuario_id = ?
    `;

    const params = [id];

    // Filtrar por fecha si se proporcionan
    if (desde && hasta) {
      sqlQuery += " AND DATE(created_at) BETWEEN ? AND ?";
      params.push(desde, hasta);
    }

    sqlQuery += " ORDER BY created_at DESC";

    const [result] = await connect.query(sqlQuery, params);

    const compras = result.map(compra => {
      let facturaJson = compra.factura_json;

      if (typeof facturaJson === 'string') {
        try {
          facturaJson = JSON.parse(facturaJson);
        } catch (e) {
          facturaJson = {};
        }
      }

      return {
        id: compra.id,
        numero: compra.numero || '',
        reference_code: compra.reference_code,
        factura_json: facturaJson,
        usuario_id: compra.usuario_id,
        created_at: compra.created_at,
        updated_at: compra.updated_at
      };
    });

    res.status(200).json(compras);

  } catch (error) {
    console.error("❌ Error al obtener compras por fecha:", error);
    res.status(500).json({ 
      error: "Error al obtener compras", 
      details: error.message 
    });
  }
};
