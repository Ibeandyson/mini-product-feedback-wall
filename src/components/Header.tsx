'use client';

import { useAuth } from './AuthProvider';

interface HeaderProps {
  onAuthRequired: () => void;
}

export function Header({ onAuthRequired }: HeaderProps) {
  const { user, loading, signOut, isConfigured } = useAuth();

  return (
    <header className="border-b border-[#3d3d5c]/50 bg-[#0f0f1a]/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Feedback Wall</h1>
            <p className="text-xs text-gray-500">Real-time product feedback</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live indicator */}
          {isConfigured && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              <span className="text-xs font-medium text-[#10b981]">Live</span>
            </div>
          )}

          {!isConfigured ? (
            <div className="px-3 py-1.5 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-full">
              <span className="text-xs font-medium text-[#f59e0b]">Setup Required</span>
            </div>
          ) : loading ? (
            <div className="w-8 h-8 rounded-full bg-[#3d3d5c]/50 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-white font-medium truncate max-w-[150px]">
                  {user.email || 'Guest User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user.is_anonymous ? 'Anonymous' : 'Signed in'}
                </p>
              </div>
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-[#1a1a2e] border border-[#3d3d5c] rounded-xl hover:border-[#ef4444] hover:text-[#ef4444] transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthRequired}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-xl hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-[#6366f1]/25"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
