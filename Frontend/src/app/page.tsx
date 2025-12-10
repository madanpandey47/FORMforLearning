"use client";
import React, { useEffect, useState } from "react";
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

const Home = () => {
  const [students, setStudents] = useState<StudentDTO[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const fetchedStudents = await getStudents();
      setStudents(fetchedStudents);
    };
    fetchStudents();
  }, []);

  const handleDelete = (id: number) => {
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== id)
    );
    console.log("Deleted student with id:", id);
  };

  return (
    <div className="p-8">
      <h1 className="text-center mb-8 text-3xl font-bold">Application Forms</h1>
      <div className="flex flex-wrap gap-8 justify-center">
        {students.map((student: StudentDTO) => (
          <ApplicationCard
            key={student.id}
            student={student}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;