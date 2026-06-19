import { Router } from "express";

import {
  obtenerSalidasPorPaquete,
  crearSalida,
  actualizarSalida,
  eliminarSalida
} from "../controllers/salidas.controller.js";

import {
  verificarToken,
  esAdmin
} from "../middlewares/auth.middleware.js";

const router = Router();

// Públicas
router.get("/paquete/:paqueteId", obtenerSalidasPorPaquete);

// CRUD de salidas — Solo admin
router.post("/",      verificarToken, esAdmin, crearSalida);
router.put("/:id",    verificarToken, esAdmin, actualizarSalida);
router.delete("/:id", verificarToken, esAdmin, eliminarSalida);

export default router;