import { FormStep } from "../constants/formSteps";
import { FormData } from "@/lib/validation/formvalidation";
import { UseFormTrigger } from "react-hook-form";
import type { MouseEvent } from "react";

export const useFormNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  steps: FormStep[],
  trigger: UseFormTrigger<FormData>,
  router: { push: (path: string) => void }
) => {
  const handleNext = async (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();

    const fields = steps[currentStep - 1].fields;
    // If no fields to validate (empty array), just move to next step
    if (fields.length === 0) {
      setCurrentStep(Math.min(currentStep + 1, steps.length));
      return;
    }
    const output = await trigger(fields as (keyof FormData)[]);
    if (output) setCurrentStep(Math.min(currentStep + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleCancel = () => {
    router.push("/");
  };

  const handleSave = async (
    getValues: () => FormData,
    onSubmit: (data: FormData) => Promise<void>,
    onError: (err: Record<string, { message?: string }>) => void,
    errors: Record<string, { message?: string }>
  ) => {
    // Validate all fields, not just the current step
    const isValid = await trigger();
    if (isValid) {
      const data = getValues();
      await onSubmit(data);
    } else {
      onError(errors);
    }
  };

  return { handleNext, handleBack, handleCancel, handleSave };
};
