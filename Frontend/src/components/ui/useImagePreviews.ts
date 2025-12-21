import { useState } from "react";

export interface ImagePreviewState {
  profileImagePreviewUrl: string | null;
  citizenshipImagePreviewUrl: string | null;
  boardCertificateImagePreviewUrl: string | null;
  studentIdCardImagePreviewUrl: string | null;
  setProfileImagePreviewUrl: (url: string | null) => void;
  setCitizenshipImagePreviewUrl: (url: string | null) => void;
  setBoardCertificateImagePreviewUrl: (url: string | null) => void;
  setStudentIdCardImagePreviewUrl: (url: string | null) => void;
}

export const useImagePreviews = (): ImagePreviewState => {
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState<
    string | null
  >(null);
  const [citizenshipImagePreviewUrl, setCitizenshipImagePreviewUrl] = useState<
    string | null
  >(null);
  const [boardCertificateImagePreviewUrl, setBoardCertificateImagePreviewUrl] =
    useState<string | null>(null);
  const [studentIdCardImagePreviewUrl, setStudentIdCardImagePreviewUrl] =
    useState<string | null>(null);

  return {
    profileImagePreviewUrl,
    citizenshipImagePreviewUrl,
    boardCertificateImagePreviewUrl,
    studentIdCardImagePreviewUrl,
    setProfileImagePreviewUrl,
    setCitizenshipImagePreviewUrl,
    setBoardCertificateImagePreviewUrl,
    setStudentIdCardImagePreviewUrl,
  };
};
