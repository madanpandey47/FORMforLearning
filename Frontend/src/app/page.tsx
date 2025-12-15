"use client";
import React, { useEffect, useState } from "react";
import ApplicationCard from "@/components/ApplicationCard";
import { StudentDTO } from "@/lib/types/student-types";
import { deleteStudent, getAllStudents } from "@/lib/api/student-api";

const Home = () => {
  const [students, setStudents] = useState<StudentDTO[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const fetchedStudents = await getAllStudents();
      setStudents(fetchedStudents);
    };
    fetchStudents();
  }, []);

  const handleDelete = async (pid: string) => {
    try {
      await deleteStudent(pid);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.pid !== pid)
      );
      console.log("Deleted student with id:", pid);
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("Failed to delete student");
    }
  };

  return (
    <div className="p-8 bg-linear-to-br from-slate-100 to-slate-50 min-h-screen">
      <h1 className="text-center mb-8 text-3xl font-bold text-slate-900">
        Application Forms
      </h1>
      <div className="flex flex-wrap gap-8 justify-center">
        {students.map((student: StudentDTO) => (
          <ApplicationCard
            key={student.pid}
            student={student}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
