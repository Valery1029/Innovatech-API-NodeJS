
import { connect } from '../config/db/connect.js';

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
