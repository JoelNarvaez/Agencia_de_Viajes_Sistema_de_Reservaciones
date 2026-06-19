import db from "../config/db.js";

// Helper: convierte una fecha a "YYYY-MM-DD"
const toDateStr = (d) => new Date(d).toISOString().split("T")[0];

// Helper: resta N días a una fecha y devuelve "YYYY-MM-DD"
const restarDias = (fechaStr, dias) => {
  const d = new Date(fechaStr);
  d.setDate(d.getDate() - dias);
  return toDateStr(d);
};

const toGuestCount = (value, fallback = 0) => {
  const count = Number(value ?? fallback);
  return Number.isInteger(count) && count >= 0 ? count : null;
};

const toMoney = (value) => Number(Number(value).toFixed(2));

export const crearReservacion = async (req, res) => {
  const usuarioId = req.usuario.id;

  // Aceptar nombres en español o en inglés (compatibilidad con el front)
  const paqueteId  = req.body.paqueteId  ?? req.body.packageId;
  const salidaId   = req.body.salidaId   ?? req.body.departureId   ?? null;
  const fechaLlegada = req.body.fechaLlegada ?? req.body.arrivalDate   ?? null;
  const fechaSalida  = req.body.fechaSalida  ?? req.body.departureDate ?? null;
  const pago = req.body.pago ?? req.body.payment ?? {};
  const estadoInicial = pago.timing === "now" ? "pagada" : "pendiente";

  const huespedes = req.body.huespedes ?? req.body.guests ?? {};
  const adultos   = toGuestCount(huespedes.adultos   ?? huespedes.adults, 1);
  const ninos     = toGuestCount(huespedes.ninos     ?? huespedes.children, 0);
  const bebes     = toGuestCount(huespedes.bebes     ?? huespedes.babies, 0);
  const mascotas  = toGuestCount(huespedes.mascotas  ?? huespedes.pets, 0);

  // Validaciones básicas
  if (!paqueteId) {
    return res.status(400).json({ message: "Falta el ID del paquete" });
  }

  if ([adultos, ninos, bebes, mascotas].some((count) => count === null)) {
    return res.status(400).json({ message: "Los huespedes deben ser numeros enteros validos" });
  }

  if (mascotas > 0) {
    return res.status(400).json({ message: "No se admiten mascotas" });
  }

  if (adultos < 1) {
    return res.status(400).json({ message: "Debe haber al menos un adulto en la reservacion" });
  }

  const totalHuespedes = adultos + ninos;
  if (totalHuespedes < 1) {
    return res.status(400).json({ message: "Debe haber al menos un huésped" });
  }

  try {
    // Verificar que el paquete exista y esté activo 
    const [paquetes] = await db.query(
      "SELECT * FROM paquetes WHERE id = ? AND activo = TRUE",
      [paqueteId]
    );
    if (paquetes.length === 0) {
      return res.status(404).json({ message: "Paquete no encontrado o no disponible" });
    }
    const paquete = paquetes[0];

    if (totalHuespedes > paquete.max_huespedes) {
      return res.status(400).json({
        message: `La cantidad de huéspedes supera el máximo permitido (${paquete.max_huespedes})`,
      });
    }

    let fechaInicioReserva, fechaFinReserva, montoTotal;

    // Lógica según el modo del paquete 
    if (paquete.modo_reserva === "fecha-fija") {
      // Paquete con salida fija —
      if (!salidaId) {
        return res.status(400).json({ message: "Debes seleccionar una salida disponible para este paquete" });
      }

      const [salidas] = await db.query(
        "SELECT * FROM salidas WHERE id = ? AND paquete_id = ? AND activo = TRUE",
        [salidaId, paqueteId]
      );
      if (salidas.length === 0) {
        return res.status(404).json({ message: "Salida no encontrada o no disponible" });
      }
      const salida = salidas[0];

      if (salida.cupos_disponibles < totalHuespedes) {
        return res.status(400).json({
          message: `Cupos insuficientes. Solo quedan ${salida.cupos_disponibles} lugar(es) disponibles`,
        });
      }

      fechaInicioReserva = toDateStr(salida.fecha_inicio);
      fechaFinReserva    = toDateStr(salida.fecha_fin);
      // Precio final de la salida: cubre hasta el maximo permitido; no se multiplica por persona.
      montoTotal = toMoney(salida.precio ?? paquete.precio);

    } else {
      // Paquete por noche 
      if (!fechaLlegada || !fechaSalida) {
        return res.status(400).json({ message: "Debes proporcionar fecha de llegada y fecha de salida" });
      }

      const llegada = new Date(fechaLlegada);
      const salida  = new Date(fechaSalida);

      if (isNaN(llegada) || isNaN(salida)) {
        return res.status(400).json({ message: "Las fechas proporcionadas no son válidas" });
      }
      if (salida <= llegada) {
        return res.status(400).json({ message: "La fecha de salida debe ser posterior a la de llegada" });
      }

      const noches = Math.round((salida - llegada) / (1000 * 60 * 60 * 24));

      if (paquete.noches_minimas && noches < paquete.noches_minimas) {
        return res.status(400).json({
          message: `La estadía mínima es de ${paquete.noches_minimas} noche(s)`,
        });
      }

      fechaInicioReserva = toDateStr(llegada);
      fechaFinReserva    = toDateStr(salida);
      // Precio final por noche: cambia por duracion, no por cantidad de huespedes dentro de capacidad.
      montoTotal = toMoney(Number(paquete.precio) * noches);
    }

    // Calcular fecha límite de cancelación 
    const fechaLimiteCancelacion = restarDias(
      fechaInicioReserva,
      paquete.dias_cancelacion_anticipada
    );

    // Insertar reservación 
    const [result] = await db.query(
      `INSERT INTO reservaciones
         (usuario_id, paquete_id, salida_id, fecha_llegada, fecha_salida,
          total_huespedes, monto_total, estado, fecha_limite_cancelacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuarioId, paqueteId, salidaId,
        fechaInicioReserva, fechaFinReserva,
        totalHuespedes, montoTotal.toFixed(2), estadoInicial,
        fechaLimiteCancelacion,
      ]
    );

    const reservacionId = result.insertId;

    // Insertar huéspedes 
    await db.query(
      `INSERT INTO huespedes_reservacion (reservacion_id, adultos, ninos, bebes, mascotas)
       VALUES (?, ?, ?, ?, ?)`,
      [reservacionId, adultos, ninos, bebes, mascotas]
    );

    // Descontar cupos si es fecha fija 
    if (paquete.modo_reserva === "fecha-fija" && salidaId) {
      await db.query(
        "UPDATE salidas SET cupos_disponibles = cupos_disponibles - ? WHERE id = ?",
        [totalHuespedes, salidaId]
      );
    }

    // Devolver reservación con datos del paquete
    const [reservacion] = await db.query(
      `SELECT r.*,
              p.titulo      AS paquete_titulo,
              p.slug        AS paquete_slug,
              p.destino,
              p.imagen_principal,
              p.modo_reserva,
              hr.adultos, hr.ninos, hr.bebes, hr.mascotas
       FROM   reservaciones r
       JOIN   paquetes p ON r.paquete_id = p.id
       LEFT JOIN huespedes_reservacion hr ON hr.reservacion_id = r.id
       WHERE  r.id = ?`,
      [reservacionId]
    );

    return res.status(201).json({
      message: "Reservación creada correctamente",
      reservacion: reservacion[0],
    });

  } catch (error) {
    console.error("[crearReservacion]", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Listar las reservaciones del usuario autenticado
export const misReservaciones = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const [reservaciones] = await db.query(
      `SELECT r.id,
              r.fecha_llegada,
              r.fecha_salida,
              r.total_huespedes,
              r.monto_total,
              r.estado,
              r.fecha_limite_cancelacion,
              r.creado_en,
              p.titulo      AS paquete_titulo,
              p.slug        AS paquete_slug,
              p.destino,
              p.imagen_principal,
              hr.adultos, hr.ninos, hr.bebes, hr.mascotas
       FROM   reservaciones r
       JOIN   paquetes p ON r.paquete_id = p.id
       LEFT JOIN huespedes_reservacion hr ON hr.reservacion_id = r.id
       WHERE  r.usuario_id = ?
       ORDER BY r.creado_en DESC`,
      [usuarioId]
    );

    return res.status(200).json({ reservaciones });

  } catch (error) {
    console.error("[misReservaciones]", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Ver detalle de una reservación (solo la propia o admin)
export const obtenerReservacion = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.usuario.id;
  const esAdmin   = req.usuario.rol === "admin";

  try {
    const [reservaciones] = await db.query(
      `SELECT r.*,
              p.titulo           AS paquete_titulo,
              p.slug             AS paquete_slug,
              p.destino,
              p.imagen_principal,
              p.modo_reserva,
              p.es_reembolsable,
              hr.adultos, hr.ninos, hr.bebes, hr.mascotas
       FROM   reservaciones r
       JOIN   paquetes p ON r.paquete_id = p.id
       LEFT JOIN huespedes_reservacion hr ON hr.reservacion_id = r.id
       WHERE  r.id = ?`,
      [id]
    );

    if (reservaciones.length === 0) {
      return res.status(404).json({ message: "Reservación no encontrada" });
    }

    const reservacion = reservaciones[0];

    // Solo el dueño o un admin puede ver el detalle
    if (!esAdmin && reservacion.usuario_id !== usuarioId) {
      return res.status(403).json({ message: "No tienes permiso para ver esta reservación" });
    }

    return res.status(200).json({ reservacion });

  } catch (error) {
    console.error("[obtenerReservacion]", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Cancelar una reservación propia (usuario o admin)
export const cancelarReservacion = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.usuario.id;
  const esAdmin   = req.usuario.rol === "admin";

  const motivo = req.body.motivo ?? req.body.reason ?? null;

  try {
    // Obtener reservación con datos del paquete
    const [reservaciones] = await db.query(
      `SELECT r.*, p.es_reembolsable, p.dias_cancelacion_anticipada
       FROM   reservaciones r
       JOIN   paquetes p ON r.paquete_id = p.id
       WHERE  r.id = ?`,
      [id]
    );

    if (reservaciones.length === 0) {
      return res.status(404).json({ message: "Reservación no encontrada" });
    }

    const reservacion = reservaciones[0];

    // Solo el dueño o un admin puede cancelar
    if (!esAdmin && reservacion.usuario_id !== usuarioId) {
      return res.status(403).json({ message: "No tienes permiso para cancelar esta reservación" });
    }

    if (reservacion.estado === "cancelada") {
      return res.status(400).json({ message: "La reservación ya está cancelada" });
    }

    if (reservacion.estado === "pagada") {
      return res.status(400).json({ message: "No se puede cancelar una reservación ya pagada" });
    }

    // Validar política de reembolso (solo para usuarios normales, admin puede siempre)
    if (!esAdmin) {
      if (!reservacion.es_reembolsable) {
        return res.status(400).json({ message: "Este paquete no permite cancelaciones" });
      }

      const hoy  = new Date();
      const limite = new Date(reservacion.fecha_limite_cancelacion);
      if (hoy > limite) {
        return res.status(400).json({
          message: `La fecha límite para cancelar era el ${toDateStr(limite)}. Ya no es posible cancelar`,
        });
      }
    }

    // Cancelar la reservación
    await db.query(
      `UPDATE reservaciones
       SET estado = 'cancelada', cancelado_en = NOW(), motivo_cancelacion = ?
       WHERE id = ?`,
      [motivo, id]
    );

    // Regresar cupos si era fecha fija
    if (reservacion.salida_id) {
      await db.query(
        "UPDATE salidas SET cupos_disponibles = cupos_disponibles + ? WHERE id = ?",
        [reservacion.total_huespedes, reservacion.salida_id]
      );
    }

    return res.status(200).json({ message: "Reservación cancelada correctamente" });

  } catch (error) {
    console.error("[cancelarReservacion]", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
