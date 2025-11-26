import React from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface CheckboxProps<T extends FieldValues = FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
}

const Checkbox = <T extends FieldValues = FieldValues>(
  props: CheckboxProps<T>
) => {
  const { label, name, register, error } = props;
  return (
    <div>
      <div className="flex items-center">
        <input
          id={name}
          type="checkbox"
          {...register(name)}
          className="w-4 h-4 accent-black rounded"
        />
        <label
          htmlFor={name}
          className="block ml-3 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Checkbox;
