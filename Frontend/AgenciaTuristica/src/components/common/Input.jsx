import styles from "./Input.module.css";

function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      <input
        className={styles.input}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {error && (
        <span className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;