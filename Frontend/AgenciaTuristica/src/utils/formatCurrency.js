// Formatea cantidades en pesos mexicanos para mostrarlas en tarjetas, checkout y reservas.
export const formatCurrency = (amount, { currency = 'MXN', showCurrency = true } = {}) => {
  const numericAmount = Number(amount) || 0
  const formattedAmount = `$${new Intl.NumberFormat('es-MX').format(numericAmount)}`

  return showCurrency ? `${formattedAmount} ${currency}` : formattedAmount
}

export default formatCurrency
