import { FieldValues } from "react-hook-form";
import { StudentDTO } from "../types/student-types";
import { sanitizeData } from "../utils/sanitize";
import { StudentLookupDTO } from "../types/student-lookup-types";
import {
  objectToFormData,
  transformToDTO,
  transformFromDTO,
} from "../utils/transform";

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const API_ENDPOINT = `${API_BASE_URL}/api/student`;

// Helper function to construct full image URL
export const getImageUrl = (imagePath?: string | null): string | undefined => {
  if (!imagePath) return undefined;
  return `${API_BASE_URL}${imagePath}`;
};

// CREATE
export const submitStudent = async (data: FieldValues): Promise<StudentDTO> => {
  const formData = new FormData();
  const {
    profileImage,
    citizenshipImage,
    boardCertificateImage,
    studentIdCardImage,
    academicCertificates,
    ...rest
  } = data;

  const transformed = transformToDTO(rest);
  const sanitized = sanitizeData(transformed) as FieldValues;

  objectToFormData(sanitized, formData);

  if (profileImage instanceof File) {
    formData.append("ProfileImage", profileImage);
  }

  if (citizenshipImage instanceof File) {
    formData.append("CitizenshipImage", citizenshipImage);
  }

  if (boardCertificateImage instanceof File) {
    formData.append("BoardCertificateImage", boardCertificateImage);
  }

  if (studentIdCardImage instanceof File) {
    formData.append("StudentIdCardImage", studentIdCardImage);
  }

  if (Array.isArray(academicCertificates)) {
    academicCertificates.forEach((file: unknown) => {
      if (file instanceof File) {
        formData.append("AcademicCertificates", file);
      }
    });
  }

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const responseText = await response.text();
  let result: Record<string, unknown>;

  try {
    result = JSON.parse(responseText);
  } catch {
    console.error("Response was not valid JSON:", responseText);
    throw new Error("Invalid response from server");
  }

  if (!response.ok) {
    console.error("Server error:", result);
    throw new Error(result.message?.toString() || "Failed to submit student");
  }

  return result as unknown as StudentDTO;
};

// READ
export const getStudentById = async (
  pid: string
): Promise<StudentDTO | null> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${pid}`, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Student not found");

    return (await response.json()) as StudentDTO;
  } catch (error) {
    console.error("Error fetching student:", error);
    return null;
  }
};

export const getStudent = async (pid: string): Promise<FieldValues | null> => {
  const dto = await getStudentById(pid);
  return dto ? transformFromDTO(dto) : null;
};

// LIST
export const getAllStudents = async (): Promise<StudentLookupDTO[]> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/lookup`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch students");
    return (await response.json()) as StudentLookupDTO[];
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};

export const deleteStudent = async (pid: string): Promise<void> => {
  const response = await fetch(`${API_ENDPOINT}/${pid}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error("Failed to delete student");
  }
};

// UPDATE
export const updateStudent = async (
  pid: string,
  data: FieldValues
): Promise<StudentDTO> => {
  const formData = new FormData();
  const {
    profileImage,
    citizenshipImage,
    boardCertificateImage,
    studentIdCardImage,
    academicCertificates,
    ...rest
  } = data;

  const transformed = transformToDTO(rest);
  const sanitized = sanitizeData(transformed) as FieldValues;

  sanitized.pid = pid;

  objectToFormData(sanitized, formData);

  if (profileImage instanceof File) {
    formData.append("ProfileImage", profileImage);
  }

  if (citizenshipImage instanceof File) {
    formData.append("CitizenshipImage", citizenshipImage);
  }

  if (boardCertificateImage instanceof File) {
    formData.append("BoardCertificateImage", boardCertificateImage);
  }

  if (studentIdCardImage instanceof File) {
    formData.append("StudentIdCardImage", studentIdCardImage);
  }
  if (Array.isArray(academicCertificates)) {
    academicCertificates.forEach((file: unknown) => {
      if (file instanceof File) {
        formData.append("AcademicCertificates", file);
      }
    });
  }

  const response = await fetch(`${API_ENDPOINT}/${pid}`, {
    method: "PUT",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Update failed:", result);
    throw new Error(result.message || "Failed to update student");
  }
  return result as StudentDTO;
};
