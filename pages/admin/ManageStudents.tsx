
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const ManageStudents: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Manage Students</h1>
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            This feature is under construction. Student management functionalities will be available here.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ManageStudents;
