import React from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface RadioProps<T extends FieldValues = FieldValues> {
  label: string;
  name: Path<T>;
  options: { label: string; value: string }[];
  register: UseFormRegister<T>;
  error?: string;
}

const Radio = <T extends FieldValues = FieldValues>(props: RadioProps<T>) => {
  const { label, name, options, register, error } = props;
  return (
    <fieldset>
      <legend className="text-base font-medium text-gray-900">{label}</legend>
      <div className="mt-4 flex gap-6">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${name}-${option.value}`}
              type="radio"
              value={option.value}
              {...register(name)}
              className="w-4 h-4 accent-black rounded-full"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="block ml-3 text-sm font-medium text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </fieldset>
  );
};

export default Radio;
