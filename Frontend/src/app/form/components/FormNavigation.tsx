import React from "react";
import Button from "@/components/ui/button";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isEditMode: boolean;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  isEditMode,
  onNext,
  onBack,
  onCancel,
  onSave,
}) => {
  return (
    <div className="mt-10 flex justify-between">
      <div className="flex gap-3">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onBack}
            className="rounded bg-gray-500 px-6 py-3 text-white hover:bg-gray-600"
          >
            Back
          </button>
        )}
        {isEditMode && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-red-500 px-6 py-3 text-white hover:bg-red-600"
          >
            Cancel
          </button>
        )}
      </div>
      <div className="flex gap-3">
        {isEditMode && (
          <button
            type="button"
            onClick={onSave}
            className="rounded bg-green-600 px-6 py-3 text-white hover:bg-green-700"
          >
            Save Changes
          </button>
        )}
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={onNext}
            className="rounded bg-sky-600 px-6 py-3 text-white hover:bg-sky-700"
          >
            Next
          </button>
        ) : (
          !isEditMode && <Button type="submit" label="Submit Application" />
        )}
      </div>
    </div>
  );
};
