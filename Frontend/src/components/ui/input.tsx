import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  className,
  error,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-stone-700">
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        {...props}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${className}`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Input;
