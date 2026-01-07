export type VoteType = 'up' | 'down';

export interface Feedback {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  created_at: string;
}

export interface FeedbackWithVotes extends Feedback {
  vote_count: number;
  upvotes: number;
  downvotes: number;
  user_vote?: VoteType | null;
}

export interface Vote {
  id: string;
  feedback_id: string;
  user_id: string;
  vote_type: VoteType;
  created_at: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      feedback: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "feedback_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      votes: {
        Row: {
          id: string;
          feedback_id: string;
          user_id: string;
          vote_type: VoteType;
          created_at: string;
        };
        Insert: {
          id?: string;
          feedback_id: string;
          user_id: string;
          vote_type: VoteType;
          created_at?: string;
        };
        Update: {
          id?: string;
          feedback_id?: string;
          user_id?: string;
          vote_type?: VoteType;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "votes_feedback_id_fkey";
            columns: ["feedback_id"];
            isOneToOne: false;
            referencedRelation: "feedback";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      feedback_with_votes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_by: string;
          created_at: string;
          vote_count: number;
          upvotes: number;
          downvotes: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_user_vote: {
        Args: {
          p_feedback_id: string;
          p_user_id: string;
        };
        Returns: VoteType | null;
      };
    };
    Enums: {
      vote_type: VoteType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
