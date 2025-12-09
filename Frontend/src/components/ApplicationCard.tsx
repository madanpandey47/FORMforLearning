"use client";

import React from 'react';
import { StudentDTO, Gender } from '@/lib/types';

interface ApplicationCardProps {
  student: StudentDTO;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ student }) => {
  const getGenderString = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return 'Male';
      case Gender.Female:
        return 'Female';
      case Gender.Other:
        return 'Other';
      default:
        return 'Unknown';
    }
  };

  const handleEdit = () => {
    console.log('Edit student:', student.id);
    // Future: navigate to edit form
  };

  const handleDelete = () => {
    console.log('Delete student:', student.id);
    // Future: implement delete logic
  };

  const imageUrl = student.profileImagePath;
  const fullImageUrl = imageUrl ? `http://localhost:5000${imageUrl}` : undefined;

  return (
    <div className="w-[190px] h-[254px] rounded-[30px] bg-[#e0e0e0] shadow-[15px_15px_30px_#bebebe,-15px_-15px_30px_#ffffff] flex flex-col justify-center items-center p-4 text-center">
      {fullImageUrl && (
        <img
          src={fullImageUrl}
          alt={`${student.firstName} ${student.lastName}`}
          className="w-20 h-20 rounded-full object-cover mb-2"
        />
      )}
      <h2 className="text-xl font-semibold mb-2">{student.firstName} {student.lastName}</h2>
      <p className="text-sm text-gray-700">Gender: {getGenderString(student.gender)}</p>
      {student.academicEnrollment?.programName && (
        <p className="text-sm text-gray-700">Faculty: {student.academicEnrollment.programName}</p>
      )}
      <div className="mt-4 flex gap-2">
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
