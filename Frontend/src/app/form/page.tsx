"use client";
import React from "react";
import Form from "../../components/ui/form";
import Input from "../../components/ui/input";
import Select from "../../components/ui/select";
import Checkbox from "../../components/ui/checkbox";
import Button from "../../components/ui/button";
import { useForm, FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../lib/formvalidation";
import {
  getBloodTypes,
  getAcademicLevels,
  getAddressTypes,
  getGenders,
  Option,
} from "../../lib/api/lookups";
import { submitStudent } from "../../lib/api/student";

type FormData = z.infer<typeof formSchema>;

const FormPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      permanentAddress: {
        province: "",
        municipality: "",
        ward: "",
        country: "",
        type: 1,
      },
      temporaryAddress: {
        province: "",
        municipality: "",
        ward: "",
        country: "",
        type: 2,
      },
      parents: [{ firstName: "", lastName: "", relation: "" }],
      academicHistories: [
        {
          institutionName: "",
          level: 0,
          percentageOrGPA: 0,
          passingYear: 2020,
        },
      ],
    },
  });

  const [currentStep, setCurrentStep] = React.useState(1);

  // eslint-disable-next-line react-hooks/incompatible-library
  const permanentAddress = watch("permanentAddress");
  const [sameAsPermanent, setSameAsPermanent] = React.useState(false);
  const [bloodTypeOptions, setBloodTypeOptions] = React.useState<Option[]>([]);
  const [academicLevelOptions, setAcademicLevelOptions] = React.useState<
    Option[]
  >([]);
  const [addressTypeOptions, setAddressTypeOptions] = React.useState<Option[]>(
    []
  );
  const [genderOptions, setGenderOptions] = React.useState<Option[]>([]);

  React.useEffect(() => {
    // Load lookup options from backend
    (async () => {
      try {
        const [bt, al, at, g] = await Promise.all([
          getBloodTypes(),
          getAcademicLevels(),
          getAddressTypes(),
          getGenders(),
        ]);
        setBloodTypeOptions(bt);
        setAcademicLevelOptions(al);
        setAddressTypeOptions(at);
        setGenderOptions(g);
      } catch (e) {
        console.error("Failed to load lookup options", e);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (sameAsPermanent) {
      setValue("temporaryAddress", { ...permanentAddress, type: 2 });
    }
  }, [permanentAddress, sameAsPermanent, setValue]);

  const processForm = async (data: FieldValues) => {
    try {
      const result = await submitStudent(data);
      if (result) {
        alert("Form Submitted Successfully!");
        // Reset form to initial state
        window.location.reload();
      } else {
        console.error("Form submission error: unknown error");
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
    { name: "Address", fields: ["permanentAddress", "temporaryAddress"] },
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
    if (!ok) {
      console.log("Validation errors:", errors);
    }
    if (ok) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  // lookup-backed select options are loaded via useEffect above

  return (
    <div className="flex items-start justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 py-6">
      <Form onSubmit={handleSubmit(processForm)}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Student Application Form
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Step {currentStep} of {steps.length} ·{" "}
              {steps[currentStep - 1].name}
            </p>
          </div>
        </div>

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
              <Select
                label="Gender"
                name="gender"
                register={register}
                options={genderOptions}
                valueAsNumber
              />
              <Select
                label="Blood Group"
                name="bloodGroup"
                register={register}
                options={bloodTypeOptions}
                valueAsNumber
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
              Permanent Address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Address Type"
                name="permanentAddress.type"
                register={register}
                options={addressTypeOptions}
                valueAsNumber
                error={
                  errors.permanentAddress?.type?.message as string | undefined
                }
              />
              <Input
                label="Province"
                {...register("permanentAddress.province")}
                error={errors.permanentAddress?.province?.message}
              />
              <Input
                label="Municipality"
                {...register("permanentAddress.municipality")}
                error={errors.permanentAddress?.municipality?.message}
              />
              <Input
                label="Ward"
                {...register("permanentAddress.ward")}
                error={errors.permanentAddress?.ward?.message}
              />
              <Input label="Street" {...register("permanentAddress.street")} />
              <Input
                label="Country"
                {...register("permanentAddress.country")}
                error={errors.permanentAddress?.country?.message}
              />
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-6">
              Temporary Address
            </h2>
            <div className="flex items-center mb-4">
              <input
                id="sameAsPermanent"
                type="checkbox"
                checked={sameAsPermanent}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSameAsPermanent(e.target.checked);
                  if (e.target.checked) {
                    setValue("temporaryAddress", {
                      ...permanentAddress,
                      type: 2,
                    });
                  }
                }}
                className="w-4 h-4 accent-black rounded"
              />
              <label
                htmlFor="sameAsPermanent"
                className="block ml-3 text-sm font-medium text-gray-700"
              >
                Same as Permanent Address
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Select
                label="Address Type"
                name="temporaryAddress.type"
                register={register}
                options={addressTypeOptions}
                valueAsNumber
                error={
                  errors.temporaryAddress?.type?.message as string | undefined
                }
              />
              <Input
                label="Province"
                {...register("temporaryAddress.province")}
                error={errors.temporaryAddress?.province?.message}
                disabled={sameAsPermanent}
              />
              <Input
                label="Municipality"
                {...register("temporaryAddress.municipality")}
                error={errors.temporaryAddress?.municipality?.message}
                disabled={sameAsPermanent}
              />
              <Input
                label="Ward"
                {...register("temporaryAddress.ward")}
                error={errors.temporaryAddress?.ward?.message}
                disabled={sameAsPermanent}
              />
              <Input
                label="Street"
                {...register("temporaryAddress.street")}
                disabled={sameAsPermanent}
              />
              <Input
                label="Country"
                {...register("temporaryAddress.country")}
                error={errors.temporaryAddress?.country?.message}
                disabled={sameAsPermanent}
              />
            </div>
          </div>
        )}

        {/* STEP 4 - Family */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Family Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register("parents.0.firstName")}
                error={errors.parents?.[0]?.firstName?.message}
              />
              <Input
                label="Middle Name (optional)"
                {...register("parents.0.middleName")}
              />
              <Input
                label="Last Name"
                {...register("parents.0.lastName")}
                error={errors.parents?.[0]?.lastName?.message}
              />
              <Input
                label="Relation"
                {...register("parents.0.relation")}
                error={errors.parents?.[0]?.relation?.message}
              />
              <Input
                label="Occupation (optional)"
                {...register("parents.0.occupation")}
              />
              <Input
                label="Annual Income (optional)"
                type="number"
                {...register("parents.0.annualIncome", { valueAsNumber: true })}
              />
              <Input
                label="Mobile Number (optional)"
                {...register("parents.0.mobileNumber")}
              />
              <Input
                label="Email (optional)"
                type="email"
                {...register("parents.0.email")}
              />
            </div>
          </div>
        )}

        {/* STEP 5 - Academic History */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Academic History
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Institution Name"
                {...register("academicHistories.0.institutionName")}
                error={errors.academicHistories?.[0]?.institutionName?.message}
              />
              <Select
                label="Academic Level"
                name="academicHistories.0.level"
                register={register}
                options={academicLevelOptions}
                valueAsNumber
                error={errors.academicHistories?.[0]?.level?.message}
              />
              <Input
                label="Board (optional)"
                {...register("academicHistories.0.board")}
              />
              <Input
                label="Percentage or GPA"
                type="number"
                {...register("academicHistories.0.percentageOrGPA", {
                  valueAsNumber: true,
                })}
                error={errors.academicHistories?.[0]?.percentageOrGPA?.message}
              />
              <Input
                label="Passing Year"
                type="number"
                {...register("academicHistories.0.passingYear", {
                  valueAsNumber: true,
                })}
                error={errors.academicHistories?.[0]?.passingYear?.message}
              />
            </div>
          </div>
        )}

        {/* STEP 6 - Academic Enrollment */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Academic Enrollment
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Faculty ID (e.g., 1 or 2)"
                type="number"
                {...register("academicEnrollment.facultyId", {
                  valueAsNumber: true,
                })}
                error={errors.academicEnrollment?.facultyId?.message}
              />
              <Input
                label="Program Name"
                {...register("academicEnrollment.programName")}
                error={errors.academicEnrollment?.programName?.message}
              />
              <Input
                label="Enrollment Date (YYYY-MM-DD)"
                {...register("academicEnrollment.enrollmentDate")}
                error={errors.academicEnrollment?.enrollmentDate?.message}
              />
              <Input
                label="Student ID Number (optional)"
                {...register("academicEnrollment.studentIdNumber")}
              />
            </div>
          </div>
        )}

        {/* STEP 7 - Financial & Scholarship */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Financial Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Annual Income (optional)"
                type="number"
                {...register("financialDetails.annualIncome", {
                  valueAsNumber: true,
                })}
              />
              <Input
                label="Income Source (optional)"
                {...register("financialDetails.incomeSource")}
              />
              <Input
                label="PAN Number (optional)"
                {...register("financialDetails.panNumber")}
              />
              <Checkbox
                label="Are you a taxpayer?"
                name="financialDetails.isTaxPayer"
                register={register}
              />
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-6">
              Scholarship Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Scholarship Name (optional)"
                {...register("scholarship.scholarshipName")}
              />
              <Input
                label="Amount (optional)"
                type="number"
                {...register("scholarship.amount", { valueAsNumber: true })}
              />
              <Input
                label="Start Date (YYYY-MM-DD)"
                {...register("scholarship.startDate")}
              />
              <Input
                label="End Date (YYYY-MM-DD)"
                {...register("scholarship.endDate")}
              />
            </div>
          </div>
        )}

        {/* STEP 8 - Other Details */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Disability Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Disability Type (optional)"
                {...register("disability.disabilityType")}
              />
              <Input
                label="Description (optional)"
                {...register("disability.description")}
              />
              <Input
                label="Disability Percentage (optional)"
                type="number"
                {...register("disability.disabilityPercentage", {
                  valueAsNumber: true,
                })}
              />
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-6">
              Hobbies
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Hobby (optional)" {...register("hobbies.0.name")} />
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-6">
              Achievements
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Title (optional)"
                {...register("achievements.0.title")}
              />
              <Input
                label="Description (optional)"
                {...register("achievements.0.description")}
              />
              <Input
                label="Date of Achievement (YYYY-MM-DD)"
                {...register("achievements.0.dateOfAchievement")}
              />
            </div>
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
