import React from 'react';
import { StudentDTO } from '@/lib/types';

interface ApplicationCardProps {
  student: StudentDTO;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ student }) => {
  return (
    <div className="w-[190px] h-[254px] rounded-[30px] bg-[#e0e0e0] shadow-[15px_15px_30px_#bebebe,-15px_-15px_30px_#ffffff] flex flex-col justify-center items-center p-4 text-center">
      <h2 className="text-xl font-semibold">{student.firstName} {student.lastName}</h2>
    </div>
  );
};

export default ApplicationCard;
