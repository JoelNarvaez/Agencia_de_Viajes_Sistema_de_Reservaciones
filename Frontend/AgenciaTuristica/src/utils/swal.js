import Swal from 'sweetalert2'

// ─── Paleta del proyecto ──────────────────────────────────────────────────────
const COLOR = {
  accent:  '#f8b229',
  green:   '#1f8a4c',
  red:     '#c0392b',
  text:    '#101712',
  subtext: '#6b7a72',
  bg:      '#ffffff',
  border:  'rgba(20, 33, 27, 0.1)',
}

// ─── Instancia base con estilos compartidos ───────────────────────────────────
const base = Swal.mixin({
  background:        COLOR.bg,
  color:             COLOR.text,
  confirmButtonColor: COLOR.accent,
  cancelButtonColor: 'rgba(20, 33, 27, 0.08)',
  customClass: {
    confirmButton: 'swal-btn-confirm',
    cancelButton:  'swal-btn-cancel',
    popup:         'swal-popup',
  },
  buttonsStyling: false,   // usamos nuestras clases CSS
  focusConfirm:   false,
})

// ─── Inyectar estilos globales una sola vez ───────────────────────────────────
if (!document.getElementById('swal-custom-styles')) {
  const style = document.createElement('style')
  style.id = 'swal-custom-styles'
  style.textContent = `
    .swal-popup {
      border-radius: 14px !important;
      border: 1px solid ${COLOR.border} !important;
      border-top: 4px solid ${COLOR.accent} !important;
      font-family: 'Manrope', system-ui, sans-serif !important;
      padding: 28px !important;
    }
    .swal2-title {
      font-family: 'Space Grotesk', 'Manrope', system-ui, sans-serif !important;
      font-size: 18px !important;
      font-weight: 700 !important;
      color: ${COLOR.text} !important;
      letter-spacing: -0.2px !important;
    }
    .swal2-html-container {
      font-family: 'Manrope', system-ui, sans-serif !important;
      font-size: 14px !important;
      color: ${COLOR.subtext} !important;
      margin-top: 6px !important;
    }
    .swal-btn-confirm {
      padding: 10px 22px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      font-family: 'Manrope', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.3px;
      transition: opacity 0.15s, transform 0.15s;
    }
    .swal-btn-confirm:hover  { opacity: 0.88; transform: translateY(-1px); }
    .swal-btn-confirm:active { transform: translateY(0); }

    .swal-btn-cancel {
      padding: 10px 22px;
      border-radius: 999px;
      border: 1px solid rgba(20, 33, 27, 0.15);
      background: rgba(20, 33, 27, 0.06);
      cursor: pointer;
      font-family: 'Manrope', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: ${COLOR.subtext};
      letter-spacing: 0.3px;
      transition: opacity 0.15s, transform 0.15s;
    }
    .swal-btn-cancel:hover  { opacity: 0.8; transform: translateY(-1px); }
    .swal-btn-cancel:active { transform: translateY(0); }

    .swal-btn-danger {
      background: ${COLOR.red} !important;
      color: #fff !important;
    }
    .swal-btn-green {
      background: ${COLOR.green} !important;
      color: #fff !important;
    }
    .swal-btn-yellow {
      background: ${COLOR.accent} !important;
      color: ${COLOR.text} !important;
    }

    .swal2-icon { margin-bottom: 8px !important; }
    .swal2-actions { gap: 10px !important; margin-top: 22px !important; }

    /* Input de motivo (cancelación) */
    .swal2-input, .swal2-textarea {
      font-family: 'Manrope', system-ui, sans-serif !important;
      font-size: 14px !important;
      border: 1px solid rgba(21, 32, 22, 0.12) !important;
      border-radius: 10px !important;
      box-shadow: none !important;
      color: ${COLOR.text} !important;
    }
    .swal2-input:focus, .swal2-textarea:focus {
      border-color: ${COLOR.accent} !important;
      box-shadow: 0 0 0 3px rgba(248, 178, 41, 0.15) !important;
    }
  `
  document.head.appendChild(style)
}

// ─── API pública ──────────────────────────────────────────────────────────────

/** Toast no intrusivo (esquina superior derecha) */
export const toast = {
  success: (title) =>
    Swal.fire({
      toast: true, position: 'top-end', showConfirmButton: false,
      timer: 2800, timerProgressBar: true, icon: 'success',
      title, background: COLOR.bg, color: COLOR.text,
      customClass: { popup: 'swal-popup' },
    }),
  error: (title) =>
    Swal.fire({
      toast: true, position: 'top-end', showConfirmButton: false,
      timer: 3500, timerProgressBar: true, icon: 'error',
      title, background: COLOR.bg, color: COLOR.text,
      customClass: { popup: 'swal-popup' },
    }),
  warning: (title) =>
    Swal.fire({
      toast: true, position: 'top-end', showConfirmButton: false,
      timer: 3000, timerProgressBar: true, icon: 'warning',
      title, background: COLOR.bg, color: COLOR.text,
      customClass: { popup: 'swal-popup' },
    }),
}

/** Confirmación genérica — devuelve true si el usuario confirmó */
/** Mensaje breve cuando el inicio de sesion o registro fue correcto */
export const mostrarLoginExitoso = (nombre = 'usuario', mensaje = 'Bienvenido') =>
  toast.success(`${mensaje}, ${nombre}.`)

export const confirmar = async ({
  titulo,
  texto,
  textoConfirmar = 'Confirmar',
  textoCancelar  = 'Cancelar',
  variante       = 'yellow',   // 'yellow' | 'red' | 'green'
}) => {
  const claseConfirmar = {
    yellow: 'swal-btn-confirm swal-btn-yellow',
    red:    'swal-btn-confirm swal-btn-danger',
    green:  'swal-btn-confirm swal-btn-green',
  }[variante] ?? 'swal-btn-confirm swal-btn-yellow'

  const result = await base.fire({
    title:             titulo,
    html:              texto,
    showCancelButton:  true,
    confirmButtonText: textoConfirmar,
    cancelButtonText:  textoCancelar,
    customClass: {
      confirmButton: claseConfirmar,
      cancelButton:  'swal-btn-cancel',
      popup:         'swal-popup',
    },
  })
  return result.isConfirmed
}

/** Confirmación de eliminación — variante roja con ícono de advertencia */
export const confirmarEliminar = (nombreItem) =>
  confirmar({
    titulo:          '¿Eliminar paquete?',
    texto:           `El paquete <strong>${nombreItem}</strong> quedará inactivo.`,
    textoConfirmar:  'Sí, eliminar',
    textoCancelar:   'Cancelar',
    variante:        'red',
  })

/** Confirmación de activar/desactivar */
export const confirmarToggle = (nombre, activoActual) =>
  confirmar({
    titulo:         activoActual ? '¿Desactivar paquete?' : '¿Activar paquete?',
    texto:          `El paquete <strong>${nombre}</strong> ${activoActual ? 'dejará de mostrarse a los usuarios' : 'volverá a estar disponible'}.`,
    textoConfirmar: activoActual ? 'Desactivar' : 'Activar',
    textoCancelar:  'Cancelar',
    variante:       activoActual ? 'red' : 'green',
  })

/** Pide el motivo de cancelación de una reservación — devuelve el string o null si canceló */
/** Confirma antes de cerrar la sesion actual */
export const confirmarCerrarSesion = () =>
  confirmar({
    titulo: 'Cerrar sesión',
    texto: 'Tu sesión actual se cerrará en este dispositivo.',
    textoConfirmar: 'Cerrar sesión',
    textoCancelar: 'Cancelar',
    variante: 'red',
  })

export const pedirMotivoCancel = async () => {
  const result = await base.fire({
    title:             'Cancelar reservación',
    html:              'Puedes agregar un motivo (opcional).',
    input:             'textarea',
    inputPlaceholder:  'Ej. El cliente solicitó cancelación voluntaria...',
    inputAttributes:   { rows: 3 },
    showCancelButton:  true,
    confirmButtonText: 'Cancelar reservación',
    cancelButtonText:  'Volver',
    customClass: {
      confirmButton: 'swal-btn-confirm swal-btn-danger',
      cancelButton:  'swal-btn-cancel',
      popup:         'swal-popup',
    },
  })
  if (!result.isConfirmed) return null
  return result.value?.trim() || undefined
}

/** Confirmación de cambio de estado de reservación */
export const confirmarEstado = (nuevoEstado) => {
  const config = {
    confirmada: {
      titulo: '¿Confirmar reservación?',
      texto:  'La reservación pasará al estado <strong>Confirmada</strong>.',
      textoConfirmar: 'Sí, confirmar',
      variante: 'green',
    },
    pagada: {
      titulo: '¿Marcar como pagada?',
      texto:  'La reservación pasará al estado <strong>Pagada</strong>.',
      textoConfirmar: 'Marcar como pagada',
      variante: 'green',
    },
  }[nuevoEstado]

  if (!config) return Promise.resolve(false)
  return confirmar({ ...config, textoCancelar: 'Cancelar' })
}
