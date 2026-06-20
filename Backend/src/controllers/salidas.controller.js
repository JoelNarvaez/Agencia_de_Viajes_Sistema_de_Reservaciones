import {
  obtenerSalidasPorPaqueteModel,
  crearSalidaModel,
  actualizarSalidaModel,
  eliminarSalidaModel
} from "../models/salidas.model.js";

export const obtenerSalidasPorPaquete = async (req, res) => {

  try {

    const { paqueteId } = req.params;

    const salidas =
      await obtenerSalidasPorPaqueteModel(paqueteId);

    res.json(salidas);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error al obtener salidas"
    });

  }

};

export const crearSalida = async (req, res) => {

  try {

    const resultado =
      await crearSalidaModel(req.body);

    res.status(201).json({
      message: "Salida creada correctamente",
      id: resultado.insertId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error al crear salida"
    });

  }

};

export const actualizarSalida = async (req, res) => {

  try {

    const { id } = req.params;

    const resultado =
      await actualizarSalidaModel(id, req.body);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: "Salida no encontrada"
      });
    }

    res.json({
      message: "Salida actualizada correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error al actualizar salida"
    });

  }

};

export const eliminarSalida = async (req, res) => {

  try {

    const { id } = req.params;

    const resultado =
      await eliminarSalidaModel(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: "Salida no encontrada"
      });
    }

    res.json({
      message: "Salida eliminada correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error al eliminar salida"
    });

  }

};