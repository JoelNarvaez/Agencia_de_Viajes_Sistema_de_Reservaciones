import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import usePublicPackages from '../../hooks/usePublicPackages'
import useReservation from '../../hooks/useReservation'
import { reservationService } from '../../services/reservationService'
import { formatCurrency } from '../../utils/formatCurrency'
import { buildReservationFromSelection } from '../../utils/reservationStorage'
import { getDigits, validatePaymentData } from '../../utils/validations'
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

function Checkout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, token, user } = useAuth()
  const { isLoading: isLoadingPackages, packages } = usePublicPackages()
  const { loadMine } = useReservation()
  const [activeStep, setActiveStep] = useState(1)
  const [paymentTiming, setPaymentTiming] = useState('now')
  const [paymentData, setPaymentData] = useState(initialPaymentData)
  const [paymentError, setPaymentError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const packageId = searchParams.get('packageId') ?? ''
  const travelPackage = packages.find((item) => item.id === packageId)
  const selection = useMemo(
    () => ({
      arrivalDate: searchParams.get('arrivalDate') ?? '',
      departureDate: searchParams.get('departureDate') ?? '',
      departureId: searchParams.get('departureId'),
      guests: {
        adults: searchParams.get('adults') ?? 1,
        babies: searchParams.get('babies') ?? 0,
        children: searchParams.get('children') ?? 0,
        pets: searchParams.get('pets') ?? 0,
      },
    }),
    [searchParams],
  )
  const reservation = useMemo(
    () => buildReservationFromSelection({ selection, travelPackage, user }),
    [selection, travelPackage, user],
  )
  const priceBreakdown = reservation?.priceBreakdown
  const taxes = priceBreakdown?.taxes ?? 0
  const subtotal = priceBreakdown?.subtotal ?? 0
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
    return validatePaymentData(paymentData)
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

  const handleConfirm = async () => {
    if (!reservation) return

    const validationError = validatePayment()
    if (validationError) {
      setPaymentError(validationError)
      return
    }

    setPaymentError('')
    setIsProcessing(true)

    try {
      const createdReservation = await reservationService.create({
        payment: {
          cardLast4: getDigits(paymentData.cardNumber).slice(-4),
          method: paymentData.method,
          timing: paymentTiming,
        },
        reservation,
        token,
      })
      await loadMine()
      navigate(`/reservations/success?reservationId=${createdReservation.id}`, { replace: true })
    } catch (createError) {
      setPaymentError(createError.message ?? 'No se pudo crear la reservacion.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: `/reservations/checkout?${searchParams.toString()}` }} to="/login" />
  }

  if (isLoadingPackages) {
    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <p>Cargando reservacion...</p>
        </section>
      </main>
    )
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
                      <strong>Paga {formatCurrency(reservation.totalAmount)} ahora</strong>
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
                        {formatCurrency(reservation.totalAmount)} se cobraran antes del viaje. Sin
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
                      <strong>{formatCurrency(paymentDueNow)}</strong>
                    </li>
                    <li>
                      <span>Metodo</span>
                      <strong>Tarjeta **** {getDigits(paymentData.cardNumber).slice(-4)}</strong>
                    </li>
                    <li>
                      <span>Total</span>
                      <strong>{formatCurrency(reservation.totalAmount)}</strong>
                    </li>
                  </ul>
                  {paymentError && <p className={styles.error}>{paymentError}</p>}
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
                <span>{reservation.destination}</span>
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
                <strong>{reservation.guestBreakdown}</strong>
                <Link to={packageDetailPath}>Modificar</Link>
              </div>
            </section>

            <section className={styles.priceDetails}>
              <h3>Detalles del precio</h3>
              <div>
                <span>
                  {priceBreakdown?.units ?? reservation.tripDays}{' '}
                  {priceBreakdown?.unitType ?? (reservation.tripDays === 1 ? 'dia' : 'dias')} x{' '}
                  {formatCurrency(priceBreakdown?.unitPrice ?? Math.round(reservation.totalAmount / reservation.tripDays))}
                </span>
                <strong>
                  <del>{formatCurrency(originalPrice)}</del> {formatCurrency(subtotal)}
                </strong>
              </div>
              <div>
                <span>Impuestos incluidos</span>
                <strong>{formatCurrency(taxes)}</strong>
              </div>
              {reservation.companionGuests > 0 && (
                <div>
                  <span>Bebes sin cargo</span>
                  <strong>{reservation.companionGuests}</strong>
                </div>
              )}
              <div className={styles.priceTotal}>
                <span>Total MXN</span>
                <strong>{formatCurrency(reservation.totalAmount)}</strong>
              </div>
            </section>
          </aside>

        </div>
      </section>
    </main>
  )
}

export default Checkout
