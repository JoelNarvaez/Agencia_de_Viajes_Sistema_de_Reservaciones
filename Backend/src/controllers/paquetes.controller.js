import {
  obtenerPaquetesModel,
  obtenerPaquetePorSlugModel,
  crearPaqueteModel,
  actualizarPaqueteModel,
  eliminarPaqueteModel
} from "../models/paquetes.model.js";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const obtenerPaquetes = async (req, res) => {
  try {
    let incluirInactivos = false;

    // Si viene todos=true, validamos token de admin
    if (req.query.todos === "true") {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.rol !== "admin") {
          return res.status(403).json({ message: "Acceso denegado: se requiere rol de administrador" });
        }
        incluirInactivos = true;
      } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
      }
    }

    const paquetes = await obtenerPaquetesModel(incluirInactivos);
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

    // 1. Validar si existen reservaciones asociadas a este paquete
    const [reservas] = await db.query(
      "SELECT COUNT(*) AS total FROM reservaciones WHERE paquete_id = ?",
      [id]
    );

    if (reservas[0].total > 0) {
      return res.status(400).json({
        message: "No se puede eliminar el paquete porque existen reservaciones asociadas."
      });
    }

    // 2. Si no hay reservaciones, realizar eliminación definitiva
    const resultado = await eliminarPaqueteModel(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: "Paquete no encontrado"
      });
    }

    res.status(200).json({
      message: "Paquete eliminado definitivamente del sistema."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al eliminar paquete"
    });
  }
};