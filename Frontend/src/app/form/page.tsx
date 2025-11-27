"use client";
import React from "react";
import Form from "../../components/ui/form";
import Input from "../../components/ui/input";
import Radio from "../../components/ui/radio";
import Select from "../../components/ui/select";
import Checkbox from "../../components/ui/checkbox";
import Button from "../../components/ui/button";
import { useForm, FieldValues, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../lib/formvalidation";

type FormData = z.infer<typeof formSchema>;

const FormPage: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      addresses: [
        {
          province: "",
          municipality: "",
          ward: "",
          country: "",
          addressTypeId: 1,
        },
      ],
      parents: [{ firstName: "", lastName: "", relation: "" }],
      academicHistories: [
        {
          institutionName: "",
          level: "",
          percentageOrGPA: 0,
          passingYear: 2020,
        },
      ],
    },
  });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control,
    name: "addresses",
  });
  const {
    fields: parentFields,
    append: appendParent,
    remove: removeParent,
  } = useFieldArray({
    control,
    name: "parents",
  });

  const [currentStep, setCurrentStep] = React.useState(1);

  const processForm = async (data: FieldValues) => {
    try {
      const submissionData = {
        ...data,
      };

      const response = await fetch("http://localhost:5000/api/Student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        alert("Form Submitted Successfully!");
      } else {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch {
          // ignore parse error
        }
        console.error("Form submission error:", errorData);
        alert("Form submission failed. Please check the console for details.");
      }
    } catch (error) {
      console.error("An error occurred during form submission:", error);
      alert(
        "An error occurred during form submission. Please try again later."
      );
    }
  };

  // ---- fields grouped per step ----
  const steps = [
    {
      name: "Personal Details",
      fields: ["firstName", "lastName", "dateOfBirth", "gender", "bloodGroup"],
    },
    { name: "Contact Info", fields: ["contactInfo"] },
    { name: "Address", fields: ["addresses"] },
    { name: "Family Details", fields: ["parents"] },
    { name: "Academic History", fields: ["academicHistories"] },
    { name: "Enrollment", fields: ["academicEnrollment"] },
    {
      name: "Financial & Scholarship",
      fields: ["financialDetails", "scholarship"],
    },
    { name: "Other", fields: ["disability", "hobbies", "achievements"] },
    { name: "Documents & Confirmation", fields: ["agree"] },
  ];

  const handleNext = async () => {
    const fields = steps[currentStep - 1].fields;
    const ok = await trigger(fields as (keyof FormData)[]);
    if (ok) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  // select options
  const bloodGroups = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-300 p-4">
      <Form onSubmit={handleSubmit(processForm)}>
        <div className="mb-1 text-right text-gray-500 text-sm font-bold">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
        </div>

        <h1 className="text-2xl font-bold text-center mb-4">
          Student Application Form
        </h1>

        {/* STEP 1 - Personal */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Personal Information
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="First Name"
                {...register("firstName")}
                error={errors.firstName?.message}
              />
              <Input
                label="Middle Name (optional)"
                {...register("middleName")}
              />
              <Input
                label="Last Name"
                {...register("lastName")}
                error={errors.lastName?.message}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Date of Birth (YYYY-MM-DD)"
                {...register("dateOfBirth")}
                error={errors.dateOfBirth?.message}
              />
              <Radio
                label="Gender"
                name="gender"
                register={register}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
                error={errors.gender?.message}
              />
              <Select
                label="Blood Group (optional)"
                name="bloodGroup"
                register={register}
                options={bloodGroups}
              />
            </div>
            <h2 className="text-xl font-semibold border-b pb-2">Citizenship</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Citizenship Number"
                {...register("citizenship.citizenshipNumber")}
                error={errors.citizenship?.citizenshipNumber?.message}
              />
              <Input
                label="Country of Issuance"
                {...register("citizenship.countryOfIssuance")}
                error={errors.citizenship?.countryOfIssuance?.message}
              />
              <Input
                label="Date of Issuance"
                {...register("citizenship.dateOfIssuance")}
                error={errors.citizenship?.dateOfIssuance?.message}
              />
              <Input
                label="Place of Issuance"
                {...register("citizenship.placeOfIssuance")}
                error={errors.citizenship?.placeOfIssuance?.message}
              />
            </div>
          </div>
        )}

        {/* STEP 2 - Contact */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Contact Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Primary Mobile"
                {...register("contactInfo.primaryMobile")}
                error={errors.contactInfo?.primaryMobile?.message}
              />
              <Input
                label="Alternate Mobile (optional)"
                {...register("contactInfo.alternateMobile")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Primary Email"
                type="email"
                {...register("contactInfo.primaryEmail")}
                error={errors.contactInfo?.primaryEmail?.message}
              />
              <Input
                label="Alternate Email (optional)"
                type="email"
                {...register("contactInfo.alternateEmail")}
              />
            </div>
          </div>
        )}

        {/* STEP 3 - Address */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Address Information
            </h2>
            {addressFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Province"
                    {...register(`addresses.${index}.province`)}
                    error={errors.addresses?.[index]?.province?.message}
                  />
                  <Input
                    label="Municipality"
                    {...register(`addresses.${index}.municipality`)}
                    error={errors.addresses?.[index]?.municipality?.message}
                  />
                  <Input
                    label="Ward"
                    {...register(`addresses.${index}.ward`)}
                    error={errors.addresses?.[index]?.ward?.message}
                  />
                  <Input
                    label="Street"
                    {...register(`addresses.${index}.street`)}
                  />
                  <Input
                    label="Country"
                    {...register(`addresses.${index}.country`)}
                    error={errors.addresses?.[index]?.country?.message}
                  />
                  <Select
                    label="Address Type"
                    name={`addresses.${index}.addressTypeId`}
                    register={register}
                    options={[
                      { label: "Permanent", value: 1 },
                      { label: "Temporary", value: 2 },
                    ]}
                    error={errors.addresses?.[index]?.addressTypeId?.message}
                    valueAsNumber
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeAddress(index)}
                  label="Remove Address"
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                appendAddress({
                  province: "",
                  municipality: "",
                  ward: "",
                  country: "",
                  addressTypeId: 1,
                })
              }
              label="Add Address"
            />
          </div>
        )}

        {/* STEP 4 - Family */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Family Details
            </h2>
            {parentFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    {...register(`parents.${index}.firstName`)}
                    error={errors.parents?.[index]?.firstName?.message}
                  />
                  <Input
                    label="Last Name"
                    {...register(`parents.${index}.lastName`)}
                    error={errors.parents?.[index]?.lastName?.message}
                  />
                  <Input
                    label="Relation"
                    {...register(`parents.${index}.relation`)}
                    error={errors.parents?.[index]?.relation?.message}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeParent(index)}
                  label="Remove Parent"
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                appendParent({ firstName: "", lastName: "", relation: "" })
              }
              label="Add Parent"
            />
          </div>
        )}

        {/* STEP 9 - Documents & Confirmation */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">
              Documents & Confirmation
            </h2>
            <Checkbox
              label="I agree to the terms and conditions"
              name="agree"
              register={register}
              error={errors.agree?.message}
            />
          </div>
        )}

        <div className="mt-8 flex justify-between gap-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back
            </button>
          )}

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <Button type="submit" label="Submit Application" />
          )}
        </div>
      </Form>
    </div>
  );
};

export default FormPage;
