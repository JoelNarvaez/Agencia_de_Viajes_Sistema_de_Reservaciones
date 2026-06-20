import styles from "./AboutCTA.module.css";
import Button from "../common/Button.jsx";
import { useNavigate } from "react-router-dom";

function AboutCTA() {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <div className={styles.card}>

        <span className={styles.badge}>
          COMIENZA TU VIAJE
        </span>

        <h2>
          Tu próxima aventura
          comienza aquí
        </h2>

        <p>
          Descubre destinos increíbles,
          vive experiencias inolvidables
          y encuentra el viaje perfecto
          para tu próxima escapada.
        </p>

        <Button
          text="Explorar Paquetes"
          onClick={() =>
            navigate("/packages")
          }
        />

      </div>
    </section>
  );
}

export default AboutCTA;