import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FiUser } from "react-icons/fi";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { FormData } from "@/lib/validation/formvalidation";
import { Option } from "@/lib/types/student-types";

interface PersonalDetailsStepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  genderOptions: Option[];
  bloodTypeOptions: Option[];
}

export const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({
  register,
  errors,
  genderOptions,
  bloodTypeOptions,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
        <FiUser className="text-sky-600" /> Personal Information
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          label="First Name"
          {...register("firstName")}
          error={errors.firstName?.message}
        />
        <Input label="Middle Name (optional)" {...register("middleName")} />
        <Input
          label="Last Name"
          {...register("lastName")}
          error={errors.lastName?.message}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          label="Date of Birth"
          type="date"
          {...register("dateOfBirth")}
          error={errors.dateOfBirth?.message}
        />
        <Select
          label="Gender"
          options={genderOptions}
          {...register("gender", { valueAsNumber: true })}
          error={errors.gender?.message}
        />
        <Select
          label="Blood Group"
          options={bloodTypeOptions}
          {...register("bloodGroup", { valueAsNumber: true })}
          error={errors.bloodGroup?.message}
        />
      </div>
      <h3 className="text-lg font-medium mt-6">Citizenship Details</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Citizenship Number"
          type="number"
          {...register("citizenship.citizenshipNumber")}
          error={errors.citizenship?.citizenshipNumber?.message}
        />
        <Input
          label="Country of Issuance"
          {...register("citizenship.countryOfIssuance")}
          error={errors.citizenship?.countryOfIssuance?.message}
        />
        <Input
          label="Date of Issuance"
          type="date"
          {...register("citizenship.dateOfIssuance")}
          error={errors.citizenship?.dateOfIssuance?.message}
        />
        <Input
          label="Place of Issuance"
          {...register("citizenship.placeOfIssuance")}
          error={errors.citizenship?.placeOfIssuance?.message}
        />
      </div>
    </div>
  );
};
