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
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-xs font-medium uppercase tracking-wide text-slate-600"
      >
        {label}
      </label>
      <select
        id={name}
        {...register(name, { valueAsNumber })}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
