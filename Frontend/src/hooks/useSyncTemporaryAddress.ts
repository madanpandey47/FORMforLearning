import React from "react";
import { UseFormSetValue } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../lib/formvalidation";

type FormData = z.infer<typeof formSchema>;

export function useSyncTemporaryAddress(
  currentStep: number,
  sameAsPermanent: boolean,
  permanentAddress: FormData["permanentAddress"] | null,
  temporaryAddress: FormData["temporaryAddress"] | null,
  setValue: UseFormSetValue<FormData>
) {
  const permanentAddressStr = React.useMemo(
    () => JSON.stringify(permanentAddress),
    [permanentAddress]
  );

  React.useEffect(() => {
    if (!sameAsPermanent || currentStep !== 3) {
      return;
    }

    const parsed = JSON.parse(permanentAddressStr) as
      | FormData["permanentAddress"]
      | null;

    if (!parsed) {
      return;
    }

    const nextTemp: FormData["temporaryAddress"] = {
      ...parsed,
      type: 2,
    };

    const currentTempStr = JSON.stringify(temporaryAddress);
    const nextTempStr = JSON.stringify(nextTemp);

    if (currentTempStr !== nextTempStr) {
      setValue("temporaryAddress", nextTemp, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [
    currentStep,
    sameAsPermanent,
    permanentAddressStr,
    temporaryAddress,
    setValue,
  ]);
}
