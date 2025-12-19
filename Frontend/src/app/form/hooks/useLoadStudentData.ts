import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { FormData } from "@/lib/validation/formvalidation";
import { getStudent } from "@/lib/api/student-api";
import { getMunicipalities } from "@/lib/api/lookups";

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
  useEffect(() => {
    if (isEditMode && studentId && lookupsLoaded) {
      (async () => {
        try {
          const studentFormData = await getStudent(studentId);
          if (studentFormData) {
            interface AcademicHistoryApiData {
              passedYear?: string;
              [key: string]: unknown;
            }
            if (studentFormData.academicHistories) {
              studentFormData.academicHistories =
                studentFormData.academicHistories.map(
                  (history: AcademicHistoryApiData) => ({
                    ...history,
                    passedYear: history.passedYear
                      ? new Date(history.passedYear).getFullYear()
                      : null,
                  })
                );
            }

            reset(studentFormData as FormData);
            setValue("agree", true);

            if (studentFormData.profileImagePath) {
              setProfileImagePreviewUrl(
                `http://localhost:5000${studentFormData.profileImagePath}`
              );
            }

            // Load secondary info images
            if (studentFormData.secondaryInfos?.citizenshipImagePath) {
              setCitizenshipImagePreviewUrl(
                `http://localhost:5000${studentFormData.secondaryInfos.citizenshipImagePath}`
              );
            }
            if (studentFormData.secondaryInfos?.boardCertificateImagePath) {
              setBoardCertificateImagePreviewUrl(
                `http://localhost:5000${studentFormData.secondaryInfos.boardCertificateImagePath}`
              );
            }
            if (studentFormData.secondaryInfos?.studentIdCardPath) {
              setStudentIdCardImagePreviewUrl(
                `http://localhost:5000${studentFormData.secondaryInfos.studentIdCardPath}`
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
