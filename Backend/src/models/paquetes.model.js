import db from "../config/db.js";

export const obtenerPaquetesModel = async () => {

  const [rows] = await db.query(`
    SELECT *
    FROM paquetes
    WHERE activo = 1
  `);

  return rows;
};

export const obtenerPaquetePorSlugModel = async (slug) => {

  const [rows] = await db.query(`
    SELECT *
    FROM paquetes
    WHERE slug = ?
    LIMIT 1
  `, [slug]);

  return rows[0];
};

export const crearPaqueteModel = async (datos) => {

  const [resultado] = await db.query(`
    INSERT INTO paquetes (
      slug,
      titulo,
      destino,
      descripcion,
      tipo_experiencia,
      dias,
      noches_minimas,
      precio,
      direccion_hospedaje,
      latitud,
      longitud,
      imagen_principal,
      activo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    datos.slug,
    datos.titulo,
    datos.destino,
    datos.descripcion,
    datos.tipo_experiencia,
    datos.dias,
    datos.noches_minimas,
    datos.precio,
    datos.direccion_hospedaje,
    datos.latitud,
    datos.longitud,
    datos.imagen_principal,
    datos.activo
  ]);

  return resultado;
};

export const actualizarPaqueteModel = async (id, datos) => {

  const [resultado] = await db.query(`
    UPDATE paquetes
    SET
      titulo = ?,
      destino = ?,
      descripcion = ?,
      tipo_experiencia = ?,
      dias = ?,
      noches_minimas = ?,
      precio = ?,
      direccion_hospedaje = ?,
      latitud = ?,
      longitud = ?,
      imagen_principal = ?,
      activo = ?
    WHERE id = ?
  `, [
    datos.titulo,
    datos.destino,
    datos.descripcion,
    datos.tipo_experiencia,
    datos.dias,
    datos.noches_minimas,
    datos.precio,
    datos.direccion_hospedaje,
    datos.latitud,
    datos.longitud,
    datos.imagen_principal,
    datos.activo,
    id
  ]);

  return resultado;
};

export const eliminarPaqueteModel = async (id) => {

  const [resultado] = await db.query(`
    UPDATE paquetes
    SET activo = 0
    WHERE id = ?
  `, [id]);

  return resultado;
};