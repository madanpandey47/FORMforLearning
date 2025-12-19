export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2,
}

export enum BloodType {
  APositive = 0,
  ANegative = 1,
  BPositive = 2,
  BNegative = 3,
  ABPositive = 4,
  ABNegative = 5,
  OPositive = 6,
  ONegative = 7,
}

export enum ParentType {
  Father = 0,
  Mother = 1,
  Sibling = 2,
  Other = 3,
}

export enum AcademicLevel {
  Secondary = 0,
  HighSchool = 1,
  Bachelors = 2,
  Masters = 3,
}

export enum FacultyType {
  Science = 0,
  Commerce = 1,
  Arts = 2,
  Engineering = 3,
  Medicine = 4,
  Law = 5,
  Education = 6,
  Management = 7,
  IT = 8,
  Agriculture = 9,
  Forestry = 10,
  Humanities = 11,
  SocialSciences = 12,
  FineArts = 13,
  Journalism = 14,
  PublicHealth = 15,
  Architecture = 16,
}

// Enum Mappers
export const genderMap: Record<Gender | number | string, string> = {
  [Gender.Male]: "Male",
  [Gender.Female]: "Female",
  [Gender.Other]: "Other",
};

export const bloodTypeMap: Record<BloodType | number | string, string> = {
  [BloodType.APositive]: "A+",
  [BloodType.ANegative]: "A-",
  [BloodType.BPositive]: "B+",
  [BloodType.BNegative]: "B-",
  [BloodType.ABPositive]: "AB+",
  [BloodType.ABNegative]: "AB-",
  [BloodType.OPositive]: "O+",
  [BloodType.ONegative]: "O-",
};

export const parentTypeMap: Record<ParentType | number | string, string> = {
  [ParentType.Father]: "Father",
  [ParentType.Mother]: "Mother",
  [ParentType.Sibling]: "Sibling",
  [ParentType.Other]: "Other",
};

export const academicLevelMap: Record<AcademicLevel | number | string, string> =
  {
    [AcademicLevel.Secondary]: "Secondary",
    [AcademicLevel.HighSchool]: "High School",
    [AcademicLevel.Bachelors]: "Bachelors",
    [AcademicLevel.Masters]: "Masters",
  };

export const facultyTypeMap: Record<FacultyType | number | string, string> = {
  [FacultyType.Science]: "Science",
  [FacultyType.Commerce]: "Commerce",
  [FacultyType.Arts]: "Arts",
  [FacultyType.Engineering]: "Engineering",
  [FacultyType.Medicine]: "Medicine",
  [FacultyType.Law]: "Law",
  [FacultyType.Education]: "Education",
  [FacultyType.Management]: "Management",
  [FacultyType.IT]: "IT",
  [FacultyType.Agriculture]: "Agriculture",
  [FacultyType.Forestry]: "Forestry",
  [FacultyType.Humanities]: "Humanities",
  [FacultyType.SocialSciences]: "Social Sciences",
  [FacultyType.FineArts]: "Fine Arts",
  [FacultyType.Journalism]: "Journalism",
  [FacultyType.PublicHealth]: "Public Health",
  [FacultyType.Architecture]: "Architecture",
};

// Helper functions
export const getEnumDisplay = (
  value: number | string | undefined,
  enumMap: Record<string | number, string>
): string => {
  if (value === null || value === undefined) return "N/A";
  return enumMap[value] || String(value);
};

export const getGenderDisplay = (
  value: Gender | number | string | undefined
): string => getEnumDisplay(value, genderMap);

export const getBloodTypeDisplay = (
  value: BloodType | number | string | undefined
): string => getEnumDisplay(value, bloodTypeMap);

export const getParentTypeDisplay = (
  value: ParentType | number | string | undefined
): string => getEnumDisplay(value, parentTypeMap);

export const getAcademicLevelDisplay = (
  value: AcademicLevel | number | string | undefined
): string => getEnumDisplay(value, academicLevelMap);

export const getFacultyTypeDisplay = (
  value: FacultyType | number | string | undefined
): string => getEnumDisplay(value, facultyTypeMap);

export interface CitizenshipDTO {
  pid?: string;
  citizenshipNumber?: string;
  countryOfIssuance?: string;
  dateOfIssuance?: string;
  placeOfIssuance?: string;
}

export interface SecondaryInfosDTO {
  pid?: string;
  middleName?: string;
  alternateMobile?: string;
  alternateEmail?: string;
  citizenshipImagePath?: string;
  boardCertificateImagePath?: string;
  studentIdCardPath?: string;
}

export interface AddressDTO {
  pid?: string;
  province?: string;
  municipality?: string;
  ward?: string;
  street?: string;
  country?: string;
}

export interface ParentDTO {
  pid?: string;
  id?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  relation?: ParentType;
  occupation?: string;
  annualIncome?: number;
  mobileNumber?: string;
  email?: string;
}

export interface AcademicHistoryDTO {
  pid?: string;
  id?: number;
  institutionName?: string;
  level?: AcademicLevel;
  board?: string;
  percentageOrGPA?: number;
  passedYear?: string;
}

export interface AcademicEnrollmentDTO {
  pid?: string;
  id?: number;
  faculty?: FacultyType;
  facultyId?: number;
  programName?: string;
  enrollmentDate?: string;
  studentIdNumber?: string;
}

export interface AchievementDTO {
  pid?: string;
  title?: string;
  description?: string;
  dateOfAchievement?: string;
}

export interface HobbyDTO {
  pid?: string;
  name?: string;
}

export interface DisabilityDTO {
  pid?: string;
  disabilityType?: string;
  description?: string;
  disabilityPercentage?: number;
}

export interface ScholarshipDTO {
  pid?: string;
  scholarshipName?: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
}

export interface StudentDTO {
  pid: string;

  firstName: string;

  lastName: string;

  dateOfBirth: string;

  gender: Gender;

  primaryMobile: string;

  primaryEmail: string;

  bloodGroup: BloodType;

  profileImagePath?: string;

  citizenship?: CitizenshipDTO;

  secondaryInfos?: SecondaryInfosDTO;

  permanentAddress?: AddressDTO;
  temporaryAddress?: AddressDTO;
  isTemporaryAddressSameAsPermanent?: boolean;

  parents: ParentDTO[];

  academicHistories: AcademicHistoryDTO[];

  academicEnrollment?: AcademicEnrollmentDTO;

  achievements: AchievementDTO[];

  hobbies: HobbyDTO[];

  disability?: DisabilityDTO;

  scholarship?: ScholarshipDTO;
}
