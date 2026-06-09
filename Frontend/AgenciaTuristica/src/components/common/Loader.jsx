import PropTypes from "prop-types";
import styles from "./Loader.module.css";

function Loader({
  text = "Cargando...",
}) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p>{text}</p>
    </div>
  );
}

Loader.propTypes = {
  text: PropTypes.string,
};

export default Loader;