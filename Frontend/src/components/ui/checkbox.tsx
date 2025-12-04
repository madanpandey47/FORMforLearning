import React, { useMemo } from "react";

interface CheckboxProps {
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
}

const Checkbox = React.memo(function CheckboxComponent({
  label,
  name,
  register,
  error,
}: CheckboxProps) {
  const registeredProps = useMemo(() => register(name), [register, name]);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <input
          id={name}
          type="checkbox"
          {...registeredProps}
          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
        />
        <label htmlFor={name} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
