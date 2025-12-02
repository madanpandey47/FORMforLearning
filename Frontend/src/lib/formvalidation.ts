import { z } from "zod";

const dateSchema = z
  .string()
  .refine(
    (s) => /^\d{4}-\d{2}-\d{2}$/.test(s),
    "Date must be in YYYY-MM-DD format"
  );

export const addressSchema = z.object({
  province: z.string().min(1, "Province is required"),
  municipality: z.string().min(1, "Municipality is required"),
  ward: z.string().min(1, "Ward is required"),
  street: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  type: z.number().int(),
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
  level: z.number().int(),
  board: z.string().optional(),
  percentageOrGPA: z.number().min(0).max(100),
  passingYear: z.number().int().min(1900).max(new Date().getFullYear()),
});

export const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: dateSchema,
  gender: z.number().int(),
  bloodGroup: z.number().int(),

  citizenship: z.object({
    citizenshipNumber: z.string().min(1, "Citizenship Number is required"),
    countryOfIssuance: z.string().min(1, "Country of Issuance is required"),
    dateOfIssuance: dateSchema,
    placeOfIssuance: z.string().optional(),
  }),

  contactInfo: z.object({
    primaryMobile: z.string().min(7, "Enter a valid mobile number"),
    alternateMobile: z.string().optional(),
    primaryEmail: z.string().email("Invalid email"),
    alternateEmail: z
      .string()
      .email("Invalid alternate email")
      .optional()
      .or(z.literal("")),
  }),

  permanentAddress: addressSchema,
  temporaryAddress: addressSchema.optional(),

  parents: z.array(parentSchema).optional(),

  academicHistories: z.array(academicHistorySchema).optional(),

  academicEnrollment: z.object({
    facultyId: z.number().int().min(1, "Please select a valid faculty"),
    programName: z.string().min(1, "Program Name is required"),
    enrollmentDate: dateSchema.optional(),
    studentIdNumber: z.string().optional(),
  }),

  achievements: z
    .array(
      z.object({
        title: z.string().optional(),
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

  hobbies: z.array(z.object({ name: z.string().optional() })).optional(),

  disability: z
    .object({
      disabilityType: z.string().optional(),
      description: z.string().optional(),
      disabilityPercentage: z.number().min(0).max(100).optional(),
    })
    .optional(),

  bankDetails: z
    .object({
      bankName: z.string().min(1, "Bank Name is required"),
      accountNumber: z.string().min(1, "Account Number is required"),
      accountHolderName: z.string().min(1, "Account Holder Name is required"),
    })
    .optional(),

  scholarship: z
    .object({
      scholarshipName: z.string().optional(),
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
