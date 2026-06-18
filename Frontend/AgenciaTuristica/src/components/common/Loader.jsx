import PropTypes from "prop-types";
import styles from "./Loader.module.css";

function Loader({
  text = "Cargando...",
  variant = "block",
}) {
  return (
    <div className={`${styles.container} ${styles[variant]}`}>
      <div className={styles.spinner}></div>
      <p>{text}</p>
    </div>
  );
}

Loader.propTypes = {
  text: PropTypes.string,
  variant: PropTypes.oneOf(["block", "inline"]),
};

export default Loader;
