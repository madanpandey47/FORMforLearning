import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { FormData } from "@/lib/validation/formvalidation";
import { getStudent } from "@/lib/api/student-api";
import { getMunicipalities } from "@/lib/api/lookups";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const useLoadStudentData = (
  isEditMode: boolean,
  studentId: string | null,
  lookupsLoaded: boolean,
  reset: (data: FormData) => void,
  setValue: UseFormSetValue<FormData>,
  setProfileImagePreviewUrl: (url: string | null) => void,
  setCitizenshipImagePreviewUrl: (url: string | null) => void,
  setBoardCertificateImagePreviewUrl: (url: string | null) => void,
  setStudentIdCardImagePreviewUrl: (url: string | null) => void,
  setPermanentMunicipalities: (
    options: { label: string; value: string | number }[]
  ) => void,
  setTemporaryMunicipalities: (
    options: { label: string; value: string | number }[]
  ) => void
) => {
  const resolveImageUrl = (path?: string | null) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  useEffect(() => {
    if (isEditMode && studentId && lookupsLoaded) {
      (async () => {
        try {
          const studentFormData = await getStudent(studentId);
          if (studentFormData) {
            interface AcademicHistoryApiData {
              passedYear?: string | number | null;
              [key: string]: unknown;
            }
            if (studentFormData.academicHistories) {
              studentFormData.academicHistories =
                studentFormData.academicHistories.map(
                  (history: AcademicHistoryApiData) => ({
                    ...history,
                    passedYear:
                      typeof history.passedYear === "string"
                        ? new Date(history.passedYear).getFullYear()
                        : history.passedYear ?? null,
                  })
                );
            }

            reset(studentFormData as FormData);
            setValue("agree", true);

            if (studentFormData.profileImagePath) {
              setProfileImagePreviewUrl(
                resolveImageUrl(studentFormData.profileImagePath)
              );
            }

            // Load secondary info images
            if (studentFormData.secondaryInfos?.citizenshipImagePath) {
              setCitizenshipImagePreviewUrl(
                resolveImageUrl(
                  studentFormData.secondaryInfos.citizenshipImagePath
                )
              );
            }
            if (studentFormData.secondaryInfos?.boardCertificateImagePath) {
              setBoardCertificateImagePreviewUrl(
                resolveImageUrl(
                  studentFormData.secondaryInfos.boardCertificateImagePath
                )
              );
            }
            if (studentFormData.secondaryInfos?.studentIdCardPath) {
              setStudentIdCardImagePreviewUrl(
                resolveImageUrl(
                  studentFormData.secondaryInfos.studentIdCardPath
                )
              );
            }

            if (studentFormData.permanentAddress?.province) {
              getMunicipalities(studentFormData.permanentAddress.province).then(
                (municipalities) => {
                  setPermanentMunicipalities(municipalities);
                  setValue(
                    "permanentAddress.municipality",
                    studentFormData.permanentAddress.municipality
                  );
                }
              );
            }
            if (studentFormData.temporaryAddress?.province) {
              getMunicipalities(studentFormData.temporaryAddress.province).then(
                (municipalities) => {
                  setTemporaryMunicipalities(municipalities);
                  setValue(
                    "temporaryAddress.municipality",
                    studentFormData.temporaryAddress.municipality
                  );
                }
              );
            }
            setValue(
              "isTemporaryAddressSameAsPermanent",
              studentFormData.isTemporaryAddressSameAsPermanent ?? false
            );
          }
        } catch {
          alert("Failed to load student data");
        }
      })();
    }
  }, [
    isEditMode,
    studentId,
    reset,
    setValue,
    lookupsLoaded,
    setProfileImagePreviewUrl,
    setCitizenshipImagePreviewUrl,
    setBoardCertificateImagePreviewUrl,
    setStudentIdCardImagePreviewUrl,
    setPermanentMunicipalities,
    setTemporaryMunicipalities,
  ]);
};
