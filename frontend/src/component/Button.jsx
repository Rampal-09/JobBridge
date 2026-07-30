const Button = ({
  type = "text",
  variant = "primary",
  children,
  onClick,
  size = "md",
  disabled = false,
}) => {
  const baseStyle =
    "rounded-lg font-medium transition-all duration-300 flex items-center justify-center";
  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105",

    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",

    outline: "border border-slate-300 text-slate-700 hover:bg-slate-100",

    danger: "bg-red-500 text-white hover:bg-red-600",

    success: "bg-green-500 text-white hover:bg-green-600",

    ghost: "text-indigo-600 hover:bg-indigo-50",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
};

export default Button;
