'use client';

import { useState } from 'react';
import { AuthProvider } from './AuthProvider';
import { AuthModal } from './AuthModal';
import { Header } from './Header';
import { FeedbackForm } from './FeedbackForm';
import { FeedbackList } from './FeedbackList';

export function FeedbackWall() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0f0f1a]">
        {/* Background Pattern */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-[#6366f1]/5 via-transparent to-transparent" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-[#8b5cf6]/5 via-transparent to-transparent" />
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <Header onAuthRequired={handleAuthRequired} />

        <main className="relative max-w-4xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Share Your Ideas
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Help us build better products. Submit feedback, vote on features, 
              and see updates in real-time.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,1.5fr] gap-8">
            {/* Feedback Form */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <FeedbackForm onAuthRequired={handleAuthRequired} />
              
              {/* Stats Card */}
              <div className="mt-6 bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-[#3d3d5c]/50 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Powered by
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3ecf8e]/10 flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 109 113" fill="none">
                      <path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-35.15 44.347Z" fill="url(#a)"/>
                      <path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-35.15 44.347Z" fill="url(#b)" fillOpacity=".2"/>
                      <path d="M45.317 2.07c2.86-3.601 8.657-1.628 8.726 2.97l.442 67.251H9.83c-8.19 0-12.759-9.46-7.665-15.875L37.314 12.07l7.993-10Z" fill="#3ecf8e"/>
                      <defs>
                        <linearGradient id="a" x1="53.974" y1="54.974" x2="94.163" y2="71.829" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#249361"/>
                          <stop offset="1" stopColor="#3ecf8e"/>
                        </linearGradient>
                        <linearGradient id="b" x1="36.156" y1="30.578" x2="54.484" y2="65.081" gradientUnits="userSpaceOnUse">
                          <stop/>
                          <stop offset="1" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Supabase</p>
                    <p className="text-xs text-gray-500">Realtime • Auth • RLS</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback List */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  All Feedback
                </h3>
                <span className="text-xs text-gray-500 bg-[#1a1a2e] px-3 py-1 rounded-full border border-[#3d3d5c]">
                  Sorted by votes
                </span>
              </div>
              <FeedbackList onAuthRequired={handleAuthRequired} />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#3d3d5c]/30 mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
            Built with Next.js & Supabase • Real-time updates powered by Postgres
          </div>
        </footer>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    </AuthProvider>
  );
}

