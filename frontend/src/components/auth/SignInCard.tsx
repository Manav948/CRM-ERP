import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useLoginMutation } from '../../hooks';
import { Lock, Mail, ArrowRight, Loader2, X, ShieldCheck } from 'lucide-react';

interface SignInCardProps {
  onClose?: () => void;
  onSwitchToSignUp?: () => void;
}

export const SignInCard: React.FC<SignInCardProps> = ({ onClose, onSwitchToSignUp }) => {
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.token && data.user) {
            login(data.token, data.user);
            if (onClose) onClose();
          }
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.message || 'Invalid email or password');
        },
      }
    );
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden relative z-10 font-sans text-zinc-900 select-none">
   
      <div className="px-8 pt-8 pb-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
              N
            </div>
            <span className="font-bold text-base tracking-tight text-zinc-950">
              Nexus<span className="text-zinc-500 font-normal">ERP</span>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-zinc-950 tracking-tight">Sign In</h2>
          <p className="text-xs text-zinc-500 mt-1">Enter your staff credentials to access the portal</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-950 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-zinc-950 text-white text-xs font-medium border border-zinc-800 animate-in fade-in">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block font-semibold text-zinc-700 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="email"
              required
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-semibold text-zinc-700">Password</label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 mt-2"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
            </>
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

     
      {onSwitchToSignUp && (
        <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 text-center text-xs text-zinc-500">
          Need a staff account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="font-bold text-zinc-950 hover:underline"
          >
            Create Staff Account
          </button>
        </div>
      )}
    </div>
  );
};
