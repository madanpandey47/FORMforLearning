import React from "react";

// The props for the Select component are now simplified.
// It expects the props returned from react-hook-form's register function,
// plus label, options, and error.
interface SelectProps extends React.ComponentPropsWithoutRef<"select"> {
  label: string;
  options: { label: string; value: string | number }[];
  error?: string;
}

// The Select component is wrapped in React.forwardRef to allow the ref from
// react-hook-form to be passed to the underlying <select> element.
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, name, ...props }, ref) => {
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
          name={name}
          ref={ref}
          {...props}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        >
          {options.length === 0 && <option value="">Loading...</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;