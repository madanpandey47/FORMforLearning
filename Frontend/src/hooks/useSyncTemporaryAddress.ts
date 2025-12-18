import React from "react";
import { UseFormSetValue } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../lib/validation/formvalidation";

type FormData = z.infer<typeof formSchema>;

export function useSyncTemporaryAddress(
  currentStep: number,
  isTemporaryAddressSameAsPermanent: boolean,
  permanentAddress: FormData["permanentAddress"] | undefined,
  temporaryAddress: FormData["temporaryAddress"] | undefined,
  setValue: UseFormSetValue<FormData>
) {
  React.useEffect(() => {
    if (
      !isTemporaryAddressSameAsPermanent ||
      currentStep !== 3 ||
      !permanentAddress 
    ) {
      return;
    }

    // Only set if temporary address is not already the same
    if (JSON.stringify(permanentAddress) !== JSON.stringify(temporaryAddress)) {
      setValue("temporaryAddress", permanentAddress, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [
    isTemporaryAddressSameAsPermanent,
    currentStep,
    permanentAddress,
    temporaryAddress,
    setValue,
  ]);
}
