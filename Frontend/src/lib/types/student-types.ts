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

export enum AddressType {
  Permanent = 0,
  Temporary = 1,
  Correspondence = 2,
}

export enum ParentType {
  Father = 0,
  Mother = 1,
  Guardian = 2,
}

export enum AcademicLevel {
  SEE = 0,
  PlusTwo = 1,
  Bachelors = 2,
  Masters = 3,
  PHD = 4,
}

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
  academicCertificatePaths?: string;
}

export interface AddressDTO {
  pid?: string;
  province?: string;
  municipality?: string;
  ward?: string;
  street?: string;
  country?: string;
  type?: AddressType;
}

export interface ParentDTO {
  pid?: string;
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
  institutionName?: string;
  level?: AcademicLevel;
  board?: string;
  percentageOrGPA?: number;
  passedYear?: string;
}

export interface AcademicEnrollmentDTO {
  pid?: string;
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

export interface StudentSummaryDTO {
  pid: string;

  firstName: string;

  lastName: string;

  middleName?: string;

  profileImagePath?: string;

  gender: Gender;

  primaryEmail: string;

  primaryMobile: string;

  programName?: string;

  country?: string;
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

  addresses: AddressDTO[];

  parents: ParentDTO[];

  academicHistories: AcademicHistoryDTO[];

  academicEnrollment?: AcademicEnrollmentDTO;

  achievements: AchievementDTO[];

  hobbies: HobbyDTO[];

  disability?: DisabilityDTO;

  scholarship?: ScholarshipDTO;
}
