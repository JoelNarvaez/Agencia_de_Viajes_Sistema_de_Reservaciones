import { useRef, useState } from "react";
import styles from "./AboutContactForm.module.css";

function AboutContactForm() {
  const formRef = useRef(null);
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!name || !email) {
      setMessage("Agrega tu nombre y correo para enviar la solicitud.");
      return;
    }

    setMessage(`Solicitud recibida para ${name}. Te contactaremos pronto.`);
    formRef.current?.reset();
  };

  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div>
          <span>Contacto rapido</span>
          <h2>Planea una experiencia a tu medida</h2>
          <p>
            Comparte tus datos y el tipo de viaje que tienes en mente para recibir una propuesta inicial.
          </p>
        </div>

        <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
          <label>
            Nombre
            <input name="name" placeholder="Tu nombre" />
          </label>
          <label>
            Correo
            <input name="email" placeholder="correo@ejemplo.com" type="email" />
          </label>
          <label>
            Interes
            <select defaultValue="playa" name="interest">
              <option value="playa">Playa</option>
              <option value="cultura">Cultura</option>
              <option value="aventura">Aventura</option>
              <option value="relax">Relax</option>
            </select>
          </label>
          <button type="submit">Enviar solicitud</button>
          {message && <p className={styles.message}>{message}</p>}
        </form>
      </div>
    </section>
  );
}

export default AboutContactForm;
