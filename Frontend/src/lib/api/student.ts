import { FieldValues } from "react-hook-form";

interface Address {
  province: string;
  municipality: string;
  ward: string;
  street?: string;
  country: string;
  type: number;
}

interface SubmissionData extends Record<string, unknown> {
  addresses: Address[];
}

export async function submitStudent(data: FieldValues) {
  const { permanentAddress, temporaryAddress, ...rest } = data as {
    permanentAddress?: Address;
    temporaryAddress?: Address;
    [key: string]: unknown;
  };

  const addresses: Address[] = [];
  if (permanentAddress) addresses.push(permanentAddress);
  if (temporaryAddress) addresses.push(temporaryAddress);

  const submissionData: SubmissionData = {
    ...rest,
    addresses,
  };
  debugger;
  const res = await fetch("http://localhost:5000/api/Student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submissionData),
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
