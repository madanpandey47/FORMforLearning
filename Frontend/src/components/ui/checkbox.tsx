import React from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface CheckboxProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
}

function CheckboxComponent<T extends FieldValues>({
  label,
  name,
  register,
  error,
}: CheckboxProps<T>) {
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
}

CheckboxComponent.displayName = "Checkbox";

const Checkbox = CheckboxComponent as <T extends FieldValues>(
  props: CheckboxProps<T>
) => React.JSX.Element;

export default Checkbox;
