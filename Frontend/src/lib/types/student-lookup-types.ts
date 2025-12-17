import { Gender } from "./student-types";

export interface StudentLookupDTO {
  pid: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  primaryMobile: string;
  primaryEmail: string;
  profileImagePath?: string;
  programName?: string;
  country?: string;
}
