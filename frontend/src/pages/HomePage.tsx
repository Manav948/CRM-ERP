import React, { useState } from 'react';
import { Navbar } from '../components/home/Navbar';
import { Footer } from '../components/home/Footer';
import { SignInCard } from '../components/auth/SignInCard';
import { SignUpCard } from '../components/auth/SignUpCard';
import { Users, Package, FileText, Shield, ArrowRight, CheckCircle2, Zap, Lock, Database } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [authModal, setAuthModal] = useState<'signin' | 'signup' | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-white selection:text-zinc-950">
    
      <Navbar
        onOpenSignIn={() => setAuthModal('signin')}
        onOpenSignUp={() => setAuthModal('signup')}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto text-center space-y-8 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Next-Gen Enterprise Suite • React 19 & Prisma ORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Unified Operations Portal for <span className="underline decoration-zinc-700 decoration-wavy">CRM, Stock & Delivery</span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Manage customer relationships, automate sales challans with live inventory stock deduction, track warehouse movements, and enforce strict role-based security.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setAuthModal('signin')}
            className="w-full sm:w-auto px-6 py-3 bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105"
          >
            Launch Portal Demo <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAuthModal('signup')}
            className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold text-xs rounded-xl transition-all"
          >
            Create Staff Account
          </button>
        </div>

        {/* Hero Preview Card */}
        <div className="pt-10 max-w-4xl mx-auto">
          <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-md">
            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800/80 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                  <Database className="w-4 h-4 text-emerald-400" />
                  PostgreSQL Relational DB • Prisma ORM Live Pipeline
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500 font-semibold">Active Customers</div>
                  <div className="text-xl font-bold text-white mt-1">2,840+</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Wholesale & Retail</div>
                </div>
                <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500 font-semibold">Warehouse Catalog</div>
                  <div className="text-xl font-bold text-white mt-1">1,420 SKUs</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">Auto Low Stock Alerts</div>
                </div>
                <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500 font-semibold">Confirmed Sales</div>
                  <div className="text-xl font-bold text-white mt-1">$94,200</div>
                  <div className="text-[10px] text-blue-400 mt-0.5">Challan Dispatches</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Built for Operational Speed & Accuracy</h2>
          <p className="text-xs text-zinc-400">Integrated CRM, inventory control, and dispatch workflows</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Customer CRM Portal</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Track retail, wholesale, and distributor client profiles, GST numbers, follow-up dates, and activity notes history.
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Smart Inventory & Stock</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Real-time stock level monitoring with custom minimum threshold alerts, manual IN/OUT adjustments, and full audit logs.
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Sales Delivery Challans</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate formatted sales delivery challans with customer snapshots, stock validation, and printable delivery receipts.
            </p>
          </div>
        </div>
      </section>

      {/* RBAC Section */}
      <section id="roles" className="py-16 px-6 bg-zinc-900/40 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" /> Security & Roles
            </div>
            <h2 className="text-2xl font-bold text-white">Strict Role-Based Access Control (RBAC)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
              <div className="font-bold text-emerald-400 text-sm">Admin</div>
              <p className="text-zinc-400">Full system access, staff registration, inventory control, and customer management.</p>
            </div>
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
              <div className="font-bold text-blue-400 text-sm">Sales</div>
              <p className="text-zinc-400">Customer CRM management, follow-up notes, and issuing sales delivery challans.</p>
            </div>
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
              <div className="font-bold text-amber-400 text-sm">Warehouse</div>
              <p className="text-zinc-400">Product catalog management, stock adjustments (IN/OUT), and stock audit logs.</p>
            </div>
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
              <div className="font-bold text-purple-400 text-sm">Accounts</div>
              <p className="text-zinc-400">Auditing confirmed sales challans, customer profiles, and stock log reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Auth Modals */}
      {authModal && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          {authModal === 'signin' ? (
            <SignInCard
              onClose={() => setAuthModal(null)}
              onSwitchToSignUp={() => setAuthModal('signup')}
            />
          ) : (
            <SignUpCard
              onClose={() => setAuthModal(null)}
              onSwitchToSignIn={() => setAuthModal('signin')}
            />
          )}
        </div>
      )}
    </div>
  );
};
