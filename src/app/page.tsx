'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#4f46e5]/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-[#7c3aed]/25 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6366f1]/10 rounded-full blur-[150px]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Floating particles */}
        {mounted && [...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-6">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">FeedbackWall</span>
            </div>
            <Link 
              href="/feedback"
              className="px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white border border-white/10 hover:border-white/30 rounded-full transition-all duration-300 hover:bg-white/5"
            >
              View Feedback
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              <span className="text-sm text-gray-300">Real-time updates powered by Supabase</span>
            </div>

            {/* Title */}
            <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Your Voice
              <span className="block bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] text-transparent bg-clip-text">
                Shapes Our Product
              </span>
            </h1>

            {/* Description */}
            <p className={`text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Share your ideas, vote on features, and watch your feedback come to life. 
              Every voice matters in building something extraordinary.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link
                href="/feedback"
                className="group relative px-8 py-4 text-lg font-semibold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 shadow-lg shadow-[#6366f1]/40" />
                <span className="relative flex items-center gap-2">
                  Submit Feedback
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <Link
                href="/feedback"
                className="px-8 py-4 text-lg font-medium text-gray-300 hover:text-white rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
              >
                Browse Ideas
              </Link>
            </div>

            {/* Stats */}
            <div className={`flex items-center justify-center gap-8 sm:gap-16 mt-16 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">∞</div>
                <div className="text-sm text-gray-500">Ideas Welcome</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">⚡</div>
                <div className="text-sm text-gray-500">Real-time</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">🔒</div>
                <div className="text-sm text-gray-500">Secure Voting</div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>Built with Next.js & Supabase</p>
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <svg className="w-5 h-5" viewBox="0 0 109 113" fill="none">
                <path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-35.15 44.347Z" fill="#3ecf8e"/>
                <path d="M45.317 2.07c2.86-3.601 8.657-1.628 8.726 2.97l.442 67.251H9.83c-8.19 0-12.759-9.46-7.665-15.875L37.314 12.07l7.993-10Z" fill="#3ecf8e"/>
              </svg>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
