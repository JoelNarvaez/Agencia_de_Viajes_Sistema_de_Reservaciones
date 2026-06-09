import PropTypes from "prop-types";
import styles from "./Modal.module.css";

function Modal({
  isOpen,
  title,
  children,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3>{title}</h3>

          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default Modal;