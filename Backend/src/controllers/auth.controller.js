import bcrypt from "bcrypt";
import db from "../config/db.js";
import jwt from "jsonwebtoken";

// Helper: genera el JWT para un usuario
const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

export const registro = async (req, res) => {
  // El front puede enviar fullName (nombre completo) o nombre+apellido por separado
  let { nombre, apellido, fullName, email, telefono, phone, password } = req.body;

  // Adaptar si viene fullName desde el front
  if (fullName && !nombre) {
    const partes = fullName.trim().split(" ");
    nombre = partes[0];
    apellido = partes.slice(1).join(" ") || "";
  }

  // Adaptar si viene phone en lugar de telefono
  if (phone && !telefono) telefono = phone;

  // Validación de campos obligatorios
  // apellido es NOT NULL en la BD — si viene fullName sin apellido, usar string vacío
  if (apellido === undefined) apellido = "";

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios (nombre, email, password)" });
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

    // Insertar usuario con rol y status por defecto
    const [result] = await db.query(
      `INSERT INTO usuarios (nombre, apellido, email, telefono, password, rol, status)
       VALUES (?, ?, ?, ?, ?, 'usuario', 'activo')`,
      [nombre, apellido || "", email, telefono || null, hash]
    );

    const nuevoUsuario = {
      id: result.insertId,
      nombre,
      apellido: apellido || "",
      email,
      telefono: telefono || null,
      rol: "usuario",
      status: "activo",
    };

    // Generar token
    const token = generarToken(nuevoUsuario);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      token,
      user: nuevoUsuario,
    });
  } catch (error) {
    console.error("[registro]", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
  }

  try {
    const [usuarios] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const usuario = usuarios[0];

    if (usuario.status === "inactivo") {
      return res.status(403).json({ message: "Usuario inactivo, contacta al administrador" });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = generarToken(usuario);

    res.status(200).json({
      message: "Inicio de sesión correcto",
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("[login]", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};