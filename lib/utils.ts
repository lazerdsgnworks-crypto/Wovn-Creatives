import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes and cleans chat replies from webhooks or LLMs:
 * - Decodes string escape sequences
 * - Unwraps raw JSON payload strings if present
 * - Preserves Markdown & Shadcn syntax (bold, lists, tables, code, badges)
 * - Removes ANSI codes and control characters
 */
export function cleanChatReply(input: any): string {
  if (input === null || input === undefined) return "";
  let text = typeof input === "string" ? input : String(input);

  // 1. If it looks like a JSON string object e.g. {"output": "..."} or {"text": "..."}, attempt JSON.parse
  if (
    (text.startsWith("{") && text.endsWith("}")) ||
    (text.startsWith("[") && text.endsWith("]")) ||
    (text.startsWith('"') && text.endsWith('"'))
  ) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "string") {
        text = parsed;
      } else if (parsed && typeof parsed === "object") {
        text =
          parsed.text ||
          parsed.output ||
          parsed.response ||
          parsed.message ||
          parsed.reply ||
          parsed.result ||
          parsed.content ||
          JSON.stringify(parsed, null, 2);
      }
    } catch {
      // Continue with string processing
    }
  }

  // 2. Remove ANSI escape sequences
  text = text.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");

  // 3. Decode/clean raw string literal escape sequences (e.g., "\n", "\t", "\"", "\'")
  text = text
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, "  ")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");

  // 4. Remove unescaped unicode control codes if any (except standard newlines/tabs)
  text = text.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, "");

  // 5. Clean up excessive consecutive empty lines (more than 2)
  text = text.replace(/\n{3,}/g, "\n\n").trim();

  return text;
}
