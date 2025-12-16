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
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/student";

// Helper function to construct full image URL
export const getImageUrl = (imagePath?: string | null): string | undefined => {
  if (!imagePath) return undefined;
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}${imagePath}`;
};

// CREATE
export const submitStudent = async (data: FieldValues): Promise<StudentDTO> => {
  const formData = new FormData();
  const { profileImage, academicCertificates, ...rest } = data;

  const transformed = transformToDTO(rest);
  const sanitized = sanitizeData(transformed) as FieldValues;

  objectToFormData(sanitized, formData);

  if (profileImage instanceof File) {
    formData.append("ProfileImage", profileImage);
  }

  if (Array.isArray(academicCertificates)) {
    academicCertificates.forEach((file: unknown) => {
      if (file instanceof File) {
        formData.append("AcademicCertificates", file);
      }
    });
  }

  const response = await fetch(API_BASE_URL, {
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
    const response = await fetch(`${API_BASE_URL}/${pid}`, {
      cache: "no-store", // Recommended for dynamic data in Next.js
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
    const response = await fetch(`${API_BASE_URL}/lookup`, {
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
  const response = await fetch(`${API_BASE_URL}/${pid}`, { method: "DELETE" });

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
  const { profileImage, academicCertificates, ...rest } = data;

  const transformed = transformToDTO(rest);
  const sanitized = sanitizeData(transformed) as FieldValues;

  // Ensure PID is included
  sanitized.pid = pid;

  objectToFormData(sanitized, formData);

  if (profileImage instanceof File) {
    formData.append("ProfileImage", profileImage);
  }
  if (Array.isArray(academicCertificates)) {
    academicCertificates.forEach((file: unknown) => {
      if (file instanceof File) {
        formData.append("AcademicCertificates", file);
      }
    });
  }

  const response = await fetch(`${API_BASE_URL}/${pid}`, {
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
