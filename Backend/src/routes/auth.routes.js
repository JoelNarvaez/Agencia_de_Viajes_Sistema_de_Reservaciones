import { Router } from "express";
import { registro, login, logout } from "../controllers/auth.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { validarRegistro, validarLogin } from "../middlewares/validators.middleware.js";

const router = Router();

// Rutas públicas
//router.post("/registro", validarRegistro, registro); 
router.post("/register", validarRegistro, registro); 

router.post("/login", validarLogin, login);

// Rutas protegidas (requieren token)
router.post("/logout", verificarToken, logout);

export default router;