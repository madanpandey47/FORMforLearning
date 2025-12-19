export interface StudentLookupDTO {
  pid: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  blooadGroup: number;
  dateOfBirth: string;
  gender: number;
  primaryEmail: string;
  profileImagePath?: string;
}
