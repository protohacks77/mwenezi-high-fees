
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';
import { LayoutDashboard, Users, Settings } from 'lucide-react';

const navLinksConfig = {
    [UserRole.ADMIN]: [
        { icon: LayoutDashboard, text: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, text: 'Students', path: '/admin/students' },
        { icon: Settings, text: 'Settings', path: '/settings' },
    ],
    [UserRole.BURSAR]: [
        { icon: LayoutDashboard, text: 'Dashboard', path: '/bursar/dashboard' },
        { icon: Settings, text: 'Settings', path: '/settings' },
    ],
    [UserRole.STUDENT]: [
        { icon: LayoutDashboard, text: 'Dashboard', path: '/student/dashboard' },
        { icon: Settings, text: 'Settings', path: '/settings' },
    ],
};

const BottomNav: React.FC = () => {
    const { user } = useAuthStore();
    
    if (!user) return null;

    const navLinks = navLinksConfig[user.role] || [];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background-secondary border-t border-slate-700">
            <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `inline-flex flex-col items-center justify-center px-5 hover:bg-slate-700 group ${isActive ? 'text-accent-primary' : 'text-text-secondary'}`}
                    >
                        <link.icon className="w-6 h-6 mb-1" />
                        <span className="text-xs">{link.text}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default BottomNav;
