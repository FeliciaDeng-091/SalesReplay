import { SALES_REVIEW_PROMPT } from '@/constants/prompts';
import { cleanJsonResponse } from './jsonCleaner';
import type { ConversationReview } from '@/types/review';

const STORAGE_KEY = 'salesreplay_api_key';
const BASE_URL = import.meta.env.VITE_LLM_BASE_URL || '/api/llm';
const MODEL = import.meta.env.VITE_LLM_MODEL || 'MiniMax-M2.7-highspeed';

export function getApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key);
}

export function removeApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export interface ReviewResult {
  data: ConversationReview | null;
  error: string | null;
}

export async function getSalesReview(
  vehicleContext: string,
  conversationText: string,
  signal?: AbortSignal
): Promise<ReviewResult> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return { 
      data: null, 
      error: '请先在页面右上角设置 MiniMax API Key' 
    };
  }

  const prompt = SALES_REVIEW_PROMPT
    .replace('{vehicle_context}', vehicleContext)
    .replace('{conversation_text}', conversationText);

  try {
    const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
      signal,
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 401) {
        return { data: null, error: 'API Key 无效，请检查配置' };
      }
      if (status === 429) {
        return { data: null, error: '请求过于频繁，请稍后再试' };
      }
      return { data: null, error: `API 错误: ${status}` };
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;

    if (!content) {
      return { data: null, error: 'AI 返回内容为空' };
    }

    const cleaned = cleanJsonResponse(content);
    console.log('=== LLM cleaned output ===', cleaned);
    const parsed: ConversationReview = JSON.parse(cleaned);
    return { data: parsed, error: null };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return { data: null, error: 'AI 返回格式异常，无法解析 JSON' };
    }
    if (err instanceof Error && err.name === 'AbortError') {
      return { data: null, error: '请求已取消' };
    }
    return { data: null, error: err instanceof Error ? err.message : '网络错误' };
  }
}
