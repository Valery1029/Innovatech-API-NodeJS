import md5 from "md5";
import { connect } from '../config/db/connect.js';

export const prepararPago = async (req, res) => {
  try {
    const { usuario_id, email } = req.body;

    if (!usuario_id || !email) {
      return res.status(400).json({ error: "usuario_id y email son obligatorios" });
    }

    const [carrito] = await connect.query(
      `SELECT SUM(p.precio * c.cantidad) AS total
       FROM carrito c
       JOIN productos p ON p.id = c.producto_id
       WHERE c.usuario_id = ?`,
      [usuario_id]
    );

    const total = carrito[0]?.total || 0;

    if (total <= 0) {
      return res.status(400).json({ error: "El carrito está vacío o el total es 0" });
    }
    const apiKey = "4Vj8eK4rloUd272L48hsrarnUA";
    const merchantId = "508029";
    const currency = "COP";
    const referenceCode = `ref_${Date.now()}`;

    const signatureRaw = `${apiKey}~${merchantId}~${referenceCode}~${total}~${currency}`;
    const signature = md5(signatureRaw);

    res.status(200).json({
      message: "Pago preparado correctamente",
      referenceCode,
      amount: total,
      currency,
      signature,
      merchantId,
      accountId: "512321", 
      email,
      urlPayU: "https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/"
    });
  } catch (error) {
    console.error("Error al preparar pago:", error);
    res.status(500).json({
      error: "Error interno al preparar el pago",
      details: error.message
    });
  }
};
