import styles from "./Modal.module.css";

function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{title}</h3>

          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            X
          </button>
        </div>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;