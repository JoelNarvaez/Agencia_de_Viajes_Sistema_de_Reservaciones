import db from "../config/db.js";

const ESTADOS_VALIDOS = ["pendiente", "confirmada", "cancelada", "pagada"];

// Listar todas las reservaciones con info del usuario y paquete

export const listarTodasReservaciones = async (req, res) => {
  // Filtro opcional: GET /api/admin/reservaciones?estado=pendiente
  const { estado } = req.query;

  // Validar el estado si viene como parámetro
  if (estado && !ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({
      message: `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(", ")}`,
    });
  }

  // Construir WHERE dinámico según si viene filtro o no
  const whereClause = estado ? "WHERE r.estado = ?" : "";
  const params      = estado ? [estado] : [];

  try {
    const [reservaciones] = await db.query(
      `SELECT r.id,
              r.estado,
              r.fecha_llegada,
              r.fecha_salida,
              r.total_huespedes,
              r.monto_total,
              r.creado_en,
              r.cancelado_en,
              r.motivo_cancelacion,
              u.id     AS usuario_id,
              u.nombre,
              u.apellido,
              u.email,
              p.id     AS paquete_id,
              p.slug   AS paquete_slug,
              p.titulo AS paquete_titulo,
              p.destino
       FROM   reservaciones r
       JOIN   usuarios u ON r.usuario_id = u.id
       JOIN   paquetes  p ON r.paquete_id = p.id
       ${whereClause}
       ORDER BY r.creado_en DESC`,
      params
    );

    return res.status(200).json({ reservaciones, total: reservaciones.length });

  } catch (error) {
    console.error("[listarTodasReservaciones]", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Ver detalle completo de una reservación
export const obtenerReservacionAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const [reservaciones] = await db.query(
      `SELECT r.*,
              u.nombre,
              u.apellido,
              u.email,
              u.telefono,
              p.titulo          AS paquete_titulo,
              p.slug            AS paquete_slug,
              p.destino,
              p.imagen_principal,
              p.modo_reserva,
              p.es_reembolsable,
              hr.adultos, hr.ninos, hr.bebes, hr.mascotas,
              s.fecha_inicio    AS salida_fecha_inicio,
              s.fecha_fin       AS salida_fecha_fin
       FROM   reservaciones r
       JOIN   usuarios  u  ON r.usuario_id = u.id
       JOIN   paquetes  p  ON r.paquete_id = p.id
       LEFT JOIN huespedes_reservacion hr ON hr.reservacion_id = r.id
       LEFT JOIN salidas s ON r.salida_id = s.id
       WHERE  r.id = ?`,
      [id]
    );

    if (reservaciones.length === 0) {
      return res.status(404).json({ message: "Reservación no encontrada" });
    }

    return res.status(200).json({ reservacion: reservaciones[0] });

  } catch (error) {
    console.error("[obtenerReservacionAdmin]", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Cambiar el estado de una reservación
export const cambiarEstadoReservacion = async (req, res) => {
  const { id } = req.params;
  const { estado, motivo } = req.body;

  if (!estado) {
    return res.status(400).json({ message: "Debes enviar el campo 'estado'" });
  }

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({
      message: `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(", ")}`,
    });
  }

  try {
    const [reservaciones] = await db.query(
      `SELECT r.*, r.salida_id, r.total_huespedes, r.estado AS estado_actual
       FROM reservaciones r WHERE r.id = ?`,
      [id]
    );

    if (reservaciones.length === 0) {
      return res.status(404).json({ message: "Reservación no encontrada" });
    }

    const reservacion = reservaciones[0];

    if (reservacion.estado_actual === estado) {
      return res.status(400).json({ message: `La reservación ya tiene el estado '${estado}'` });
    }

    // Si se cancela desde admin y era fecha-fija → regresar cupos
    if (estado === "cancelada" && reservacion.estado_actual !== "cancelada" && reservacion.salida_id) {
      await db.query(
        "UPDATE salidas SET cupos_disponibles = cupos_disponibles + ? WHERE id = ?",
        [reservacion.total_huespedes, reservacion.salida_id]
      );
    }

    // Si se reactiva (de cancelada a otro estado) y era fecha-fija → descontar cupos nuevamente
    if (reservacion.estado_actual === "cancelada" && estado !== "cancelada" && reservacion.salida_id) {
      // Verificar cupos disponibles antes de reactivar
      const [salidas] = await db.query(
        "SELECT cupos_disponibles FROM salidas WHERE id = ?",
        [reservacion.salida_id]
      );
      if (salidas.length > 0 && salidas[0].cupos_disponibles < reservacion.total_huespedes) {
        return res.status(400).json({ message: "No hay cupos disponibles para reactivar esta reservación" });
      }
      await db.query(
        "UPDATE salidas SET cupos_disponibles = cupos_disponibles - ? WHERE id = ?",
        [reservacion.total_huespedes, reservacion.salida_id]
      );
    }

    // Actualizar estado
    const canceladoEn = estado === "cancelada" ? new Date() : null;

    await db.query(
      `UPDATE reservaciones
       SET estado = ?,
           cancelado_en = ?,
           motivo_cancelacion = ?
       WHERE id = ?`,
      [estado, canceladoEn, motivo ?? null, id]
    );

    return res.status(200).json({
      message: `Estado de la reservación actualizado a '${estado}'`,
    });

  } catch (error) {
    console.error("[cambiarEstadoReservacion]", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
