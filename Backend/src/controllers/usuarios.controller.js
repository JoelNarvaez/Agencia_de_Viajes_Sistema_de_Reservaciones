import bcrypt from "bcrypt";
import db from "../config/db.js";

// Listar todos los usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const [usuarios] = await db.query(
      "SELECT id, nombre, apellido, email, telefono, rol, status, created_at FROM usuarios ORDER BY id ASC"
    );
    res.status(200).json({ usuarios });
  } catch (error) {
    console.error("[listarUsuarios]", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener un usuario por ID
export const obtenerUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const [usuarios] = await db.query(
      "SELECT id, nombre, apellido, email, telefono, rol, status, created_at FROM usuarios WHERE id = ?",
      [id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ usuario: usuarios[0] });
  } catch (error) {
    console.error("[obtenerUsuario]", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Actualizar datos, rol o status de un usuario
export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, telefono, rol, status, password } = req.body;

  try {
    // Verificar que el usuario exista
    const [existe] = await db.query("SELECT id FROM usuarios WHERE id = ?", [id]);
    if (existe.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validar valores permitidos para rol y status
    const rolesPermitidos = ["usuario", "admin"];
    const statusPermitidos = ["activo", "inactivo"];

    if (rol && !rolesPermitidos.includes(rol)) {
      return res.status(400).json({ message: "Rol inválido. Use 'usuario' o 'admin'" });
    }
    if (status && !statusPermitidos.includes(status)) {
      return res.status(400).json({ message: "Status inválido. Use 'activo' o 'inactivo'" });
    }

    // Si se envía nueva contraseña, encriptarla
    let hash = undefined;
    if (password) {
      hash = await bcrypt.hash(password, 10);
    }

    // Construir la consulta dinámicamente con los campos enviados
    const campos = [];
    const valores = [];

    if (nombre !== undefined)   { campos.push("nombre = ?");   valores.push(nombre); }
    if (apellido !== undefined) { campos.push("apellido = ?"); valores.push(apellido); }
    if (email !== undefined)    { campos.push("email = ?");    valores.push(email); }
    if (telefono !== undefined) { campos.push("telefono = ?"); valores.push(telefono); }
    if (rol !== undefined)      { campos.push("rol = ?");      valores.push(rol); }
    if (status !== undefined)   { campos.push("status = ?");   valores.push(status); }
    if (hash !== undefined)     { campos.push("password = ?"); valores.push(hash); }

    if (campos.length === 0) {
      return res.status(400).json({ message: "No se enviaron campos para actualizar" });
    }

    valores.push(id);
    await db.query(
      `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`,
      valores
    );

    // Devolver usuario actualizado
    const [actualizado] = await db.query(
      "SELECT id, nombre, apellido, email, telefono, rol, status FROM usuarios WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Usuario actualizado correctamente",
      usuario: actualizado[0],
    });
  } catch (error) {
    console.error("[actualizarUsuario]", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  // Evitar que un admin se elimine a sí mismo
  if (parseInt(id) === req.usuario.id) {
    return res.status(400).json({ message: "No puedes eliminarte a ti mismo" });
  }

  try {
    const [existe] = await db.query("SELECT id FROM usuarios WHERE id = ?", [id]);
    if (existe.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("[eliminarUsuario]", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Ver los datos del usuario
export const verPerfil = async (req, res) => {
  const idUsuario = req.usuario.id;

  try {
    const [usuarios] = await db.query(
      "SELECT id, nombre, apellido, email, telefono, rol, status, created_at FROM usuarios WHERE id = ?",
      [idUsuario]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ usuario: usuarios[0] });
  } catch (error) {
    console.error("[verPerfil]", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Editar los propios datos (No se puede cambiar rol ni status)
export const editarPerfil = async (req, res) => {
  const idUsuario = req.usuario.id;
  const { nombre, apellido, telefono, password } = req.body;

  try {
    const campos = [];
    const valores = [];

    if (nombre !== undefined)   { campos.push("nombre = ?");   valores.push(nombre); }
    if (apellido !== undefined) { campos.push("apellido = ?"); valores.push(apellido); }
    if (telefono !== undefined) { campos.push("telefono = ?"); valores.push(telefono); }

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      campos.push("password = ?");
      valores.push(hash);
    }

    if (campos.length === 0) {
      return res.status(400).json({ message: "No se enviaron campos para actualizar" });
    }

    valores.push(idUsuario);
    await db.query(
      `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`,
      valores
    );

    // Devolver perfil actualizado
    const [actualizado] = await db.query(
      "SELECT id, nombre, apellido, email, telefono, rol, status FROM usuarios WHERE id = ?",
      [idUsuario]
    );

    res.status(200).json({
      message: "Perfil actualizado correctamente",
      usuario: actualizado[0],
    });
  } catch (error) {
    console.error("[editarPerfil]", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
