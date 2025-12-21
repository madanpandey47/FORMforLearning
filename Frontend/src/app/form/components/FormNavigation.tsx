import React from "react";

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
    <div className="mt-10 flex justify-between items-center border-t-2 border-gray-200 pt-6">
      <div className="flex gap-3">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg bg-linear-to-r from-gray-500 to-gray-600 px-6 py-3 text-white font-semibold hover:from-gray-600 hover:to-gray-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            ← Back
          </button>
        )}
        {isEditMode && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-linear-to-r from-red-500 to-red-600 px-6 py-3 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
            className="rounded-lg bg-linear-to-r from-green-500 to-green-600 px-6 py-3 text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Save Changes
          </button>
        )}
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg bg-linear-to-r from-blue-500 to-blue-600 px-6 py-3 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Next →
          </button>
        ) : (
          !isEditMode && (
            <button
              type="submit"
              className="rounded-lg bg-linear-to-r from-purple-500 to-purple-600 px-8 py-3 text-white font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Submit
            </button>
          )
        )}
      </div>
    </div>
  );
};
