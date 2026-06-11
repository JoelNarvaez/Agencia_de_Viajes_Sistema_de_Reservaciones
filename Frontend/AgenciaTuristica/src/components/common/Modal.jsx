import PropTypes from "prop-types";

import {
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";

import styles from "./Modal.module.css";

function Modal({
  isOpen,
  title,
  children,
  onClose,
  type = "default",
  size = "md",
  footer,
}) {
  if (!isOpen) return null;

  const iconMap = {
    success: <FaCheckCircle />,
    error: <FaTimesCircle />,
    warning: <FaExclamationTriangle />,
    info: <FaInfoCircle />,
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={`${styles.modal} ${styles[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            {type !== "default" && (
              <span
                className={`${styles.icon} ${styles[type]}`}
              >
                {iconMap[type]}
              </span>
            )}

            <h2>{title}</h2>
          </div>

          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <div className={styles.body}>
          {children}
        </div>

        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,

  type: PropTypes.oneOf([
    "default",
    "success",
    "error",
    "warning",
    "info",
  ]),

  size: PropTypes.oneOf([
    "sm",
    "md",
    "lg",
  ]),

  footer: PropTypes.node,
};

export default Modal;