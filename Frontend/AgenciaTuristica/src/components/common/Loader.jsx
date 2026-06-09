import styles from "./Loader.module.css";

function Loader() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p>Cargando...</p>
    </div>
  );
}

export default Loader;