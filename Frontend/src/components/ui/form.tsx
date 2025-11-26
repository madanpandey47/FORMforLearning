import React from "react";

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="p-6 shadow-md w-full max-w-3xl space-y-3 bg-gray-100 rounded-3xl"
    >
      {children}
    </form>
  );
};

export default Form;
