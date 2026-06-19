import { Router } from "express";
import {
  listarTodasReservaciones,
  obtenerReservacionAdmin,
  cambiarEstadoReservacion,
} from "../controllers/admin.reservaciones.controller.js";
import { verificarToken, esAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verificarToken, esAdmin, listarTodasReservaciones);

//  Detalle de una reservación (admin)
router.get("/:id", verificarToken, esAdmin, obtenerReservacionAdmin);

router.patch("/:id/estado", verificarToken, esAdmin, cambiarEstadoReservacion);

export default router;
