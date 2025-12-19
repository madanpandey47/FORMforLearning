import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  FieldArrayWithId,
} from "react-hook-form";
import { FiSettings, FiAward, FiStar, FiPlus, FiTrash2 } from "react-icons/fi";
import Input from "@/components/ui/input";
import { FormData } from "@/lib/validation/formvalidation";

interface AdditionalInfoStepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  achievementFields: FieldArrayWithId<FormData, "achievements", "id">[];
  hobbyFields: FieldArrayWithId<FormData, "hobbies", "id">[];
  appendAchievement: (value: Record<string, unknown>) => void;
  removeAchievement: (index: number) => void;
  appendHobby: (value: Record<string, unknown>) => void;
  removeHobby: (index: number) => void;
}

export const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({
  register,
  achievementFields,
  hobbyFields,
  appendAchievement,
  removeAchievement,
  appendHobby,
  removeHobby,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
        <FiSettings className="text-sky-600" /> Additional Information
      </h2>

      {/* Achievements */}
      <div>
        <h3 className="flex items-center gap-2 mb-4 text-lg font-medium">
          <FiAward className="text-amber-600" /> Achievements (Optional)
        </h3>
        {achievementFields.map((field, i) => (
          <div
            key={field.id as string}
            className="mb-4 rounded-lg border bg-gray-50 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-semibold text-sm">Achievement {i + 1}</h4>
              <button
                type="button"
                onClick={() => removeAchievement(i)}
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash2 />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Title" {...register(`achievements.${i}.title`)} />
              <Input
                label="Date"
                type="date"
                {...register(`achievements.${i}.dateOfAchievement`)}
              />
              <Input
                label="Description"
                {...register(`achievements.${i}.description`)}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            appendAchievement({
              title: "",
              description: "",
              dateOfAchievement: "",
            })
          }
          className="flex items-center gap-2 text-sky-600"
        >
          <FiPlus /> Add Achievement
        </button>
      </div>

      {/* Hobbies */}
      <div>
        <h3 className="flex items-center gap-2 mb-4 text-lg font-medium">
          <FiStar className="text-purple-600" /> Hobbies (Optional)
        </h3>
        {hobbyFields.map((field, i) => (
          <div
            key={field.id as string}
            className="mb-2 flex items-center gap-2"
          >
            <Input
              label={`Hobby ${i + 1}`}
              {...register(`hobbies.${i}.name`)}
            />
            <button
              type="button"
              onClick={() => removeHobby(i)}
              className="mt-6 text-red-600 hover:text-red-800"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendHobby({ name: "" })}
          className="flex items-center gap-2 text-sky-600"
        >
          <FiPlus /> Add Hobby
        </button>
      </div>

      {/* Disability */}
      <div>
        <h3 className="text-lg font-medium mb-4">
          Disability Information (Optional)
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Disability Type"
            {...register("disability.disabilityType")}
          />
          <Input
            label="Percentage"
            type="number"
            {...register("disability.disabilityPercentage", {
              valueAsNumber: true,
            })}
          />
          <Input label="Description" {...register("disability.description")} />
        </div>
      </div>
    </div>
  );
};
