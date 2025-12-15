import { FieldValues } from "react-hook-form";
import { StudentDTO } from "@lib/types/student-types";
import { isEmptyObject } from "./sanitize";

// Convert nested object to FormData with proper nested keys (e.g., addresses[0].province)
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
    middleName,
    citizenship,
    secondaryInfos,
    academicHistories = [],
    scholarship,
    ...rest
  } = formData;

  const transformed: FieldValues = {
    ...rest,
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
  const addresses: FieldValues[] = [];
  if (permanentAddress && !isEmptyObject(permanentAddress)) {
    addresses.push({ ...permanentAddress, type: 0 });
  }
  if (temporaryAddress && !isEmptyObject(temporaryAddress)) {
    addresses.push({ ...temporaryAddress, type: 1 });
  }
  if (addresses.length > 0) {
    transformed.addresses = addresses;
  }

  return transformed;
};

// Transform backend DTO → form structure
export const transformFromDTO = (dto: StudentDTO): FieldValues => {
  const {
    primaryMobile = "",
    primaryEmail = "",
    secondaryInfos,
    addresses = [],
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

  const permanentAddress = addresses.find((a) => a.type === 0) ?? {};
  const temporaryAddress = addresses.find((a) => a.type === 1) ?? {};

  return {
    ...rest,
    profileImagePath,
    academicCertificatePaths: secondaryInfos?.academicCertificatePaths ?? [],
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
    permanentAddress,
    temporaryAddress,
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
        ? achievements.map((a) => ({
            ...a,
            dateOfAchievement: a.dateOfAchievement?.split("T")[0] ?? "",
          }))
        : [{}],
    citizenship: citizenship
      ? {
          ...citizenship,
          dateOfIssuance: citizenship.dateOfIssuance
            ? new Date(citizenship.dateOfIssuance).toISOString().split("T")[0]
            : "",
        }
      : {},
    academicEnrollment: academicEnrollment
      ? {
          ...academicEnrollment,
          enrollmentDate: academicEnrollment.enrollmentDate
            ? new Date(academicEnrollment.enrollmentDate)
                .toISOString()
                .split("T")[0]
            : "",
        }
      : {},
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
