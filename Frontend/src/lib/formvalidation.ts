import { z } from "zod";

const dateStringSchema = z
  .string()
  .refine(
    (s) => /^\d{4}-\d{2}-\d{2}$/.test(s),
    "Date must be in YYYY-MM-DD format"
  )
  .optional();

export const GenderEnum = z.union([z.literal(0), z.literal(1), z.literal(2)]);

export const BloodGroupEnum = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
]);

export const ParentTypeEnum = z.union([
  z.literal(0), // Father
  z.literal(1), // Mother
  z.literal(2), // Sibling
  z.literal(3), // Other
]);

export const FacultyEnum = z.number().int().min(1);

export const addressSchema = z.object({
  province: z.string().min(1, "Province is required"),
  municipality: z.string().min(1, "Municipality is required"),
  ward: z.string().min(1, "Ward is required"),
  street: z.string().optional(),
  country: z.string().min(3, "Country is required"),
  type: z.union([z.literal(0), z.literal(1), z.literal(2)]),
});

export const parentSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name is required"),
  relation: ParentTypeEnum,
  occupation: z.string().optional(),
  annualIncome: z.number().optional(),
  mobileNumber: z.string().optional(),
  email: z.union([z.string().email("Invalid email"), z.literal("")]).optional(),
});

export const academicHistorySchema = z.object({
  institutionName: z.string().min(4, "Institution name is required"),
  level: z.number().int(),
  board: z.string().optional(),
  percentageOrGPA: z.number().min(0).max(100),
  passingYear: z.number().int().min(1900).max(new Date().getFullYear()),
});

const citizenshipSchema = z.object({
  citizenshipNumber: z.string().min(1, "Citizenship Number is required"),
  countryOfIssuance: z.string().min(1, "Country of Issuance is required"),
  dateOfIssuance: dateStringSchema,
  placeOfIssuance: z.string().min(3, "Place of Issuance is required"),
});

const contactInfoSchema = z.object({
  primaryMobile: z.string().min(7, "Enter a valid mobile number"),
  alternateMobile: z.string().optional(),
  primaryEmail: z.string().email("Invalid email"),
  alternateEmail: z
    .union([z.string().email("Invalid alternate email"), z.literal("")])
    .optional(),
});

const achievementSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  dateOfAchievement: dateStringSchema.optional(),
});

const hobbiesSchema = z.object({
  name: z.string().optional(),
});

const disabilitySchema = z.object({
  disabilityType: z.string().optional(),
  description: z.string().optional(),
  disabilityPercentage: z.number().min(0).max(100).optional(),
});

const scholarshipSchema = z.object({
  scholarshipName: z.string().optional(),
  amount: z.number().optional(),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
});

const academicEnrollmentSchema = z.object({
  facultyId: z.number().int().min(1, "Faculty is required"),
  programName: z.string().min(1, "Program name is required"),
  enrollmentDate: dateStringSchema,
  studentIdNumber: z.string().optional(),
});

export const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: dateStringSchema.refine(
    (val) => val !== undefined,
    "Date of birth is required"
  ),
  gender: GenderEnum,
  bloodGroup: BloodGroupEnum,
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
  profileImage: z.instanceof(File).optional(), // Made optional for edit mode
  academicCertificates: z.array(z.instanceof(File)).optional(),
  agree: z
    .boolean()
    .refine((v) => v === true, { message: "You must agree to continue" }),
});

export type FormData = z.infer<typeof formSchema>;
export default formSchema;
