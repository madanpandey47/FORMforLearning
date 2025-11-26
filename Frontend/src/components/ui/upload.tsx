import React from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface ImageUploadProps<T extends FieldValues = FieldValues> {
  label?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
}

const ImageUpload = <T extends FieldValues = FieldValues>(
  props: ImageUploadProps<T>
) => {
  const { label, name, register, error } = props;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-bold text-gray-700">
          {label}
        </label>
      )}

      <input
        type="file"
        accept="image/*"
        id={name}
        {...register(name)}
        className={`w-full border rounded-md p-2 bg-gray-300/50 hover:bg-gray-500/70 cursor-pointer
          ${error ? "border-red-500" : "border-gray-300"}`}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default ImageUpload;
