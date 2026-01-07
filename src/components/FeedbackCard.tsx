'use client';

import { FeedbackWithVotes } from '@/types/database';
import { VoteButton } from './VoteButton';

interface FeedbackCardProps {
  feedback: FeedbackWithVotes;
  onAuthRequired: () => void;
  onVoteChange: () => void;
}

export function FeedbackCard({ feedback, onAuthRequired, onVoteChange }: FeedbackCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const voteColor = feedback.vote_count > 0 
    ? 'from-[#10b981] to-[#059669]' 
    : feedback.vote_count < 0 
      ? 'from-[#ef4444] to-[#dc2626]' 
      : 'from-gray-500 to-gray-600';

  const voteTextColor = feedback.vote_count > 0 
    ? 'text-[#10b981]' 
    : feedback.vote_count < 0 
      ? 'text-[#ef4444]' 
      : 'text-gray-400';

  return (
    <div className="group relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-[#6366f1]/5">
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-[#6366f1]/10 to-transparent" />
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="flex gap-5">
          {/* Vote Section - Left side with beautiful vote counter */}
          <div className="flex flex-col items-center gap-1">
            <VoteButton
              feedbackId={feedback.id}
              voteType="up"
              currentUserVote={feedback.user_vote ?? null}
              onAuthRequired={onAuthRequired}
              onVoteChange={onVoteChange}
            />
            
            {/* Vote Count Badge */}
            <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${voteColor} p-[1px] my-1`}>
              <div className="w-full h-full rounded-xl bg-[#0a0a1a] flex items-center justify-center">
                <span className={`text-xl font-bold tabular-nums ${voteTextColor}`}>
                  {feedback.vote_count > 0 ? '+' : ''}{feedback.vote_count}
                </span>
              </div>
            </div>
            
            <VoteButton
              feedbackId={feedback.id}
              voteType="down"
              currentUserVote={feedback.user_vote ?? null}
              onAuthRequired={onAuthRequired}
              onVoteChange={onVoteChange}
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0 py-1">
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#a5b4fc] transition-colors leading-snug">
              {feedback.title}
            </h3>
            
            {feedback.description && (
              <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                {feedback.description}
              </p>
            )}
            
            {/* Footer */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="flex items-center gap-1.5 text-gray-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDate(feedback.created_at)}
              </span>
              
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[#10b981]/80">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {feedback.upvotes}
                </span>
                <span className="flex items-center gap-1 text-[#ef4444]/80">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feedback.downvotes}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
