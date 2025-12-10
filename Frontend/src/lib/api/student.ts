import { StudentDTO } from "@/lib/types";
import { FieldValues } from "react-hook-form";

const API_BASE_URL = "http://localhost:5000/api/student";

const sanitizeData = (obj: FieldValues): FieldValues => {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeData(item));
  }

  if (typeof obj === "object") {
    const sanitized: FieldValues = {};
    for (const key in obj) {
      const value = obj[key];
      if (
        value === "" &&
        (key.includes("date") ||
          key.includes("Date") ||
          key === "studentIdNumber")
      ) {
        sanitized[key] = null;
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  return obj;
};

// Transform form data structure to match backend DTO
export const transformToDTO = (formData: FieldValues): FieldValues => {
  const {
    contactInfo,
    permanentAddress,
    temporaryAddress,
    middleName,
    ...rest
  } = formData;

  // Flatten contactInfo to root level
  const transformed: FieldValues = {
    ...rest,
    primaryMobile: contactInfo?.primaryMobile || "",
    primaryEmail: contactInfo?.primaryEmail || "",
  };

  // Add secondary info with middleName and alternate contact
  if (
    middleName ||
    contactInfo?.alternateMobile ||
    contactInfo?.alternateEmail
  ) {
    transformed.secondaryInfos = {
      middleName: middleName || null,
      alternateMobile: contactInfo?.alternateMobile || null,
      alternateEmail: contactInfo?.alternateEmail || null,
    };
  }

  // Add addresses array
  const addresses: FieldValues[] = [];
  if (permanentAddress) {
    addresses.push({ ...permanentAddress, type: 0 }); // Permanent = 0
  }
  if (temporaryAddress) {
    addresses.push({ ...temporaryAddress, type: 1 }); // Temporary = 1
  }
  transformed.addresses = addresses;

  return transformed;
};

export const submitStudent = async (
  data: FieldValues
): Promise<StudentDTO | null> => {
  try {
    const formData = new FormData();

    const { profileImage, academicCertificates, ...restOfData } = data;

    // Transform the form structure to match backend DTO
    const transformedData = transformToDTO(restOfData);

    // Sanitize the data (convert empty strings to null)
    const sanitizedData = sanitizeData(transformedData);

    console.log("Transformed and sanitized data:", sanitizedData);
    formData.append("studentDto", JSON.stringify(sanitizedData));

    if (profileImage && profileImage instanceof File) {
      console.log("Appending profile image:", profileImage.name);
      formData.append("profileImage", profileImage);
    }

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
      body: formData,
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

export const getStudent = async (id: number): Promise<StudentDTO | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch student");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching student:", error);
    return null;
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
