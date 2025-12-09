
// Frontend/src/lib/types.ts

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

// Minimal DTOs to support StudentDTO. You might need to expand these based on actual usage.
export interface CitizenshipDTO {
  id?: number;
  country?: string;
  // ... other properties from Backend/DTOs/CitizenshipDTO.cs
}

export interface SecondaryInfosDTO {
  id?: number;
  lastSchoolAttended?: string;
  // ... other properties from Backend/DTOs/SecondaryInfosDTO.cs
}

export interface AddressDTO {
  id?: number;
  street?: string;
  city?: string;
  // ... other properties from Backend/DTOs/AddressDTO.cs
}

export interface ParentDTO {
  id?: number;
  firstName?: string;
  lastName?: string;
  // ... other properties from Backend/DTOs/ParentDTO.cs
}

export interface AcademicHistoryDTO {
  id?: number;
  institutionName?: string;
  // ... other properties from Backend/DTOs/AcademicHistoryDTO.cs
}

export interface AcademicEnrollmentDTO {
  id?: number;
  programName?: string;
  // ... other properties from Backend/DTOs/AcademicEnrollmentDTO.cs
}

export interface AchievementDTO {
  id?: number;
  name?: string;
  // ... other properties from Backend/DTOs/AchievementDTO.cs
}

export interface HobbyDTO {
  id?: number;
  name?: string;
  // ... other properties from Backend/DTOs/HobbyDTO.cs
}

export interface DisabilityDTO {
  id?: number;
  name?: string;
  // ... other properties from Backend/DTOs/DisabilityDTO.cs
}

export interface ScholarshipDTO {
  id?: number;
  name?: string;
  // ... other properties from Backend/DTOs/ScholarshipDTO.cs
}

export interface StudentDTO {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // Assuming DateTime maps to string in TS
  gender: Gender;
  primaryMobile: string;
  primaryEmail: string;
  bloodGroup: BloodType;

  // Relationships (optional, based on whether they are always present or needed for the current view)
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
