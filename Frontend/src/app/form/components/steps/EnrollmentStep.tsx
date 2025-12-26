import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FiBriefcase } from "react-icons/fi";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { FormData } from "@/lib/validation/formvalidation";
import { Option } from "@/lib/types/student-types";

interface EnrollmentStepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  facultyTypeOptions: Option[];
}

export const EnrollmentStep: React.FC<EnrollmentStepProps> = ({
  register,
  errors,
  facultyTypeOptions,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
        <FiBriefcase className="text-sky-600" /> Enrollment
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Faculty"
          options={facultyTypeOptions}
          {...register("academicEnrollment.faculty", { valueAsNumber: true })}
          error={errors.academicEnrollment?.faculty?.message}
        />
        <Input
          label="Program Name"
          {...register("academicEnrollment.programName")}
          error={errors.academicEnrollment?.programName?.message}
        />
        <Input
          label="Enrollment Date"
          type="date"
          {...register("academicEnrollment.enrollmentDate")}
          error={errors.academicEnrollment?.enrollmentDate?.message}
        />
        <Input
          label="Student ID (optional)"
          {...register("academicEnrollment.studentIdNumber")}
        />
      </div>
    </div>
  );
};
