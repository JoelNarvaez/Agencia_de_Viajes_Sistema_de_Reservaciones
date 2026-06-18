import { Router } from "express";

import {
  obtenerPaquetes,
  obtenerPaquetePorSlug,
  crearPaquete,
  actualizarPaquete,
  eliminarPaquete
} from "../controllers/paquetes.controller.js";

import {
  verificarToken,
  esAdmin
} from "../middlewares/auth.middleware.js";

const router = Router();

// Públicas
router.get("/", obtenerPaquetes);
router.get("/:slug", obtenerPaquetePorSlug);

// CRUD de paquetes — Solo admin
router.post("/",      verificarToken, esAdmin, crearPaquete);
router.put("/:id",    verificarToken, esAdmin, actualizarPaquete);
router.delete("/:id", verificarToken, esAdmin, eliminarPaquete);

export default router;