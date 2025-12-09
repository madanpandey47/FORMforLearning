import React from "react";
import ApplicationCard from "@/components/ApplicationCard";
import { StudentDTO } from "@/lib/types";

async function getStudents(): Promise<StudentDTO[]> {
  try {
    const res = await fetch("http://localhost:5000/api/Student");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const students: StudentDTO[] = await res.json();
    return students;
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return [];
  }
}

const DashboardPage = async () => {
  const students: StudentDTO[] = await getStudents();

  return (
    <div className="p-8">
      <h1 className="text-center mb-8 text-3xl font-bold">Application Forms</h1>
      <div className="flex flex-wrap gap-8 justify-center">
        {students.map((student: StudentDTO) => (
          <ApplicationCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
