
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const StudentProfile: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Student Profile: {studentId}</h1>
       <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
          <CardDescription>
            This feature is under construction. A detailed 360-degree view of the student will be available here.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default StudentProfile;
