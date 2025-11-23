import { connect } from '../config/db/connect.js';

/**
 * Obtiene todas las compras/facturas de un usuario específico
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
      return res.status(200).json([]);
    }

    // Parsear factura_json y calcular totales
    const compras = result.map(compra => {
      let facturaJson = compra.factura_json;

      // Si factura_json es un string, parsearlo
      if (typeof facturaJson === 'string') {
        try {
          facturaJson = JSON.parse(facturaJson);
        } catch (e) {
          console.error(`❌ Error parseando factura_json para factura ${compra.numero}:`, e);
          facturaJson = {};
        }
      }

      // ✅ FUNCIÓN RECURSIVA PARA BUSCAR EL TOTAL
      function buscarTotal(obj, camino = '') {
        if (!obj || typeof obj !== 'object') return null;
        
        // Buscar "total" directamente
        if (obj.total !== undefined && obj.total !== null) {
          const valor = parseFloat(obj.total);
          if (!isNaN(valor) && valor > 0) {
            console.log(`💰 Total encontrado en ${camino}.total: ${valor}`);
            return valor;
          }
        }
        
        // Buscar en propiedades anidadas
        for (const key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            const found = buscarTotal(obj[key], camino ? `${camino}.${key}` : key);
            if (found !== null) return found;
          }
        }
        
        return null;
      }

      let total = buscarTotal(facturaJson, 'root');

      // Si no encontró el total, intentar calcularlo desde items
      if (total === null || total === 0) {
        console.log(`⚠️ Total no encontrado, calculando desde items...`);
        
        // Buscar items en diferentes ubicaciones
        let items = null;
        if (facturaJson.response?.items) items = facturaJson.response.items;
        else if (facturaJson.items) items = facturaJson.items;
        else if (facturaJson.response?.bill?.items) items = facturaJson.response.bill.items;
        else if (facturaJson.bill?.items) items = facturaJson.bill.items;

        if (items && Array.isArray(items)) {
          total = 0;
          items.forEach(item => {
            const itemTotal = parseFloat(item.total || item.price || 0);
            total += itemTotal;
          });
          console.log(`✅ Total calculado desde items: ${total}`);
        }
      }

      // Si aún no hay total, usar 0
      if (total === null || isNaN(total)) {
        console.warn(`⚠️ No se pudo obtener total para factura ${compra.numero}, usando 0`);
        total = 0;
      }

      console.log(`📄 Factura ${compra.numero} - Total final: ${total}`);

      return {
        id: compra.id,
        numero: compra.numero || '',
        reference_code: compra.reference_code,
        factura_json: facturaJson,
        total: total, // ✅ TOTAL CALCULADO
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

    if (typeof facturaJson === 'string') {
      try {
        facturaJson = JSON.parse(facturaJson);
      } catch (e) {
        console.error(`❌ Error parseando factura_json:`, e);
        facturaJson = {};
      }
    }

    // Buscar total recursivamente
    function buscarTotal(obj) {
      if (!obj || typeof obj !== 'object') return null;
      
      if (obj.total !== undefined && obj.total !== null) {
        const valor = parseFloat(obj.total);
        if (!isNaN(valor) && valor > 0) return valor;
      }
      
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          const found = buscarTotal(obj[key]);
          if (found !== null) return found;
        }
      }
      
      return null;
    }

    let total = buscarTotal(facturaJson);

    // Calcular desde items si no se encontró
    if (total === null || total === 0) {
      let items = facturaJson.response?.items || facturaJson.items || 
                  facturaJson.response?.bill?.items || facturaJson.bill?.items;

      if (items && Array.isArray(items)) {
        total = 0;
        items.forEach(item => {
          total += parseFloat(item.total || item.price || 0);
        });
      }
    }

    if (total === null || isNaN(total)) total = 0;

    res.status(200).json({
      id: factura.id,
      numero: factura.numero,
      reference_code: factura.reference_code,
      factura_json: facturaJson,
      total: total,
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
