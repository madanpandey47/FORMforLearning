"use client";
import React from "react";
import Image from "next/image";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiUsers,
  FiBookOpen,
  FiBriefcase,
  FiDollarSign,
  FiSettings,
  FiFileText,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import Form from "../../components/ui/form";
import Input from "../../components/ui/input";
import Select from "../../components/ui/select";
import Checkbox from "../../components/ui/checkbox";
import Button from "../../components/ui/button";
import {
  useForm,
  FieldValues,
  FieldErrors,
  useFieldArray,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../lib/formvalidation";
import {
  getBloodTypes,
  getAcademicLevels,
  getGenders,
  getParentTypes,
  Option,
} from "../../lib/api/lookups";
import { submitStudent } from "../../lib/api/student";

type FormData = z.infer<typeof formSchema>;

const FormPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid, isSubmitting, isValidating },
    watch,
    setValue,
    getValues,
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: false,
    defaultValues: {
      contactInfo: {
        primaryMobile: "",
        primaryEmail: "",
      },
      citizenship: {
        citizenshipNumber: "",
        countryOfIssuance: "",
        dateOfIssuance: "",
        placeOfIssuance: "",
      },
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
      parents: [{ firstName: "", lastName: "", relation: 0 }],
      academicHistories: [
        {
          institutionName: "",
          level: 0,
          percentageOrGPA: 0,
          passingYear: 0,
        },
      ],
    },
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

  // eslint-disable-next-line react-hooks/incompatible-library
  const permanentAddress = watch("permanentAddress");
  const [sameAsPermanent, setSameAsPermanent] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [bloodTypeOptions, setBloodTypeOptions] = React.useState<Option[]>([]);
  const [academicLevelOptions, setAcademicLevelOptions] = React.useState<
    Option[]
  >([]);
  const [genderOptions, setGenderOptions] = React.useState<Option[]>([]);
  const [parentTypeOptions, setParentTypeOptions] = React.useState<Option[]>(
    []
  );

  React.useEffect(() => {
    // Load lookup options from backend
    (async () => {
      try {
        const [bt, al, g, pt] = await Promise.all([
          getBloodTypes(),
          getAcademicLevels(),
          getGenders(),
          getParentTypes(),
        ]);
        setBloodTypeOptions(bt);
        setAcademicLevelOptions(al);
        setGenderOptions(g);
        setParentTypeOptions(pt);
      } catch (e) {
        console.error("Failed to load lookup options", e);
      }
    })();
  }, []);

  React.useEffect(() => {
    // Only sync addresses when on address step and sameAsPermanent is checked
    if (sameAsPermanent && permanentAddress && currentStep === 3) {
      setValue(
        "temporaryAddress",
        { ...permanentAddress, type: 2 },
        { shouldValidate: false, shouldDirty: false, shouldTouch: false }
      );
    }
  }, [permanentAddress, sameAsPermanent, setValue, currentStep]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processForm = async (data: FieldValues) => {
    console.log("ProcessForm called - form is submitting!");
    console.log("Form data:", data);
    try {
      const result = await submitStudent(data);
      console.log("✅ submitStudent returned:", result);
      if (result) {
        alert("Form Submitted Successfully!");
        // Reset form to initial state
        reset();
        setCurrentStep(1);
        setImagePreview(null);
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
      fields: [
        "firstName",
        "lastName",
        "dateOfBirth",
        "gender",
        "bloodGroup",
        "citizenship.citizenshipNumber",
        "citizenship.countryOfIssuance",
        "citizenship.dateOfIssuance",
        "citizenship.placeOfIssuance",
      ],
    },
    {
      name: "Contact Info",
      fields: ["contactInfo.primaryMobile", "contactInfo.primaryEmail"],
    },
    {
      name: "Address",
      fields: [
        "permanentAddress.province",
        "permanentAddress.municipality",
        "permanentAddress.ward",
        "permanentAddress.country",
      ],
    },
    {
      name: "Family Details",
      fields: ["parents"],
    },
    { name: "Academic History", fields: ["academicHistories"] },
    { name: "Enrollment", fields: ["academicEnrollment"] },
    {
      name: "Scholarship",
      fields: [],
    },
    { name: "Other", fields: [] },
    { name: "Documents & Confirmation", fields: ["agree", "image"] },
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

  const onSubmitError = (validationErrors: FieldErrors<FormData>) => {
    console.error("Form validation failed! Cannot submit.");
    console.error("Validation errors:", validationErrors);

    // Flatten nested errors for easier debugging
    const errorMessages: string[] = [];
    const extractErrors = (obj: Record<string, unknown>, prefix = ""): void => {
      Object.keys(obj).forEach((key) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];
        if (value && typeof value === "object" && "message" in value) {
          errorMessages.push(
            `${fullKey}: ${(value as { message: string }).message}`
          );
        } else if (value && typeof value === "object" && value !== null) {
          extractErrors(value as Record<string, unknown>, fullKey);
        }
      });
    };
    extractErrors(validationErrors as unknown as Record<string, unknown>);

    console.error("Error Summary:", errorMessages);
    console.error("Number of errors:", errorMessages.length);

    if (errorMessages.length > 0) {
      alert(`Please fix the following errors:\n\n${errorMessages.join("\n")}`);
    } else {
      console.warn("OnSubmitError called but no validation errors found!");
      console.log("Current form values:", getValues());
      console.log("Form state:", { isValid, isSubmitting, isValidating });
      alert("Please check all required fields before submitting.");
    }
  };

  const countryOptions = [
    { label: "Nepal", value: "Nepal" },
    { label: "Afghanistan", value: "Afghanistan" },
    { label: "Bangladesh", value: "Bangladesh" },
    { label: "Bhutan", value: "Bhutan" },
    { label: "India", value: "India" },
    { label: "Maldives", value: "Maldives" },
    { label: "Pakistan", value: "Pakistan" },
    { label: "Sri Lanka", value: "Sri Lanka" },
    { label: "Other", value: "Other" },
  ];

  // lookup-backed select options are loaded via useEffect above

  return (
    <div className="flex items-start justify-center bg-linear-to-br from-slate-100 via-slate-50 to-slate-100 py-6">
      <Form onSubmit={handleSubmit(processForm, onSubmitError)}>
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
            <h2 className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-slate-900">
              <FiUser className="h-4 w-4 text-sky-500" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                label="Date of Birth"
                type="date"
                {...register("dateOfBirth")}
                error={errors.dateOfBirth?.message}
              />
              <Select
                label="Gender"
                options={genderOptions}
                error={errors.gender?.message}
                {...register("gender", { valueAsNumber: true })}
              />
              <Select
                label="Blood Group"
                options={bloodTypeOptions}
                error={errors.bloodGroup?.message}
                {...register("bloodGroup", { valueAsNumber: true })}
              />
            </div>
            <h2 className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-slate-900">
              <FiFileText className="h-4 w-4 text-sky-500" />
              Citizenship
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Citizenship Number"
                {...register("citizenship.citizenshipNumber")}
                error={errors.citizenship?.citizenshipNumber?.message}
              />
              <Select
                label="Country of Issuance"
                options={countryOptions}
                error={errors.citizenship?.countryOfIssuance?.message}
                {...register("citizenship.countryOfIssuance")}
              />
              <Input
                label="Date of Issuance"
                type="date"
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
            <h2 className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-slate-900">
              <FiPhone className="h-4 w-4 text-sky-500" />
              Contact Details
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            <h2 className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-slate-900">
              <FiMapPin className="h-4 w-4 text-sky-500" />
              Permanent Address
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <Select
                label="Country"
                options={countryOptions}
                error={errors.permanentAddress?.country?.message}
                {...register("permanentAddress.country")}
              />
            </div>

            <h2 className="mt-6 flex items-center gap-2 border-b pb-2 text-lg font-semibold text-slate-900">
              <FiMapPin className="h-4 w-4 text-emerald-500" />
              Temporary Address
            </h2>
            <div className="mb-4 flex items-center">
              <input
                id="sameAsPermanent"
                type="checkbox"
                checked={sameAsPermanent}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSameAsPermanent(e.target.checked);
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
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <Select
                label="Country"
                options={countryOptions}
                error={errors.temporaryAddress?.country?.message}
                disabled={sameAsPermanent}
                {...register("temporaryAddress.country")}
              />
            </div>
          </div>
        )}

        {/* STEP 4 - Family */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-slate-900">
              <FiUsers className="h-4 w-4 text-sky-500" />
              Family Details
            </h2>

            {parentFields.map((parent, index) => (
              <div key={parent.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-semibold">
                    Parent/Guardian {index + 1}
                  </h3>
                  {parentFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParent(index)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <FiTrash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="First Name"
                    {...register(`parents.${index}.firstName`)}
                    error={errors.parents?.[index]?.firstName?.message}
                  />
                  <Input
                    label="Middle Name (optional)"
                    {...register(`parents.${index}.middleName`)}
                  />
                  <Input
                    label="Last Name"
                    {...register(`parents.${index}.lastName`)}
                    error={errors.parents?.[index]?.lastName?.message}
                  />
                  <Select
                    label="Relation Type"
                    options={parentTypeOptions}
                    error={errors.parents?.[index]?.relation?.message}
                    {...register(`parents.${index}.relation`, {
                      valueAsNumber: true,
                    })}
                  />
                  <Input
                    label="Occupation (optional)"
                    {...register(`parents.${index}.occupation`)}
                  />
                  <Input
                    label="Annual Income (optional)"
                    type="number"
                    {...register(`parents.${index}.annualIncome`, {
                      setValueAs: (v) =>
                        v === "" || isNaN(Number(v)) ? 0 : Number(v),
                    })}
                  />
                  <Input
                    label="Mobile Number (optional)"
                    {...register(`parents.${index}.mobileNumber`)}
                  />
                  <Input
                    label="Email (optional)"
                    type="email"
                    {...register(`parents.${index}.email`)}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                appendParent({
                  firstName: "",
                  lastName: "",
                  relation: 0,
                  email: "",
                })
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              <FiPlus className="h-4 w-4" />
              Add Another Parent/Guardian
            </button>

            {errors.parents?.message && (
              <p className="text-red-600 text-sm">{errors.parents.message}</p>
            )}
          </div>
        )}

        {/* STEP 5 - Academic History */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-slate-900">
              <FiBookOpen className="h-4 w-4 text-sky-500" />
              Academic History
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Institution Name"
                {...register("academicHistories.0.institutionName")}
                error={errors.academicHistories?.[0]?.institutionName?.message}
              />
              <Select
                label="Academic Level"
                options={academicLevelOptions}
                error={errors.academicHistories?.[0]?.level?.message}
                {...register("academicHistories.0.level", {
                  valueAsNumber: true,
                })}
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
            <h2 className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-slate-900">
              <FiBriefcase className="h-4 w-4 text-sky-500" />
              Academic Enrollment
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Faculty ID"
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
                label="Enrollment Date"
                type="date"
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

        {/* STEP 7 - Scholarship */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-slate-900">
              <FiDollarSign className="h-4 w-4 text-emerald-500" />
              Scholarship Details
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Scholarship Name (optional)"
                {...register("scholarship.scholarshipName")}
              />
              <Input
                label="Amount (optional)"
                type="number"
                {...register("scholarship.amount", {
                  setValueAs: (v) =>
                    v === "" || isNaN(Number(v)) ? 0 : Number(v),
                })}
              />
              <Input
                label="Start Date"
                type="date"
                {...register("scholarship.startDate")}
              />
              <Input
                label="End Date"
                type="date"
                {...register("scholarship.endDate")}
              />
            </div>
          </div>
        )}

        {/* STEP 8 - Other Details */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-slate-900">
              <FiSettings className="h-4 w-4 text-sky-500" />
              Disability Information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  setValueAs: (v) =>
                    v === "" || isNaN(Number(v)) ? 0 : Number(v),
                })}
              />
            </div>

            <h2 className="mt-6 flex items-center gap-2 border-b pb-2 text-lg font-semibold text-slate-900">
              <FiSettings className="h-4 w-4 text-amber-500" />
              Hobbies
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="Hobby (optional)" {...register("hobbies.0.name")} />
            </div>

            <h2 className="mt-6 flex items-center gap-2 border-b pb-2 text-lg font-semibold text-slate-900">
              <FiSettings className="h-4 w-4 text-purple-500" />
              Achievements
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Title (optional)"
                {...register("achievements.0.title")}
              />
              <Input
                label="Description (optional)"
                {...register("achievements.0.description")}
              />
              <Input
                label="Date of Achievement"
                type="date"
                {...register("achievements.0.dateOfAchievement")}
              />
            </div>
          </div>
        )}

        {/* STEP 9 - Documents & Confirmation */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-slate-900">
              <FiFileText className="h-4 w-4 text-sky-500" />
              Documents & Profile Image
            </h2>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <FiFileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 font-medium">
                    Upload Profile Image
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>

                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  {...register("image")}
                  onChange={handleImageChange}
                  className="hidden"
                />

                <label
                  htmlFor="imageInput"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                >
                  Select Image
                </label>

                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={128}
                      height={128}
                      className="h-32 w-32 mx-auto rounded object-cover"
                    />
                  </div>
                )}
              </div>

              <Checkbox
                label="I agree to the terms and conditions"
                name="agree"
                register={register}
                error={errors.agree?.message}
              />
            </div>
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
