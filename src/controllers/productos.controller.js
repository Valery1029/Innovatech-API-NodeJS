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
    const sqlQuery = "SELECT * FROM productos WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "producto not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching producto", details: error.message });
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
      data: req.body,
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
