'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthProvider';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface FeedbackItem {
  id: string;
  title: string;
  vote_count: number;
  upvotes: number;
  downvotes: number;
}

interface ChartDataItem {
  name: string;
  fullTitle: string;
  votes: number;
  upvotes: number;
  downvotes: number;
}

const COLORS = ['#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444'];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDataItem }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1a1a2e] border border-white/20 rounded-lg p-4 shadow-xl max-w-[250px]">
        <p className="text-white font-semibold mb-2 text-sm leading-tight">{data.fullTitle}</p>
        <div className="space-y-2">
          <div className={`text-lg font-bold ${data.votes >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
            {data.votes >= 0 ? '+' : ''}{data.votes} votes
          </div>
          <div className="flex gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {data.upvotes} upvotes
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#ef4444]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {data.downvotes} downvotes
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function VoteChart() {
  const [topFeedback, setTopFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { supabase, isConfigured } = useAuth();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchTopFeedback = useCallback(async (showUpdateIndicator = false) => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    if (showUpdateIndicator) {
      setIsUpdating(true);
    }

    const { data, error } = await supabase
      .from('feedback_with_votes')
      .select('id, title, vote_count, upvotes, downvotes')
      .order('vote_count', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching chart data:', error);
    } else {
      setTopFeedback(data || []);
    }
    
    setLoading(false);
    
    if (showUpdateIndicator) {
      setTimeout(() => setIsUpdating(false), 500);
    }
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    
    fetchTopFeedback();

    // Create a unique channel for the chart with combined subscriptions
    const channelName = `vote-chart-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'votes' 
        },
        () => {
          console.log('Vote INSERT detected');
          fetchTopFeedback(true);
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'votes' 
        },
        () => {
          console.log('Vote UPDATE detected');
          fetchTopFeedback(true);
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'votes' 
        },
        () => {
          console.log('Vote DELETE detected');
          fetchTopFeedback(true);
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'feedback' 
        },
        () => {
          console.log('Feedback change detected');
          fetchTopFeedback(true);
        }
      )
      .subscribe((status) => {
        console.log('Chart subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [supabase, fetchTopFeedback]);

  // Also poll every 3 seconds as a fallback
  useEffect(() => {
    if (!supabase || !isConfigured) return;
    
    const interval = setInterval(() => {
      fetchTopFeedback(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [supabase, isConfigured, fetchTopFeedback]);

  if (!isConfigured || loading) {
    return null;
  }

  if (topFeedback.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top 5 Features</h3>
        <p className="text-gray-500 text-center py-8">No feedback yet</p>
      </div>
    );
  }

  const chartData: ChartDataItem[] = topFeedback.map((item) => ({
    name: item.title.length > 12 ? item.title.substring(0, 12) + '...' : item.title,
    fullTitle: item.title,
    votes: Math.max(0, item.vote_count),
    upvotes: item.upvotes,
    downvotes: item.downvotes,
  }));

  return (
    <div className={`bg-white/5 border border-white/10 rounded-xl p-6 transition-all duration-300 ${isUpdating ? 'ring-2 ring-[#10b981]/50' : ''}`}>
      {/* Header with Live indicator */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Top 5 Features</h3>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
          </span>
          <span className="text-xs font-medium text-[#10b981]">
            {isUpdating ? 'Updating...' : 'Live'}
          </span>
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              allowDecimals={false}
              tickCount={6}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar 
              dataKey="votes" 
              radius={[4, 4, 0, 0]}
              animationDuration={500}
              animationEasing="ease-out"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
