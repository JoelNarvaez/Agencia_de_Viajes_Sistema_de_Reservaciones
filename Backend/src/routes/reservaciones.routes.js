import { Router } from "express";
import {
  crearReservacion,
  misReservaciones,
  obtenerReservacion,
  cancelarReservacion,
} from "../controllers/reservaciones.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarToken, crearReservacion);

router.get("/mis-reservaciones", verificarToken, misReservaciones);

router.get("/:id", verificarToken, obtenerReservacion);

router.patch("/:id/cancelar", verificarToken, cancelarReservacion);

export default router;
