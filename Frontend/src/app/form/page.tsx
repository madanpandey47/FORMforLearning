"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  useWatch,
  FieldValues,
  Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  FormData as SchemaFormData,
} from "@/lib/validation/formvalidation";
import Form from "@/components/ui/form";
import { useSyncTemporaryAddress } from "@/hooks/useSyncTemporaryAddress";

// Hooks
import { useLookups } from "./hooks/useLookups";
import { useFormSubmit } from "./hooks/useFormSubmit";
import { useFormNavigation } from "./hooks/useFormNavigation";
import { useImagePreviews } from "./hooks/useImagePreviews";
import { useLoadStudentData } from "./hooks/useLoadStudentData";

// Components
import { FormProgress } from "./components/FormProgress";
import { FormNavigation as Navigation } from "./components/FormNavigation";
import {
  PersonalDetailsStep,
  ContactInfoStep,
  AddressStep,
  FamilyDetailsStep,
  AcademicHistoryStep,
  EnrollmentStep,
  ScholarshipStep,
  AdditionalInfoStep,
  DocumentsStep,
} from "./components/steps";

// Constants
import { FORM_STEPS } from "./constants/formSteps";

type FormData = SchemaFormData;

const FormPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const studentId = searchParams.get("id");
  const isEditMode = !!studentId;
  const [currentStep, setCurrentStep] = useState(1);

  // Form setup
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
    resolver: zodResolver(formSchema) as unknown as Resolver<FormData>,
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      contactInfo: { primaryMobile: "", primaryEmail: "" },
      citizenship: {
        citizenshipNumber: "",
        countryOfIssuance: "Nepal",
        dateOfIssuance: "",
        placeOfIssuance: "",
      },
      isTemporaryAddressSameAsPermanent: false,
      permanentAddress: {
        province: "",
        municipality: "",
        ward: "",
        country: "Nepal",
      },
      temporaryAddress: {
        province: "",
        municipality: "",
        ward: "",
        country: "",
      },
      parents: [{ firstName: "", lastName: "" }],
      academicHistories: [
        {
          institutionName: "",
          level: null,
          board: "",
          percentageOrGPA: null,
          passedYear: null,
        },
      ],
      academicEnrollment: {
        faculty: 0,
        programName: "",
        enrollmentDate: "",
        studentIdNumber: "",
      },
      achievements: [],
      hobbies: [],
      disability: {
        disabilityType: "",
        description: "",
        disabilityPercentage: null,
      },
      scholarship: {
        scholarshipName: "",
        amount: null,
        startDate: "",
        endDate: "",
      },
      profileImage: undefined,
      citizenshipImage: undefined,
      boardCertificateImage: undefined,
      studentIdCardImage: undefined,
      agree: false,
    },
  });

  // Field arrays
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
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({ control, name: "achievements" });
  const {
    fields: hobbyFields,
    append: appendHobby,
    remove: removeHobby,
  } = useFieldArray({ control, name: "hobbies" });

  // Watch values
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
  const isTemporaryAddressSameAsPermanent = useWatch({
    control,
    name: "isTemporaryAddressSameAsPermanent",
    defaultValue: false,
  });

  // Custom hooks
  const imagePreviews = useImagePreviews();
  const {
    bloodTypeOptions,
    academicLevelOptions,
    genderOptions,
    parentTypeOptions,
    facultyTypeOptions,
    provinceOptions,
    permanentMunicipalities,
    temporaryMunicipalities,
    setPermanentMunicipalities,
    setTemporaryMunicipalities,
    lookupsLoaded,
  } = useLookups(permanentProvince, temporaryProvince);

  const { onSubmit, onError } = useFormSubmit(isEditMode, studentId, router);
  const { handleNext, handleBack, handleCancel, handleSave } =
    useFormNavigation(currentStep, setCurrentStep, FORM_STEPS, trigger, router);

  // Load student data in edit mode
  useLoadStudentData(
    isEditMode,
    studentId,
    lookupsLoaded,
    reset,
    setValue,
    imagePreviews.setProfileImagePreviewUrl,
    imagePreviews.setCitizenshipImagePreviewUrl,
    imagePreviews.setBoardCertificateImagePreviewUrl,
    imagePreviews.setStudentIdCardImagePreviewUrl,
    setPermanentMunicipalities,
    setTemporaryMunicipalities
  );

  // Sync temporary address
  useSyncTemporaryAddress(
    currentStep,
    !!isTemporaryAddressSameAsPermanent,
    permanentAddress,
    temporaryAddress,
    setValue
  );

  // Cleanup image previews
  useEffect(() => {
    return () => {
      if (imagePreviews.profileImagePreviewUrl)
        URL.revokeObjectURL(imagePreviews.profileImagePreviewUrl);
      if (imagePreviews.citizenshipImagePreviewUrl)
        URL.revokeObjectURL(imagePreviews.citizenshipImagePreviewUrl);
      if (imagePreviews.boardCertificateImagePreviewUrl)
        URL.revokeObjectURL(imagePreviews.boardCertificateImagePreviewUrl);
      if (imagePreviews.studentIdCardImagePreviewUrl)
        URL.revokeObjectURL(imagePreviews.studentIdCardImagePreviewUrl);
    };
  }, [imagePreviews]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsStep
            register={register}
            errors={errors}
            genderOptions={genderOptions}
            bloodTypeOptions={bloodTypeOptions}
          />
        );
      case 2:
        return <ContactInfoStep register={register} errors={errors} />;
      case 3:
        return (
          <AddressStep
            register={register}
            errors={errors}
            control={control}
            setValue={setValue}
            getValues={getValues}
            provinceOptions={provinceOptions}
            permanentMunicipalities={permanentMunicipalities}
            temporaryMunicipalities={temporaryMunicipalities}
            permanentProvince={permanentProvince}
            temporaryProvince={temporaryProvince}
            isTemporaryAddressSameAsPermanent={
              !!isTemporaryAddressSameAsPermanent
            }
          />
        );
      case 4:
        return (
          <FamilyDetailsStep
            register={register}
            errors={errors}
            parentFields={parentFields}
            parentTypeOptions={parentTypeOptions}
            appendParent={
              appendParent as (value: Record<string, unknown>) => void
            }
            removeParent={removeParent}
          />
        );
      case 5:
        return (
          <AcademicHistoryStep
            register={register}
            errors={errors}
            academicFields={academicFields}
            academicLevelOptions={academicLevelOptions}
            appendAcademic={
              appendAcademic as (value: Record<string, unknown>) => void
            }
            removeAcademic={removeAcademic}
          />
        );
      case 6:
        return (
          <EnrollmentStep
            register={register}
            errors={errors}
            facultyTypeOptions={facultyTypeOptions}
          />
        );
      case 7:
        return <ScholarshipStep register={register} errors={errors} />;
      case 8:
        return (
          <AdditionalInfoStep
            register={register}
            errors={errors}
            achievementFields={achievementFields}
            hobbyFields={hobbyFields}
            appendAchievement={
              appendAchievement as (value: Record<string, unknown>) => void
            }
            removeAchievement={removeAchievement}
            appendHobby={
              appendHobby as (value: Record<string, unknown>) => void
            }
            removeHobby={removeHobby}
          />
        );
      case 9:
        return (
          <DocumentsStep
            control={control}
            errors={errors}
            isEditMode={isEditMode}
            imagePreviews={imagePreviews}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <FormProgress
          currentStep={currentStep}
          totalSteps={FORM_STEPS.length}
          stepName={FORM_STEPS[currentStep - 1].name}
        />

        <Form
          onSubmit={handleSubmit(async (data: FieldValues) => {
            const isValid = await trigger();
            if (!isValid) {
              onError(errors as Record<string, { message?: string }>);
              return;
            }
            await onSubmit(data as FormData);
          }, onError)}
        >
          {renderStep()}

          <Navigation
            currentStep={currentStep}
            totalSteps={FORM_STEPS.length}
            isEditMode={isEditMode}
            onNext={handleNext}
            onBack={handleBack}
            onCancel={handleCancel}
            onSave={() =>
              handleSave(
                getValues,
                onSubmit,
                onError,
                errors as Record<string, { message?: string }>
              )
            }
          />
        </Form>
      </div>
    </div>
  );
};

export default FormPage;
