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
    <div className="group bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-[#3d3d5c]/50 rounded-2xl p-5 hover:border-[#6366f1]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#6366f1]/10">
      <div className="flex gap-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-2">
          <VoteButton
            feedbackId={feedback.id}
            voteType="up"
            currentUserVote={feedback.user_vote ?? null}
            onAuthRequired={onAuthRequired}
            onVoteChange={onVoteChange}
          />
          <div className={`text-xl font-bold tabular-nums ${
            feedback.vote_count > 0 
              ? 'text-[#10b981]' 
              : feedback.vote_count < 0 
                ? 'text-[#ef4444]' 
                : 'text-gray-400'
          }`}>
            {feedback.vote_count}
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
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#a5b4fc] transition-colors">
            {feedback.title}
          </h3>
          {feedback.description && (
            <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-3">
              {feedback.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDate(feedback.created_at)}
            </span>
            <span className="text-[#3d3d5c]">•</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              {feedback.upvotes}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {feedback.downvotes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

