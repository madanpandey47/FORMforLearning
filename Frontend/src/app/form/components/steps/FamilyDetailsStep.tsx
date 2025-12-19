import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  FieldArrayWithId,
} from "react-hook-form";
import { FiUsers, FiPlus, FiTrash2 } from "react-icons/fi";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { FormData } from "@/lib/validation/formvalidation";
import { Option } from "@/lib/api/lookups";

interface FamilyDetailsStepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  parentFields: FieldArrayWithId<FormData, "parents", "id">[];
  parentTypeOptions: Option[];
  appendParent: (value: Record<string, unknown>) => void;
  removeParent: (index: number) => void;
}

export const FamilyDetailsStep: React.FC<FamilyDetailsStepProps> = ({
  register,
  errors,
  parentFields,
  parentTypeOptions,
  appendParent,
  removeParent,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
        <FiUsers className="text-sky-600" /> Family Details
      </h2>
      {parentFields.map((field, i) => (
        <div
          key={field.id as string}
          className="rounded-lg border bg-gray-50 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Parent/Guardian {i + 1}</h3>
            {parentFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeParent(i)}
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash2 /> Remove
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="First Name"
              {...register(`parents.${i}.firstName`)}
              error={errors.parents?.[i]?.firstName?.message}
            />
            <Input
              label="Middle Name (optional)"
              {...register(`parents.${i}.middleName`)}
            />
            <Input
              label="Last Name"
              {...register(`parents.${i}.lastName`)}
              error={errors.parents?.[i]?.lastName?.message}
            />
            <Select
              label="Relation"
              options={parentTypeOptions}
              {...register(`parents.${i}.relation`, { valueAsNumber: true })}
              error={errors.parents?.[i]?.relation?.message}
            />
            <Input
              label="Occupation (optional)"
              {...register(`parents.${i}.occupation`)}
            />
            <Input
              label="Annual Income (optional)"
              type="number"
              {...register(`parents.${i}.annualIncome`, {
                valueAsNumber: true,
              })}
            />
            <Input
              label="Mobile (optional)"
              {...register(`parents.${i}.mobileNumber`)}
            />
            <Input
              label="Email (optional)"
              type="email"
              {...register(`parents.${i}.email`)}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          appendParent({ firstName: "", lastName: "", relation: 0 })
        }
        className="flex items-center gap-2 text-sky-600 hover:text-sky-700"
      >
        <FiPlus /> Add Another
      </button>
    </div>
  );
};
