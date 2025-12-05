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
  const prevStateRef = React.useRef<{
    permanentAddress: FormData["permanentAddress"] | null;
    temporaryAddress: FormData["temporaryAddress"] | null;
  }>({ permanentAddress, temporaryAddress });

  React.useEffect(() => {
    if (!sameAsPermanent || currentStep !== 3 || !permanentAddress) return;

    const nextTemp: FormData["temporaryAddress"] = {
      ...permanentAddress,
      type: 2,
    };

    const isSame =
      JSON.stringify(nextTemp) ===
      JSON.stringify(prevStateRef.current.temporaryAddress);

    if (!isSame) {
      // Defer setValue to avoid state update during render
      queueMicrotask(() => {
        setValue("temporaryAddress", nextTemp, {
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false,
        });
      });
    }

    // Update ref after effect
    prevStateRef.current = { permanentAddress, temporaryAddress };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, sameAsPermanent, permanentAddress, setValue]);
}
