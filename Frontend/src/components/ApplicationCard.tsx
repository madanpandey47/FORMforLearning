import { useRouter } from "next/navigation";
import React from "react";
import { StudentDTO, getGenderDisplay } from "@/lib/types/student-types";
import { getImageUrl } from "@/lib/api/student-api";

interface ApplicationCardProps {
  student: StudentDTO;
  onDelete: (pid: string) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  student,
  onDelete,
}) => {
  const router = useRouter();
  const [imageError, setImageError] = React.useState(false);

  const handleEdit = () => {
    router.push(`/form?id=${student.pid}`);
  };

  const handleView = () => {
    router.push(`/view/${student.pid}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      onDelete(student.pid);
    }
  };

  const fullImageUrl = getImageUrl(student.profileImagePath);

  return (
    <div className="w-[400px] h-[200px] rounded-[30px] bg-[#ffffff] shadow-[15px_15px_30px_#bebebe,-15px_-15px_30px_#ffffff] flex p-4">
      <div className="flex flex-col items-center justify-center w-1/3 border-r border-gray-300 pr-4">
        {fullImageUrl && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fullImageUrl}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-red-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300 mb-2 flex items-center justify-center border-2 border-red-500">
            <span className="text-gray-500 text-2xl font-semibold">
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
            <span className="font-semibold">Gender:</span>{" "}
            {getGenderDisplay(student.gender)}
          </p>
          {student.primaryEmail && (
            <p className="text-xs text-gray-700 truncate">
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
          <p className="text-xs text-gray-700">
            <span className="font-semibold">Program:</span>{" "}
            {student.academicEnrollment?.programName || "N/A"}
          </p>
          <p className="text-xs text-gray-700">
            <span className="font-semibold">Country:</span>{" "}
            {student.addresses.find((a) => a.type === 0)?.country?.trim() ||
              "N/A"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleView}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs flex-1"
          >
            View
          </button>
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
