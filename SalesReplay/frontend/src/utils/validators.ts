import type { ConversationReview, Stage, Blocker, Confidence } from '@/types/review';

const validStages: Stage[] = [
  'initial_contact',
  'needs_discovery',
  'objection_handling',
  'proposal_stage',
  'negotiation',
  'closing_attempt',
];

const validBlockers: Blocker[] = [
  'price_concern',
  'timing_not_right',
  'comparing_options',
  'authority_issue',
  'trust_concern',
  'feature_mismatch',
  'nothing_obvious',
];

const validConfidences: Confidence[] = ['high', 'medium', 'low'];

export function validateReview(obj: unknown): obj is ConversationReview {
  if (!obj || typeof obj !== 'object') return false;

  const r = obj as Record<string, unknown>;

  // Required string fields
  const stringFields = [
    'what_they_said',
    'what_they_probably_meant',
    'how_you_can_tell',
    'where_clue',
    'blocker_detail',
    'next_time_opener',
    'lesson_learned',
  ];
  for (const field of stringFields) {
    if (typeof r[field] !== 'string') return false;
  }

  // Boolean
  if (typeof r.gap_exists !== 'boolean') return false;

  // Enum fields
  if (!validStages.includes(r.where_they_are as Stage)) return false;
  if (!validBlockers.includes(r.real_blocker as Blocker)) return false;
  if (!validConfidences.includes(r.confidence as Confidence)) return false;

  // Array fields
  const arrayFields = ['missed_shots', 'good_moves', 'next_time_focus', 'next_time_avoid'];
  for (const field of arrayFields) {
    if (!Array.isArray(r[field]) || !r[field].every((item) => typeof item === 'string')) {
      return false;
    }
  }

  return true;
}
