// app/(your-path)/FormPage.tsx
"use client";
import React from "react";
import Form from "../../components/ui/form";
import Input from "../../components/ui/input";
import Radio from "../../components/ui/radio";
import Select from "../../components/ui/select";
import Checkbox from "../../components/ui/checkbox";
import ImageUpload from "../../components/ui/upload";
import Button from "../../components/ui/button";
import { useForm, FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../lib/formvalidation";

type FormData = z.infer<typeof formSchema>;

const FormPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const [currentStep, setCurrentStep] = React.useState(1);

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const toBase64Array = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return [];
    const arr: string[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const b = await toBase64(fileList[i]);
      arr.push(b);
    }
    return arr;
  };

  const processForm = async (data: FieldValues) => {
    try {
      // profile (single file) -> base64
      let profileImageBase64 = "";
      if (data.profile && data.profile.length > 0) {
        profileImageBase64 = await toBase64(data.profile[0]);
      }

      // additionalDocuments (multiple) -> base64 array
      const additionalDocsBase64 = await toBase64Array(
        (data.additionalDocuments as FileList) || null
      );

      const submissionData = {
        ...data,
        profile: profileImageBase64,
        additionalDocuments: additionalDocsBase64,
      };

      const response = await fetch(
        "http://localhost:5000/api/ApplicationForm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

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
      fields: [
        "firstname",
        "middlename",
        "lastname",
        "dob",
        "nationality",
        "citizenshipNumber",
        "email",
        "alternateEmail",
        "gender",
        "bloodgroup",
        "country",
      ] as (keyof FormData)[],
    },
    {
      fields: [
        "primaryMobile",
        "alternateMobile",
        "emergencyContact",
        "emergencyRelation",
        "permanentAddress",
        "preferredContactMethod",
      ] as (keyof FormData)[],
    },
    {
      fields: [
        "primaryContact",
        "fatherName",
        "fatherMobile",
        "fatherOccupation",
        "motherName",
        "motherMobile",
        "motherOccupation",
        "guardianName",
        "guardianRelation",
        "guardianMobile",
        "annualIncome",
        "familyType",
      ] as (keyof FormData)[],
    },
    {
      fields: [
        "schoolName",
        "collegeName",
        "schoolAddress",
        "previousGrade",
        "percentage",
        "passingYear",
        "extraCurricular",
        "profile",
        "additionalDocuments",
        "agree",
      ] as (keyof FormData)[],
    },
  ];

  const handleNext = async () => {
    const fields = steps[currentStep - 1].fields;
    const ok = await trigger(fields);
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
  const previousacademic = [
    { label: "Master's", value: "master" },
    { label: "Bachelor's", value: "bachelor" },
    { label: "+2", value: "intermediate" },
    { label: "Secondary", value: "secondary" },
  ];
  const incomeOptions = [
    { label: "<5 Lakh", value: "<5" },
    { label: "5-10 Lakh", value: "5-10" },
    { label: "10-20 Lakh", value: "10-20" },
    { label: ">20 Lakh", value: ">20" },
  ];
  const emergencyRelations = [
    { label: "Parent", value: "parent" },
    { label: "Sibling", value: "sibling" },
    { label: "Relative", value: "relative" },
    { label: "Friend", value: "friend" },
    { label: "Other", value: "other" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-300 p-4">
      <Form onSubmit={handleSubmit(processForm)}>
        <div className="mb-1 text-right text-gray-500 text-sm font-bold">
          Step {currentStep} of {steps.length}
        </div>

        <h1 className="text-2xl font-bold text-center mb-4">
          Application Form
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
                {...register("firstname")}
                error={errors.firstname?.message}
              />
              <Input
                label="Middle Name (optional)"
                {...register("middlename")}
                error={errors.middlename?.message}
              />
              <Input
                label="Last Name"
                {...register("lastname")}
                error={errors.lastname?.message}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Date of Birth (YYYY-MM-DD)"
                {...register("dob")}
                error={errors.dob?.message}
              />
              <Input
                label="Nationality (optional)"
                {...register("nationality")}
                error={errors.nationality?.message}
              />
              <Input
                label="Citizenship No (optional)"
                {...register("citizenshipNumber")}
                error={errors.citizenshipNumber?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                {...register("email")}
                error={errors.email?.message}
              />
              <Input
                label="Alternate Email (optional)"
                {...register("alternateEmail")}
                error={errors.alternateEmail?.message}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Select
                label="Country"
                name="country"
                register={register}
                options={[
                  { label: "Nepal", value: "nepal" },
                  { label: "India", value: "india" },
                  { label: "China", value: "china" },
                ]}
                error={errors.country?.message}
              />

              <Select
                label="Blood Group (optional)"
                name="bloodgroup"
                register={register}
                options={bloodGroups}
                error={errors.bloodgroup?.message}
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
                {...register("primaryMobile")}
                error={errors.primaryMobile?.message}
              />
              <Input
                label="Alternate Mobile (optional)"
                {...register("alternateMobile")}
                error={errors.alternateMobile?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Emergency Contact"
                {...register("emergencyContact")}
                error={errors.emergencyContact?.message}
              />

              <Select
                label="Emergency Contact Relation"
                name="emergencyRelation"
                register={register}
                options={emergencyRelations}
                error={errors.emergencyRelation?.message}
              />
            </div>

            <Input
              label="Permanent Address"
              {...register("permanentAddress")}
              error={errors.permanentAddress?.message}
            />

            <Select
              label="Preferred Contact Method (optional)"
              name="preferredContactMethod"
              register={register}
              options={[
                { label: "Email", value: "email" },
                { label: "Phone", value: "phone" },
                { label: "Both", value: "both" },
              ]}
              error={errors.preferredContactMethod?.message}
            />
          </div>
        )}

        {/* STEP 3 - Family */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">
              Family Details
            </h2>

            <Radio
              label="Primary Contact"
              name="primaryContact"
              register={register}
              options={[
                { label: "Father", value: "father" },
                { label: "Mother", value: "mother" },
                { label: "Guardian", value: "guardian" },
              ]}
              error={errors.primaryContact?.message}
            />

            <div className="bg-slate-50 p-4 rounded-md">
              <h3 className="font-bold mb-2">Father&apos;s Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Name"
                  {...register("fatherName")}
                  error={errors.fatherName?.message}
                />
                <Input
                  label="Mobile"
                  {...register("fatherMobile")}
                  error={errors.fatherMobile?.message}
                />
                <Input
                  label="Occupation (optional)"
                  {...register("fatherOccupation")}
                  error={errors.fatherOccupation?.message}
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-md">
              <h3 className="font-bold mb-2">Mother&apos;s Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Name"
                  {...register("motherName")}
                  error={errors.motherName?.message}
                />
                <Input
                  label="Mobile"
                  {...register("motherMobile")}
                  error={errors.motherMobile?.message}
                />
                <Input
                  label="Occupation (optional)"
                  {...register("motherOccupation")}
                  error={errors.motherOccupation?.message}
                />
              </div>
            </div>

            {/* Guardian (optional) */}
            <div className="bg-slate-50 p-4 rounded-md">
              <h3 className="font-bold mb-2">Guardian (optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Name"
                  {...register("guardianName")}
                  error={errors.guardianName?.message}
                />
                <Input
                  label="Relation"
                  {...register("guardianRelation")}
                  error={errors.guardianRelation?.message}
                />
                <Input
                  label="Mobile"
                  {...register("guardianMobile")}
                  error={errors.guardianMobile?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Annual Family Income"
                name="annualIncome"
                register={register}
                options={incomeOptions}
                error={errors.annualIncome?.message}
              />

              <Select
                label="Family Type (optional)"
                name="familyType"
                register={register}
                options={[
                  { label: "Joint", value: "joint" },
                  { label: "Nuclear", value: "nuclear" },
                ]}
                error={errors.familyType?.message}
              />
            </div>
          </div>
        )}

        {/* STEP 4 - Academics & Documents */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">
              Academics & Documents
            </h2>

            <Input
              label="School Name"
              {...register("schoolName")}
              error={errors.schoolName?.message}
            />

            <Input
              label="College Name (optional)"
              {...register("collegeName")}
              error={errors.collegeName?.message}
            />

            <Input
              label="School Address"
              {...register("schoolAddress")}
              error={errors.schoolAddress?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Previous Grade/Class"
                name="previousGrade"
                register={register}
                options={previousacademic}
                error={errors.previousGrade?.message}
              />

              <Input
                label="Percentage / GPA"
                type="number"
                {...register("percentage", { valueAsNumber: true })}
                error={errors.percentage?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Passing Year (optional)"
                type="number"
                {...register("passingYear", { valueAsNumber: true })}
                error={errors.passingYear?.message}
              />
              <Input
                label="Extra Curricular (optional)"
                {...register("extraCurricular")}
                error={errors.extraCurricular?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ImageUpload
                label="Upload Profile Image (optional)"
                name="profile"
                register={register}
                error={errors.profile?.message as string}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Additional Documents (optional)
                </label>
                <input
                  type="file"
                  multiple
                  {...register("additionalDocuments")}
                  className="mt-1 block w-full"
                />
                {errors.additionalDocuments && (
                  <p className="text-red-600 text-sm mt-1">
                    {String(errors.additionalDocuments.message)}
                  </p>
                )}
              </div>
            </div>

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
