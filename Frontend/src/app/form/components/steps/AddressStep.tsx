import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  Controller,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import { FiMapPin } from "react-icons/fi";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { FormData } from "@/lib/validation/formvalidation";
import { Option } from "@/lib/types/student-types";
import { COUNTRY_OPTIONS } from "../../constants/formSteps";

interface AddressStepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
  setValue: UseFormSetValue<FormData>;
  getValues: UseFormGetValues<FormData>;
  provinceOptions: Option[];
  permanentMunicipalities: Option[];
  temporaryMunicipalities: Option[];
  permanentProvince?: string;
  temporaryProvince?: string;
  isTemporaryAddressSameAsPermanent: boolean;
}

export const AddressStep: React.FC<AddressStepProps> = ({
  register,
  errors,
  control,
  setValue,
  getValues,
  provinceOptions,
  permanentMunicipalities,
  temporaryMunicipalities,
  permanentProvince,
  temporaryProvince,
  isTemporaryAddressSameAsPermanent,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
          <FiMapPin className="text-sky-600" /> Permanent Address
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Select
            label="Province"
            options={provinceOptions}
            {...register("permanentAddress.province")}
            error={errors.permanentAddress?.province?.message}
          />
          <Select
            label="Municipality"
            options={permanentMunicipalities}
            {...register("permanentAddress.municipality")}
            disabled={!permanentProvince}
            error={errors.permanentAddress?.municipality?.message}
          />
          <Input
            label="Ward"
            {...register("permanentAddress.ward")}
            error={errors.permanentAddress?.ward?.message}
          />
          <Input
            label="Street (optional)"
            {...register("permanentAddress.street")}
          />
          <Select
            label="Country"
            options={COUNTRY_OPTIONS}
            {...register("permanentAddress.country")}
            error={errors.permanentAddress?.country?.message}
          />
        </div>
      </div>

      <div>
        <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
          <FiMapPin className="text-emerald-600" /> Temporary Address
        </h2>
        <div className="my-4 flex items-center">
          <Controller
            name="isTemporaryAddressSameAsPermanent"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                id="isTemporaryAddressSameAsPermanent"
                checked={!!field.value}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  field.onChange(isChecked);
                  if (isChecked) {
                    // Copy permanent address to temporary address
                    const permanentAddress = getValues("permanentAddress");
                    setValue("temporaryAddress", {
                      province: permanentAddress?.province || "",
                      municipality: permanentAddress?.municipality || "",
                      ward: permanentAddress?.ward || "",
                      street: permanentAddress?.street || "",
                      country: permanentAddress?.country || "",
                    });
                  }
                }}
                className="h-4 w-4 rounded accent-sky-600"
              />
            )}
          />
          <label
            htmlFor="isTemporaryAddressSameAsPermanent"
            className="ml-2 text-sm font-medium"
          >
            Same as Permanent Address
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Province"
            options={provinceOptions}
            {...register("temporaryAddress.province")}
            disabled={isTemporaryAddressSameAsPermanent}
            error={errors.temporaryAddress?.province?.message}
          />
          <Select
            label="Municipality"
            options={temporaryMunicipalities}
            {...register("temporaryAddress.municipality")}
            disabled={isTemporaryAddressSameAsPermanent || !temporaryProvince}
            error={errors.temporaryAddress?.municipality?.message}
          />
          <Input
            label="Ward"
            {...register("temporaryAddress.ward")}
            disabled={isTemporaryAddressSameAsPermanent}
            error={errors.temporaryAddress?.ward?.message}
          />
          <Input
            label="Street (optional)"
            {...register("temporaryAddress.street")}
            disabled={isTemporaryAddressSameAsPermanent}
          />
          <Select
            label="Country"
            options={COUNTRY_OPTIONS}
            {...register("temporaryAddress.country")}
            disabled={isTemporaryAddressSameAsPermanent}
            error={errors.temporaryAddress?.country?.message}
          />
        </div>
      </div>
    </div>
  );
};
