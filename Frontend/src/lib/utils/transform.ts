import { FieldValues } from "react-hook-form";
import { StudentDTO } from "@lib/types/student-types";
import { isEmptyObject } from "./sanitize";

export const objectToFormData = (
  obj: unknown,
  formData: FormData = new FormData(),
  parentKey: string = ""
): void => {
  if (obj === null || obj === undefined) return;

  if (obj instanceof File) {
    if (parentKey) formData.append(parentKey, obj);
    return;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const key = parentKey ? `${parentKey}[${index}]` : `[${index}]`;
      objectToFormData(item, formData, key);
    });
    return;
  }

  if (typeof obj === "object") {
    Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      objectToFormData(value, formData, newKey);
    });
    return;
  }

  // Primitive values
  if (parentKey) {
    formData.append(parentKey, String(obj));
  }
};

// Transform form values → backend DTO structure
export const transformToDTO = (formData: FieldValues): FieldValues => {
  const {
    contactInfo,
    permanentAddress,
    temporaryAddress,
    isTemporaryAddressSameAsPermanent,
    middleName,
    academicEnrollment,
    citizenship,
    secondaryInfos,
    academicHistories = [],
    scholarship,
    gender,
    bloodGroup,
    ...rest
  } = formData;

  const transformed: FieldValues = {
    ...rest,
    // Convert gender and bloodGroup to numbers if they're strings
    gender:
      gender !== null && gender !== undefined && gender !== ""
        ? Number(gender)
        : null,
    bloodGroup:
      bloodGroup !== null && bloodGroup !== undefined && bloodGroup !== ""
        ? Number(bloodGroup)
        : null,
    primaryMobile: contactInfo?.primaryMobile ?? null,
    primaryEmail: contactInfo?.primaryEmail ?? null,
    citizenship: citizenship ?? null,
  };

  // Transform academic histories (convert passedYear number → YYYY-01-01)
  if (Array.isArray(academicHistories) && academicHistories.length > 0) {
    transformed.academicHistories = academicHistories.map(
      (ah: FieldValues) => ({
        ...ah,
        passedYear:
          ah.passedYear && typeof ah.passedYear === "number"
            ? `${ah.passedYear}-01-01`
            : ah.passedYear ?? null,
      })
    );
  }

  // Transform scholarship
  if (scholarship && !isEmptyObject(scholarship)) {
    transformed.scholarship = {
      ...scholarship,
      amount:
        typeof scholarship.amount === "number" &&
        !Number.isNaN(scholarship.amount)
          ? scholarship.amount
          : null,
    };
  }

  // Secondary infos
  const hasSecondaryInfo =
    middleName || contactInfo?.alternateMobile || contactInfo?.alternateEmail;

  if (hasSecondaryInfo || secondaryInfos?.pid) {
    transformed.secondaryInfos = {
      pid: secondaryInfos?.pid ?? null,
      middleName: middleName ?? null,
      alternateMobile: contactInfo?.alternateMobile ?? null,
      alternateEmail: contactInfo?.alternateEmail ?? null,
    };
  }

  // Addresses
  if (isTemporaryAddressSameAsPermanent) {
    transformed.permanentAddress = permanentAddress;
    transformed.temporaryAddress = permanentAddress;
  } else {
    transformed.permanentAddress = permanentAddress;
    transformed.temporaryAddress = temporaryAddress;
  }
  transformed.isTemporaryAddressSameAsPermanent =
    !!isTemporaryAddressSameAsPermanent;

  // Academic enrollment
  if (academicEnrollment && !isEmptyObject(academicEnrollment)) {
    transformed.academicEnrollment = {
      faculty:
        academicEnrollment.faculty !== null &&
        academicEnrollment.faculty !== undefined &&
        academicEnrollment.faculty !== ""
          ? Number(academicEnrollment.faculty)
          : 0,
      programName: academicEnrollment.programName ?? "",
      enrollmentDate: academicEnrollment.enrollmentDate ?? null,
      studentIdNumber: academicEnrollment.studentIdNumber ?? null,
    };
  }

  return transformed;
};

// Transform backend DTO → form structure
export const transformFromDTO = (dto: StudentDTO): FieldValues => {
  const {
    primaryMobile = "",
    primaryEmail = "",
    secondaryInfos,
    permanentAddress,
    temporaryAddress,
    isTemporaryAddressSameAsPermanent,
    parents = [],
    academicHistories = [],
    hobbies = [],
    achievements = [],
    dateOfBirth,
    citizenship,
    academicEnrollment,
    scholarship,
    profileImagePath,
    ...rest
  } = dto;

  return {
    ...rest,
    profileImagePath,
    citizenship: citizenship
      ? {
          ...citizenship,
          dateOfIssuance: citizenship.dateOfIssuance
            ? new Date(citizenship.dateOfIssuance).toISOString().split("T")[0]
            : "",
        }
      : {},
    secondaryInfos: secondaryInfos ?? {},
    dateOfBirth: dateOfBirth
      ? new Date(dateOfBirth).toISOString().split("T")[0]
      : "",
    middleName: secondaryInfos?.middleName ?? "",
    contactInfo: {
      primaryMobile,
      primaryEmail,
      alternateMobile: secondaryInfos?.alternateMobile ?? "",
      alternateEmail: secondaryInfos?.alternateEmail ?? "",
    },
    permanentAddress: permanentAddress ?? {},
    temporaryAddress: temporaryAddress ?? {},
    isTemporaryAddressSameAsPermanent:
      isTemporaryAddressSameAsPermanent ?? false,
    parents: parents.length > 0 ? parents : [{}],
    academicHistories:
      academicHistories.length > 0
        ? academicHistories.map((ah) => ({
            ...ah,
            passedYear:
              typeof ah.passedYear === "string"
                ? parseInt(ah.passedYear.split("-")[0], 10)
                : typeof ah.passedYear === "number"
                ? ah.passedYear
                : undefined,
          }))
        : [{}],
    hobbies: hobbies.length > 0 ? hobbies : [{}],
    achievements:
      achievements.length > 0
        ? achievements.map((a: FieldValues) => ({
            ...a,
            dateOfAchievement: a.dateOfAchievement?.split("T")[0] ?? "",
          }))
        : [{}],
    academicEnrollment: academicEnrollment
      ? {
          faculty: academicEnrollment.facultyId ?? 0,
          programName: academicEnrollment.programName ?? "",
          enrollmentDate: academicEnrollment.enrollmentDate
            ? new Date(academicEnrollment.enrollmentDate)
                .toISOString()
                .split("T")[0]
            : "",
          studentIdNumber: academicEnrollment.studentIdNumber ?? "",
        }
      : {
          faculty: 0,
          programName: "",
          enrollmentDate: "",
          studentIdNumber: "",
        },
    scholarship: scholarship
      ? {
          ...scholarship,
          startDate: scholarship.startDate
            ? new Date(scholarship.startDate).toISOString().split("T")[0]
            : "",
          endDate: scholarship.endDate
            ? new Date(scholarship.endDate).toISOString().split("T")[0]
            : "",
        }
      : {},
  };
};
