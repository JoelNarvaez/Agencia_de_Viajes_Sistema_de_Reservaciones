import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import {
  buildReservationFromDraft,
  clearReservationDraft,
  getReservationDraft,
  saveReservation,
} from '../../utils/reservationStorage'
import styles from './UserPage.module.css'

const initialPaymentData = {
  cardName: '',
  cardNumber: '',
  country: 'Mexico',
  cvc: '',
  expiry: '',
  method: 'card',
  postalCode: '',
}

const getDigits = (value) => value.replace(/\D/g, '')

function Checkout() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [activeStep, setActiveStep] = useState(1)
  const [paymentTiming, setPaymentTiming] = useState('now')
  const [paymentData, setPaymentData] = useState(initialPaymentData)
  const [paymentError, setPaymentError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const draft = getReservationDraft()
  const reservation = useMemo(
    () => (draft ? buildReservationFromDraft(draft, user) : null),
    [draft, user],
  )
  const taxes = reservation ? Math.round(reservation.totalAmount * 0.16) : 0
  const subtotal = reservation ? reservation.totalAmount - taxes : 0
  const originalPrice = reservation ? Math.round(reservation.totalAmount * 1.1) : 0
  const paymentDueNow = paymentTiming === 'now' ? reservation?.totalAmount ?? 0 : 0
  const packageDetailPath = reservation ? `/packages/${reservation.packageId}` : '/packages'

  const handlePaymentChange = (event) => {
    const { name, value } = event.target
    setPaymentData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const validatePayment = () => {
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

  const openStep = (step) => {
    if (step === 1) {
      setActiveStep(1)
      return
    }

    if (step === 2) {
      if (!paymentTiming) return
      setActiveStep(2)
      return
    }

    if (step === 3) {
      const validationError = validatePayment()
      if (validationError) {
        setPaymentError(validationError)
        setActiveStep(2)
        return
      }
      setPaymentError('')
      setActiveStep(3)
    }
  }

  const goToPayment = () => {
    setActiveStep(2)
  }

  const goToReview = () => {
    const validationError = validatePayment()
    if (validationError) {
      setPaymentError(validationError)
      return
    }

    setPaymentError('')
    setActiveStep(3)
  }

  const handleConfirm = () => {
    if (!reservation) return

    const validationError = validatePayment()
    if (validationError) {
      setPaymentError(validationError)
      return
    }

    setPaymentError('')
    setIsProcessing(true)

    window.setTimeout(() => {
      const cardDigits = getDigits(paymentData.cardNumber)

      saveReservation({
        ...reservation,
        payment: {
          amount: paymentDueNow,
          cardLast4: cardDigits.slice(-4),
          method: paymentData.method,
          paidAt: new Date().toISOString(),
          reference: `PAY-${Date.now()}`,
          scheduledAmount: paymentTiming === 'later' ? reservation.totalAmount : 0,
          status: paymentTiming === 'now' ? 'Aprobado' : 'Programado',
          timing: paymentTiming,
        },
        status: 'Confirmada',
      })
      clearReservationDraft()
      navigate(`/reservations/success?reservationId=${reservation.id}`, { replace: true })
    }, 900)
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: '/reservations/checkout' }} to="/login" />
  }

  if (!reservation) {
    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <header className={styles.header}>
            <span className={styles.eyebrow}>Confirmacion</span>
            <h1>Checkout</h1>
            <p>No hay una reserva lista para confirmar.</p>
          </header>

          <div className={styles.emptyState}>
            <h2>Reserva no encontrada</h2>
            <p>Selecciona un paquete para generar el resumen antes de confirmar.</p>
            <div className={styles.actions}>
              <Link to="/packages">Ver paquetes</Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.checkoutHeader}>
          <Link aria-label="Volver al paquete" className={styles.roundBack} to={packageDetailPath}>
            <span aria-hidden="true">{'<'}</span>
          </Link>
          <h1>Confirmar y pagar</h1>
        </header>

        <div className={styles.checkoutLayout}>
          <div className={styles.checkoutSteps}>
            <section className={`${styles.checkoutStep} ${activeStep === 1 ? styles.checkoutStepOpen : ''}`}>
              <button className={styles.stepHeader} type="button" onClick={() => openStep(1)}>
                <span>1. Elige cuando quieres pagar</span>
              </button>
              {activeStep === 1 && (
                <div className={styles.stepBody}>
                  <label className={styles.paymentChoice}>
                    <span>
                      <strong>Paga ${reservation.totalAmount.toLocaleString()} MXN ahora</strong>
                    </span>
                    <input
                      checked={paymentTiming === 'now'}
                      name="paymentTiming"
                      onChange={() => setPaymentTiming('now')}
                      type="radio"
                    />
                  </label>
                  <label className={styles.paymentChoice}>
                    <span>
                      <strong>Paga $0 MXN ahora</strong>
                      <small>
                        ${reservation.totalAmount.toLocaleString()} MXN se cobraran antes del viaje. Sin
                        tarifas adicionales.
                      </small>
                    </span>
                    <input
                      checked={paymentTiming === 'later'}
                      name="paymentTiming"
                      onChange={() => setPaymentTiming('later')}
                      type="radio"
                    />
                  </label>
                  <div className={styles.stepActions}>
                    <button type="button" onClick={goToPayment}>
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className={`${styles.checkoutStep} ${activeStep === 2 ? styles.checkoutStepOpen : ''}`}>
              <button className={styles.stepHeader} type="button" onClick={() => openStep(2)}>
                <span>2. Agrega una forma de pago</span>
              </button>
              {activeStep === 2 && (
                <div className={styles.stepBody}>
                  <div className={styles.paymentMethods}>
                    <section className={styles.paymentMethod}>
                      <label className={styles.paymentMethodHeader}>
                        <span className={styles.paymentBrandIcon} aria-hidden="true">
                          --
                        </span>
                        <span>
                          <strong>Tarjeta de credito o debito</strong>
                          <small>VISA MC AMEX</small>
                        </span>
                        <input
                          checked={paymentData.method === 'card'}
                          name="method"
                          readOnly
                          type="radio"
                        />
                      </label>

                      {paymentData.method === 'card' && (
                        <div className={styles.cardFields}>
                          <label className={styles.cardNumberField}>
                            <span>Numero de tarjeta</span>
                            <input
                              autoComplete="cc-number"
                              inputMode="numeric"
                              maxLength="19"
                              name="cardNumber"
                              onChange={handlePaymentChange}
                              placeholder="0000 0000 0000 0000"
                              value={paymentData.cardNumber}
                            />
                          </label>

                          <label>
                            <span>Caducidad</span>
                            <input
                              autoComplete="cc-exp"
                              maxLength="5"
                              name="expiry"
                              onChange={handlePaymentChange}
                              placeholder="MM / AA"
                              value={paymentData.expiry}
                            />
                          </label>

                          <label>
                            <span>CVV</span>
                            <input
                              autoComplete="cc-csc"
                              inputMode="numeric"
                              maxLength="4"
                              name="cvc"
                              onChange={handlePaymentChange}
                              placeholder="123"
                              value={paymentData.cvc}
                            />
                          </label>
                        </div>
                      )}

                      {paymentData.method === 'card' && (
                        <div className={styles.form}>
                          <label>
                            Titular
                            <input
                              autoComplete="cc-name"
                              name="cardName"
                              onChange={handlePaymentChange}
                              placeholder="Nombre como aparece en la tarjeta"
                              value={paymentData.cardName}
                            />
                          </label>
                          <label>
                            Codigo postal
                            <input
                              autoComplete="postal-code"
                              name="postalCode"
                              onChange={handlePaymentChange}
                              placeholder="Codigo postal"
                              value={paymentData.postalCode}
                            />
                          </label>
                          <label>
                            Pais/region
                            <select name="country" onChange={handlePaymentChange} value={paymentData.country}>
                              <option value="Mexico">Mexico</option>
                              <option value="Estados Unidos">Estados Unidos</option>
                              <option value="Canada">Canada</option>
                            </select>
                          </label>
                        </div>
                      )}
                    </section>
                  </div>
                  {paymentError && <p className={styles.error}>{paymentError}</p>}
                  <div className={styles.stepActions}>
                    <button type="button" onClick={goToReview}>
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className={`${styles.checkoutStep} ${activeStep === 3 ? styles.checkoutStepOpen : ''}`}>
              <button className={styles.stepHeader} type="button" onClick={() => openStep(3)}>
                <span>3. Revisa tu reservacion</span>
              </button>
              {activeStep === 3 && (
                <div className={styles.stepBody}>
                  <ul className={styles.detailList}>
                    <li>
                      <span>Pago ahora</span>
                      <strong>${paymentDueNow.toLocaleString()} MXN</strong>
                    </li>
                    <li>
                      <span>Metodo</span>
                      <strong>Tarjeta **** {getDigits(paymentData.cardNumber).slice(-4)}</strong>
                    </li>
                    <li>
                      <span>Total</span>
                      <strong>${reservation.totalAmount.toLocaleString()} MXN</strong>
                    </li>
                  </ul>
                  <div className={styles.stepActions}>
                    <button disabled={isProcessing} type="button" onClick={handleConfirm}>
                      {isProcessing ? 'Procesando...' : 'Confirmar y pagar'}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className={styles.checkoutSummary}>
            <div className={styles.checkoutPackage}>
              <img src={reservation.image} alt="" />
              <div>
                <h2>{reservation.packageName}</h2>
                <p>4.96 (24)</p>
                <span>Favorito entre huespedes</span>
              </div>
            </div>

            <section className={styles.summarySection}>
              <h3>Cancelacion gratuita</h3>
              <p>
                Si cancelas antes del {reservation.cancellationDeadline}, recibiras un reembolso completo.
              </p>
            </section>

            <section className={styles.editableRows}>
              <div>
                <span>Fechas</span>
                <strong>{reservation.travelDate}</strong>
                <Link to={packageDetailPath}>Modificar</Link>
              </div>
              <div>
                <span>Participantes</span>
                <strong>{reservation.totalGuests} huespedes</strong>
                <Link to={packageDetailPath}>Modificar</Link>
              </div>
            </section>

            <section className={styles.priceDetails}>
              <h3>Detalles del precio</h3>
              <div>
                <span>
                  {reservation.tripDays} {reservation.tripDays === 1 ? 'dia' : 'dias'} x $
                  {Math.round(subtotal / reservation.tripDays).toLocaleString()} MXN
                </span>
                <strong>
                  <del>${originalPrice.toLocaleString()}</del> ${subtotal.toLocaleString()} MXN
                </strong>
              </div>
              <div>
                <span>Impuestos</span>
                <strong>${taxes.toLocaleString()} MXN</strong>
              </div>
              <div className={styles.priceTotal}>
                <span>Total MXN</span>
                <strong>${reservation.totalAmount.toLocaleString()} MXN</strong>
              </div>
            </section>
          </aside>

        </div>
      </section>
    </main>
  )
}

export default Checkout
