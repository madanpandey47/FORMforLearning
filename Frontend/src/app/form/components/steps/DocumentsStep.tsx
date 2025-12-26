import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { FiFileText } from "react-icons/fi";
import Checkbox from "@/components/ui/checkbox";
import { FormData } from "@/lib/validation/formvalidation";
import { ImageUploadField } from "../../../../components/ui/ImageUploadField";
import { ImagePreviewState } from "../../../../components/ui/useImagePreviews";

interface DocumentsStepProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  imagePreviews: ImagePreviewState;
}

export const DocumentsStep: React.FC<DocumentsStepProps> = ({
  control,
  errors,
  imagePreviews,
}) => {
  return (
    <div className="space-y-8">
      <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
        <FiFileText className="text-sky-600" /> Documents & Confirmation
      </h2>

      <ImageUploadField
        control={control}
        name="profileImage"
        label="Profile Image"
        previewUrl={imagePreviews.profileImagePreviewUrl}
        setPreviewUrl={imagePreviews.setProfileImagePreviewUrl}
        errors={errors}
      />

      <ImageUploadField
        control={control}
        name="citizenshipImage"
        label="Citizenship Document"
        previewUrl={imagePreviews.citizenshipImagePreviewUrl}
        setPreviewUrl={imagePreviews.setCitizenshipImagePreviewUrl}
        errors={errors}
      />

      <ImageUploadField
        control={control}
        name="boardCertificateImage"
        label="Board Certificate"
        previewUrl={imagePreviews.boardCertificateImagePreviewUrl}
        setPreviewUrl={imagePreviews.setBoardCertificateImagePreviewUrl}
        errors={errors}
      />

      <ImageUploadField
        control={control}
        name="studentIdCardImage"
        label="Student-ID Card"
        previewUrl={imagePreviews.studentIdCardImagePreviewUrl}
        setPreviewUrl={imagePreviews.setStudentIdCardImagePreviewUrl}
        errors={errors}
      />

      <Controller
        name="agree"
        control={control}
        render={({ field }) => (
          <Checkbox
            label="I agree to the terms and conditions"
            name="agree"
            checked={!!field.value}
            onChange={field.onChange}
            error={errors.agree?.message}
          />
        )}
      />
    </div>
  );
};
