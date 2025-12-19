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
    <div className="mb-8 text-center">
      <h1 className="text-2xl font-bold text-slate-900">
        Student Application Form
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Step {currentStep} of {totalSteps} — {stepName}
      </p>
      <div className="mt-4 h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 bg-sky-600 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};
