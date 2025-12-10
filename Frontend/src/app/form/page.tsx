"use client";
import React from "react";
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
  FiAward,
  FiStar,
} from "react-icons/fi";
import Form from "../../components/ui/form";
import Input from "../../components/ui/input";
import Select from "../../components/ui/select";
import Checkbox from "../../components/ui/checkbox";
import Button from "../../components/ui/button";
import { useSyncTemporaryAddress } from "../../hooks/useSyncTemporaryAddress";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../lib/formvalidation";
import {
  getBloodTypes,
  getAcademicLevels,
  getGenders,
  getParentTypes,
  getFacultyTypes,
  getProvinces,
  getMunicipalities,
  Option,
} from "../../lib/api/lookups";
import {
  submitStudent,
  getStudent,
  updateStudent,
  transformToDTO,
} from "../../lib/api/student";
import { StudentDTO } from "../../lib/types";
import { useSearchParams } from "next/navigation";

type FormData = z.infer<typeof formSchema>;

const FormPage: React.FC = () => {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id");
  const isEditMode = !!studentId;

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      contactInfo: { primaryMobile: "", primaryEmail: "" },
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
        type: 0, // Fixed: Permanent is 0
      },
      temporaryAddress: {
        province: "",
        municipality: "",
        ward: "",
        country: "",
        type: 1, // Fixed: Temporary is 1
      },
      parents: [{ firstName: "", lastName: "", relation: 0 }],
      academicHistories: [
        {
          institutionName: "",
          level: 0,
          board: "",
          percentageOrGPA: 0,
          passingYear: 0,
        },
      ],
      hobbies: [{ name: "" }],
      achievements: [{ title: "", description: "", dateOfAchievement: "" }],
      academicEnrollment: {
        facultyId: 0,
        programName: "",
        enrollmentDate: "",
        studentIdNumber: "",
      },
      disability: {
        disabilityType: "",
        description: "",
        disabilityPercentage: 0,
      },
      scholarship: {
        scholarshipName: "",
        amount: 0,
        startDate: "",
        endDate: "",
      },
      profileImage: undefined,
      academicCertificates: [],
      agree: false,
    },
  });

  // Dynamic field arrays
  const {
    fields: parentFields,
    append: appendParent,
    remove: removeParent,
  } = useFieldArray({ control, name: "parents" });
  const {
    fields: academicFields,
    append: appendAcademic,
    remove: removeAcademic,
  } = useFieldArray({ control, name: "academicHistories" });
  const {
    fields: hobbyFields,
    append: appendHobby,
    remove: removeHobby,
  } = useFieldArray({ control, name: "hobbies" });
  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({ control, name: "achievements" });

  const [currentStep, setCurrentStep] = React.useState(1);
  const [sameAsPermanent, setSameAsPermanent] = React.useState(false);

  // Previews
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = React.useState<
    string | null
  >(null);
  const [academicCertificatesPreviewUrls, setAcademicCertificatesPreviewUrls] =
    React.useState<string[]>([]);

  // Lookups
  const [bloodTypeOptions, setBloodTypeOptions] = React.useState<Option[]>([]);
  const [academicLevelOptions, setAcademicLevelOptions] = React.useState<
    Option[]
  >([]);
  const [genderOptions, setGenderOptions] = React.useState<Option[]>([]);
  const [parentTypeOptions, setParentTypeOptions] = React.useState<Option[]>(
    []
  );
  const [facultyTypeOptions, setFacultyTypeOptions] = React.useState<Option[]>(
    []
  );
  const [provinceOptions, setProvinceOptions] = React.useState<Option[]>([]);
  const [permanentMunicipalities, setPermanentMunicipalities] = React.useState<
    Option[]
  >([]);
  const [temporaryMunicipalities, setTemporaryMunicipalities] = React.useState<
    Option[]
  >([]);

  const permanentAddress = useWatch({ control, name: "permanentAddress" });
  const temporaryAddress = useWatch({ control, name: "temporaryAddress" });
  const permanentProvince = useWatch({
    control,
    name: "permanentAddress.province",
  });
  const temporaryProvince = useWatch({
    control,
    name: "temporaryAddress.province",
  });

  // Load lookup data
  React.useEffect(() => {
    (async () => {
      try {
        const [bt, al, g, pt, ft, prov] = await Promise.all([
          getBloodTypes(),
          getAcademicLevels(),
          getGenders(),
          getParentTypes(),
          getFacultyTypes(),
          getProvinces(),
        ]);
        setBloodTypeOptions(bt);
        setAcademicLevelOptions(al);
        setGenderOptions(g);
        setParentTypeOptions(pt);
        setFacultyTypeOptions(ft);
        setProvinceOptions(prov);
      } catch (e) {
        console.error("Failed to load lookups", e);
      }
    })();
  }, []);

  // Load municipalities
  React.useEffect(() => {
    if (permanentProvince)
      getMunicipalities(permanentProvince).then(setPermanentMunicipalities);
    else setPermanentMunicipalities([]);
  }, [permanentProvince]);

  React.useEffect(() => {
    if (temporaryProvince)
      getMunicipalities(temporaryProvince).then(setTemporaryMunicipalities);
    else setTemporaryMunicipalities([]);
  }, [temporaryProvince]);

  // Load student in edit mode
  React.useEffect(() => {
    if (isEditMode && studentId) {
      (async () => {
        try {
          const student = await getStudent(parseInt(studentId));
          if (student) {
            const formData: Partial<FormData> = {
              firstName: student.firstName,
              middleName: student.secondaryInfos?.middleName || "",
              lastName: student.lastName,
              dateOfBirth: student.dateOfBirth.split("T")[0],
              gender: student.gender,
              bloodGroup: student.bloodGroup,
              citizenship: student.citizenship
                ? {
                    citizenshipNumber:
                      student.citizenship.citizenshipNumber || "",
                    countryOfIssuance:
                      student.citizenship.countryOfIssuance || "",
                    dateOfIssuance: student.citizenship.dateOfIssuance || "",
                    placeOfIssuance: student.citizenship.placeOfIssuance || "",
                  }
                : {
                    citizenshipNumber: "",
                    countryOfIssuance: "",
                    dateOfIssuance: "",
                    placeOfIssuance: "",
                  },
              contactInfo: {
                primaryMobile: student.primaryMobile,
                primaryEmail: student.primaryEmail,
                alternateMobile: student.secondaryInfos?.alternateMobile || "",
                alternateEmail: student.secondaryInfos?.alternateEmail || "",
              },
              permanentAddress: (() => {
                const addr = student.addresses?.find((a) => a.type === 0);
                return addr
                  ? {
                      province: addr.province || "",
                      municipality: addr.municipality || "",
                      ward: addr.ward || "",
                      street: addr.street || "",
                      country: addr.country || "",
                      type: 0,
                    }
                  : {
                      province: "",
                      municipality: "",
                      ward: "",
                      street: "",
                      country: "",
                      type: 0,
                    };
              })(),
              temporaryAddress: (() => {
                const addr = student.addresses?.find((a) => a.type === 1);
                return addr
                  ? {
                      province: addr.province || "",
                      municipality: addr.municipality || "",
                      ward: addr.ward || "",
                      street: addr.street || "",
                      country: addr.country || "",
                      type: 1,
                    }
                  : {
                      province: "",
                      municipality: "",
                      ward: "",
                      street: "",
                      country: "",
                      type: 1,
                    };
              })(),
              parents: student.parents?.length
                ? student.parents.map((p) => ({
                    firstName: p.firstName || "",
                    lastName: p.lastName || "",
                    relation: p.relation || 0,
                    middleName: p.middleName || "",
                    occupation: p.occupation || "",
                    annualIncome: p.annualIncome || 0,
                    mobileNumber: p.mobileNumber || "",
                    email: p.email || "",
                  }))
                : [{ firstName: "", lastName: "", relation: 0 }],
              academicHistories: student.academicHistories?.length
                ? student.academicHistories.map((ah) => ({
                    institutionName: ah.institutionName || "",
                    level: ah.level || 0,
                    board: ah.board || "",
                    percentageOrGPA: ah.percentageOrGPA || 0,
                    passingYear: ah.passedYear ? parseInt(ah.passedYear) : 0, // Fixed: string to number
                  }))
                : [
                    {
                      institutionName: "",
                      level: 0,
                      board: "",
                      percentageOrGPA: 0,
                      passingYear: 0,
                    },
                  ],
              hobbies: student.hobbies?.length
                ? student.hobbies
                : [{ name: "" }],
              achievements: student.achievements?.length
                ? student.achievements.map((a) => ({
                    ...a,
                    dateOfAchievement: a.dateOfAchievement?.split("T")[0] || "",
                  }))
                : [{ title: "", description: "", dateOfAchievement: "" }],
              academicEnrollment: student.academicEnrollment
                ? {
                    facultyId: student.academicEnrollment.facultyId || 0,
                    programName: student.academicEnrollment.programName || "",
                    enrollmentDate:
                      student.academicEnrollment.enrollmentDate?.split(
                        "T"
                      )[0] || "",
                    studentIdNumber:
                      student.academicEnrollment.studentIdNumber || "",
                  }
                : {
                    facultyId: 0,
                    programName: "",
                    enrollmentDate: "",
                    studentIdNumber: "",
                  },
              disability: student.disability || {
                disabilityType: "",
                description: "",
                disabilityPercentage: 0,
              },
              scholarship: student.scholarship || {
                scholarshipName: "",
                amount: 0,
                startDate: "",
                endDate: "",
              },
            };

            reset(formData as FormData);

            if (student.profileImagePath) {
              setProfileImagePreviewUrl(
                `http://localhost:5000${student.profileImagePath}`
              );
            }

            // Check if temporary same as permanent
            const perm = getValues("permanentAddress");
            const temp = getValues("temporaryAddress");
            const permWithoutType = {
              province: perm.province,
              municipality: perm.municipality,
              ward: perm.ward,
              street: perm.street || "",
              country: perm.country,
            };
            const tempWithoutType = {
              province: temp.province,
              municipality: temp.municipality,
              ward: temp.ward,
              street: temp.street || "",
              country: temp.country,
            };
            if (
              JSON.stringify(permWithoutType) ===
              JSON.stringify(tempWithoutType)
            ) {
              setSameAsPermanent(true);
            }
          }
        } catch {
          alert("Failed to load student data");
        }
      })();
    }
  }, [isEditMode, studentId, reset, getValues]);

  // Sync temporary address
  useSyncTemporaryAddress(
    currentStep,
    sameAsPermanent,
    permanentAddress,
    temporaryAddress,
    setValue
  );

  // Cleanup URLs
  React.useEffect(() => {
    return () => {
      if (profileImagePreviewUrl) URL.revokeObjectURL(profileImagePreviewUrl);
      academicCertificatesPreviewUrls.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [profileImagePreviewUrl, academicCertificatesPreviewUrls]);

  const handleNext = async () => {
    const fields = steps[currentStep - 1].fields;
    const output = await trigger(fields as (keyof FormData)[]);
    if (output) setCurrentStep((s) => Math.min(s + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit = async (data: FormData) => {
    try {
      let result;
      if (isEditMode && studentId) {
        // Transform to DTO for update
        const transformed = transformToDTO(data); // Use same transform
        result = await updateStudent(
          parseInt(studentId),
          transformed as StudentDTO,
          data.profileImage,
          data.academicCertificates
        );
      } else {
        result = await submitStudent(data);
      }
      if (result) {
        alert(
          isEditMode
            ? "Application updated successfully!"
            : "Application submitted successfully!"
        );
        reset();
        setCurrentStep(1);
        setProfileImagePreviewUrl(null);
        setAcademicCertificatesPreviewUrls([]);
      }
    } catch (err) {
      alert("Submission failed. Check console.");
      console.error(err);
    }
  };

  const onError = (err: Record<string, { message?: string }>) => {
    console.error("Validation errors:", err);
    const messages = Object.values(err)
      .map((e) => e?.message)
      .filter(Boolean);
    alert("Please fix errors:\n" + messages.join("\n"));
  };

  const countryOptions = [
    { label: "Nepal", value: "Nepal" },
    { label: "India", value: "India" },
    { label: "Other", value: "Other" },
  ];

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
      ],
    },
    {
      name: "Contact Info",
      fields: ["contactInfo.primaryMobile", "contactInfo.primaryEmail"],
    },
    {
      name: "Address",
      fields: ["permanentAddress.province", "temporaryAddress.province"],
    },
    { name: "Family Details", fields: ["parents"] },
    { name: "Academic History", fields: ["academicHistories"] },
    { name: "Enrollment", fields: ["academicEnrollment.facultyId"] },
    { name: "Scholarship", fields: [] },
    { name: "Other", fields: [] },
    { name: "Documents & Confirmation", fields: ["agree"] },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-50 py-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Student Application Form
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Step {currentStep} of {steps.length} — {steps[currentStep - 1].name}
          </p>
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-sky-600 rounded-full"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          {/* STEP 1: Personal */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
                <FiUser className="text-sky-600" /> Personal Information
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
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
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  label="Date of Birth"
                  type="date"
                  {...register("dateOfBirth")}
                  error={errors.dateOfBirth?.message}
                />
                <Select
                  label="Gender"
                  options={genderOptions}
                  {...register("gender", { valueAsNumber: true })}
                  error={errors.gender?.message}
                />
                <Select
                  label="Blood Group"
                  options={bloodTypeOptions}
                  {...register("bloodGroup", { valueAsNumber: true })}
                  error={errors.bloodGroup?.message}
                />
              </div>
              {/* Added: Citizenship */}
              <h3 className="text-lg font-medium mt-6">Citizenship Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
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

          {/* STEP 2: Contact */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
                <FiPhone className="text-sky-600" /> Contact Information
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Primary Mobile"
                  {...register("contactInfo.primaryMobile")}
                  error={errors.contactInfo?.primaryMobile?.message}
                />
                <Input
                  label="Alternate Mobile (optional)"
                  {...register("contactInfo.alternateMobile")}
                />
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

          {/* STEP 3: Address */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
                  <FiMapPin className="text-sky-600" /> Permanent Address
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Select
                    label="Province"
                    options={provinceOptions}
                    {...register("permanentAddress.province")}
                    error={errors.permanentAddress?.province?.message}
                  />
                  <Select
                    label="Municipality"
                    options={permanentMunicipalities}
                    {...register("permanentAddress.municipality")}
                    disabled={!permanentProvince}
                    error={errors.permanentAddress?.municipality?.message}
                  />
                  <Input
                    label="Ward"
                    {...register("permanentAddress.ward")}
                    error={errors.permanentAddress?.ward?.message}
                  />
                  <Input
                    label="Street (optional)"
                    {...register("permanentAddress.street")}
                  />
                  <Select
                    label="Country"
                    options={countryOptions}
                    {...register("permanentAddress.country")}
                    error={errors.permanentAddress?.country?.message}
                  />
                </div>
              </div>

              <div>
                <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
                  <FiMapPin className="text-emerald-600" /> Temporary Address
                </h2>
                <div className="my-4 flex items-center">
                  <input
                    type="checkbox"
                    id="sameAsPermanent"
                    checked={sameAsPermanent}
                    onChange={(e) => setSameAsPermanent(e.target.checked)}
                    className="h-4 w-4 rounded accent-sky-600"
                  />
                  <label
                    htmlFor="sameAsPermanent"
                    className="ml-2 text-sm font-medium"
                  >
                    Same as Permanent Address
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Select
                    label="Province"
                    options={provinceOptions}
                    {...register("temporaryAddress.province")}
                    disabled={sameAsPermanent}
                    error={errors.temporaryAddress?.province?.message}
                  />
                  <Select
                    label="Municipality"
                    options={temporaryMunicipalities}
                    {...register("temporaryAddress.municipality")}
                    disabled={sameAsPermanent || !temporaryProvince}
                    error={errors.temporaryAddress?.municipality?.message}
                  />
                  <Input
                    label="Ward"
                    {...register("temporaryAddress.ward")}
                    disabled={sameAsPermanent}
                    error={errors.temporaryAddress?.ward?.message}
                  />
                  <Input
                    label="Street (optional)"
                    {...register("temporaryAddress.street")}
                    disabled={sameAsPermanent}
                  />
                  <Select
                    label="Country"
                    options={countryOptions}
                    {...register("temporaryAddress.country")}
                    disabled={sameAsPermanent}
                    error={errors.temporaryAddress?.country?.message}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Family */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
                <FiUsers className="text-sky-600" /> Family Details
              </h2>
              {parentFields.map((field, i) => (
                <div
                  key={field.id}
                  className="rounded-lg border bg-gray-50 p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">Parent/Guardian {i + 1}</h3>
                    {parentFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParent(i)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 /> Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="First Name"
                      {...register(`parents.${i}.firstName`)}
                      error={errors.parents?.[i]?.firstName?.message}
                    />
                    <Input
                      label="Middle Name (optional)"
                      {...register(`parents.${i}.middleName`)}
                    />
                    <Input
                      label="Last Name"
                      {...register(`parents.${i}.lastName`)}
                      error={errors.parents?.[i]?.lastName?.message}
                    />
                    <Select
                      label="Relation"
                      options={parentTypeOptions}
                      {...register(`parents.${i}.relation`, {
                        valueAsNumber: true,
                      })}
                      error={errors.parents?.[i]?.relation?.message}
                    />
                    <Input
                      label="Occupation (optional)"
                      {...register(`parents.${i}.occupation`)}
                    />
                    <Input
                      label="Annual Income (optional)"
                      type="number"
                      {...register(`parents.${i}.annualIncome`, {
                        valueAsNumber: true,
                      })}
                    />
                    <Input
                      label="Mobile (optional)"
                      {...register(`parents.${i}.mobileNumber`)}
                    />
                    <Input
                      label="Email (optional)"
                      type="email"
                      {...register(`parents.${i}.email`)}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  appendParent({ firstName: "", lastName: "", relation: 0 })
                }
                className="flex items-center gap-2 text-sky-600 hover:text-sky-700"
              >
                <FiPlus /> Add Another
              </button>
            </div>
          )}

          {/* STEP 5: Academic History */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
                <FiBookOpen className="text-sky-600" /> Academic History
              </h2>
              {academicFields.map((field, i) => (
                <div
                  key={field.id}
                  className="rounded-lg border bg-gray-50 p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">Education {i + 1}</h3>
                    {academicFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAcademic(i)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 /> Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Institution"
                      {...register(`academicHistories.${i}.institutionName`)}
                      error={
                        errors.academicHistories?.[i]?.institutionName?.message
                      }
                    />
                    <Select
                      label="Level"
                      options={academicLevelOptions}
                      {...register(`academicHistories.${i}.level`, {
                        valueAsNumber: true,
                      })}
                      error={errors.academicHistories?.[i]?.level?.message}
                    />
                    <Input
                      label="Board (optional)"
                      {...register(`academicHistories.${i}.board`)}
                    />
                    <Input
                      label="Percentage/GPA"
                      type="number"
                      step="0.01"
                      {...register(`academicHistories.${i}.percentageOrGPA`, {
                        valueAsNumber: true,
                      })}
                      error={
                        errors.academicHistories?.[i]?.percentageOrGPA?.message
                      }
                    />
                    <Input
                      label="Passing Year"
                      type="number"
                      {...register(`academicHistories.${i}.passingYear`, {
                        valueAsNumber: true,
                      })}
                      error={
                        errors.academicHistories?.[i]?.passingYear?.message
                      }
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  appendAcademic({
                    institutionName: "",
                    level: 0,
                    board: "",
                    percentageOrGPA: 0,
                    passingYear: 0,
                  })
                }
                className="flex items-center gap-2 text-sky-600"
              >
                <FiPlus /> Add Education
              </button>
            </div>
          )}

          {/* STEP 6: Enrollment */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
                <FiBriefcase className="text-sky-600" /> Enrollment
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Faculty"
                  options={facultyTypeOptions}
                  {...register("academicEnrollment.facultyId", {
                    valueAsNumber: true,
                  })}
                  error={errors.academicEnrollment?.facultyId?.message}
                />
                <Input
                  label="Program"
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

          {/* STEP 7: Scholarship */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
                <FiDollarSign className="text-sky-600" /> Scholarship Details
                (Optional)
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Scholarship Name"
                  {...register("scholarship.scholarshipName")}
                />
                <Input
                  label="Amount"
                  type="number"
                  {...register("scholarship.amount", { valueAsNumber: true })}
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

          {/* STEP 8: Other (Hobbies, Achievements, Disability) */}
          {currentStep === 8 && (
            <div className="space-y-8">
              <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
                <FiSettings className="text-sky-600" /> Other Details
              </h2>

              {/* Hobbies */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                  <FiStar className="text-sky-600" /> Hobbies
                </h3>
                {hobbyFields.map((field, i) => (
                  <div key={field.id} className="flex items-end gap-4 mb-4">
                    <Input
                      label={`Hobby ${i + 1}`}
                      {...register(`hobbies.${i}.name`)}
                    />
                    {hobbyFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHobby(i)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendHobby({ name: "" })}
                  className="flex items-center gap-2 text-sky-600"
                >
                  <FiPlus /> Add Hobby
                </button>
              </div>

              {/* Achievements */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                  <FiAward className="text-sky-600" /> Achievements
                </h3>
                {achievementFields.map((field, i) => (
                  <div
                    key={field.id}
                    className="rounded-lg border bg-gray-50 p-6 mb-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Achievement {i + 1}</h4>
                      {achievementFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAchievement(i)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 /> Remove
                        </button>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        label="Title"
                        {...register(`achievements.${i}.title`)}
                      />
                      <Input
                        label="Description"
                        {...register(`achievements.${i}.description`)}
                      />
                      <Input
                        label="Date of Achievement"
                        type="date"
                        {...register(`achievements.${i}.dateOfAchievement`)}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendAchievement({
                      title: "",
                      description: "",
                      dateOfAchievement: "",
                    })
                  }
                  className="flex items-center gap-2 text-sky-600"
                >
                  <FiPlus /> Add Achievement
                </button>
              </div>

              {/* Disability */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Disability Details (Optional)
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Disability Type"
                    {...register("disability.disabilityType")}
                  />
                  <Input
                    label="Description"
                    {...register("disability.description")}
                  />
                  <Input
                    label="Disability Percentage"
                    type="number"
                    {...register("disability.disabilityPercentage", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: Documents */}
          {currentStep === 9 && (
            <div className="space-y-8">
              <h2 className="flex items-center gap-2 border-b pb-3 text-xl font-semibold">
                <FiFileText className="text-sky-600" /> Documents & Confirmation
              </h2>

              {/* Profile Image */}
              <Controller
                control={control}
                name="profileImage"
                render={({ field }) => (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <FiUser className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="font-medium">
                      Profile Image {isEditMode ? "(Replace if needed)" : ""}
                    </p>
                    {!profileImagePreviewUrl ? (
                      <label className="mt-4 inline-block cursor-pointer rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
                        Choose Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                              setProfileImagePreviewUrl(
                                URL.createObjectURL(file)
                              );
                            }
                          }}
                        />
                      </label>
                    ) : (
                      <div className="mt-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={profileImagePreviewUrl}
                          alt="Preview"
                          className="mx-auto h-32 w-32 rounded-full object-cover shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(undefined);
                            if (
                              profileImagePreviewUrl &&
                              !profileImagePreviewUrl.startsWith("http")
                            )
                              URL.revokeObjectURL(profileImagePreviewUrl);
                            setProfileImagePreviewUrl(null);
                          }}
                          className="mt-2 text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {errors.profileImage?.message && (
                      <p className="text-red-600 mt-2">
                        {errors.profileImage.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Certificates */}
              <Controller
                control={control}
                name="academicCertificates"
                render={({ field }) => (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <FiFileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="font-medium">
                      Academic Certificates {isEditMode ? "(Add/Replace)" : ""}
                    </p>
                    <label className="mt-4 inline-block cursor-pointer rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
                      Add Files
                      <input
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files
                            ? Array.from(e.target.files)
                            : [];
                          field.onChange(files);
                          setAcademicCertificatesPreviewUrls(
                            files.map((f) => URL.createObjectURL(f))
                          );
                        }}
                      />
                    </label>

                    {academicCertificatesPreviewUrls.length > 0 && (
                      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {academicCertificatesPreviewUrls.map((url, i) => (
                          <div key={i} className="relative">
                            {getValues("academicCertificates")?.[
                              i
                            ]?.type.startsWith("image/") ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={url}
                                  alt=""
                                  className="h-32 w-full rounded object-cover shadow-md"
                                />
                              </>
                            ) : (
                              <div className="flex h-32 items-center justify-center rounded bg-gray-200 shadow-md">
                                <FiFileText className="h-12 w-12 text-gray-500" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles =
                                  field.value?.filter(
                                    (_file: File, idx: number) => idx !== i
                                  ) || [];
                                field.onChange(newFiles);
                                URL.revokeObjectURL(url);
                                setAcademicCertificatesPreviewUrls((prev) =>
                                  prev.filter((_, idx) => idx !== i)
                                );
                              }}
                              className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white shadow"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />

              <Controller
                name="agree"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label="I agree to the terms and conditions"
                    name="agree"
                    checked={field.value}
                    onChange={field.onChange}
                    error={errors.agree?.message}
                  />
                )}
              />
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded bg-gray-500 px-6 py-3 text-white hover:bg-gray-600"
              >
                Back
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded bg-sky-600 px-6 py-3 text-white hover:bg-sky-700"
              >
                Next
              </button>
            ) : (
              <Button
                type="submit"
                label={isEditMode ? "Update Application" : "Submit Application"}
              />
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default FormPage;
