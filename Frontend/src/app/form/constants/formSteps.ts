export interface FormStep {
  name: string;
  fields: string[];
}

export const FORM_STEPS: FormStep[] = [
  {
    name: "Personal Details",
    fields: [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "bloodGroup",
      "citizenship.citizenshipNumber",
    ],
  },
  {
    name: "Contact Info",
    fields: ["contactInfo.primaryMobile", "contactInfo.primaryEmail"],
  },
  {
    name: "Address",
    fields: ["permanentAddress", "temporaryAddress"],
  },
  {
    name: "Family Details",
    fields: ["parents.0.firstName", "parents.0.lastName", "parents.0.relation"],
  },
  {
    name: "Academic History",
    fields: [
      "academicHistories.0.institutionName",
      "academicHistories.0.level",
    ],
  },
  {
    name: "Enrollment",
    fields: ["academicEnrollment.faculty", "academicEnrollment.programName"],
  },
  { name: "Scholarship", fields: [] },
  { name: "Other", fields: [] },
  { name: "Documents & Confirmation", fields: ["agree"] },
];

export const COUNTRY_OPTIONS = [
  { label: "Nepal", value: "Nepal" },
  { label: "India", value: "India" },
  { label: "Other", value: "Other" },
];
