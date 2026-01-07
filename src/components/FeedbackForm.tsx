'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

interface FeedbackFormProps {
  onAuthRequired: () => void;
}

export function FeedbackForm({ onAuthRequired }: FeedbackFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user, supabase, isConfigured } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      onAuthRequired();
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!supabase) {
      setError('Supabase not configured');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const { error: insertError } = await supabase
      .from('feedback')
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        created_by: user.id,
      });

    if (insertError) {
      setError(insertError.message);
    } else {
      setTitle('');
      setDescription('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7]" />
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">New Feedback</h2>
            <p className="text-xs text-gray-500">Share your ideas with us</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-[#f472b6]">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your idea?"
              className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all"
              maxLength={200}
              disabled={!isConfigured}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-gray-600">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details to help others understand..."
              rows={4}
              className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all resize-none"
              maxLength={1000}
              disabled={!isConfigured}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[#f87171] text-sm bg-[#ef4444]/10 border border-[#ef4444]/20 px-4 py-3 rounded-xl">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-[#34d399] text-sm bg-[#10b981]/10 border border-[#10b981]/20 px-4 py-3 rounded-xl">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Feedback submitted! Others can now vote on it.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !isConfigured}
            className="group relative w-full py-3.5 px-4 rounded-xl font-semibold text-white overflow-hidden transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 shadow-lg shadow-[#6366f1]/30" />
            <span className="relative flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Feedback
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
          </button>

          {!user && isConfigured && (
            <p className="text-xs text-gray-500 text-center">
              You&apos;ll need to sign in to submit feedback
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
