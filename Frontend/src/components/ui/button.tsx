import React from "react";

interface ButtonProps {
  label: string;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  type = "button",
  onClick,
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-600 focus:hover:bg-green-500 rounded-md ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
