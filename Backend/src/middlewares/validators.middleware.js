// Helpers internos
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telefonoRegex = /^\d{7,15}$/;

const esVacio = (valor) => !valor || String(valor).trim() === "";

export const validarRegistro = (req, res, next) => {
  const { nombre, fullName, email, password } = req.body;
  const errores = [];

  // nombre o fullName es obligatorio
  const nombreEfectivo = fullName || nombre;
  if (esVacio(nombreEfectivo)) {
    errores.push("El nombre es obligatorio.");
  }

  // email obligatorio y con formato válido
  if (esVacio(email)) {
    errores.push("El correo electrónico es obligatorio.");
  } else if (!emailRegex.test(email.trim())) {
    errores.push("El correo electrónico no tiene un formato válido.");
  }

  // password obligatoria y con mínimo de seguridad
  if (esVacio(password)) {
    errores.push("La contraseña es obligatoria.");
  } else if (password.length < 8) {
    errores.push("La contraseña debe tener al menos 8 caracteres.");
  }

  // teléfono opcional, pero si viene debe ser numérico
  const telefono = req.body.telefono || req.body.phone;
  if (telefono && !telefonoRegex.test(String(telefono).trim())) {
    errores.push("El teléfono debe contener entre 7 y 15 dígitos numéricos.");
  }

  if (errores.length > 0) {
    return res.status(400).json({
      message: "Datos de registro inválidos.",
      errores,
    });
  }

  next();
};

export const validarLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errores = [];

  if (esVacio(email)) {
    errores.push("El correo electrónico es obligatorio.");
  } else if (!emailRegex.test(email.trim())) {
    errores.push("El correo electrónico no tiene un formato válido.");
  }

  if (esVacio(password)) {
    errores.push("La contraseña es obligatoria.");
  }

  if (errores.length > 0) {
    return res.status(400).json({
      message: "Datos de inicio de sesión inválidos.",
      errores,
    });
  }

  next();
};

export const validarActualizarUsuario = (req, res, next) => {
  const { email, rol, status, password } = req.body;
  const errores = [];

  // Si envían email, validar formato
  if (email !== undefined && !emailRegex.test(String(email).trim())) {
    errores.push("El correo electrónico no tiene un formato válido.");
  }

  // Si envían rol, validar que sea permitido
  if (rol !== undefined && !["usuario", "admin"].includes(rol)) {
    errores.push("El rol debe ser 'usuario' o 'admin'.");
  }

  // Si envían status, validar que sea permitido (en español, igual que la BD)
  if (status !== undefined && !["activo", "inactivo"].includes(status)) {
    errores.push("El status debe ser 'activo' o 'inactivo'.");
  }

  // Si envían contraseña, validar longitud
  if (password !== undefined && password.length < 8) {
    errores.push("La contraseña debe tener al menos 8 caracteres.");
  }

  // Verificar que al menos un campo venga en el body
  const camposPermitidos = ["nombre", "apellido", "email", "telefono", "rol", "status", "password"];
  const tieneCampos = camposPermitidos.some((campo) => req.body[campo] !== undefined);

  if (!tieneCampos) {
    errores.push("Debes enviar al menos un campo para actualizar.");
  }

  if (errores.length > 0) {
    return res.status(400).json({
      message: "Datos de actualización inválidos.",
      errores,
    });
  }

  next();
};

export const validarEditarPerfil = (req, res, next) => {
  const { password } = req.body;
  const errores = [];

  if (password !== undefined && password.length < 8) {
    errores.push("La contraseña debe tener al menos 8 caracteres.");
  }

  const camposPermitidos = ["nombre", "apellido", "telefono", "password"];
  const tieneCampos = camposPermitidos.some((campo) => req.body[campo] !== undefined);

  if (!tieneCampos) {
    errores.push("Debes enviar al menos un campo para actualizar (nombre, apellido, telefono o password).");
  }

  if (errores.length > 0) {
    return res.status(400).json({
      message: "Datos de perfil inválidos.",
      errores,
    });
  }

  next();
};
