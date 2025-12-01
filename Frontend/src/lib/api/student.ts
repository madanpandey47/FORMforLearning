import { FieldValues } from "react-hook-form";

export async function submitStudent(data: FieldValues) {
  const { permanentAddress, temporaryAddress, ...rest } = data as any;

  const addresses: any[] = [];
  if (permanentAddress) addresses.push(permanentAddress);
  if (temporaryAddress) addresses.push(temporaryAddress);

  const submissionData = {
    ...rest,
    addresses,
  };

  const res = await fetch("http://localhost:5000/api/Student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submissionData),
  });

  if (!res.ok) {
    let err: any = undefined;
    try {
      err = await res.json();
    } catch {}
    throw new Error(err ? JSON.stringify(err) : "Submission failed");
  }
  return res.json();
}
