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

  return (
    <div className="group relative">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500" />
      
      <div className="relative bg-[#0c0c18] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-white/20">
        {/* Top gradient line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#6366f1]/50 to-transparent" />
        
        <div className="p-5">
          <div className="flex gap-5">
            {/* Vote Section */}
            <div className="flex flex-col items-center">
              {/* Vote Container */}
              <div className="relative p-3 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10">
                {/* Background glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#6366f1]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative flex flex-col items-center gap-2">
                  <VoteButton
                    feedbackId={feedback.id}
                    voteType="up"
                    currentUserVote={feedback.user_vote ?? null}
                    onAuthRequired={onAuthRequired}
                    onVoteChange={onVoteChange}
                  />
                  
                  {/* Vote Count */}
                  <div className="relative">
                    <div className={`text-2xl font-bold tabular-nums tracking-tight ${
                      feedback.vote_count > 0 
                        ? 'text-[#10b981]' 
                        : feedback.vote_count < 0 
                          ? 'text-[#ef4444]' 
                          : 'text-white'
                    }`}>
                      {feedback.vote_count}
                    </div>
                    <div className="text-[10px] text-gray-500 text-center uppercase tracking-wider">
                      votes
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
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 py-1">
              <h3 className="text-lg font-semibold text-white mb-2 leading-snug group-hover:text-[#a5b4fc] transition-colors">
                {feedback.title}
              </h3>
              
              {feedback.description && (
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                  {feedback.description}
                </p>
              )}
              
              {/* Footer Stats */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(feedback.created_at)}
                </div>
                
                {/* Vote breakdown pills */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
                    <svg className="w-3 h-3 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-[#10b981]">{feedback.upvotes}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/20">
                    <svg className="w-3 h-3 text-[#ef4444]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-[#ef4444]">{feedback.downvotes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
