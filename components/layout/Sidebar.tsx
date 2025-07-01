import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';
import { LayoutDashboard, Users, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const adminNavLinks = [
  { icon: LayoutDashboard, text: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, text: 'Manage Students', path: '/admin/students' },
  // { icon: FileClock, text: 'Financial Activity', path: '/admin/activity' },
  // { icon: Wrench, text: 'Fee Config', path: '/admin/config' },
];

const bursarNavLinks = [
  { icon: LayoutDashboard, text: 'Dashboard', path: '/bursar/dashboard' },
  // { icon: HandCoins, text: 'Reconciliation', path: '/bursar/reconciliation' },
];

const studentNavLinks = [
  { icon: LayoutDashboard, text: 'Dashboard', path: '/student/dashboard' },
  // { icon: History, text: 'Payment History', path: '/student/history' },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    switch (user?.role) {
      case UserRole.ADMIN: return adminNavLinks;
      case UserRole.BURSAR: return bursarNavLinks;
      case UserRole.STUDENT: return studentNavLinks;
      default: return [];
    }
  };
  
  const navLinks = getNavLinks();

  return (
    <div className={`relative flex flex-col bg-background-secondary border-r border-slate-700 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between h-20 border-b border-slate-700 px-4">
          <img src="/mwenezihighlogo.png" alt="Mwenezi High Logo" className={`transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'}`} />
          {!isCollapsed && <h1 className="text-xl font-bold text-text-primary ml-2">Mwenezi High</h1>}
      </div>

      <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-4 top-24 z-10 bg-accent-secondary text-background-primary rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-accent-primary">
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {navLinks.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `flex items-center py-2.5 px-4 rounded-lg transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''} ${isActive ? 'bg-accent-primary text-white' : 'text-text-secondary hover:bg-slate-700 hover:text-text-primary'}`}
            title={link.text}
          >
            <link.icon className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} />
            {!isCollapsed && <span className="ml-4 font-medium">{link.text}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 py-4 border-t border-slate-700 space-y-2">
         <NavLink
            to="/settings"
            className={({ isActive }) => `flex items-center py-2.5 px-4 rounded-lg transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''} ${isActive ? 'bg-accent-primary text-white' : 'text-text-secondary hover:bg-slate-700 hover:text-text-primary'}`}
            title="Settings"
          >
            <Settings className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} />
            {!isCollapsed && <span className="ml-4 font-medium">Settings</span>}
          </NavLink>
         <button
            onClick={handleLogout}
            className={`w-full flex items-center py-2.5 px-4 rounded-lg text-text-secondary hover:bg-slate-700 hover:text-text-primary transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''}`}
            title="Logout"
          >
            <LogOut className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} />
            {!isCollapsed && <span className="ml-4 font-medium">Logout</span>}
          </button>
      </div>
    </div>
  );
};

export default Sidebar;