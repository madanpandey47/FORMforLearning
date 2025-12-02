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

  // 3. Remove the 'agree' field which is not part of the backend DTO
  delete (cleanedData as { [k: string]: unknown })["agree"];

  // 4. Restructure addresses into a single collection
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

  const res = await fetch("http://localhost:5000/api/Student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let err: unknown = undefined;
    try {
      err = await res.json();
    } catch {
      // ignore parse error
    }
    throw new Error(err ? JSON.stringify(err) : "Submission failed");
  }
  return res.json();
}
