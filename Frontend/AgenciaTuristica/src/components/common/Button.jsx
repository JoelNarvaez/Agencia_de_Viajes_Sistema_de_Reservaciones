import styles from "./Button.module.css";

function Button({
  text,
  type = "button",
  onClick,
  variant = "primary",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]}`}
    >
      {text}
    </button>
  );
}

export default Button;