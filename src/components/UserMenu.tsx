'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthProvider';

interface UserMenuProps {
  onAuthRequired: () => void;
}

export function UserMenu({ onAuthRequired }: UserMenuProps) {
  const { user, loading, signOut, isConfigured } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isConfigured) {
    return (
      <div className="px-3 py-1.5 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-full">
        <span className="text-xs font-medium text-[#f59e0b]">Setup Required</span>
      </div>
    );
  }

  if (loading) {
    return <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />;
  }

  if (!user) {
    return (
      <button
        onClick={onAuthRequired}
        className="group relative px-5 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] transition-opacity" />
        <span className="relative">Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-sm font-bold">
          {user.email ? user.email[0].toUpperCase() : 'G'}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm text-white font-medium truncate max-w-[120px]">
            {user.email || 'Guest'}
          </p>
          <p className="text-xs text-gray-500">
            {user.is_anonymous ? 'Anonymous' : 'Signed in'}
          </p>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 py-2 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl animate-fadeIn">
          <div className="px-4 py-2 border-b border-white/10">
            <p className="text-sm text-white font-medium truncate">{user.email || 'Guest User'}</p>
            <p className="text-xs text-gray-500">{user.is_anonymous ? 'Anonymous Session' : 'Authenticated'}</p>
          </div>
          <button
            onClick={() => {
              signOut();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-gray-400 hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

