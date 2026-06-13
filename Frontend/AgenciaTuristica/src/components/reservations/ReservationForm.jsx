import { useState } from "react";
import PropTypes from "prop-types";

import {
  FaCalendarAlt,
  FaUsers,
  FaPlane,
  FaShieldAlt,
} from "react-icons/fa";

import Button from "../common/Button";
import styles from "./ReservationForm.module.css";

function ReservationForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    date: "",
    people: 1,
    transport: "",
    insurance: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "people" ? Number(value) : value,
    }));
  };

  // 🔥 Validación
  const validate = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = "Selecciona una fecha";
    }

    if (!formData.people || formData.people < 1) {
      newErrors.people = "Debe haber al menos 1 persona";
    }

    if (!formData.transport) {
      newErrors.transport = "Selecciona un transporte";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const isValid =
    formData.date &&
    formData.people >= 1 &&
    formData.transport;

  return (
    <section className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <span className={styles.subtitle}>
          PLANIFICA TU VIAJE
        </span>

        <h2 className={styles.title}>
          Crear Reservación
        </h2>

        <p className={styles.description}>
          Personaliza tu experiencia de viaje
        </p>

        <div className={styles.formGrid}>
          {/* Fecha */}
          <div className={styles.field}>
            <label>
              <FaCalendarAlt /> Fecha de viaje
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

            {errors.date && (
              <span className={styles.error}>
                {errors.date}
              </span>
            )}
          </div>

          {/* Personas */}
          <div className={styles.field}>
            <label>
              <FaUsers /> Personas
            </label>

            <input
              type="number"
              min="1"
              name="people"
              value={formData.people}
              onChange={handleChange}
            />

            {errors.people && (
              <span className={styles.error}>
                {errors.people}
              </span>
            )}
          </div>

          {/* Transporte */}
          <div
            className={`${styles.field} ${styles.fullWidth}`}
          >
            <label>
              <FaPlane /> Transporte
            </label>

            <select
              name="transport"
              value={formData.transport}
              onChange={handleChange}
            >
              <option value="">
                Selecciona una opción
              </option>
              <option value="economico">
                Vuelo Económico
              </option>
              <option value="premium">
                Vuelo Premium
              </option>
              <option value="autobus">
                Autobús
              </option>
            </select>

            {errors.transport && (
              <span className={styles.error}>
                {errors.transport}
              </span>
            )}
          </div>
        </div>

        {/* Seguro */}
        <div className={styles.insuranceSection}>
          <label className={styles.insuranceLabel}>
            <FaShieldAlt /> Seguro de viaje
          </label>

          <div className={styles.options}>
            <button
              type="button"
              className={
                !formData.insurance
                  ? `${styles.option} ${styles.optionActive}`
                  : styles.option
              }
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  insurance: false,
                }))
              }
            >
              Sin seguro
            </button>

            <button
              type="button"
              className={
                formData.insurance
                  ? `${styles.option} ${styles.optionActive}`
                  : styles.option
              }
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  insurance: true,
                }))
              }
            >
              Con seguro
            </button>
          </div>
        </div>

        {/* Botón */}
        <div className={styles.actions}>
          <Button
            text="CONTINUAR AL PAGO"
            type="submit"
            disabled={!isValid}
          />
        </div>
      </form>
    </section>
  );
}

ReservationForm.propTypes = {
  onSubmit: PropTypes.func,
};

export default ReservationForm;