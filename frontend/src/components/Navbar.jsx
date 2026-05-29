import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 md:left-64 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30">
      {/* Left spacer */}
      <div className="hidden md:flex flex-1 max-w-md">
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div>
            <p className="text-sm font-medium text-slate-900">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-slate-500">{user?.role || 'CRM Manager'}</p>
          </div>
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
            {user?.avatar || 'A'}
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-2"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
