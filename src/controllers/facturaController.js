import axios from 'axios';

// 🔑 Configuración de Factus
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
    // Si ya tenemos un token válido, devolverlo
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
      console.log('✅ Usando token existente');
      return accessToken;
    }

    console.log('🔑 Solicitando nuevo token a Factus...');

    const response = await axios.post(
      `${FACTUS_CONFIG.baseURL}/oauth/token`,
      new URLSearchParams({
        grant_type: 'password',
        client_id: FACTUS_CONFIG.clientId,
        client_secret: FACTUS_CONFIG.clientSecret,
        username: FACTUS_CONFIG.email,
        password: FACTUS_CONFIG.password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }
    );

    accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in || 3600;
    tokenExpiry = Date.now() + (expiresIn * 1000);

    console.log(`✅ Token obtenido, válido por ${expiresIn} segundos`);

    return accessToken;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error.response?.data || error.message);
    throw new Error('No se pudo autenticar con Factus');
  }
}

/**
 * POST /api_v1/facturas
 * Crea una factura electrónica en Factus
 */
export const crearFactura = async (req, res) => {
  try {
    const facturaData = req.body;

    console.log('📋 Solicitud de factura recibida');
    console.log('🆔 Usuario:', facturaData.usuario_id);
    console.log('📝 Referencia:', facturaData.reference_code);

    // Validar datos requeridos
    if (!facturaData.customer || !facturaData.items || facturaData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: customer e items son obligatorios',
      });
    }

    // 1️⃣ Obtener token de Factus
    const token = await getFactusToken();

    // 2️⃣ Crear factura en Factus
    console.log('📄 Creando factura en Factus...');

    const response = await axios.post(
      `${FACTUS_CONFIG.baseURL}/v1/bills/validate`,
      facturaData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    console.log('✅ Factura creada exitosamente en Factus');
    console.log('📄 Respuesta:', JSON.stringify(response.data, null, 2));

    const factusData = response.data.data || response.data;

    // 3️⃣ Responder con éxito
    res.status(201).json({
      success: true,
      message: 'Factura creada exitosamente',
      data: {
        invoice_number: factusData?.invoice_number || factusData?.number,
        cufe: factusData?.cufe,
        qr_code: factusData?.qr_code,
        pdf_url: factusData?.pdf_url,
        xml_url: factusData?.xml_url,
        factus_response: factusData,
      },
    });
  } catch (error) {
    console.error('❌ Error creando factura:', error.response?.data || error.message);
    console.error('📡 Status:', error.response?.status);

    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Error al crear factura en Factus',
      error: error.response?.data || error.message,
    });
  }
};

/**
 * GET /api_v1/facturas/:numero
 * Consulta una factura por su número
 */
export const consultarFactura = async (req, res) => {
  try {
    const { numero } = req.params;

    console.log(`🔍 Consultando factura: ${numero}`);

    const token = await getFactusToken();

    const response = await axios.get(
      `${FACTUS_CONFIG.baseURL}/v1/bills/${numero}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    console.log('✅ Factura encontrada');

    res.status(200).json({
      success: true,
      data: response.data.data || response.data,
    });
  } catch (error) {
    console.error('❌ Error consultando factura:', error.response?.data || error.message);

    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Error al consultar factura',
      error: error.response?.data || error.message,
    });
  }
};

/**
 * GET /api_v1/facturas/:numero/pdf
 * Descarga el PDF de una factura
 */
export const descargarPDF = async (req, res) => {
  try {
    const { numero } = req.params;

    console.log(`📥 Descargando PDF: ${numero}`);

    const token = await getFactusToken();

    const response = await axios.get(
      `${FACTUS_CONFIG.baseURL}/v1/bills/${numero}/pdf`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'arraybuffer',
      }
    );

    console.log('✅ PDF descargado correctamente');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="factura-${numero}.pdf"`);
    res.send(response.data);
  } catch (error) {
    console.error('❌ Error descargando PDF:', error.response?.data || error.message);

    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Error al descargar PDF',
      error: error.message,
    });
  }
};
