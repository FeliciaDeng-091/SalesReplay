export type Confidence = 'high' | 'medium' | 'low';

export type Stage = 
  | 'initial_contact' 
  | 'needs_discovery' 
  | 'objection_handling' 
  | 'proposal_stage' 
  | 'negotiation' 
  | 'closing_attempt';

export type Blocker =
  | 'price_concern'
  | 'timing_not_right'
  | 'comparing_options'
  | 'authority_issue'
  | 'trust_concern'
  | 'feature_mismatch'
  | 'nothing_obvious';

export interface ConversationReview {
  what_they_said: string;
  what_they_probably_meant: string;
  gap_exists: boolean;
  how_you_can_tell: string;
  where_they_are: Stage;
  where_clue: string;
  real_blocker: Blocker;
  blocker_detail: string;
  missed_shots: string[];
  good_moves: string[];
  next_time_opener: string;
  next_time_focus: string[];
  next_time_avoid: string[];
  lesson_learned: string;
  confidence: Confidence;
}
