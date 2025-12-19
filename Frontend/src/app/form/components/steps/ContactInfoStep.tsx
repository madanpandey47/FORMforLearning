import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FiPhone } from "react-icons/fi";
import Input from "@/components/ui/input";
import { FormData } from "@/lib/validation/formvalidation";

interface ContactInfoStepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export const ContactInfoStep: React.FC<ContactInfoStepProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
        <FiPhone className="text-sky-600" /> Contact Information
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Primary Mobile"
          {...register("contactInfo.primaryMobile")}
          error={errors.contactInfo?.primaryMobile?.message}
        />
        <Input
          label="Alternate Mobile (optional)"
          {...register("contactInfo.alternateMobile")}
        />
        <Input
          label="Primary Email"
          type="email"
          {...register("contactInfo.primaryEmail")}
          error={errors.contactInfo?.primaryEmail?.message}
        />
        <Input
          label="Alternate Email (optional)"
          type="email"
          {...register("contactInfo.alternateEmail")}
        />
      </div>
    </div>
  );
};
