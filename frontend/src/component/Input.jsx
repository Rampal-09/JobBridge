const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  error,
}) => {
  return (
    <>
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
            w-full
          max-w-96
          rounded-lg
          border
          px-4
          py-2
          outline-none
          transition

          ${
            error
              ? "border-red-500"
              : "border-slate-300 focus:border-indigo-500"
          }

          disabled:bg-slate-100
        `}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </>
  );
};

export default Input;
