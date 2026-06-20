import styles from "./AboutHero.module.css";

function AboutHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>

        <span className={styles.eyebrow}>
          SOBRE NOSOTROS
        </span>

        <h1>
          Viajes que inspiran,
          experiencias que perduran
        </h1>

        <p>
          Somos una agencia comprometida con crear
          experiencias de viaje memorables, brindando
          confianza, comodidad y atención personalizada
          en cada aventura.
        </p>

      </div>
    </section>
  );
}

export default AboutHero;