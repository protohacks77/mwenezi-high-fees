
import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Bell } from 'lucide-react';

const Header: React.FC = () => {
    const { user } = useAuthStore();

    if (!user) return null;

    const getRoleName = (role: string) => {
        return role.charAt(0).toUpperCase() + role.slice(1);
    }

    return (
        <header className="flex items-center justify-between h-20 px-6 bg-background-secondary border-b border-slate-700 w-full">
            <div>
                <h1 className="text-xl font-semibold text-text-primary">Welcome, {user.username}</h1>
                <p className="text-sm text-text-secondary">{getRoleName(user.role)} Portal</p>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative text-text-secondary hover:text-text-primary">
                    <Bell size={24} />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                    </span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center font-bold text-white">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary">{user.username}</p>
                        <p className="text-xs text-text-secondary">{user.id}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
