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
      <div className="text-center py-16 bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-[#3d3d5c]/50 rounded-2xl">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#f59e0b]/20 to-[#d97706]/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Supabase Not Configured</h3>
        <p className="text-gray-400 max-w-md mx-auto px-4">
          Please set up your environment variables. Copy <code className="text-[#f59e0b]">env.local.example</code> to <code className="text-[#f59e0b]">.env.local</code> and add your Supabase credentials.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-[#3d3d5c]/50 rounded-2xl p-5 animate-pulse"
          >
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-[#3d3d5c]/50 rounded-xl" />
                <div className="w-6 h-6 bg-[#3d3d5c]/50 rounded" />
                <div className="w-10 h-10 bg-[#3d3d5c]/50 rounded-xl" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-[#3d3d5c]/50 rounded w-3/4" />
                <div className="h-4 bg-[#3d3d5c]/50 rounded w-full" />
                <div className="h-4 bg-[#3d3d5c]/50 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (feedbackItems.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-[#3d3d5c]/50 rounded-2xl">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No feedback yet</h3>
        <p className="text-gray-400">Be the first to share your ideas!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedbackItems.map((feedback) => (
        <FeedbackCard
          key={feedback.id}
          feedback={feedback}
          onAuthRequired={onAuthRequired}
          onVoteChange={fetchFeedback}
        />
      ))}
    </div>
  );
}
