import React from "react";
import Image from "next/image";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { FiFileText, FiUser } from "react-icons/fi";
import { FormData } from "@/lib/validation/formvalidation";

interface ImageUploadFieldProps {
  control: Control<FormData>;
  name:
    | "profileImage"
    | "citizenshipImage"
    | "boardCertificateImage"
    | "studentIdCardImage";
  label: string;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  errors: FieldErrors<FormData>;
  isEditMode?: boolean;
  isProfile?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  control,
  name,
  label,
  previewUrl,
  setPreviewUrl,
  errors,
  isEditMode = false,
  isProfile = false,
}) => {
  const Icon = isProfile ? FiUser : FiFileText;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <Icon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="font-medium">
            {label}{" "}
            {isEditMode ? "(Replace if needed)" : isProfile ? "" : "(Optional)"}
          </p>
          {!previewUrl ? (
            <label className="mt-4 inline-block cursor-pointer rounded bg-sky-600 p-2 text-white hover:bg-sky-700">
              Choose Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    field.onChange(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          ) : (
            <div className="mt-6">
              <Image
                src={previewUrl}
                alt={`${label} Preview`}
                width={isProfile ? 128 : 200}
                height={isProfile ? 128 : 150}
                unoptimized
                className={`mx-auto object-cover shadow-md ${
                  isProfile
                    ? "rounded-full border-2 border-red-500"
                    : "rounded border-2 border-sky-500"
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  field.onChange(undefined);
                  if (previewUrl && !previewUrl.startsWith("http"))
                    URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                }}
                className="mt-2 text-red-600"
              >
                Remove
              </button>
            </div>
          )}
          {errors[name]?.message && (
            <p className="text-red-600 mt-2">
              {errors[name]?.message as string}
            </p>
          )}
        </div>
      )}
    />
  );
};
