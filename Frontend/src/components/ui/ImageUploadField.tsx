import React from "react";
import Image from "next/image";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { FiFileText } from "react-icons/fi";
import { FormData } from "@/lib/validation/formvalidation";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

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
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  control,
  name,
  label,
  previewUrl,
  setPreviewUrl,
  errors,
}) => {
  const Icon = FiFileText;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <Icon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="font-medium">
            {label} {"(Upload a file under 10MB)"}
          </p>
          {previewUrl ? (
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="relative h-48 w-72 rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 overflow-hidden">
                <Image
                  src={previewUrl}
                  alt={`${label} Preview`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  field.onChange(undefined);
                  if (previewUrl && !previewUrl.startsWith("http")) {
                    URL.revokeObjectURL(previewUrl);
                  }
                  setPreviewUrl(null);
                }}
                className="text-sm text-red-600 hover:underline"
              >
                Remove image
              </button>
            </div>
          ) : (
            <label className="mt-4 inline-block cursor-pointer rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
              Choose Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > MAX_FILE_SIZE_BYTES) {
                      alert("Image must be 10MB or smaller.");
                      e.target.value = "";
                      return;
                    }
                    field.onChange(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
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
