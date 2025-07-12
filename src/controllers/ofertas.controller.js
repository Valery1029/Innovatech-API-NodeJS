import { connect } from '../config/db/connect.js';

// GET
export const showOfertas = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM ofertas";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching ofertas", details: error.message });
  }
};

// GET ID
export const showOfertasId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM ofertas WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "ofertas not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching ofertas", details: error.message });
  }
};

// POST
export const addOfertas = async (req, res) => {
  try {
    const { descuento, imagen, fechaini, fechafin, descripcion, estado, productos_id } = req.body;

    if (!descuento || !imagen || !fechaini || estado === undefined || !productos_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const formatDate = (inputDate) => {
      const [day, month, year] = inputDate.split('/');
      return `${year}-${month}-${day}`;
    };

    const fechainiFormatted = formatDate(fechaini);
    const fechafinFormatted = fechafin ? formatDate(fechafin) : null;

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sqlQuery = `
      INSERT INTO ofertas 
      (descuento, imagen, fechaini, fechafin, descripcion, estado, productos_id, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connect.query(sqlQuery, [
      descuento, imagen, fechainiFormatted, fechafinFormatted, descripcion, estado, productos_id, created_at
    ]);

    res.status(201).json({
      data: {
        id: result.insertId,
        descuento,
        imagen,
        fechaini: fechainiFormatted,
        fechafin: fechafinFormatted,
        descripcion,
        estado,
        productos_id,
        created_at
      },
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding ofertas", details: error.message });
  }
};

// PUT
export const updateOfertas = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      descuento, imagen, fechaini, fechafin,
      descripcion, estado, productos_id
    } = req.body;

    if (!descuento || !imagen || !fechaini || estado === undefined || !productos_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const formatDate = (inputDate) => {
      const [day, month, year] = inputDate.split('/');
      return `${year}-${month}-${day}`;
    };

    const fechainiFormatted = formatDate(fechaini);
    const fechafinFormatted = fechafin ? formatDate(fechafin) : null;

    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sqlQuery = `
      UPDATE ofertas 
      SET descuento = ?, imagen = ?, fechaini = ?, fechafin = ?, 
          descripcion = ?, estado = ?, productos_id = ?, updated_at = ? 
      WHERE id = ?
    `;

    const [result] = await connect.query(sqlQuery, [
      descuento, imagen, fechainiFormatted, fechafinFormatted,
      descripcion, estado, productos_id, updated_at, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Oferta not found" });
    }

    res.status(200).json({
      data: {
        id,
        descuento,
        imagen,
        fechaini: fechainiFormatted,
        fechafin: fechafinFormatted,
        descripcion,
        estado,
        productos_id,
        updated_at
      },
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating oferta", details: error.message });
  }
};

// DELETE
export const deleteOfertas = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM ofertas WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "ofertas not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting ofertas", details: error.message });
  }
};
