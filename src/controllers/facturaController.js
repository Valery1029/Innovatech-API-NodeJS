import { connect } from '../config/db/connect.js';


const FACTUS_CONFIG = {
  baseURL: process.env.FACTUS_API_URL || 'https://api-sandbox.factus.com.co',
  clientId: process.env.FACTUS_CLIENT_ID || '9dec2e75-714c-4902-82d7-dc1fa93474c7',
  clientSecret: process.env.FACTUS_CLIENT_SECRET || 'aehxmjZ0XavzxrHsAkeJkn9xJua1VZiLJDkvgjl3',
  email: process.env.FACTUS_EMAIL || 'sandbox@factus.com.co',
  password: process.env.FACTUS_PASSWORD || 'sandbox2024%',
};

// Cache del token
let accessToken = null;
let tokenExpiry = null;

/**
 * Obtiene el token de acceso OAuth de Factus
 */
async function getFactusToken() {
  try {
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
      return accessToken;
    }


    const formData = new URLSearchParams({
      grant_type: 'password',
      client_id: FACTUS_CONFIG.clientId,
      client_secret: FACTUS_CONFIG.clientSecret,
      username: FACTUS_CONFIG.email,
      password: FACTUS_CONFIG.password,
    });

    const response = await fetch(`${FACTUS_CONFIG.baseURL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error en autenticación:', error);
      throw new Error(`Factus OAuth error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    const expiresIn = data.expires_in || 3600;
    tokenExpiry = Date.now() + (expiresIn * 1000);

    console.log(`Token obtenido, válido por ${expiresIn} segundos`);

    return accessToken;
  } catch (error) {
    console.error('Error obteniendo token:', error.message);
    throw new Error('No se pudo autenticar con Factus');
  }
}

/**
 * POST /api_v1/facturas
 * Crea una factura electrónica en Factus Y la guarda en la base de datos
 */
export const crearFactura = async (req, res) => {
  try {
    const facturaData = req.body;

    console.log('Solicitud de factura recibida');
    console.log('Usuario:', facturaData.usuario_id);
    console.log('Referencia:', facturaData.reference_code);

    if (!facturaData.customer || !facturaData.items || facturaData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: customer e items son obligatorios',
      });
    }

    if (!facturaData.usuario_id) {
      return res.status(400).json({
        success: false,
        message: 'usuario_id es requerido para guardar la factura',
      });
    }

    try {
      facturaData.items = facturaData.items.map((item, index) => {
        const itemValidado = {
          scheme_id: item.scheme_id || "0",
          note: item.note || "",
          code_reference: String(item.code_reference || ""),
          name: String(item.name || ""),
          quantity: parseInt(item.quantity) || 0,
          discount_rate: parseFloat(item.discount_rate) || 0,
          price: parseFloat(item.price) || 0,
          tax_rate: String(item.tax_rate || "19.00"),
          unit_measure_id: parseInt(item.unit_measure_id) || 70,
          standard_code_id: parseInt(item.standard_code_id) || 1,
          is_excluded: parseInt(item.is_excluded) || 0,
          tribute_id: parseInt(item.tribute_id) || 1,
          withholding_taxes: Array.isArray(item.withholding_taxes) ? item.withholding_taxes : []
        };

        if (!itemValidado.code_reference || !itemValidado.name) {
          throw new Error(`Item ${index}: code_reference y name son requeridos`);
        }
        if (itemValidado.quantity <= 0) {
          throw new Error(`Item ${index}: quantity debe ser mayor a 0`);
        }
        if (itemValidado.price <= 0) {
          throw new Error(`Item ${index}: price debe ser mayor a 0`);
        }

        return itemValidado;
      });

    } catch (validationError) {
      console.error('Error validando items:', validationError.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación en items',
        error: validationError.message,
      });
    }

    let token;
    try {
      token = await getFactusToken();
    } catch (tokenError) {
      console.error('Error obteniendo token:', tokenError);
      return res.status(500).json({
        success: false,
        message: 'Error de autenticación con Factus',
        error: tokenError.message,
      });
    }

    let factusResponse;
    let factusJsonResponse;
    
    try {
      factusResponse = await fetch(`${FACTUS_CONFIG.baseURL}/v1/bills/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(facturaData),
      });


      factusJsonResponse = await factusResponse.json();
      
      console.log('📋 Respuesta Factus completa:', JSON.stringify(factusJsonResponse, null, 2));

      if (!factusResponse.ok) {
        const error = factusJsonResponse;
        console.error('Error en Factus:', JSON.stringify(error, null, 2));
        
        return res.status(factusResponse.status).json({
          success: false,
          message: error.message || 'Error al crear factura en Factus',
          error: error,
        });
      }

    } catch (fetchError) {
      console.error('Error de conexión con Factus:', fetchError);
      return res.status(500).json({
        success: false,
        message: 'Error de conexión con Factus',
        error: fetchError.message,
      });
    }

    console.log('🔍 Buscando invoice_number en respuesta...');
    
    function buscarInvoiceNumber(obj, path = 'root') {
      if (!obj || typeof obj !== 'object') return null;
      
      // Buscar directamente en el objeto
      if (obj.invoice_number) {
        console.log(`Encontrado en ${path}.invoice_number:`, obj.invoice_number);
        return obj.invoice_number;
      }
      if (obj.number) {
        console.log(`Encontrado en ${path}.number:`, obj.number);
        return obj.number;
      }
      
      // Buscar en sub-objetos
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          const found = buscarInvoiceNumber(obj[key], `${path}.${key}`);
          if (found) return found;
        }
      }
      
      return null;
    }

    let invoiceNumber = buscarInvoiceNumber(factusJsonResponse);
    
    if (!invoiceNumber) {
      console.error('No se encontró invoice_number en toda la respuesta');
      console.error('Claves en respuesta:', Object.keys(factusJsonResponse));
      invoiceNumber = `TEMP-${Date.now()}`;
      console.log('Usando número temporal:', invoiceNumber);
    }

    // Obtener data para guardar (toda la respuesta)
    const factusData = factusJsonResponse.data || factusJsonResponse;

    console.log('Factura creada exitosamente en Factus');
    console.log('Número final:', invoiceNumber);

    let dbInsertId = null;
    try {

      const insertQuery = `
        INSERT INTO facturas_compras 
        (usuario_id, reference_code, factura_json, numero, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `;

      const [insertResult] = await connect.query(insertQuery, [
        facturaData.usuario_id,
        facturaData.reference_code,
        JSON.stringify(factusData),
        invoiceNumber
      ]);

      dbInsertId = insertResult.insertId;

    } catch (dbError) {
      console.error('Error guardando en BD:', dbError.message);
      console.error('   - Código:', dbError.code);
      console.error('   - Stack:', dbError.stack);
      console.warn('Factura en Factus pero NO en BD local');
    }

    res.status(201).json({
      success: true,
      message: 'Factura creada exitosamente',
      data: {
        invoice_number: invoiceNumber,
        cufe: factusData?.cufe,
        qr_code: factusData?.qr_code,
        pdf_url: factusData?.pdf_url,
        xml_url: factusData?.xml_url,
        factus_response: factusData,
        db_saved: dbInsertId !== null,
        db_id: dbInsertId,
      },
    });
  } catch (error) {
    console.error('Error crítico en crearFactura:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
};


export const consultarFactura = async (req, res) => {
  try {
    const { numero } = req.params;

    console.log(`Consultando factura: ${numero}`);

    const token = await getFactusToken();

    const response = await fetch(`${FACTUS_CONFIG.baseURL}/v1/bills/${numero}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Status consulta:', response.status);

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({
        success: false,
        message: 'Error al consultar factura',
        error: error,
      });
    }

    const result = await response.json();
    console.log('Factura encontrada');

    res.status(200).json({
      success: true,
      data: result.data || result,
    });
  } catch (error) {
    console.error('Error consultando factura:', error.message);

    res.status(500).json({
      success: false,
      message: 'Error al consultar factura',
      error: error.message,
    });
  }
};

export const descargarPDF = async (req, res) => {
  try {
    const { numero } = req.params;

    console.log(`Descargando PDF: ${numero}`);

    const token = await getFactusToken();

    const response = await fetch(`${FACTUS_CONFIG.baseURL}/v1/bills/${numero}/pdf`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: 'Error al descargar PDF',
      });
    }

    const pdfBuffer = await response.arrayBuffer();
    console.log('PDF descargado correctamente');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="factura-${numero}.pdf"`);
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('Error descargando PDF:', error.message);

    res.status(500).json({
      success: false,
      message: 'Error al descargar PDF',
      error: error.message,
    });
  }
};
