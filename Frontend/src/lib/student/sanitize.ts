// Type-safe empty check
export const isEmptyObject = (obj: unknown): boolean => {
    if (obj === null || obj === undefined) return true;
    if (obj instanceof File) return false;
    if (Array.isArray(obj)) {
      return obj.length === 0 || obj.every(isEmptyObject);
    }
    if (typeof obj !== "object") return false;
  
    return Object.values(obj).every(
      (value) =>
        value === null ||
        value === undefined ||
        value === "" ||
        (typeof value === "number" && Number.isNaN(value)) ||
        isEmptyObject(value)
    );
  };
  
  // Deep sanitize: remove empty objects/arrays, convert empty strings to null for specific cases
 export const sanitizeData = (obj: unknown): unknown => {
    if (obj === null || obj === undefined) return null;
  
    if (Array.isArray(obj)) {
      const sanitized = obj
        .map(sanitizeData)
        .filter((item): item is NonNullable<typeof item> => !isEmptyObject(item));
      return sanitized.length > 0 ? sanitized : null;
    }
  
    if (typeof obj === "object" && !(obj instanceof File)) {
      const result: Record<string, unknown> = {};
  
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        if (value === undefined) continue;
  
        // Convert NaN to null
        if (typeof value === "number" && Number.isNaN(value)) {
          result[key] = null;
          continue;
        }
  
        // Convert empty strings to null for date-like or ID fields
        if (
          value === "" &&
          (key.toLowerCase().includes("date") ||
            key.toLowerCase().includes("year") ||
            key === "studentIdNumber")
        ) {
          result[key] = null;
          continue;
        }
  
        const sanitizedValue = sanitizeData(value);
  
        // Skip entirely empty optional nested objects/arrays
        if (
          ["hobbies", "achievements", "scholarship", "disability"].includes(key)
        ) {
          if (sanitizedValue !== null && !isEmptyObject(sanitizedValue)) {
            result[key] = sanitizedValue;
          }
        } else {
          result[key] = sanitizedValue;
        }
      }
  
      return Object.keys(result).length > 0 ? result : null;
    }
  
    return obj;
  };