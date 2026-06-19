// Extrae solo numeros de un texto; util para tarjeta, CVC o telefono.
export const getDigits = (value) => String(value ?? '').replace(/\D/g, '')

// Valida el formato basico de un correo.
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email ?? '').trim())

// Valida el formulario de pago simulado y regresa un mensaje de error.
// Si regresa string vacio, los datos son validos para continuar.
export const validatePaymentData = (paymentData) => {
  const cardDigits = getDigits(paymentData.cardNumber)
  const cvcDigits = getDigits(paymentData.cvc)
  const expiryIsValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.expiry)

  if (!paymentData.cardName.trim()) return 'Ingresa el nombre del titular.'
  if (cardDigits.length !== 16) return 'La tarjeta simulada debe tener 16 digitos.'
  if (!expiryIsValid) return 'La vigencia debe tener formato MM/AA.'
  if (cvcDigits.length < 3) return 'El CVC debe tener al menos 3 digitos.'
  if (!paymentData.postalCode.trim()) return 'Ingresa el codigo postal.'

  return ''
}
