import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  FieldArrayWithId,
} from "react-hook-form";
import { FiBookOpen, FiPlus, FiTrash2 } from "react-icons/fi";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { FormData } from "@/lib/validation/formvalidation";
import { Option } from "@/lib/types/student-types";

interface AcademicHistoryStepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  academicFields: FieldArrayWithId<FormData, "academicHistories", "id">[];
  academicLevelOptions: Option[];
  appendAcademic: (value: Record<string, unknown>) => void;
  removeAcademic: (index: number) => void;
}

export const AcademicHistoryStep: React.FC<AcademicHistoryStepProps> = ({
  register,
  errors,
  academicFields,
  academicLevelOptions,
  appendAcademic,
  removeAcademic,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
        <FiBookOpen className="text-sky-600" /> Academic History
      </h2>
      {academicFields.map((field, i) => (
        <div
          key={field.id as string}
          className="rounded-lg border bg-gray-50 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Education {i + 1}</h3>
            {academicFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeAcademic(i)}
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash2 /> Remove
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Institution"
              {...register(`academicHistories.${i}.institutionName`)}
              error={errors.academicHistories?.[i]?.institutionName?.message}
            />
            <Select
              label="Level"
              options={academicLevelOptions}
              {...register(`academicHistories.${i}.level`, {
                valueAsNumber: true,
              })}
              error={errors.academicHistories?.[i]?.level?.message}
            />
            <Input
              label="Board (optional)"
              {...register(`academicHistories.${i}.board`)}
            />
            <Input
              label="Percentage/GPA"
              type="number"
              step="0.01"
              {...register(`academicHistories.${i}.percentageOrGPA`, {
                valueAsNumber: true,
              })}
              error={errors.academicHistories?.[i]?.percentageOrGPA?.message}
            />
            <Input
              label="Passing Year"
              type="number"
              {...register(`academicHistories.${i}.passedYear`, {
                valueAsNumber: true,
              })}
              error={errors.academicHistories?.[i]?.passedYear?.message}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          appendAcademic({
            institutionName: "",
            level: 0,
            board: "",
            percentageOrGPA: 0,
            passedYear: 2024,
          })
        }
        className="flex items-center gap-2 text-sky-600"
      >
        <FiPlus /> Add Education
      </button>
    </div>
  );
};
