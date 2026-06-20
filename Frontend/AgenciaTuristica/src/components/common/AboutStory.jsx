import styles from "./AboutStory.module.css";

function AboutStory() {
  return (
    <section className={styles.section}>

      <div className={styles.storyContainer}>

        <div className={styles.image}></div>

        <div className={styles.text}>

          <span>Nuestra Historia</span>

          <h2>
            Más que una agencia de viajes
          </h2>

          <p>
            Nacimos con el propósito de conectar
            personas con experiencias inolvidables.
            Creemos que viajar no es solo visitar
            un lugar, sino descubrir nuevas culturas,
            crear recuerdos y vivir momentos únicos.
          </p>

          <p>
            A lo largo de los años hemos ayudado a
            miles de viajeros a explorar destinos
            increíbles con seguridad, confianza y
            atención personalizada.
          </p>

        </div>

      </div>

      <div className={styles.cards}>

        <div className={styles.card}>

          <h3>Misión</h3>

          <p>
            Brindar experiencias de viaje excepcionales,
            ofreciendo destinos cuidadosamente seleccionados
            y un servicio que inspire confianza en cada aventura.
          </p>

        </div>

        <div className={styles.card}>

          <h3>Visión</h3>

          <p>
            Ser la agencia de viajes líder en innovación,
            calidad y atención personalizada, convirtiendo
            cada viaje en una experiencia memorable.
          </p>

        </div>

      </div>

    </section>
  );
}

export default AboutStory;