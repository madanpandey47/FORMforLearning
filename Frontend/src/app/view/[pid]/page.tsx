"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image"; // Import Image component
import { getStudent } from "@/lib/api/student-api";
import { FieldValues } from "react-hook-form";
import {
  getGenderDisplay,
  getBloodTypeDisplay,
  getParentTypeDisplay,
  getAcademicLevelDisplay,
} from "@/lib/types/student-types";

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

  // Map field names to display names and handle special enum conversions
  const fieldDisplayMap: Record<string, string> = {
    gender: "Gender",
    bloodGroup: "Blood Group",
    relation: "Relation",
    level: "Academic Level",
    faculty: "Faculty",
    citizenship: "Citizenship",
    secondaryInfos: "Secondary Information",
  };

  // Fields to exclude from display
  const excludeFields = new Set([
    "pid",
    "profileImagePath",
    "isTemporaryAddressSameAsPermanent",
    "citizenshipImagePath",
    "boardCertificateImagePath",
    "studentIdCardPath",
  ]);

  // Fields to hide IDs for
  const hideIdFields = new Set(["parents", "academicHistories"]);

  const formatFieldValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined) return "Not provided";
    if (typeof value === "boolean") return value ? "Yes" : "No";

    // Handle enum conversions
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
        // Assuming faculty values are numbers, and you have a mapping
        return String(value); // Needs actual mapping if not direct
      default:
        return String(value);
    }
  };

  const renderStudentData = (
    data: FieldValues,
    parentKey: string = ""
  ): React.ReactNode => {
    return Object.entries(data).map(([key, value]) => {
      // Skip excluded fields
      if (excludeFields.has(key)) return null;

      // Conditionally skip temporaryAddress
      if (
        key === "temporaryAddress" &&
        student.isTemporaryAddressSameAsPermanent
      ) {
        return null;
      }

      // Handle nested objects (not arrays)
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        return (
          <section key={key} className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {fieldDisplayMap[key] || toTitleCase(key)}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderStudentData(value, key)}
            </div>
          </section>
        );
      }

      // Handle arrays
      if (Array.isArray(value)) {
        return (
          <section key={key} className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {fieldDisplayMap[key] || toTitleCase(key)}
            </h2>

            <div className="space-y-6">
              {value.map((item, index) => (
                <div key={index} className="border-t pt-6">
                  <p className="text-sm text-gray-500 mb-4">
                    {hideIdFields.has(key)
                      ? `Entry ${index + 1}`
                      : `Item ${index + 1}`}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderStudentData(item, key)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      }

      // Skip ID fields for certain sections
      if (hideIdFields.has(parentKey) && key === "pid") {
        return null;
      }

      // Render primitive values
      return (
        <div key={key}>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            {fieldDisplayMap[key] || toTitleCase(key)}
          </p>
          <p className="text-gray-900 mt-1">
            {formatFieldValue(key, value) === "Not provided" ? (
              <span className="italic text-gray-400">Not provided</span>
            ) : (
              formatFieldValue(key, value)
            )}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {student.profileImagePath && !imageError ? (
            <Image
              src={`http://localhost:5000${student.profileImagePath}`}
              alt="Profile"
              width={144} // Set appropriate width
              height={144} // Set appropriate height
              className="w-36 h-36 rounded-full object-cover border-2 border-gray-300"
              onError={() => setImageError(true)}
              unoptimized // Use unoptimized for local or non-optimized images
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-300">
              <span className="text-gray-500 text-2xl font-semibold">
                {student.firstName?.charAt(0) || ""}
                {student.lastName?.charAt(0) || ""}
              </span>
            </div>
          )}

          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {student.firstName} {student.middleName || ""} {student.lastName}
            </h1>
            <p className="text-gray-500 mt-2">{student.primaryEmail}</p>
            <p className="text-gray-500">{student.primaryMobile}</p>
            <p className="text-gray-500 mt-2">
              <span className="font-semibold">Blood Group:</span>{" "}
              {getBloodTypeDisplay(student.bloodGroup)}
            </p>
            {student.gender && (
              <p className="text-gray-500">
                <span className="font-semibold">Gender:</span>{" "}
                {getGenderDisplay(student.gender)}
              </p>
            )}
            {student.citizenship?.citizenshipNumber && (
              <p className="text-gray-500 mt-2">
                <span className="font-semibold">Citizenship #:</span>{" "}
                {student.citizenship.citizenshipNumber}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="my-12" />

        {/* Documents Section */}
        {(student.secondaryInfos?.citizenshipImagePath ||
          student.secondaryInfos?.boardCertificateImagePath ||
          student.secondaryInfos?.studentIdCardPath) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {student.secondaryInfos?.citizenshipImagePath && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Citizenship Document
                  </h3>
                  <Image
                    src={`http://localhost:5000${student.secondaryInfos.citizenshipImagePath}`}
                    alt="Citizenship"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded"
                    unoptimized
                  />
                </div>
              )}
              {student.secondaryInfos?.boardCertificateImagePath && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Board Certificate
                  </h3>
                  <Image
                    src={`http://localhost:5000${student.secondaryInfos.boardCertificateImagePath}`}
                    alt="Board Certificate"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded"
                    unoptimized
                  />
                </div>
              )}
              {student.secondaryInfos?.studentIdCardPath && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Student ID Card
                  </h3>
                  <Image
                    src={`http://localhost:5000${student.secondaryInfos.studentIdCardPath}`}
                    alt="Student ID Card"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded"
                    unoptimized
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        {renderStudentData(student)}
      </div>
    </div>
  );
};

export default StudentViewPage;
