'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { signInAnonymously, signInWithMagicLink } = useAuth();

  if (!isOpen) return null;

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const { error } = await signInWithMagicLink(email);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Check your email for the magic link!');
      setEmail('');
    }
    setIsSubmitting(false);
  };

  const handleAnonymous = async () => {
    setIsSubmitting(true);
    await signInAnonymously();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a2e] border border-[#3d3d5c] rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-400 mb-6">Sign in to submit feedback and vote on ideas.</p>

        {/* Magic Link Form */}
        <form onSubmit={handleMagicLink} className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-[#0f0f1a] border border-[#3d3d5c] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        {message && (
          <p className={`text-sm mb-4 ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#3d3d5c]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#1a1a2e] text-gray-400">or continue as</span>
          </div>
        </div>

        {/* Anonymous Sign In */}
        <button
          onClick={handleAnonymous}
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[#0f0f1a] border border-[#3d3d5c] text-gray-300 font-semibold rounded-xl hover:bg-[#252540] hover:border-[#6366f1] disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Guest (Anonymous)
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Anonymous users can submit and vote, but progress may be lost.
        </p>
      </div>
    </div>
  );
}

