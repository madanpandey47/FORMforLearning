import React from "react";
import { UseFormSetValue } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../lib/formvalidation";

type FormData = z.infer<typeof formSchema>;

export function useSyncTemporaryAddress(
  currentStep: number,
  sameAsPermanent: boolean,
  permanentAddress: FormData["permanentAddress"] | undefined,
  temporaryAddress: FormData["temporaryAddress"] | undefined,
  setValue: UseFormSetValue<FormData>
) {
  React.useEffect(() => {
    if (
      !sameAsPermanent ||
      currentStep !== 3 ||
      !permanentAddress ||
      !temporaryAddress
    ) {
      return;
    }

    const expectedTemp = {
      ...permanentAddress,
      type: 1 as const,
    };

    const permWithoutType = JSON.stringify({
      province: permanentAddress.province,
      municipality: permanentAddress.municipality,
      ward: permanentAddress.ward,
      street: permanentAddress.street,
      country: permanentAddress.country,
    });
    const tempWithoutType = JSON.stringify({
      province: temporaryAddress.province,
      municipality: temporaryAddress.municipality,
      ward: temporaryAddress.ward,
      street: temporaryAddress.street,
      country: temporaryAddress.country,
    });

    if (permWithoutType !== tempWithoutType) {
      setValue("temporaryAddress", expectedTemp, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [
    sameAsPermanent,
    currentStep,
    permanentAddress,
    temporaryAddress,
    setValue,
  ]);
}
