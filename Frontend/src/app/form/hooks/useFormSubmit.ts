import { FormData } from "@/lib/validation/formvalidation";
import { submitStudent, updateStudent } from "@/lib/api/student-api";

export const useFormSubmit = (
  isEditMode: boolean,
  studentId: string | null,
  router: { push: (path: string) => void }
) => {
  const onSubmit = async (data: FormData) => {
    try {
      let result;
      if (isEditMode && studentId) {
        result = await updateStudent(studentId, data);
      } else {
        result = await submitStudent(data);
      }
      if (result) {
        alert(
          isEditMode
            ? "Application updated successfully!"
            : "Application submitted successfully!"
        );
        router.push("/");
      }
    } catch (err) {
      alert("Submission failed. Check console.");
      console.error(err);
    }
  };

  const onError = (err: Record<string, { message?: string }>) => {
    if (!err || Object.keys(err).length === 0) {
      alert("Please check all required fields before submitting.");
      return;
    }

    console.error("Validation errors:", err);
    const errorMessages: string[] = [];

    const extractMessages = (
      obj: Record<string, unknown>,
      prefix = ""
    ): void => {
      Object.entries(obj).forEach(([key, value]: [string, unknown]) => {
        const fieldName = prefix ? `${prefix}.${key}` : key;
        if (typeof value === "object" && value !== null && "message" in value) {
          const errorObj = value as { message?: string };
          if (errorObj.message) {
            errorMessages.push(`${fieldName}: ${errorObj.message}`);
          }
        } else if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          extractMessages(value as Record<string, unknown>, fieldName);
        }
      });
    };

    extractMessages(err);

    if (errorMessages.length > 0) {
      alert("Please fix errors:\n" + errorMessages.join("\n"));
    } else {
      alert("Please check all required fields before submitting.");
    }
  };

  return { onSubmit, onError };
};
