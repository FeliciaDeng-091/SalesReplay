/**
 * Clean LLM response by stripping markdown code fences, think tags, and trimming
 */
export function cleanJsonResponse(raw: string): string {
  let cleaned = raw.trim();

  // Remove <think>...</think> block (MiniMax reasoning output)
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  // Remove markdown code block fences
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }

  return cleaned.trim();
}
