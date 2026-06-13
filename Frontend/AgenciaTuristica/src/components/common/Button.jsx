import PropTypes from "prop-types";
import styles from "./Button.module.css";

function Button({
  text,
  type = "button",
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${styles.button}
        ${styles[variant]}
        ${className}
      `}
    >
      {text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    "button",
    "submit",
    "reset",
  ]),
  onClick: PropTypes.func,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "dark",
    "danger",
  ]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;