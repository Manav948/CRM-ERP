import React from 'react';
import { LayoutDashboard, Users, Package, FileText, Activity } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer CRM', icon: Users },
    { id: 'products', label: 'Products & Inventory', icon: Package },
    { id: 'challans', label: 'Sales Challans', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white text-zinc-900 flex flex-col justify-between border-r border-zinc-200 select-none font-sans">
      <div>
        
        <div className="h-16 px-6 border-b border-zinc-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            C
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-zinc-950">CRM Project</div>
            <div className="text-[10px] text-zinc-500 font-medium">Enterprise Suite</div>
          </div>
        </div>

      
        <div className="p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            Main Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-zinc-950 text-white font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-950'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </div>

    
      <div className="p-4 border-t border-zinc-100">
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
          <div className="flex items-center gap-2 font-semibold text-zinc-900 mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>System Status</span>
          </div>
          <p className="text-[10px] text-zinc-500">
            Connected , Online
          </p>
        </div>
      </div>
    </aside>
  );
};
