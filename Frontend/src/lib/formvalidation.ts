// lib/formvalidation.ts
import { z } from "zod";

export const formSchema = z.object({
  // PERSONAL (step 1)
  firstname: z.string().min(1, "First name is required"),
  middlename: z.string().optional(), // optional
  lastname: z.string().min(1, "Last name is required"),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((s) => {
      // simple YYYY-MM-DD validation
      return /^\d{4}-\d{2}-\d{2}$/.test(s);
    }, "Date must be in YYYY-MM-DD format"),
  nationality: z.string().optional(),
  citizenshipNumber: z.string().optional(),
  email: z.string().email("Invalid email"),
  alternateEmail: z.string().email("Invalid alternate email").optional(),
  gender: z.enum(["male", "female", "other"]),
  bloodgroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "O+", "O-"]).optional(),
  country: z.string().min(1, "Country is required"),

  // CONTACT (step 2)
  primaryMobile: z
    .string()
    .min(7, "Enter a valid mobile number")
    .max(20)
    .regex(/^[0-9+ -]+$/, "Invalid characters in phone"),
  alternateMobile: z
    .string()
    .min(7, "Enter a valid alternate number")
    .max(20)
    .regex(/^[0-9+ -]+$/, "Invalid characters in phone")
    .optional(),
  emergencyContact: z
    .string()
    .min(7, "Enter emergency contact number")
    .regex(/^[0-9+ -]+$/, "Invalid characters in phone"),
  emergencyRelation: z.string().min(1, "Emergency relation is required"),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  preferredContactMethod: z.enum(["email", "phone", "both"]).optional(),

  // FAMILY (step 3)
  primaryContact: z.enum(["father", "mother", "guardian"]),
  fatherName: z.string().min(1, "Father's name is required"),
  fatherMobile: z
    .string()
    .min(7, "Enter father's mobile")
    .regex(/^[0-9+ -]+$/, "Invalid characters in phone"),
  fatherOccupation: z.string().optional(),
  motherName: z.string().min(1, "Mother's name is required"),
  motherMobile: z
    .string()
    .min(7, "Enter mother's mobile")
    .regex(/^[0-9+ -]+$/, "Invalid characters in phone"),
  motherOccupation: z.string().optional(),
  guardianName: z.string().optional(),
  guardianRelation: z.string().optional(),
  guardianMobile: z
    .string()
    .min(7, "Enter guardian mobile")
    .regex(/^[0-9+ -]+$/, "Invalid characters in phone")
    .optional(),
  annualIncome: z.enum(["<5", "5-10", "10-20", ">20"]),
  familyType: z.enum(["joint", "nuclear"]).optional(),

  // ACADEMICS & DOCUMENTS (step 4)
  schoolName: z.string().min(1, "School name is required"),
  collegeName: z.string().optional(),
  schoolAddress: z.string().min(1, "School address is required"),
  previousGrade: z.enum(["master", "bachelor", "intermediate", "secondary"]),
  percentage: z
    .number()
    .min(0, "Percentage must be >= 0")
    .max(100, "Percentage must be <= 100"),
  passingYear: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
  extraCurricular: z.string().optional(),
  profile: z.any().optional(),
  additionalDocuments: z.any().optional(),
  agree: z
    .boolean()
    .refine((v) => v === true, { message: "You must agree to continue" }),
});
export type FormData = z.infer<typeof formSchema>;
export default formSchema;
