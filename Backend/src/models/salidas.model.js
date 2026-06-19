import db from "../config/db.js";

export const obtenerSalidasPorPaqueteModel = async (paqueteId) => {

  const [rows] = await db.query(`
    SELECT *
    FROM salidas
    WHERE paquete_id = ?
      AND activo = 1
    ORDER BY fecha_inicio
  `, [paqueteId]);

  return rows;
};

export const crearSalidaModel = async (datos) => {

  const [resultado] = await db.query(`
    INSERT INTO salidas (
      paquete_id,
      fecha_inicio,
      fecha_fin,
      cupos_totales,
      cupos_disponibles,
      precio,
      activo
    )
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `, [
    datos.paquete_id,
    datos.fecha_inicio,
    datos.fecha_fin,
    datos.cupos_totales,
    datos.cupos_totales, // disponibles = totales
    datos.precio
  ]);

  return resultado;
};

export const actualizarSalidaModel = async (id, datos) => {

  const [resultado] = await db.query(`
    UPDATE salidas
    SET
      fecha_inicio = ?,
      fecha_fin = ?,
      cupos_totales = ?,
      precio = ?
    WHERE id = ?
  `, [
    datos.fecha_inicio,
    datos.fecha_fin,
    datos.cupos_totales,
    datos.precio,
    id
  ]);

  return resultado;
};

export const eliminarSalidaModel = async (id) => {

  const [resultado] = await db.query(`
    UPDATE salidas
    SET activo = 0
    WHERE id = ?
  `, [id]);

  return resultado;
};