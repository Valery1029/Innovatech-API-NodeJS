import { connect } from '../config/db/connect.js';
import crypto from 'crypto';

// GET
export const showProductos = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM productos";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching productos", details: error.message });
  }
};

// GET ID
export const showProductosId = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT 
        p.id,
        p.nom,
        p.descripcion,
        p.existencias,
        p.precio,
        p.imagen,
        p.caracteristicas,
        p.tam,
        p.tampantalla,
        p.created_at,
        p.updated_at,

        m.nom AS marca,
        e.nom AS estado,
        col.nom AS color,  
        c.nom AS categoria,

        g.mes_año AS garantia,

        CONCAT(a.num, ' ', a.unidadestandar) AS almacenamiento,
        CONCAT(r.num, ' ', r.unidadestandar) AS ram,

        CONCAT(so.nom, ' ', so.version) AS sistema_operativo,

        res.nom AS resolucion

      FROM productos p
      LEFT JOIN marca m ON p.id_marca = m.id
      LEFT JOIN estado_producto e ON p.id_estado = e.id
      LEFT JOIN color col ON p.id_color = col.id_color  
      LEFT JOIN categoria c ON p.id_categoria = c.id
      LEFT JOIN garantia g ON p.id_garantia = g.id
      LEFT JOIN almacenamiento a ON p.id_almacenamiento = a.id
      LEFT JOIN almacenamiento_aleatorio r ON p.id_ram = r.id
      LEFT JOIN sistema_operativo so ON p.id_sistema_operativo = so.id
      LEFT JOIN resolucion res ON p.id_resolucion = res.id
      WHERE p.id = ?;
    `;

    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({
      error: "Error fetching producto con relaciones",
      details: error.message,
    });
  }
};

// POST
export const addProductos = async (req, res) => {
  try {
    const {
      nom, descripcion, existencias, precio, imagen,
      caracteristicas, tam, tampantalla, id_marca,
      id_estado, id_color, id_categoria, id_garantia,
      id_almacenamiento, id_ram, id_sistema_operativo, id_resolucion
    } = req.body;

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `INSERT INTO productos
      (nom, descripcion, existencias, precio, imagen,
      caracteristicas, tam, tampantalla, id_marca, id_estado,
      id_color, id_categoria, id_garantia, id_almacenamiento,
      id_ram, id_sistema_operativo, id_resolucion, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await connect.query(sqlQuery, [
      nom, descripcion, existencias, precio, imagen,
      caracteristicas, tam, tampantalla, id_marca, id_estado,
      id_color, id_categoria, id_garantia, id_almacenamiento,
      id_ram, id_sistema_operativo, id_resolucion, created_at
    ]);

    res.status(201).json({
      data: {id: result.insertId, nom, descripcion, existencias, precio, imagen,
      caracteristicas, tam, tampantalla, id_marca, id_estado,
      id_color, id_categoria, id_garantia, id_almacenamiento,
      id_ram, id_sistema_operativo, id_resolucion, created_at},
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding producto", details: error.message });
  }
};

// PUT
export const updateProductos = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom, descripcion, existencias, precio, imagen,
      caracteristicas, tam, tampantalla, id_marca,
      id_estado, id_color, id_categoria, id_garantia,
      id_almacenamiento, id_ram, id_sistema_operativo, id_resolucion
    } = req.body;

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sqlQuery = `UPDATE productos SET nom=?, descripcion=?, existencias=?, precio=?, imagen=?,
      caracteristicas=?, tam=?, tampantalla=?, id_marca=?, id_estado=?,
      id_color=?, id_categoria=?, id_garantia=?, id_almacenamiento=?,
      id_ram=?, id_sistema_operativo=?, id_resolucion=?, updated_at=?
      WHERE id=?`;

    const [result] = await connect.query(sqlQuery, [
      nom, descripcion, existencias, precio, imagen,
      caracteristicas, tam, tampantalla, id_marca, id_estado,
      id_color, id_categoria, id_garantia, id_almacenamiento,
      id_ram, id_sistema_operativo, id_resolucion, updated_at, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "producto not found" });
    }

    res.status(200).json({
      data: { id, ...req.body },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating producto", details: error.message });
  }
};

// DELETE
export const deleteProductos = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM productos WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "producto not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting producto", details: error.message });
  }
};

export const getCategoriasConProductos = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT c.id AS categoria_id, c.nom AS categoria_nom,
             p.id AS producto_id, p.nom AS producto_nom, 
             p.descripcion, 
             p.precio, p.imagen
      FROM categoria c
      LEFT JOIN productos p ON c.id = p.id_categoria
      ORDER BY c.id;
    `;
    const [rows] = await connect.query(sqlQuery);

    const categorias = {};
    rows.forEach(row => {
      if (!categorias[row.categoria_id]) {
        categorias[row.categoria_id] = {
          id: row.categoria_id,
          nom: row.categoria_nom,
          productos: []
        };
      }
      if (row.producto_id) {
        categorias[row.categoria_id].productos.push({
          id: row.producto_id,
          nom: row.producto_nom,
          descripcion: row.descripcion,  // 🔹 agregar aquí
          precio: row.precio,
          imagen: row.imagen,
        });
      }
    });

    res.json(Object.values(categorias));
  } catch (error) {
    res.status(500).json({
      error: "Error fetching categorias con productos",
      details: error.message
    });
  }
};


export const searchProductos = async (req, res) => {
  try {
    const {
      query,
      precioMin,
      precioMax,
      marca,
      categoria,
      color,
      ram,
      almacenamiento,
      sistema_operativo,
      resolucion,
    } = req.query;

    let sqlQuery = `
      SELECT 
        p.id,
        p.nom,
        p.descripcion,
        p.existencias,
        p.precio,
        p.imagen,
        p.caracteristicas,
        p.tam,
        p.tampantalla,
        p.created_at,
        p.updated_at,

        m.nom AS marca,
        e.nom AS estado,
        col.nom AS color,  
        c.nom AS categoria,

        g.mes_año AS garantia,

        CONCAT(a.num, ' ', a.unidadestandar) AS almacenamiento,
        CONCAT(r.num, ' ', r.unidadestandar) AS ram,

        CONCAT(so.nom, ' ', so.version) AS sistema_operativo,

        res.nom AS resolucion

      FROM productos p
      LEFT JOIN marca m ON p.id_marca = m.id
      LEFT JOIN estado_producto e ON p.id_estado = e.id
      LEFT JOIN color col ON p.id_color = col.id_color  
      LEFT JOIN categoria c ON p.id_categoria = c.id
      LEFT JOIN garantia g ON p.id_garantia = g.id
      LEFT JOIN almacenamiento a ON p.id_almacenamiento = a.id
      LEFT JOIN almacenamiento_aleatorio r ON p.id_ram = r.id
      LEFT JOIN sistema_operativo so ON p.id_sistema_operativo = so.id
      LEFT JOIN resolucion res ON p.id_resolucion = res.id
      WHERE 1=1
    `;

    const values = [];

    // 🔎 búsqueda por nombre o descripción
    if (query) {
      sqlQuery += ` AND (
        p.nom LIKE ? 
        OR p.descripcion LIKE ? 
        OR c.nom LIKE ?
      )`;
      values.push(`%${query}%`, `%${query}%`, `%${query}%`);
    }

    // 💰 rangos de precio
    if (precioMin) {
      sqlQuery += ` AND p.precio >= ?`;
      values.push(precioMin);
    }
    if (precioMax) {
      sqlQuery += ` AND p.precio <= ?`;
      values.push(precioMax);
    }

    // 🔹 filtros de texto con LIKE (palabras parecidas)
    if (marca) {
      sqlQuery += ` AND m.nom LIKE ?`;
      values.push(`%${marca}%`);
    }
    if (categoria) {
      sqlQuery += ` AND c.nom LIKE ?`;
      values.push(`%${categoria}%`);
    }
    if (color) {
      sqlQuery += ` AND col.nom LIKE ?`;
      values.push(`%${color}%`);
    }
    if (sistema_operativo) {
      sqlQuery += ` AND so.nom LIKE ?`;
      values.push(`%${sistema_operativo}%`);
    }
    if (resolucion) {
      sqlQuery += ` AND res.nom LIKE ?`;
      values.push(`%${resolucion}%`);
    }

    // 🔹 filtros exactos para números
    if (ram) {
      sqlQuery += ` AND r.num = ?`;
      values.push(ram);
    }
    if (almacenamiento) {
      sqlQuery += ` AND a.num = ?`;
      values.push(almacenamiento);
    }

    // Ejecutar consulta
    const [rows] = await connect.query(sqlQuery, values);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error en searchProductos:", error);
    res.status(500).json({ message: "Error al buscar productos", details: error.message });
  }
};



export const getCarritoUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const sqlQuery = `
      SELECT 
        c.carrito_id,
        c.usuario_id,
        c.cantidad,
        p.id AS producto_id,
        p.nom,
        p.descripcion,
        p.existencias,
        p.precio,
        p.imagen,
        p.caracteristicas,
        p.tam,
        p.tampantalla,
        p.created_at,
        p.updated_at,

        m.nom AS marca,
        e.nom AS estado,
        col.nom AS color,  
        cat.nom AS categoria,

        g.mes_año AS garantia,

        CONCAT(a.num, ' ', a.unidadestandar) AS almacenamiento,
        CONCAT(r.num, ' ', r.unidadestandar) AS ram,

        CONCAT(so.nom, ' ', so.version) AS sistema_operativo,
        res.nom AS resolucion,

        (p.precio * c.cantidad) AS total_producto
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      LEFT JOIN marca m ON p.id_marca = m.id
      LEFT JOIN estado_producto e ON p.id_estado = e.id
      LEFT JOIN color col ON p.id_color = col.id_color  
      LEFT JOIN categoria cat ON p.id_categoria = cat.id
      LEFT JOIN garantia g ON p.id_garantia = g.id
      LEFT JOIN almacenamiento a ON p.id_almacenamiento = a.id
      LEFT JOIN almacenamiento_aleatorio r ON p.id_ram = r.id
      LEFT JOIN sistema_operativo so ON p.id_sistema_operativo = so.id
      LEFT JOIN resolucion res ON p.id_resolucion = res.id
      WHERE c.usuario_id = ?;
    `;

    const [rows] = await connect.query(sqlQuery, [usuario_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "El carrito está vacío o el usuario no existe." });
    }

    // ✅ También calculamos el total general del carrito
    const total_general = rows.reduce((acc, item) => acc + item.total_producto, 0);

    res.status(200).json({
      usuario_id,
      total_general,
      productos: rows
    });

  } catch (error) {
    console.error("❌ Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error al obtener el carrito", details: error.message });
  }
};


export const addProductoAlCarrito = async (req, res) => {
  try {
    const { usuario_id, producto_id, cantidad } = req.body;

    if (!usuario_id || !producto_id) {
      return res.status(400).json({ error: "usuario_id y producto_id son obligatorios" });
    }

    // Verificar si ya existe en el carrito
    const [existente] = await connect.query(
      `SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ?`,
      [usuario_id, producto_id]
    );

    if (existente.length > 0) {
      // Si ya existe, actualizamos la cantidad
      await connect.query(
        `UPDATE carrito SET cantidad = cantidad + ? WHERE usuario_id = ? AND producto_id = ?`,
        [cantidad || 1, usuario_id, producto_id]
      );

      return res.status(200).json({
        message: "Cantidad actualizada en el carrito ✅",
        producto_id,
        usuario_id,
      });
    } else {
      // Si no existe, lo insertamos
      await connect.query(
        `INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)`,
        [usuario_id, producto_id, cantidad || 1]
      );

      return res.status(201).json({
        message: "Producto agregado al carrito 🛒",
        producto_id,
        usuario_id,
        cantidad: cantidad || 1,
      });
    }
  } catch (error) {
    console.error("❌ Error al agregar al carrito:", error);
    res.status(500).json({
      error: "Error al agregar producto al carrito",
      details: error.message,
    });
  }
};

export const updateCantidadCarrito = async (req, res) => {
  try {
    const { usuario_id, producto_id, cantidad } = req.body;

    if (!usuario_id || !producto_id || cantidad === undefined) {
      return res.status(400).json({ error: "usuario_id, producto_id y cantidad son obligatorios" });
    }
    const [existente] = await connect.query(
      `SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ?`,
      [usuario_id, producto_id]
    );

    if (existente.length === 0) {
      return res.status(404).json({ error: "El producto no existe en el carrito" });
    }

    await connect.query(
      `UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?`,
      [cantidad, usuario_id, producto_id]
    );

    res.status(200).json({
      message: "✅ Cantidad actualizada correctamente",
      usuario_id,
      producto_id,
      cantidad
    });
  } catch (error) {
    console.error("❌ Error al actualizar cantidad:", error);
    res.status(500).json({
      error: "Error al actualizar cantidad en el carrito",
      details: error.message
    });
  }
};
export const deleteProductoCarrito = async (req, res) => {
  try {
    const { usuario_id, producto_id } = req.body;

    if (!usuario_id || !producto_id) {
      return res.status(400).json({ error: "usuario_id y producto_id son obligatorios" });
    }

    const [result] = await connect.query(
      `DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?`,
      [usuario_id, producto_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "❌ Producto no encontrado en el carrito" });
    }

    res.status(200).json({
      message: "🗑️ Producto eliminado del carrito correctamente",
      usuario_id,
      producto_id
    });
  } catch (error) {
    console.error("❌ Error al eliminar producto del carrito:", error);
    res.status(500).json({
      error: "Error al eliminar producto del carrito",
      details: error.message
    });
  }
};

// 🧹 Vaciar todo el carrito de un usuario
export const clearCarrito = async (req, res) => {
  try {
    const { usuario_id } = req.body;

    if (!usuario_id) {
      return res.status(400).json({ error: "usuario_id es obligatorio" });
    }

    const [result] = await connect.query(
      `DELETE FROM carrito WHERE usuario_id = ?`,
      [usuario_id]
    );

    res.status(200).json({
      message: "🗑️ Carrito vaciado correctamente",
      usuario_id,
      deletedItems: result.affectedRows
    });
  } catch (error) {
    console.error("❌ Error al vaciar el carrito:", error);
    res.status(500).json({
      error: "Error al vaciar el carrito",
      details: error.message
    });
  }
};

export const clearCarritoByUserId = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    if (!usuario_id) {
      return res.status(400).json({ 
        success: false,
        error: "usuario_id es obligatorio" 
      });
    }

    const [result] = await connect.query(
      `DELETE FROM carrito WHERE usuario_id = ?`,
      [usuario_id]
    );

    console.log(`✅ Carrito vaciado para usuario ${usuario_id}: ${result.affectedRows} productos eliminados`);

    res.status(200).json({
      success: true,
      message: "Carrito vaciado correctamente",
      usuario_id,
      deletedItems: result.affectedRows
    });
    
  } catch (error) {
    console.error("❌ Error al vaciar el carrito:", error);
    res.status(500).json({
      success: false,
      error: "Error al vaciar el carrito",
      details: error.message
    });
  }
};

export const prepararPago = async (req, res) => {
  try {
    const { usuario_id, email } = req.body;

    if (!usuario_id || !email) {
      return res.status(400).json({ 
        error: "usuario_id y email son obligatorios" 
      });
    }

    // 1️⃣ Obtener el carrito del usuario
    const [carrito] = await connect.query(
      `SELECT 
        c.producto_id,
        c.cantidad,
        p.precio,
        p.nom,
        (p.precio * c.cantidad) AS total_producto
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      WHERE c.usuario_id = ?`,
      [usuario_id]
    );

    if (carrito.length === 0) {
      return res.status(404).json({ 
        error: "El carrito está vacío" 
      });
    }

    // 2️Calcular el total
    const totalAmount = carrito.reduce((acc, item) => acc + item.total_producto, 0);

    // 3Configuración de PayU (IMPORTANTE: Usar tus credenciales reales)
    const merchantId = "508029";  // 🔹 Cambia por tu merchantId
    const accountId = "512321";   // 🔹 Cambia por tu accountId
    const apiKey = "4Vj8eK4rloUd272L48hsrarnUA";  // 🔹 Cambia por tu apiKey
    const currency = "COP";
    const referenceCode = `REF_${usuario_id}_${Date.now()}`;

    //  Generar signature (firma de seguridad)
    const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${totalAmount}~${currency}`;
    const signature = crypto.createHash('md5').update(signatureString).digest('hex');
    const baseUrl = "https://innovatech-api-nodejs.onrender.com/api_v1"; 
    const responseUrl = `${baseUrl}/api/productos/carrito/respuesta-pago`;
    const confirmationUrl = `${baseUrl}/api/productos/carrito/confirmacion-pago`;

    // 6️⃣ Devolver los datos para el formulario
    res.status(200).json({
      merchantId,
      accountId,
      description: `Compra de ${carrito.length} producto(s)`,
      referenceCode,
      amount: totalAmount,
      tax: "0",
      taxReturnBase: "0",
      currency,
      signature,
      test: "1",  // 🔹 Cambiar a "0" en producción
      email,
      responseUrl,
      confirmationUrl,
      urlPayU: "https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/"  // 🔹 URL de pruebas
      // En producción usar: "https://checkout.payulatam.com/ppp-web-gateway-payu/"
    });

  } catch (error) {
    console.error("❌ Error al preparar pago:", error);
    res.status(500).json({
      error: "Error al preparar el pago",
      details: error.message
    });
  }
};


// 🔹 Endpoint para recibir respuesta de PayU (página de respuesta)
export const respuestaPago = async (req, res) => {
  try {
    const { transactionState, referenceCode, TX_VALUE } = req.query;

    console.log("✅ Pago recibido:", { transactionState, referenceCode, TX_VALUE });

    // Guardar en base de datos si lo necesitas
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Pago Procesado</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 40px;
            }
            .check { font-size: 80px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="check">✅</div>
            <h2>${transactionState === '4' ? '¡Pago Aprobado!' : 'Pago Procesado'}</h2>
            <p>Referencia: ${referenceCode}</p>
            <p>Volviendo a la aplicación...</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).send("Error");
  }
};



// 🔹 Endpoint para confirmación de PayU (notificación automática)
export const confirmacionPago = async (req, res) => {
  try {
    console.log("🔔 Confirmación de PayU:", req.body);
    
    // Aquí validarías la firma y actualizarías tu base de datos
    
    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Error en confirmación:", error);
    res.status(500).send("ERROR");
  }
};
