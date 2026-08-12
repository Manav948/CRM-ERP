import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuthContext();

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Sales':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Warehouse':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Accounts':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-300';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-zinc-900 tracking-tight">
          Operations Portal
        </h2>
        <span className="text-zinc-300">|</span>
        <span className="text-xs text-zinc-500 font-medium">
          Mini ERP + CRM System
        </span>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 pr-4 border-r border-zinc-200">
            <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center font-semibold text-xs border border-zinc-800">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-zinc-900 leading-tight">
                {user.name}
              </div>
              <div className="text-[10px] text-zinc-500">{user.email}</div>
            </div>
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getRoleBadgeColor(
                user.role
              )} flex items-center gap-1`}
            >
              <Shield className="w-2.5 h-2.5" />
              {user.role}
            </span>
          </div>
        )}

        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 text-xs font-medium transition-colors flex items-center gap-1.5"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
