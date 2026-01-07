'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthProvider } from '@/components/AuthProvider';
import { AuthModal } from '@/components/AuthModal';
import { FeedbackForm } from '@/components/FeedbackForm';
import { FeedbackList } from '@/components/FeedbackList';
import { UserMenu } from '@/components/UserMenu';
import { VoteChart } from '@/components/VoteChart';

export default function FeedbackPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'vote' | 'chart' | 'submit'>('vote');

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#030014]">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#4f46e5]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#7c3aed]/15 rounded-full blur-[100px]" />
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030014]/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#6366f1]/20 group-hover:shadow-[#6366f1]/40 transition-shadow">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-white font-bold text-lg tracking-tight hidden sm:block">FeedbackWall</span>
              </Link>
              
              {/* Live Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                </span>
                <span className="text-xs font-medium text-[#10b981]">Live</span>
              </div>
            </div>

            <UserMenu onAuthRequired={handleAuthRequired} />
          </div>
        </header>

        {/* Main Content */}
        <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              Product Feedback
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto">
              Vote on ideas you love or submit your own. All updates happen in real-time.
            </p>
          </div>

          {/* Chart Section - Desktop */}
          <div className="hidden lg:block mb-8">
            <VoteChart />
          </div>

          {/* Mobile Tab Switcher */}
          <div className="lg:hidden mb-6">
            <div className="flex bg-white/5 rounded-2xl p-1.5 border border-white/10">
              <button
                onClick={() => setActiveTab('vote')}
                className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'vote'
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Vote
              </button>
              <button
                onClick={() => setActiveTab('chart')}
                className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'chart'
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Chart
              </button>
              <button
                onClick={() => setActiveTab('submit')}
                className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'submit'
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Submit
              </button>
            </div>
          </div>

          {/* Mobile Chart */}
          <div className={`lg:hidden mb-6 ${activeTab === 'chart' ? 'block' : 'hidden'}`}>
            <VoteChart />
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-[1fr,380px] gap-8">
            {/* Feedback List */}
            <div className={`${activeTab === 'vote' ? 'block' : 'hidden lg:block'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-white">All Feedback</h2>
                </div>
                <span className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  Sorted by votes
                </span>
              </div>
              <FeedbackList onAuthRequired={handleAuthRequired} />
            </div>

            {/* Sidebar */}
            <div className={`${activeTab === 'submit' ? 'block' : 'hidden lg:block'} lg:sticky lg:top-24 lg:self-start space-y-6`}>
              <FeedbackForm onAuthRequired={handleAuthRequired} />
              
              {/* Info Card */}
              <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  How it works
                </h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#6366f1]/20 text-[#6366f1] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                    <span>Submit your idea or suggestion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                    <span>Vote on ideas you want to see built</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#a855f7]/20 text-[#a855f7] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                    <span>Watch updates happen in real-time</span>
                  </li>
                </ul>
              </div>

              {/* Powered by Supabase */}
              <div className="bg-gradient-to-br from-[#3ecf8e]/10 to-[#3ecf8e]/5 border border-[#3ecf8e]/20 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8" viewBox="0 0 109 113" fill="none">
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
                  <div>
                    <p className="text-white font-semibold text-sm">Powered by Supabase</p>
                    <p className="text-xs text-gray-500">Realtime • Auth • RLS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    </AuthProvider>
  );
}
