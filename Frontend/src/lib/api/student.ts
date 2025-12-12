import { StudentDTO } from "@/lib/types";
import { FieldValues } from "react-hook-form";

const API_BASE_URL = "http://localhost:5000/api/student";

const sanitizeData = (obj: any): any => {
  if (obj === null || obj === undefined) return null;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeData(item));
  }

  if (typeof obj === "object" && !(obj instanceof File)) {
    const sanitized: FieldValues = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (
          value === "" &&
          (key.toLowerCase().includes("date") || key === "studentIdNumber")
        ) {
          sanitized[key] = null;
        } else if (value !== undefined) {
          sanitized[key] = sanitizeData(value);
        }
      }
    }
    return sanitized;
  }

  return obj;
};

// Helper to convert a JS object to FormData
const objectToFormData = (
  obj: any,
  formData = new FormData(),
  parentKey = ""
) => {
  if (obj === null || obj === undefined) {
    return;
  }

  if (typeof obj === "object" && !(obj instanceof File) && !Array.isArray(obj)) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      objectToFormData(value, formData, newKey);
    });
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const newKey = `${parentKey}[${index}]`;
      objectToFormData(item, formData, newKey);
    });
  } else {
    // Primitives or Files
    if (parentKey) {
      formData.append(parentKey, obj);
    }
  }
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
  } else {
    transformed.secondaryInfos = null;
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

    // 1. Transform the form structure to match backend DTO
    const transformedData = transformToDTO(restOfData);

    // 2. Sanitize the data (convert empty strings to null for specific fields)
    const sanitizedData = sanitizeData(transformedData);

    // 3. Convert the sanitized DTO object into FormData fields
    objectToFormData(sanitizedData, formData);

    // 4. Append files
    if (profileImage && profileImage instanceof File) {
      formData.append("ProfileImage", profileImage);
    }
    if (Array.isArray(academicCertificates)) {
      academicCertificates.forEach((file) => {
        if (file instanceof File) {
          formData.append("AcademicCertificates", file);
        }
      });
    }
    
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      body: formData,
    });
    
    const responseData = await response.json();

    if (!response.ok) {
      console.error("Server error:", responseData);
      throw new Error(
        responseData.message || "Failed to submit student application"
      );
    }
    
    return responseData;
  } catch (error) {
    console.error("Error submitting student:", error);
    throw error;
  }
};

export const getStudent = async (pid: string): Promise<StudentDTO | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${pid}`);

    if (!response.ok) {
      throw new Error("Failed to fetch student");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching student:", error);
    return null;
  }
};

export const deleteStudent = async (pid: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${pid}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete student");
  }
};

export const updateStudent = async (
  pid: string,
  data: FieldValues, // Pass the entire form data
): Promise<StudentDTO> => {
  
  const formData = new FormData();
  const { profileImage, academicCertificates, ...restOfData } = data;
  
  // 1. Transform the form structure to match backend DTO
  const transformedData = transformToDTO(restOfData);
  
  // 2. Sanitize
  const sanitizedData = sanitizeData(transformedData);

  // 3. Set PID for the update
  sanitizedData.pid = pid;
  
  // 4. Convert the DTO to form data
  objectToFormData(sanitizedData, formData);

  // 5. Append files
  if (profileImage && profileImage instanceof File) {
    formData.append("ProfileImage", profileImage);
  }
  if (Array.isArray(academicCertificates)) {
    academicCertificates.forEach((file) => {
      if (file instanceof File) {
        formData.append("AcademicCertificates", file);
      }
    });
  }

  const response = await fetch(`${API_BASE_URL}/${pid}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Server error on update:", errorData);
    throw new Error(errorData.message || "Failed to update student");
  }

  return response.json();
};
