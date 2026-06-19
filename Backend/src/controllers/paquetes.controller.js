import {
  obtenerPaquetesModel,
  obtenerPaquetePorSlugModel,
  crearPaqueteModel,
  actualizarPaqueteModel,
  eliminarPaqueteModel
} from "../models/paquetes.model.js";

export const obtenerPaquetes = async (req, res) => {

  try {

    const paquetes =
      await obtenerPaquetesModel();

    res.status(200).json(paquetes);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error al obtener paquetes"
    });

  }

};

export const obtenerPaquetePorSlug = async (req, res) => {

  try {

    const { slug } = req.params;

    const paquete =
      await obtenerPaquetePorSlugModel(slug);

    if (!paquete) {
      return res.status(404).json({
        message: "Paquete no encontrado"
      });
    }

    res.status(200).json(paquete);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error al obtener paquete"
    });

  }

};

export const crearPaquete = async (req, res) => {

  try {

    const datos = { ...req.body };

    // Generar slug automáticamente desde el título
    datos.slug = datos.titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quitar acentos
      .replace(/[^\w\s-]/g, "") // quitar caracteres raros
      .trim()
      .replace(/\s+/g, "-"); // espacios -> guiones

    const resultado = await crearPaqueteModel(datos);

    res.status(201).json({
      message: "Paquete creado correctamente",
      id: resultado.insertId,
      slug: datos.slug
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error al crear paquete"
    });

  }

};

export const actualizarPaquete = async (req, res) => {

  try {

    const { id } = req.params;

    const resultado = await actualizarPaqueteModel(
      id,
      req.body
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: "Paquete no encontrado"
      });
    }

    res.status(200).json({
      message: "Paquete actualizado correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error al actualizar paquete"
    });

  }

};

export const eliminarPaquete = async (req, res) => {

  try {

    const { id } = req.params;

    const resultado = await eliminarPaqueteModel(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: "Paquete no encontrado"
      });
    }

    res.status(200).json({
      message: "Paquete eliminado correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error al eliminar paquete"
    });

  }

};