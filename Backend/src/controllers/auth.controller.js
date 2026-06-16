import bcrypt from "bcrypt";
import db from "../config/db.js";

export const registro = async (req, res) => {
  const { nombre, apellido, email, telefono, password } = req.body;

  // Validaciones
  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    // Verificar si el email ya existe
    const [existe] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existe.length > 0) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await db.query(
      `INSERT INTO usuarios (nombre, apellido, email, telefono, password)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellido, email, telefono || null, hash]
    );

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: result.insertId,
        nombre,
        apellido,
        email,
        telefono: telefono || null,
        rol: "user",
        status: "active",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};