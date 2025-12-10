import { StudentDTO } from "@/lib/types";
import { FieldValues } from "react-hook-form";

const API_BASE_URL = "http://localhost:5000/api/student";

export const submitStudent = async (
  data: FieldValues
): Promise<StudentDTO | null> => {
  try {
    const formData = new FormData();

    // 1. Separate files from the rest of the data
    const { profileImage, academicCertificates, ...restOfData } = data;

    // 2. Append the non-file data as a JSON string
    formData.append("studentDto", JSON.stringify(restOfData));

    // 3. Append the profile image if it exists
    if (profileImage && profileImage instanceof File) {
      console.log("Appending profile image:", profileImage.name);
      formData.append("profileImage", profileImage);
    }

    // 4. Append academic certificates if they exist
    if (
      Array.isArray(academicCertificates) &&
      academicCertificates.length > 0
    ) {
      academicCertificates.forEach((file: unknown) => {
        if (file instanceof File) {
          console.log("Appending academic certificate:", (file as File).name);
          formData.append("academicCertificates", file as Blob);
        }
      });
    }

    console.log("Submitting form to:", API_BASE_URL);
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      body: formData, // No headers needed, browser sets it for FormData
    });

    console.log("Response status:", response.status);
    const responseData = await response.json();

    if (!response.ok) {
      console.error("Server error:", responseData);
      throw new Error(
        responseData.message || "Failed to submit student application"
      );
    }

    console.log("Student submitted successfully:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error submitting student:", error);
    throw error;
  }
};

export const deleteStudent = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete student");
  }
};

export const updateStudent = async (
  id: number,
  studentDto: StudentDTO,
  profileImage?: File,
  academicCertificates?: File[]
): Promise<StudentDTO> => {
  const formData = new FormData();
  formData.append("studentDto", JSON.stringify(studentDto));

  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  if (academicCertificates) {
    academicCertificates.forEach((file) => {
      formData.append("academicCertificates", file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update student");
  }

  return response.json();
};
