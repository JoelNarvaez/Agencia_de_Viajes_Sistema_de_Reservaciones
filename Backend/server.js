import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";
import usuariosRoutes from "./src/routes/usuarios.routes.js";

dotenv.config({ override: true });

const app = express();

// ──────────────────────────────────────────────
// Middlewares globales
// ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ──────────────────────────────────────────────
// Rutas
// ──────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/usuarios", usuariosRoutes);

app.get("/", (req, res) => {
  res.send("Backend - Agencia de Viajes funcionando ✓");
});

// ──────────────────────────────────────────────
// Middleware 404 — ruta no encontrada
// (debe ir DESPUÉS de todas las rutas)
// ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// ──────────────────────────────────────────────
// Middleware de manejo de errores global
// (debe ir AL FINAL, con 4 parámetros)
// ──────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[Error global]", err);
  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? "Error interno del servidor";
  res.status(status).json({ message });
});

// ──────────────────────────────────────────────
// Iniciar servidor
// ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
});
