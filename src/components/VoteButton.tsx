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
  const [isHovered, setIsHovered] = useState(false);
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
        await supabase
          .from('votes')
          .delete()
          .eq('feedback_id', feedbackId)
          .eq('user_id', user.id);
      } else if (currentUserVote) {
        await supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('feedback_id', feedbackId)
          .eq('user_id', user.id);
      } else {
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

  const upvoteStyles = {
    active: 'bg-gradient-to-br from-[#10b981] to-[#059669] text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    hover: 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/50',
    default: 'bg-white/5 text-gray-400 border-white/10 hover:bg-[#10b981]/10 hover:text-[#10b981] hover:border-[#10b981]/30',
  };

  const downvoteStyles = {
    active: 'bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    hover: 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/50',
    default: 'bg-white/5 text-gray-400 border-white/10 hover:bg-[#ef4444]/10 hover:text-[#ef4444] hover:border-[#ef4444]/30',
  };

  const styles = voteType === 'up' ? upvoteStyles : downvoteStyles;
  const currentStyle = isActive ? styles.active : isHovered ? styles.hover : styles.default;

  return (
    <button
      onClick={handleVote}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isVoting}
      className={`
        relative w-11 h-11 rounded-xl border backdrop-blur-sm
        transition-all duration-300 ease-out
        transform hover:scale-110 active:scale-95
        disabled:opacity-50 disabled:cursor-wait disabled:hover:scale-100
        ${currentStyle}
      `}
    >
      {/* Ripple effect on active */}
      {isActive && (
        <span className="absolute inset-0 rounded-xl animate-ping opacity-20 bg-current" />
      )}
      
      {/* Icon */}
      <span className={`
        relative flex items-center justify-center
        transition-transform duration-200
        ${!isActive && isHovered ? (voteType === 'up' ? '-translate-y-0.5' : 'translate-y-0.5') : ''}
      `}>
        {voteType === 'up' ? (
          <svg 
            className="w-5 h-5" 
            fill={isActive ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={isActive ? 0 : 2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        ) : (
          <svg 
            className="w-5 h-5" 
            fill={isActive ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={isActive ? 0 : 2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        )}
      </span>

      {/* Glow effect */}
      {isActive && (
        <span className={`
          absolute inset-0 rounded-xl opacity-50 blur-md -z-10
          ${voteType === 'up' ? 'bg-[#10b981]' : 'bg-[#ef4444]'}
        `} />
      )}
    </button>
  );
}
