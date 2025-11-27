import React from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface SelectProps<T extends FieldValues = FieldValues> {
  label: string;
  name: Path<T>;
  options: { label: string; value: string | number }[];
  register: UseFormRegister<T>;
  error?: string;
  valueAsNumber?: boolean;
}

const Select = <T extends FieldValues = FieldValues>(props: SelectProps<T>) => {
  const { label, name, options, register, error, valueAsNumber } = props;
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-stone-700"
      >
        {label}
      </label>
      <div className="mt-1">
        <select
          id={name}
          {...register(name, { valueAsNumber })}
          className="block w-full px-3 py-2 border border-gray-400 rounded-md"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
