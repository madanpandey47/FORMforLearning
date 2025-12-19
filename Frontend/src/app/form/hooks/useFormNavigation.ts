import { FormStep } from "../constants/formSteps";
import { FormData } from "@/lib/validation/formvalidation";
import { UseFormTrigger } from "react-hook-form";

export const useFormNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  steps: FormStep[],
  trigger: UseFormTrigger<FormData>,
  router: { push: (path: string) => void }
) => {
  const handleNext = async () => {
    const fields = steps[currentStep - 1].fields;
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
    const fields = steps[currentStep - 1].fields;
    const isValid = await trigger(fields as (keyof FormData)[]);
    if (isValid) {
      const data = getValues();
      await onSubmit(data);
    } else {
      onError(errors);
    }
  };

  return { handleNext, handleBack, handleCancel, handleSave };
};
