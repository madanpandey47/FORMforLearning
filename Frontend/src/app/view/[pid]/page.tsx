"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getStudent } from "@/lib/api/student-api";
import { FieldValues } from "react-hook-form";
import {
  getGenderDisplay,
  getBloodTypeDisplay,
  getParentTypeDisplay,
  getAcademicLevelDisplay,
  getFacultyTypeDisplay,
} from "@/lib/types/student-types";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const StudentViewPage = () => {
  const { pid } = useParams();
  const [student, setStudent] = useState<FieldValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!pid) return;

    (async () => {
      try {
        const data = await getStudent(pid as string);
        setStudent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [pid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading student...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Student not found</p>
      </div>
    );
  }

  const toTitleCase = (str: string) =>
    str
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^./, (s) => s.toUpperCase());

  const fieldDisplayMap: Record<string, string> = {
    gender: "Gender",
    bloodGroup: "Blood Group",
    relation: "Relation",
    level: "Academic Level",
    faculty: "Faculty",
    citizenship: "Citizenship",
    secondaryInfos: "Secondary Information",
    mobileNumber: "Mobile Number",
    email: "Email",
    occupation: "Occupation",
    annualIncome: "Annual Income",
    institutionName: "Institution Name",
    board: "Board",
    percentageOrGPA: "Percentage/GPA",
    passingYear: "Passing Year",
    permanentAddress: "Permanent Address",
    temporaryAddress: "Temporary Address",
    academicEnrollment: "Academic Enrollment",
  };

  const excludeFields = new Set([
    "pid",
    "profileImagePath",
    "isTemporaryAddressSameAsPermanent",
    "citizenshipImagePath",
    "boardCertificateImagePath",
    "studentIdCardImagePath",
    "studentIdCardPath",
    "firstName",
    "middleName",
    "lastName",
    "primaryEmail",
    "alternatePrimaryEmail",
    "primaryMobile",
    "alternatePrimaryMobile",
    "dateOfBirth",
    "contactInfo",
  ]);

  const hideIdFields = new Set(["parents", "academicHistories"]);

  // For parents, exclude individual name parts since we show full name
  const excludeParentFields = new Set([
    "pid",
    "profileImagePath",
    "primaryEmail",
    "alternatePrimaryEmail",
    "primaryMobile",
    "alternatePrimaryMobile",
    "firstName",
    "middleName",
    "lastName",
  ]);

  const getParentFullName = (parent: FieldValues): string => {
    const parts = [];
    if (parent.firstName) parts.push(parent.firstName);
    if (parent.middleName) parts.push(parent.middleName);
    if (parent.lastName) parts.push(parent.lastName);
    return parts.length > 0 ? parts.join(" ") : "Not provided";
  };

  const formatFieldValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined) return "Not provided";
    if (typeof value === "boolean") return value ? "Yes" : "No";

    switch (key) {
      case "gender":
        return getGenderDisplay(value as number);
      case "bloodGroup":
        return getBloodTypeDisplay(value as number);
      case "relation":
        return getParentTypeDisplay(value as number);
      case "level":
        return getAcademicLevelDisplay(value as number);
      case "faculty":
        return getFacultyTypeDisplay(value as number);
      default:
        return String(value);
    }
  };

  const renderStudentData = (
    data: FieldValues,
    parentKey: string = ""
  ): React.ReactNode => {
    // Determine which exclude set to use
    const activeExcludeFields =
      parentKey === "parents" ? excludeParentFields : excludeFields;

    return Object.entries(data).map(([key, value]) => {
      // Special handling for parent full name
      if (parentKey === "parents" && key === "firstName") {
        return (
          <div
            key="fullName"
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
              Full Name
            </p>
            <p className="text-gray-900 font-medium">
              {getParentFullName(data)}
            </p>
          </div>
        );
      }

      if (activeExcludeFields.has(key)) return null;

      if (
        key === "temporaryAddress" &&
        student.isTemporaryAddressSameAsPermanent
      ) {
        return null;
      }

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        return (
          <section key={key} className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 bg-linear-to-r from-gray-50 to-white px-4 py-3 rounded-lg border-l-4 border-blue-500">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {fieldDisplayMap[key] || toTitleCase(key)}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-4">
              {renderStudentData(value, key)}
            </div>
          </section>
        );
      }

      if (Array.isArray(value)) {
        return (
          <section key={key} className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 bg-linear-to-r from-gray-50 to-white px-4 py-3 rounded-lg border-l-4 border-blue-500">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              {fieldDisplayMap[key] || toTitleCase(key)}
            </h3>

            <div className="space-y-6 pl-4">
              {value.map((item, index) => (
                <div
                  key={index}
                  className="bg-linear-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {hideIdFields.has(key)
                        ? `#${index + 1}`
                        : `Item ${index + 1}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderStudentData(item, key)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      }

      if (hideIdFields.has(parentKey) && key === "pid") return null;

      return (
        <div
          key={key}
          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
        >
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
            {fieldDisplayMap[key] || toTitleCase(key)}
          </p>
          <p className="text-gray-900 font-medium">
            {formatFieldValue(key, value) === "Not provided" ? (
              <span className="italic text-gray-400 font-normal">
                Not provided
              </span>
            ) : (
              formatFieldValue(key, value)
            )}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header with Profile */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {student.profileImagePath && !imageError ? (
                <Image
                  src={`${API_BASE_URL}${student.profileImagePath}`}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-blue-600 text-4xl font-bold">
                    {student.firstName?.charAt(0)}
                    {student.middleName
                      ? student.middleName.charAt(0)
                      : ""}{" "}
                    {student.lastName?.charAt(0)}
                  </span>
                </div>
              )}

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {student.firstName} {student.middleName || ""}{" "}
                  {student.lastName}
                </h1>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
            {/* Personal Information */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Personal Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    Full Name
                  </p>
                  <p className="text-sm text-gray-900 font-semibold">
                    {student.firstName} {student.middleName || ""}{" "}
                    {student.lastName}
                  </p>
                </div>
                {student.dateOfBirth && (
                  <div>
                    <p className="text-xs text-blue-600 font-semibold mb-1">
                      Date of Birth
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(student.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <h3 className="text-sm font-semibold text-green-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-green-600 font-medium mb-1">
                    Primary Email
                  </p>
                  <p className="text-sm font-semibold text-gray-900 break-all">
                    {student.contactInfo?.primaryEmail || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-green-600 font-medium mb-1">
                    Primary Mobile
                  </p>
                  <p className="text-sm text-gray-900 font-semibold">
                    {student.contactInfo?.primaryMobile || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <h3 className="text-sm font-semibold text-purple-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                Academic Info
              </h3>
              <div className="space-y-3">
                {student.academicEnrollment?.programName && (
                  <div>
                    <p className="text-xs text-purple-600 font-medium mb-1">
                      Program
                    </p>
                    <p className="text-sm text-gray-900 font-semibold">
                      {student.academicEnrollment.programName}
                    </p>
                  </div>
                )}
                {student.academicEnrollment?.faculty !== null &&
                  student.academicEnrollment?.faculty !== undefined && (
                    <div>
                      <p className="text-xs text-purple-600 font-semibold mb-1">
                        Faculty
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {getFacultyTypeDisplay(
                          student.academicEnrollment.faculty
                        )}
                      </p>
                    </div>
                  )}
                {student.academicEnrollment?.level !== null &&
                  student.academicEnrollment?.level !== undefined && (
                    <div>
                      <p className="text-xs text-purple-600 font-medium mb-1">
                        Level
                      </p>
                      <p className="text-sm text-gray-900">
                        {getAcademicLevelDisplay(
                          student.academicEnrollment.level
                        )}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-gray-200">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">
              Detailed Information
            </h2>
          </div>
          <div className="space-y-8">{renderStudentData(student)}</div>
        </div>

        {/* Documents */}
        {(student.secondaryInfos?.citizenshipImagePath ||
          student.secondaryInfos?.boardCertificateImagePath ||
          student.secondaryInfos?.studentIdCardPath) && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-gray-200">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900">
                Uploaded Documents
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {student.secondaryInfos?.citizenshipImagePath && (
                <div className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-400">
                  <div className="bg-linear-to-r from-blue-500 to-blue-600 px-4 py-3">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Citizenship Document
                    </p>
                  </div>
                  <div className="relative h-56 bg-gray-50">
                    <Image
                      src={`${API_BASE_URL}${student.secondaryInfos.citizenshipImagePath}`}
                      alt="Citizenship"
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  </div>
                </div>
              )}

              {student.secondaryInfos?.boardCertificateImagePath && (
                <div className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-green-400">
                  <div className="bg-linear-to-r from-green-500 to-green-600 px-4 py-3">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Board Certificate
                    </p>
                  </div>
                  <div className="relative h-56 bg-gray-50">
                    <Image
                      src={`${API_BASE_URL}${student.secondaryInfos.boardCertificateImagePath}`}
                      alt="Board Certificate"
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  </div>
                </div>
              )}

              {student.secondaryInfos?.studentIdCardPath && (
                <div className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-purple-400">
                  <div className="bg-linear-to-r from-purple-500 to-purple-600 px-4 py-3">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Student ID Card
                    </p>
                  </div>
                  <div className="relative h-56 bg-gray-50">
                    <Image
                      src={`${API_BASE_URL}${student.secondaryInfos.studentIdCardPath}`}
                      alt="Student ID Card"
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentViewPage;
