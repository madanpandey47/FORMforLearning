import { deleteStudent } from "@/lib/api/student";
import { useRouter } from "next/navigation";
import React from "react";
import { StudentDTO, Gender } from "@/lib/types";

interface ApplicationCardProps {
  student: StudentDTO;
  onDelete: (id: number) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  student,
  onDelete,
}) => {
  const router = useRouter();

  const getGenderString = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return "Male";
      case Gender.Female:
        return "Female";
      case Gender.Other:
        return "Other";
      default:
        return "Unknown";
    }
  };

  const handleEdit = () => {
    // Navigate to edit form with student ID as query parameter
    router.push(`/form?id=${student.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(student.id);
        onDelete(student.id);
      } catch (error) {
        console.error("Failed to delete student:", error);
      }
    }
  };
  const imageUrl = student.profileImagePath;
  const fullImageUrl = imageUrl
    ? `http://localhost:5000${imageUrl}`
    : undefined;

  return (
    <div className="w-[190px] h-[254px] rounded-[30px] bg-[#e0e0e0] shadow-[15px_15px_30px_#bebebe,-15px_-15px_30px_#ffffff] flex flex-col justify-center items-center p-4 text-center">
      {fullImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fullImageUrl}
          alt={`${student.firstName} ${student.lastName}`}
          className="w-20 h-20 rounded-full object-cover mb-2"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gray-300 mb-2 flex items-center justify-center">
          <span className="text-gray-500 text-2xl">
            {student.firstName.charAt(0)}
            {student.lastName.charAt(0)}
          </span>
        </div>
      )}
      <h2 className="text-lg font-semibold mb-1">
        {student.firstName} {student.lastName}
      </h2>
      <p className="text-xs text-gray-700 mb-1">ID: {student.id}</p>
      <p className="text-xs text-gray-700 mb-1">
        Gender: {getGenderString(student.gender)}
      </p>
      {student.academicEnrollment?.programName && (
        <p className="text-xs text-gray-700 mb-1">
          Faculty: {student.academicEnrollment.programName}
        </p>
      )}
      {student.addresses &&
        student.addresses.length > 0 &&
        student.addresses[0].country && (
          <p className="text-xs text-gray-700 mb-2">
            Country: {student.addresses[0].country}
          </p>
        )}
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleEdit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
