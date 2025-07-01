
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-background-primary text-text-primary">
      {/* Sidebar for medium and larger screens */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header for medium and larger screens */}
        <div className="hidden md:flex">
          <Header />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-primary p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
        
        {/* Bottom Navigation for small screens */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;