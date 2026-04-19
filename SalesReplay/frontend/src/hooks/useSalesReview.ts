import { useState, useCallback, useRef } from 'react';
import { getSalesReview } from '@/utils/api';
import type { ConversationReview } from '@/types/review';

export interface UseSalesReviewResult {
  data: ConversationReview | null;
  loading: boolean;
  error: string | null;
  submit: (vehicleContext: string, conversationText: string) => Promise<void>;
  retry: () => void;
  cancel: () => void;
}

export function useSalesReview(): UseSalesReviewResult {
  const [data, setData] = useState<ConversationReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastInput = useRef<{ vehicleContext: string; conversationText: string } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const submit = useCallback(async (vehicleContext: string, conversationText: string) => {
    lastInput.current = { vehicleContext, conversationText };
    setLoading(true);
    setError(null);
    setData(null);

    // Cancel previous request if any
    cancel();
    const controller = new AbortController();
    abortRef.current = controller;

    // Retry logic with exponential backoff
    const maxRetries = 3;
    let lastError: string | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      if (controller.signal.aborted) {
        setLoading(false);
        return;
      }

      const result = await getSalesReview(vehicleContext, conversationText, controller.signal);

      if (result.data) {
        setData(result.data);
        setLoading(false);
        abortRef.current = null;
        return;
      }

      lastError = result.error;

      // Only retry on rate limit or network errors
      const isRetryable = result.error?.includes('频繁') || result.error?.includes('网络');
      if (!isRetryable || attempt === maxRetries - 1) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    setError(lastError);
    setLoading(false);
    abortRef.current = null;
  }, [cancel]);

  const retry = useCallback(() => {
    if (lastInput.current) {
      submit(lastInput.current.vehicleContext, lastInput.current.conversationText);
    }
  }, [submit]);

  return { data, loading, error, submit, retry, cancel };
}
