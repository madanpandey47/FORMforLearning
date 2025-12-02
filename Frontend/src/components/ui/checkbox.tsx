import React from "react";
import { UseFormRegister, FieldValues, FieldPath } from "react-hook-form";

interface CheckboxProps<T extends FieldValues = FieldValues> {
  label: string;
  name: FieldPath<T>;
  register: UseFormRegister<T>;
  error?: string;
}

const Checkbox = <T extends FieldValues = FieldValues>(
  props: CheckboxProps<T>
) => {
  const { label, name, register, error } = props;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <input
          id={name}
          type="checkbox"
          {...register(name)}
          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
        />
        <label htmlFor={name} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Checkbox;
