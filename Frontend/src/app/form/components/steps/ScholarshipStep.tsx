import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FiDollarSign } from "react-icons/fi";
import Input from "@/components/ui/input";
import { FormData } from "@/lib/validation/formvalidation";

interface ScholarshipStepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export const ScholarshipStep: React.FC<ScholarshipStepProps> = ({
  register,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
        <FiDollarSign className="text-sky-600" /> Scholarship
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Scholarship Name (optional)"
          {...register("scholarship.scholarshipName")}
        />
        <Input
          label="Amount (optional)"
          type="number"
          {...register("scholarship.amount", { valueAsNumber: true })}
        />
        <Input
          label="Start Date (optional)"
          type="date"
          {...register("scholarship.startDate")}
        />
        <Input
          label="End Date (optional)"
          type="date"
          {...register("scholarship.endDate")}
        />
      </div>
    </div>
  );
};
