"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStudent, getImageUrl } from "@/lib/api/student-api";
import { FieldValues } from "react-hook-form";
import { FiX } from "react-icons/fi";

const StudentViewPage = () => {
  const { pid } = useParams();
  const router = useRouter();
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-red-500">Student not found</p>
      </div>
    );
  }

  const fullImageUrl = getImageUrl(student.profileImagePath);

  const toTitleCase = (str: string) =>
    str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  const renderStudentData = (data: FieldValues) => {
    return Object.entries(data).map(([key, value]) => {
      if (
        key === "pid" ||
        key === "profileImagePath" ||
        key === "academicCertificatePaths"
      )
        return null;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        return (
          <section key={key} className="mt-14">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {toTitleCase(key)}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {renderStudentData(value)}
            </div>
          </section>
        );
      }

      if (Array.isArray(value)) {
        return (
          <section key={key} className="mt-14">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {toTitleCase(key)}
            </h2>

            <div className="space-y-10">
              {value.map((item, index) => (
                <div key={index} className="border-t pt-8">
                  <p className="text-sm text-gray-400 mb-6">Item {index + 1}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {renderStudentData(item)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      }

      return (
        <div key={key}>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            {toTitleCase(key)}
          </p>
          <p className="text-gray-900 mt-1">
            {value ? (
              String(value)
            ) : (
              <span className="italic text-gray-400">Not provided</span>
            )}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Close button */}
        <button
          onClick={() => router.push("/")}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-900"
        >
          <FiX size={22} />
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          {fullImageUrl && !imageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fullImageUrl}
              alt={`${student.firstName} ${student.middleName} ${student.lastName}`}
              className="w-36 h-36 rounded-full object-cover border-2 border-gray-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-300">
              <span className="text-gray-500 text-3xl font-semibold">
                {student.firstName?.charAt(0) || ""}
                {student.lastName?.charAt(0) || ""}
              </span>
            </div>
          )}

          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {student.firstName} {student.middleName} {student.lastName}
            </h1>
            <p className="text-gray-500 mt-3">{student.primaryEmail}</p>
          </div>
        </div>

        <hr className="my-14" />

        {/* Content */}
        {renderStudentData(student)}
      </div>
    </div>
  );
};

export default StudentViewPage;
