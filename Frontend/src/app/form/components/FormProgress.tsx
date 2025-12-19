import React from "react";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
}

export const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  totalSteps,
  stepName,
}) => {
  return (
    <div className="mb-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
          Student Application Form
        </h1>
        <p className="mt-3 text-base text-gray-600 font-medium">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
      <div className="mt-6 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-blue-900">
            {stepName}
          </span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-white rounded-full shadow-inner overflow-hidden">
          <div
            className="h-3 bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out shadow-lg"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
