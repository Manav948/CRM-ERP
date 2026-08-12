import React from 'react';
import { Shield, ArrowRight, LogIn, UserPlus } from 'lucide-react';

interface NavbarProps {
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSignIn, onOpenSignUp }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 text-white z-50 flex items-center justify-between px-6 select-none">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-extrabold text-sm shadow-md">
          C
        </div>
        <span className="font-bold text-base tracking-tight text-white">
         CRM <span className="text-zinc-400 font-normal">Project</span>
        </span>
      </div>

     
      <div className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
        <a href="#features" className="hover:text-white transition-colors">
          Core Features
        </a>
        <a href="#workflow" className="hover:text-white transition-colors">
          Sales Workflow
        </a>
        <a href="#roles" className="hover:text-white transition-colors">
          RBAC Security
        </a>
        <a href="#stats" className="hover:text-white transition-colors">
          Live Metrics
        </a>
      </div>

      
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSignIn}
          className="px-3.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
        >
          <LogIn className="w-3.5 h-3.5" />
          Sign In
        </button>

        <button
          onClick={onOpenSignUp}
          className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Sign Up
        </button>
      </div>
    </nav>
  );
};
