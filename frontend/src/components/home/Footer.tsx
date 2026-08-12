import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 py-12 px-6 text-xs select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold text-xs">
            c
          </div>
          <span className="font-bold text-sm text-white">CRM Project Suite</span>
        </div>

        <div className="flex items-center gap-6 text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#workflow" className="hover:text-white transition-colors">Documentation</a>
          <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
          <a href="#terms" className="hover:text-white transition-colors">Terms</a>
        </div>

        <div className="text-zinc-500 text-[11px]">
          © {new Date().getFullYear()} CRM Project Operations. Powered by Prisma & React 19.
        </div>
      </div>
    </footer>
  );
};
