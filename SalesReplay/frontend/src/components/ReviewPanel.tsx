import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ReviewSection, ReviewList, ReviewCallout, ReviewBadge } from './ReviewSection';
import {
  stageLabels,
  stageEmojis,
  blockerLabels,
  blockerEmojis,
  confidenceEmojis,
  confidenceLabels,
  safeGet,
} from '@/constants/labels';
import type { ConversationReview } from '@/types/review';
import { Copy, Check } from 'lucide-react';

interface ReviewPanelProps {
  review: ConversationReview | null;
  loading: boolean;
}

function formatReviewText(review: ConversationReview): string {
  const lines: string[] = [];

  lines.push(`${safeGet(confidenceEmojis, review.confidence, '❓')} 置信度：${safeGet(confidenceLabels, review.confidence, review.confidence)}`);
  lines.push(`${safeGet(stageEmojis, review.where_they_are, '📍')} 客户阶段：${safeGet(stageLabels, review.where_they_are, review.where_they_are)}`);
  lines.push('');

  lines.push('🗣️ 客户说了什么');
  lines.push(review.what_they_said);
  lines.push('');

  lines.push('💭 实际意图');
  lines.push(review.what_they_probably_meant);
  lines.push('');

  if (review.gap_exists) {
    lines.push('⚠️ 沟通断层');
    lines.push(`判断依据：${review.how_you_can_tell}`);
    lines.push(`阶段线索：${review.where_clue}`);
    lines.push('');
  }

  if (review.real_blocker !== 'nothing_obvious') {
    lines.push(`${safeGet(blockerEmojis, review.real_blocker, '⚠️')} 核心阻碍：${safeGet(blockerLabels, review.real_blocker, review.real_blocker)}`);
    lines.push(review.blocker_detail);
    lines.push('');
  }

  if (review.missed_shots.length > 0) {
    lines.push('🎯 错失机会');
    review.missed_shots.forEach((item) => lines.push(`  • ${item}`));
    lines.push('');
  }

  if (review.good_moves.length > 0) {
    lines.push('✅ 做得好');
    review.good_moves.forEach((item) => lines.push(`  • ${item}`));
    lines.push('');
  }

  lines.push('💬 下次开场');
  lines.push(`"${review.next_time_opener}"`);
  lines.push('');

  if (review.next_time_focus.length > 0) {
    lines.push('🎯 下次重点');
    review.next_time_focus.forEach((item) => lines.push(`  • ${item}`));
    lines.push('');
  }

  if (review.next_time_avoid.length > 0) {
    lines.push('⚠️ 下次避免');
    review.next_time_avoid.forEach((item) => lines.push(`  • ${item}`));
    lines.push('');
  }

  lines.push('📌 核心教训');
  lines.push(review.lesson_learned);

  return lines.join('\n');
}

export function ReviewPanel({ review, loading }: ReviewPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!review) return;
    const text = formatReviewText(review);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [review]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
        <div className="text-4xl mb-2">📝</div>
        <p>在左侧输入车辆背景和销售对话</p>
        <p className="text-sm mt-1">点击「开始复盘」获取 AI 分析结果</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ReviewBadge
            label={safeGet(confidenceLabels, review.confidence, review.confidence)}
            emoji={safeGet(confidenceEmojis, review.confidence, '❓')}
            variant={review.confidence === 'high' ? 'success' : review.confidence === 'medium' ? 'warning' : 'default'}
          />
          <ReviewBadge
            label={safeGet(stageLabels, review.where_they_are, review.where_they_are)}
            emoji={safeGet(stageEmojis, review.where_they_are, '📍')}
            variant="info"
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
          {copied ? '已复制' : '复制复盘'}
        </Button>
      </div>

      {/* What they said */}
      <ReviewSection title="客户说了什么" emoji="🗣️">
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.what_they_said}</p>
      </ReviewSection>

      {/* What they probably meant */}
      <ReviewSection title="实际意图" emoji="💭">
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.what_they_probably_meant}</p>
      </ReviewSection>

      {/* Gap analysis */}
      {review.gap_exists && (
        <ReviewSection title="沟通断层" emoji="⚠️" className="border-l-yellow-500">
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-gray-500">判断依据：</span>
              <p className="text-sm text-gray-700">{review.how_you_can_tell}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">阶段线索：</span>
              <p className="text-sm text-gray-700">{review.where_clue}</p>
            </div>
          </div>
        </ReviewSection>
      )}

      {/* Blocker */}
      {review.real_blocker !== 'nothing_obvious' && (
        <ReviewSection title="核心阻碍" emoji={safeGet(blockerEmojis, review.real_blocker, '⚠️')} className="border-l-red-500">
          <div className="space-y-2">
            <ReviewBadge label={safeGet(blockerLabels, review.real_blocker, review.real_blocker)} emoji={safeGet(blockerEmojis, review.real_blocker, '⚠️')} variant="warning" />
            <p className="text-sm text-gray-700">{review.blocker_detail}</p>
          </div>
        </ReviewSection>
      )}

      {/* Missed shots */}
      {review.missed_shots.length > 0 && (
        <ReviewSection title="错失机会" emoji="🎯" className="border-l-orange-500">
          <ReviewList items={review.missed_shots} prefix="🎯" />
        </ReviewSection>
      )}

      {/* Good moves */}
      {review.good_moves.length > 0 && (
        <ReviewSection title="做得好" emoji="✅" className="border-l-green-500">
          <ReviewList items={review.good_moves} prefix="✅" />
        </ReviewSection>
      )}

      {/* Next time opener */}
      <ReviewSection title="下次开场" emoji="💬">
        <ReviewCallout text={review.next_time_opener} emoji="💡" />
      </ReviewSection>

      {/* Next time focus */}
      {review.next_time_focus.length > 0 && (
        <ReviewSection title="下次重点" emoji="🎯" className="border-l-blue-500">
          <ReviewList items={review.next_time_focus} prefix="🎯" />
        </ReviewSection>
      )}

      {/* Next time avoid */}
      {review.next_time_avoid.length > 0 && (
        <ReviewSection title="下次避免" emoji="⚠️" className="border-l-red-400">
          <ReviewList items={review.next_time_avoid} prefix="⚠️" />
        </ReviewSection>
      )}

      {/* Lesson learned */}
      <ReviewSection title="核心教训" emoji="📌" className="border-l-purple-600">
        <p className="text-sm text-gray-700 font-medium">{review.lesson_learned}</p>
      </ReviewSection>
    </div>
  );
}
