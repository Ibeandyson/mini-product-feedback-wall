'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { VoteType } from '@/types/database';

interface VoteButtonProps {
  feedbackId: string;
  voteType: 'up' | 'down';
  currentUserVote: VoteType | null;
  onAuthRequired: () => void;
  onVoteChange: () => void;
}

export function VoteButton({
  feedbackId,
  voteType,
  currentUserVote,
  onAuthRequired,
  onVoteChange,
}: VoteButtonProps) {
  const [isVoting, setIsVoting] = useState(false);
  const { user, supabase } = useAuth();

  const isActive = currentUserVote === voteType;

  const handleVote = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    
    if (!supabase) return;

    setIsVoting(true);

    try {
      if (currentUserVote === voteType) {
        // Remove vote
        await supabase
          .from('votes')
          .delete()
          .eq('feedback_id', feedbackId)
          .eq('user_id', user.id);
      } else if (currentUserVote) {
        // Change vote
        await supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('feedback_id', feedbackId)
          .eq('user_id', user.id);
      } else {
        // New vote
        await supabase
          .from('votes')
          .insert({
            feedback_id: feedbackId,
            user_id: user.id,
            vote_type: voteType,
          });
      }
      onVoteChange();
    } catch (error) {
      console.error('Vote error:', error);
    }

    setIsVoting(false);
  };

  if (voteType === 'up') {
    return (
      <button
        onClick={handleVote}
        disabled={isVoting}
        className={`group/btn relative w-12 h-10 rounded-xl transition-all duration-200 transform hover:scale-110 active:scale-95 ${
          isActive
            ? 'bg-gradient-to-br from-[#10b981] to-[#059669] text-white shadow-lg shadow-[#10b981]/30'
            : 'bg-white/5 border border-white/10 text-gray-400 hover:text-[#10b981] hover:border-[#10b981]/50 hover:bg-[#10b981]/10'
        } ${isVoting ? 'opacity-50 cursor-wait' : ''}`}
        title="Upvote"
      >
        <svg
          className={`w-5 h-5 mx-auto transition-transform duration-200 ${isActive ? '' : 'group-hover/btn:-translate-y-0.5'}`}
          fill={isActive ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={isActive ? 0 : 2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
        {isActive && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleVote}
      disabled={isVoting}
      className={`group/btn relative w-12 h-10 rounded-xl transition-all duration-200 transform hover:scale-110 active:scale-95 ${
        isActive
          ? 'bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white shadow-lg shadow-[#ef4444]/30'
          : 'bg-white/5 border border-white/10 text-gray-400 hover:text-[#ef4444] hover:border-[#ef4444]/50 hover:bg-[#ef4444]/10'
      } ${isVoting ? 'opacity-50 cursor-wait' : ''}`}
      title="Downvote"
    >
      <svg
        className={`w-5 h-5 mx-auto transition-transform duration-200 ${isActive ? '' : 'group-hover/btn:translate-y-0.5'}`}
        fill={isActive ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={isActive ? 0 : 2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
      {isActive && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
      )}
    </button>
  );
}
