import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

interface CheckboxProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
}

function CheckboxComponent<T extends FieldValues>({
  label,
  name,
  control,
  error,
}: CheckboxProps<T>) {
  return (
    <div className="space-y-1">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <input
              id={name}
              type="checkbox"
              checked={Boolean(field.value)}
              onChange={(e) =>
                field.onChange(
                  (e.target.checked as PathValue<T, Path<T>>) ?? false
                )
              }
              onBlur={field.onBlur}
              ref={field.ref}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <label htmlFor={name} className="text-sm font-medium text-slate-700">
              {label}
            </label>
          </div>
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

CheckboxComponent.displayName = "Checkbox";

const Checkbox = CheckboxComponent as <T extends FieldValues>(
  props: CheckboxProps<T>
) => React.JSX.Element;

export default Checkbox;
