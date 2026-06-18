import { Router } from "express";
import { registro, login } from "../controllers/auth.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { validarRegistro, validarLogin } from "../middlewares/validators.middleware.js";

const router = Router();

// Rutas públicas
//router.post("/registro", validarRegistro, registro);   
router.post("/register", validarRegistro, registro);  
router.post("/login", validarLogin, login);

// Ruta de prueba protegida
router.get("/test-protegida", verificarToken, (req, res) => {
  res.json({ message: "Pasaste la validación ✓", usuario: req.usuario });
});

export default router;