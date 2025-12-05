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

  // 3. Extract and remove the 'image' field (handled separately) and 'agree' field
  const imageFile = (data.image as FileList)?.[0] || null;
  delete (cleanedData as { [k: string]: unknown })["image"];
  delete (cleanedData as { [k: string]: unknown })["agree"];

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
  const formData = new FormData();
  formData.append("studentDto", JSON.stringify(payload));

  if (imageFile) {
    formData.append("imageFile", imageFile);
  }

  const res = await fetch("http://localhost:5000/api/Student", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let err: unknown = undefined;
    try {
      err = await res.json();
      console.error("Backend error response:", err);
    } catch {
      console.error("Failed to parse backend error response");
      const text = await res.text();
      console.error("Raw error response:", text);
    }
    throw new Error(
      err
        ? `Submission failed: ${JSON.stringify(err)}`
        : `Submission failed with status ${res.status}`
    );
  }
  return res.json();
}
