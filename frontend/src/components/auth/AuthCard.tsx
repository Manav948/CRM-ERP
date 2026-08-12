import React, { useState } from 'react';
import { SignInCard } from './SignInCard';
import { SignUpCard } from './SignUpCard';

export const AuthCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 sm:p-6 select-none font-sans text-zinc-900">
    
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_100%)] pointer-events-none" />

      {activeTab === 'signin' ? (
        <SignInCard onSwitchToSignUp={() => setActiveTab('signup')} />
      ) : (
        <SignUpCard onSwitchToSignIn={() => setActiveTab('signin')} />
      )}
    </div>
  );
};
