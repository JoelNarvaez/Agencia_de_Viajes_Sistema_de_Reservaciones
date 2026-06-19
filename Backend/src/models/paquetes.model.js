import db from "../config/db.js";

const agregarSalidasAPaquetes = async (paquetes) => {

  if (paquetes.length === 0) return [];

  const paqueteIds = paquetes.map((paquete) => paquete.id);
  const placeholders = paqueteIds.map(() => "?").join(",");

  const [salidas] = await db.query(`
    SELECT *
    FROM salidas
    WHERE paquete_id IN (${placeholders})
      AND activo = 1
    ORDER BY fecha_inicio
  `, paqueteIds);

  const salidasPorPaquete = salidas.reduce((acumulador, salida) => {
    const paqueteId = salida.paquete_id;
    acumulador[paqueteId] = acumulador[paqueteId] ?? [];
    acumulador[paqueteId].push(salida);
    return acumulador;
  }, {});

  return paquetes.map((paquete) => ({
    ...paquete,
    salidas: salidasPorPaquete[paquete.id] ?? [],
  }));

};

const agregarImagenesAPaquetes = async (paquetes) => {

  if (paquetes.length === 0) return [];

  const paqueteIds = paquetes.map((paquete) => paquete.id);
  const placeholders = paqueteIds.map(() => "?").join(",");

  const [imagenes] = await db.query(`
    SELECT paquete_id, url_imagen, orden
    FROM imagenes_paquete
    WHERE paquete_id IN (${placeholders})
    ORDER BY paquete_id, orden ASC, id ASC
  `, paqueteIds);

  const imagenesPorPaquete = imagenes.reduce((acumulador, imagen) => {
    const paqueteId = imagen.paquete_id;
    acumulador[paqueteId] = acumulador[paqueteId] ?? [];
    acumulador[paqueteId].push({
      orden: imagen.orden,
      url: imagen.url_imagen,
    });
    return acumulador;
  }, {});

  return paquetes.map((paquete) => ({
    ...paquete,
    imagenes: imagenesPorPaquete[paquete.id] ?? [],
  }));

};

const agregarIncluidosAPaquetes = async (paquetes) => {

  if (paquetes.length === 0) return [];

  const paqueteIds = paquetes.map((paquete) => paquete.id);
  const placeholders = paqueteIds.map(() => "?").join(",");

  const [incluidos] = await db.query(`
    SELECT paquete_id, nombre, tipo_icono
    FROM incluye_paquete
    WHERE paquete_id IN (${placeholders})
    ORDER BY paquete_id, id ASC
  `, paqueteIds);

  const incluidosPorPaquete = incluidos.reduce((acumulador, incluido) => {
    const paqueteId = incluido.paquete_id;
    acumulador[paqueteId] = acumulador[paqueteId] ?? [];
    acumulador[paqueteId].push({
      nombre: incluido.nombre,
      tipo_icono: incluido.tipo_icono,
    });
    return acumulador;
  }, {});

  return paquetes.map((paquete) => ({
    ...paquete,
    incluidos: incluidosPorPaquete[paquete.id] ?? [],
  }));

};

const completarPaquetes = async (paquetes) => {
  const paquetesConSalidas = await agregarSalidasAPaquetes(paquetes);
  const paquetesConImagenes = await agregarImagenesAPaquetes(paquetesConSalidas);
  return agregarIncluidosAPaquetes(paquetesConImagenes);
};

export const obtenerPaquetesModel = async () => {

  const [rows] = await db.query(`
    SELECT *
    FROM paquetes
    WHERE activo = 1
    ORDER BY id ASC
  `);

  return completarPaquetes(rows);
};

export const obtenerPaquetePorSlugModel = async (slug) => {

  const [rows] = await db.query(`
    SELECT *
    FROM paquetes
    WHERE slug = ? OR id = ?
    LIMIT 1
  `, [slug, slug]);

  const paquetes = await completarPaquetes(rows);

  return paquetes[0];
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
