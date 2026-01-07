'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { FeedbackCard } from './FeedbackCard';
import { FeedbackWithVotes, VoteType } from '@/types/database';

interface FeedbackListProps {
  onAuthRequired: () => void;
}

export function FeedbackList({ onAuthRequired }: FeedbackListProps) {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, supabase, isConfigured } = useAuth();

  const fetchFeedback = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    
    // Fetch feedback with votes
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('feedback_with_votes')
      .select('*')
      .order('vote_count', { ascending: false });

    if (feedbackError) {
      console.error('Error fetching feedback:', feedbackError);
      setLoading(false);
      return;
    }

    // If user is logged in, fetch their votes
    let userVotesMap: Record<string, VoteType> = {};
    
    if (user) {
      const { data: userVotes } = await supabase
        .from('votes')
        .select('feedback_id, vote_type')
        .eq('user_id', user.id);

      if (userVotes) {
        userVotesMap = userVotes.reduce((acc, vote) => {
          acc[vote.feedback_id] = vote.vote_type as VoteType;
          return acc;
        }, {} as Record<string, VoteType>);
      }
    }

    // Merge feedback with user votes
    const feedbackWithUserVotes: FeedbackWithVotes[] = (feedbackData || []).map((item) => ({
      ...item,
      user_vote: userVotesMap[item.id] || null,
    }));

    // Sort by vote_count descending, then by created_at descending
    feedbackWithUserVotes.sort((a, b) => {
      if (b.vote_count !== a.vote_count) {
        return b.vote_count - a.vote_count;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    setFeedbackItems(feedbackWithUserVotes);
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    
    fetchFeedback();

    // Subscribe to realtime changes on feedback table
    const feedbackChannel = supabase
      .channel('feedback-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feedback',
        },
        () => {
          fetchFeedback();
        }
      )
      .subscribe();

    // Subscribe to realtime changes on votes table
    const votesChannel = supabase
      .channel('votes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
        },
        () => {
          fetchFeedback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(feedbackChannel);
      supabase.removeChannel(votesChannel);
    };
  }, [supabase, fetchFeedback]);

  if (!isConfigured) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#f59e0b]/20 to-[#d97706]/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Setup Required</h3>
        <p className="text-gray-400 max-w-md mx-auto px-4 text-sm">
          Configure your Supabase credentials in <code className="text-[#f59e0b] bg-[#f59e0b]/10 px-1.5 py-0.5 rounded">.env.local</code> to get started.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl p-6 animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex gap-5">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-10 bg-white/5 rounded-xl" />
                <div className="w-14 h-14 bg-white/5 rounded-xl" />
                <div className="w-12 h-10 bg-white/5 rounded-xl" />
              </div>
              <div className="flex-1 space-y-3 py-1">
                <div className="h-5 bg-white/5 rounded-lg w-3/4" />
                <div className="h-4 bg-white/5 rounded-lg w-full" />
                <div className="h-4 bg-white/5 rounded-lg w-2/3" />
                <div className="h-3 bg-white/5 rounded-lg w-1/3 mt-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (feedbackItems.length === 0) {
    return (
      <div className="text-center py-20 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl">
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No feedback yet</h3>
        <p className="text-gray-400 mb-6">Be the first to share your ideas!</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6366f1] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6366f1]"></span>
          </span>
          Waiting for the first idea
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedbackItems.map((feedback, index) => (
        <div
          key={feedback.id}
          className="animate-fadeIn"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <FeedbackCard
            feedback={feedback}
            onAuthRequired={onAuthRequired}
            onVoteChange={fetchFeedback}
          />
        </div>
      ))}
    </div>
  );
}
