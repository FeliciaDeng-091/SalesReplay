import type { Stage, Blocker } from '@/types/review';

export function safeGet(map: Record<string, string>, key: string, fallback?: string): string {
  return map[key] ?? fallback ?? key;
}

export const stageLabels: Record<Stage, string> = {
  initial_contact: '初次接触',
  needs_discovery: '需求挖掘',
  objection_handling: '异议处理',
  proposal_stage: '方案展示',
  negotiation: '谈判阶段',
  closing_attempt: '成交尝试',
};

export const stageEmojis: Record<Stage, string> = {
  initial_contact: '👋',
  needs_discovery: '🔍',
  objection_handling: '🛡️',
  proposal_stage: '💡',
  negotiation: '⚖️',
  closing_attempt: '🎯',
};

export const blockerLabels: Record<Blocker, string> = {
  price_concern: '价格顾虑',
  timing_not_right: '时机不对',
  comparing_options: '多方比较',
  authority_issue: '决策权限',
  trust_concern: '信任问题',
  feature_mismatch: '功能不匹配',
  nothing_obvious: '暂无明显阻碍',
};

export const blockerEmojis: Record<Blocker, string> = {
  price_concern: '💰',
  timing_not_right: '⏰',
  comparing_options: '📊',
  authority_issue: '👔',
  trust_concern: '🤝',
  feature_mismatch: '⚙️',
  nothing_obvious: '✅',
};

export const confidenceEmojis: Record<string, string> = {
  high: '🔥',
  medium: '⚡',
  low: '💭',
};

export const confidenceLabels: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};
