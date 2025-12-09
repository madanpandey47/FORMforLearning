import { FieldValues } from "react-hook-form";

interface Address {
  province: string;
  municipality: string;
  ward: string;
  street?: string;
  country: string;
  type: number;
}

export async function submitStudent(data: FieldValues) {
  const formData = new FormData();

  // 1. Deep copy to avoid mutating the original form state
  const cleanedData = JSON.parse(JSON.stringify(data)) as Record<
    string,
    unknown
  >;

  // 2. Clean optional date fields: convert "" to null
  const achievements = cleanedData["achievements"] as
    | Array<{ dateOfAchievement?: string | null }>
    | undefined;
  if (achievements) {
    achievements.forEach((ach) => {
      if (ach && ach.dateOfAchievement === "") {
        ach.dateOfAchievement = null;
      }
    });
  }

  const scholarship = cleanedData["scholarship"] as
    | { startDate?: string | null; endDate?: string | null }
    | undefined;
  if (scholarship) {
    if (scholarship.startDate === "") scholarship.startDate = null;
    if (scholarship.endDate === "") scholarship.endDate = null;
  }

  const academicEnrollment = cleanedData["academicEnrollment"] as
    | { facultyId?: number; programName?: string }
    | undefined;
  if (
    !academicEnrollment ||
    !academicEnrollment.facultyId ||
    academicEnrollment.facultyId === 0
  ) {
    delete (cleanedData as { [k: string]: unknown })["academicEnrollment"];
  }

  // 3. Extract and remove 'agree' field
  delete (cleanedData as { [k: string]: unknown })["agree"];
  // Remove profileImage and academicCertificates from cleanedData as they will be sent separately
  delete (cleanedData as { [k: string]: unknown })["profileImage"];
  delete (cleanedData as { [k: string]: unknown })["academicCertificates"];

  // 4. Flatten contactInfo to root level (backend expects PrimaryMobile, PrimaryEmail at root)
  const contactInfo = cleanedData["contactInfo"] as
    | {
        primaryMobile?: string;
        alternateMobile?: string;
        primaryEmail?: string;
        alternateEmail?: string;
      }
    | undefined;

  if (contactInfo) {
    cleanedData["primaryMobile"] = contactInfo.primaryMobile;
    cleanedData["primaryEmail"] = contactInfo.primaryEmail;
    delete (cleanedData as { [k: string]: unknown })["contactInfo"];
  }

  // 5. Restructure addresses into a single collection
  const submissionData: Record<string, unknown> = { ...cleanedData };
  const addresses: Address[] = [];

  const permanentAddress = submissionData["permanentAddress"] as
    | Address
    | undefined;
  if (permanentAddress) addresses.push(permanentAddress);

  const temporaryAddress = submissionData["temporaryAddress"] as
    | Address
    | undefined;
  if (temporaryAddress) addresses.push(temporaryAddress);

  submissionData["addresses"] = addresses;
  delete (submissionData as { [k: string]: unknown })["permanentAddress"];
  delete (submissionData as { [k: string]: unknown })["temporaryAddress"];

  const payload = submissionData;

  console.log("Final payload being sent:", JSON.stringify(payload, null, 2));

  // 5. Create FormData to handle both JSON and file upload
  formData.append("studentDto", JSON.stringify(payload));

  // Append profile image
  const profileImageFile = data.profileImage as File | undefined;
  if (profileImageFile) {
    console.log("Appending profile image to FormData:", profileImageFile.name);
    formData.append("profileImage", profileImageFile);
  }

  // Append academic certificates
  const academicCertificateFiles = data.academicCertificates as
    | File[]
    | undefined;
  if (academicCertificateFiles && academicCertificateFiles.length > 0) {
    console.log(
      "Appending academic certificates to FormData:",
      academicCertificateFiles.map((f) => f.name)
    );
    academicCertificateFiles.forEach((file) => {
      formData.append("academicCertificates", file);
    });
  }

  const res = await fetch("http://localhost:5000/api/Student", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let errorMessage = `Submission failed with status ${res.status}`;
    try {
      const text = await res.text();
      console.error("Raw error response:", text);

      // Try to parse as JSON
      if (text) {
        try {
          const err = JSON.parse(text);
          console.error("Backend error response:", err);
          errorMessage = `Submission failed: ${JSON.stringify(err)}`;
        } catch {
          console.error("Response is not valid JSON");
          errorMessage = `Submission failed: ${text}`;
        }
      }
    } catch (readError) {
      console.error("Failed to read error response:", readError);
    }
    throw new Error(errorMessage);
  }
  return res.json();
}
