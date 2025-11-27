import { z } from "zod";

export const addressSchema = z.object({
  province: z.string().min(1, "Province is required"),
  municipality: z.string().min(1, "Municipality is required"),
  ward: z.string().min(1, "Ward is required"),
  street: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  addressTypeId: z.number().int(),
});

export const parentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  relation: z.string().min(1, "Relation is required"),
  occupation: z.string().optional(),
  annualIncome: z.number().optional(),
  mobileNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export const academicHistorySchema = z.object({
  institutionName: z.string().min(1, "Institution name is required"),
  level: z.string().min(1, "Level is required"),
  board: z.string().optional(),
  percentageOrGPA: z.number().min(0).max(100),
  passingYear: z.number().int().min(1900).max(new Date().getFullYear()),
});

export const formSchema = z.object({
  // Student Personal Details
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z
    .string()
    .refine(
      (s) => /^\d{4}-\d{2}-\d{2}$/.test(s),
      "Date must be in YYYY-MM-DD format"
    ),
  gender: z.enum(["male", "female", "other"], {
    message: "please select an option",
  }),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "O+", "O-"]).optional(),

  // Citizenship
  citizenship: z
    .object({
      citizenshipNumber: z.string().min(1, "Citizenship Number is required"),
      countryOfIssuance: z.string().min(1, "Country of Issuance is required"),
      dateOfIssuance: z
        .string()
        .refine(
          (s) => /^\d{4}-\d{2}-\d{2}$/.test(s),
          "Date must be in YYYY-MM-DD format"
        ),
      placeOfIssuance: z.string().optional(),
    })
    .optional(),

  // Contact Info
  contactInfo: z
    .object({
      primaryMobile: z.string().min(7, "Enter a valid mobile number"),
      alternateMobile: z.string().optional(),
      primaryEmail: z.string().email("Invalid email"),
      alternateEmail: z
        .string()
        .email("Invalid alternate email")
        .optional()
        .or(z.literal("")),
    })
    .optional(),

  // Addresses
  addresses: z.array(addressSchema).optional(),

  // Parents
  parents: z.array(parentSchema).optional(),

  // Academic History
  academicHistories: z.array(academicHistorySchema).optional(),

  // Academic Enrollment
  academicEnrollment: z
    .object({
      facultyId: z.number().int("Faculty ID must be an integer"),
      programName: z.string().min(1, "Program Name is required"),
      enrollmentDate: z
        .string()
        .refine(
          (s) => /^\d{4}-\d{2}-\d{2}$/.test(s),
          "Enrollment Date must be in YYYY-MM-DD format"
        ),
      studentIdNumber: z.string().optional(),
    })
    .optional(),

  // Achievements
  achievements: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        dateOfAchievement: z
          .string()
          .refine(
            (s) => s === "" || /^\d{4}-\d{2}-\d{2}$/.test(s),
            "Date must be in YYYY-MM-DD format"
          )
          .optional(),
      })
    )
    .optional(),

  // Hobbies
  hobbies: z
    .array(
      z.object({
        name: z.string().min(1, "Hobby name is required"),
      })
    )
    .optional(),

  // Disability
  disability: z
    .object({
      disabilityType: z.string().min(1, "Disability Type is required"),
      description: z.string().optional(),
      disabilityPercentage: z.number().min(0).max(100).optional(),
    })
    .optional(),

  // Bank Details
  bankDetails: z
    .object({
      bankName: z.string().min(1, "Bank Name is required"),
      accountNumber: z.string().min(1, "Account Number is required"),
      accountHolderName: z.string().min(1, "Account Holder Name is required"),
      branch: z.string().optional(),
      swiftCode: z.string().optional(),
    })
    .optional(),

  // Financial Details
  financialDetails: z
    .object({
      annualIncome: z.number().optional(),
      incomeSource: z.string().optional(),
      isTaxPayer: z.boolean().optional(),
      panNumber: z.string().optional(),
    })
    .optional(),

  // Scholarship
  scholarship: z
    .object({
      scholarshipName: z.string().min(1, "Scholarship Name is required"),
      amount: z.number().optional(),
      startDate: z
        .string()
        .refine(
          (s) => s === "" || /^\d{4}-\d{2}-\d{2}$/.test(s),
          "Date must be in YYYY-MM-DD format"
        )
        .optional(),
      endDate: z
        .string()
        .refine(
          (s) => s === "" || /^\d{4}-\d{2}-\d{2}$/.test(s),
          "Date must be in YYYY-MM-DD format"
        )
        .optional(),
    })
    .optional(),

  agree: z
    .boolean()
    .refine((v) => v === true, { message: "You must agree to continue" }),
});

export type FormData = z.infer<typeof formSchema>;
export default formSchema;
