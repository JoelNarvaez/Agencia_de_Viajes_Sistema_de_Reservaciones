import { Router } from "express";
import {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  verPerfil,
  editarPerfil,
} from "../controllers/usuarios.controller.js";
import { verificarToken, esAdmin } from "../middlewares/auth.middleware.js";
import {
  validarActualizarUsuario,
  validarEditarPerfil,
} from "../middlewares/validators.middleware.js";

const router = Router();

// Perfil del usuario autenticado (cualquier rol)
router.get("/perfil",  verificarToken, verPerfil);
router.put("/perfil",  verificarToken, validarEditarPerfil, editarPerfil);

// CRUD de usuarios — Solo admin
router.get("/",        verificarToken, esAdmin, listarUsuarios);
router.get("/:id",     verificarToken, esAdmin, obtenerUsuario);
router.put("/:id",     verificarToken, esAdmin, validarActualizarUsuario, actualizarUsuario);
router.delete("/:id",  verificarToken, esAdmin, eliminarUsuario);

export default router;
