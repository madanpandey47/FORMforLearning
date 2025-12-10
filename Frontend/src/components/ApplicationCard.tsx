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
  const [imageError, setImageError] = React.useState(false);
  const imageUrl = student.profileImagePath;
  const fullImageUrl = imageUrl
    ? `http://localhost:5000${imageUrl}`
    : undefined;

  return (
    <div className="w-[400px] h-[200px] rounded-[30px] bg-[#e0e0e0] shadow-[15px_15px_30px_#bebebe,-15px_-15px_30px_#ffffff] flex p-4">
      {/* Left side - Profile Image and Name */}
      <div className="flex flex-col items-center justify-center w-1/3 border-r border-gray-300 pr-4">
        {fullImageUrl && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fullImageUrl}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-20 h-20 rounded-full object-cover mb-2"
            onError={() => {
              setImageError(true);
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
        <h2 className="text-base font-semibold text-center">
          {student.firstName}{" "}
          {student.secondaryInfos?.middleName && (
            <span>{student.secondaryInfos.middleName} </span>
          )}
          {student.lastName}
        </h2>
      </div>

      {/* Right side - Student Details */}
      <div className="flex flex-col justify-between w-2/3 pl-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-700">
            <span className="font-semibold">ID:</span> {student.id}
          </p>
          <p className="text-xs text-gray-700">
            <span className="font-semibold">Gender:</span>{" "}
            {getGenderString(student.gender)}
          </p>
          {student.primaryEmail && (
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Email:</span>{" "}
              {student.primaryEmail}
            </p>
          )}
          {student.primaryMobile && (
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Phone:</span>{" "}
              {student.primaryMobile}
            </p>
          )}
          {student.academicEnrollment?.programName && (
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Faculty:</span>{" "}
              {student.academicEnrollment.programName}
            </p>
          )}
          {student.addresses &&
            student.addresses.length > 0 &&
            student.addresses[0].country && (
              <p className="text-xs text-gray-700">
                <span className="font-semibold">Country:</span>{" "}
                {student.addresses[0].country}
              </p>
            )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs flex-1"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs flex-1"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
