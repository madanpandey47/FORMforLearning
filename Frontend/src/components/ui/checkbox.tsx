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
  const registeredProps = register(name);
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <input
          id={name}
          type="checkbox"
          {...registeredProps}
          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
        />
        <label
          htmlFor={name}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Checkbox;
