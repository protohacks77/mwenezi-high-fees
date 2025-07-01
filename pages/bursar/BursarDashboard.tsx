
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const BursarDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Bursar Dashboard</h1>
       <Card>
        <CardHeader>
          <CardTitle>Payments Overview</CardTitle>
          <CardDescription>
            This feature is under construction. The bursar dashboard with payment processing tools will be available here.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default BursarDashboard;
