import { z } from "zod";
import { Gender, BloodType, FacultyType } from "../types/student-types";

const dateStringSchema = z
  .string()
  .refine(
    (s) => s === "" || /^\d{4}-\d{2}-\d{2}$/.test(s),
    "Date must be in YYYY-MM-DD format"
  )
  .optional();

export const GenderEnum = z.nativeEnum(Gender);
export const BloodGroupEnum = z.nativeEnum(BloodType);
export const AddressTypeEnum = z.number().min(0).max(1);
export const ParentTypeEnum = z.number().min(0).max(3);
export const FacultyEnum = z.nativeEnum(FacultyType);
export const AcademicLevelEnum = z.number().min(0).max(3);

export const addressSchema = z.object({
  province: z.string().min(1, "Province is required"),
  municipality: z.string().min(1, "Municipality is required"),
  ward: z.string().min(1, "Ward is required"),
  street: z.string().nullable().optional(),
  country: z.string().min(3, "Country is required"),
  type: AddressTypeEnum,
});

export const parentSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().nullable().optional(),
  lastName: z.string().min(2, "Last name is required"),
  relation: ParentTypeEnum.nullable(),
  occupation: z.string().nullable().optional(),
  annualIncome: z
    .union([z.number().nonnegative(), z.nan()])
    .optional()
    .nullable(),
  mobileNumber: z.string().nullable().optional(),
  email: z
    .union([z.string().email("Invalid email"), z.literal(""), z.literal(null)])
    .optional()
    .nullable(),
});

export const academicHistorySchema = z.object({
  institutionName: z.string().min(4, "Institution name is required"),
  level: z.number().int().nullable(),
  board: z.string().nullable().optional(),
  percentageOrGPA: z.number().min(0).max(100).nullable(),
  passedYear: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .nullable(),
});

const citizenshipSchema = z.object({
  citizenshipNumber: z.string().min(1, "Citizenship Number is required"),
  countryOfIssuance: z.string().min(1, "Country of Issuance is required"),
  dateOfIssuance: dateStringSchema,
  placeOfIssuance: z.string().min(3, "Place of Issuance is required"),
});

const contactInfoSchema = z.object({
  primaryMobile: z.string().min(7, "Enter a valid mobile number"),
  alternateMobile: z.string().nullable().optional(),
  primaryEmail: z.string().email("Invalid email"),
  alternateEmail: z
    .union([
      z.string().email("Invalid alternate email"),
      z.literal(""),
      z.literal(null),
    ])
    .optional()
    .nullable(),
});

const achievementSchema = z.object({
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  dateOfAchievement: z.string().nullable().optional(),
});

const hobbiesSchema = z.object({
  name: z.string().nullable().optional(),
});

const disabilitySchema = z.object({
  disabilityType: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  disabilityPercentage: z
    .union([z.number().min(0).max(100), z.nan()])
    .optional()
    .nullable(),
});

const scholarshipSchema = z.object({
  scholarshipName: z.string().nullable().optional(),
  amount: z.union([z.number().nonnegative(), z.nan()]).optional().nullable(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});

const academicEnrollmentSchema = z.object({
  faculty: FacultyEnum,
  programName: z.string().min(1, "Program name is required"),
  enrollmentDate: dateStringSchema,
  studentIdNumber: z.string().nullable().optional(),
});

export const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: dateStringSchema.refine(
    (val) => val !== undefined,
    "Date of birth is required"
  ),
  gender: GenderEnum.nullable(),
  bloodGroup: BloodGroupEnum.nullable(),
  citizenship: citizenshipSchema,
  contactInfo: contactInfoSchema,
  permanentAddress: addressSchema,
  temporaryAddress: addressSchema,
  parents: z.array(parentSchema).min(1, "At least one parent is required"),
  academicHistories: z
    .array(academicHistorySchema)
    .min(1, "At least one academic history is required"),
  academicEnrollment: academicEnrollmentSchema,
  achievements: z.array(achievementSchema).optional(),
  hobbies: z.array(hobbiesSchema).optional(),
  disability: disabilitySchema.optional(),
  scholarship: scholarshipSchema.optional(),
  profileImage: z.instanceof(File).optional(),
  academicCertificates: z.array(z.instanceof(File)).optional(),
  agree: z
    .boolean()
    .refine((v) => v === true, { message: "You must agree to continue" }),
});

export type FormData = z.infer<typeof formSchema>;
export default formSchema;
