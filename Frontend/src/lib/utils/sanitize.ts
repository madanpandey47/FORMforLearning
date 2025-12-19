// sanitize.ts

const isEmptyValue = (value: unknown): boolean => {
  if (value === null || value === undefined || value === "") return true;
  if (typeof value === "number" && Number.isNaN(value)) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof File) return false;
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).every(isEmptyValue);
  }
  return false;
};

export const isEmptyObject = isEmptyValue;

export const NULLABLE_EMPTY_STRING_FIELDS = new Set<string>([
  "dateOfBirth",
  "enrollmentDate",
  "dateOfIssuance",
  "passedYear",
  "startDate",
  "endDate",
  "dateOfAchievement",
  "studentIdNumber",
]);

export const OPTIONAL_SECTIONS = new Set<string>([
  "hobbies",
  "achievements",
  "scholarship",
  "disability",
  "middleName",
  "alternateMobile",
  "alternateEmail",
  "street",
  "occupation",
  "annualIncome",
  "board",
]);

export const ALWAYS_INCLUDE_FIELDS = new Set<string>([
  "pid",
  "profileImagePath",
]);

export const sanitizeData = <T>(obj: T): T | null => {
  if (obj === null || obj === undefined) return null;

  if (obj instanceof File) return obj;

  if (Array.isArray(obj)) {
    const sanitized = obj
      .map(sanitizeData)
      .filter(
        (item): item is NonNullable<typeof item> =>
          item !== null && !isEmptyObject(item)
      );

    return (sanitized.length > 0 ? sanitized : null) as T | null;
  }

  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (value === undefined) continue;

      let sanitizedValue: unknown = value;

      if (
        typeof value === "string" &&
        value.trim() === "" &&
        NULLABLE_EMPTY_STRING_FIELDS.has(key)
      ) {
        sanitizedValue = null;
      }
      // Convert NaN to null
      else if (typeof value === "number" && Number.isNaN(value)) {
        sanitizedValue = null;
      } else {
        sanitizedValue = sanitizeData(value);
      }

      if (isEmptyObject(sanitizedValue)) {
        if (!OPTIONAL_SECTIONS.has(key)) {
        }
      } else {
        result[key] = sanitizedValue;
      }
    }

    const hasKeys = Object.keys(result).length > 0;
    if (!hasKeys) return null;

    return result as T | null;
  }

  return obj;
};
