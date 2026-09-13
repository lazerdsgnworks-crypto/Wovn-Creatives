import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Copy,
  Check,
  ExternalLink,
  Info,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormattedMessageProps {
  content: string;
  className?: string;
  isUser?: boolean;
}

/**
 * CodeBlock component with language badge and copy-to-clipboard functionality
 */
const CodeBlock: React.FC<{
  language?: string;
  children: string;
}> = ({ language, children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLanguage = language || "code";

  return (
    <div className="relative my-3.5 w-full rounded-xl border border-zinc-800/90 bg-zinc-950 overflow-hidden shadow-md">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900/90 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
        <span className="uppercase tracking-wider font-semibold text-zinc-300">
          {displayLanguage}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer text-xs"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-3.5 overflow-x-auto custom-scrollbar">
        <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-emerald-300/90 selection:bg-emerald-950 selection:text-emerald-200">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};

/**
 * Parses and replaces custom Shadcn / XML-like tags into standard markdown
 * so that react-markdown can process them with unified Shadcn styling.
 */
function preprocessShadcnTags(rawText: string): string {
  if (!rawText) return "";
  let text = rawText;

  // 1. Convert <Badge variant="...">Label</Badge> -> `🏷️ [Badge: Label]`
  text = text.replace(
    /<Badge(?:\s+variant=["']([^"']+)["'])?>([\s\S]*?)<\/Badge>/gi,
    (_match, _variant, content) => {
      return ` **[${content.trim()}]** `;
    }
  );

  // 2. Convert <Alert ...><AlertTitle>Title</AlertTitle><AlertDescription>Desc</AlertDescription></Alert>
  text = text.replace(
    /<Alert(?:\s+variant=["']([^"']+)["'])?>\s*(?:<AlertTitle>([\s\S]*?)<\/AlertTitle>)?\s*(?:<AlertDescription>([\s\S]*?)<\/AlertDescription>)?\s*<\/Alert>/gi,
    (_match, variant, title, desc) => {
      const calloutType = variant === "destructive" ? "[!WARNING]" : "[!NOTE]";
      const t = title ? `**${title.trim()}**\n` : "";
      const d = desc ? `${desc.trim()}` : "";
      return `\n> ${calloutType}\n> ${t}> ${d}\n`;
    }
  );

  // 3. Convert <Card><CardHeader>...</CardHeader><CardContent>...</CardContent></Card>
  text = text.replace(/<\/?Card(?:Header|Title|Description|Content|Footer)?>/gi, "\n");

  // 4. Convert <Button [href="..."]>Label</Button> -> [Label](url) or **Label**
  text = text.replace(
    /<Button(?:\s+(?:variant|className)=["'][^"']*["'])*(?:\s+href=["']([^"']+)["'])?[^>]*>([\s\S]*?)<\/Button>/gi,
    (_match, href, label) => {
      if (href) {
        return ` [${label.trim()}](${href}) `;
      }
      return ` **[${label.trim()}]** `;
    }
  );

  // 5. Convert <Separator /> or <Separator/> -> ---
  text = text.replace(/<Separator\s*\/?>/gi, "\n\n---\n\n");

  // 6. Strip remaining unparsed XML/HTML opening/closing custom container tags if any
  text = text.replace(/<\/?(div|span|section|article|Tabs|TabsList|TabsTrigger|TabsContent|Accordion|AccordionItem|AccordionTrigger|AccordionContent)[^>]*>/gi, "");

  return text;
}

/**
 * FormattedMessage Component
 * Renders LLM and webhook responses with full Shadcn UI typography, tables, badges,
 * code blocks, callouts, and interactive links.
 */
export const FormattedMessage: React.FC<FormattedMessageProps> = ({
  content,
  className = "",
  isUser = false,
}) => {
  if (!content) return null;

  // For user messages, simple plain text is cleanest
  if (isUser) {
    return <span className={cn("whitespace-pre-wrap break-words", className)}>{content}</span>;
  }

  const processedContent = preprocessShadcnTags(content);

  return (
    <div
      className={cn(
        "formatted-message prose prose-invert max-w-none text-zinc-200 text-sm sm:text-base leading-relaxed tracking-tight select-text space-y-3 break-words",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings with Shadcn typography
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-4 mb-2 pb-1.5 border-b border-zinc-800/80">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white mt-3.5 mb-2 pb-1 border-b border-zinc-800/60">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-100 mt-3 mb-1.5">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm sm:text-base font-semibold text-zinc-200 mt-2 mb-1">
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="mb-2.5 last:mb-0 leading-relaxed text-zinc-200 text-sm sm:text-[15px]">
              {children}
            </p>
          ),

          // Strong / Bold
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),

          // Emphasis / Italic
          em: ({ children }) => (
            <em className="italic text-zinc-300">{children}</em>
          ),

          // Unordered & Ordered Lists
          ul: ({ children }) => (
            <ul className="my-2.5 ml-4 sm:ml-5 space-y-1.5 list-disc marker:text-emerald-400/80 text-zinc-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2.5 ml-4 sm:ml-5 space-y-1.5 list-decimal marker:text-zinc-400 font-normal text-zinc-200">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-1 text-sm sm:text-[15px]">{children}</li>
          ),

          // Blockquotes & Callouts
          blockquote: ({ children }) => {
            // Check for callout marker in children
            const textContent = React.Children.toArray(children)
              .map((c: any) => (typeof c === "string" ? c : c?.props?.children || ""))
              .join(" ");

            let calloutIcon = <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />;
            let borderClass = "border-cyan-500/60 bg-cyan-950/20 text-cyan-200";

            if (textContent.includes("[!WARNING]") || textContent.includes("[!CAUTION]")) {
              calloutIcon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
              borderClass = "border-amber-500/60 bg-amber-950/20 text-amber-200";
            } else if (textContent.includes("[!TIP]")) {
              calloutIcon = <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
              borderClass = "border-emerald-500/60 bg-emerald-950/20 text-emerald-200";
            } else if (textContent.includes("[!IMPORTANT]")) {
              calloutIcon = <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />;
              borderClass = "border-purple-500/60 bg-purple-950/20 text-purple-200";
            }

            return (
              <div
                className={cn(
                  "my-3 flex items-start gap-2.5 rounded-xl border-l-4 p-3.5 text-sm backdrop-blur-xs shadow-xs",
                  borderClass
                )}
              >
                {calloutIcon}
                <div className="flex-1 space-y-1 text-zinc-200 [&>p]:mb-1 [&>p:last-child]:mb-0">
                  {children}
                </div>
              </div>
            );
          },

          // Shadcn Data Tables
          table: ({ children }) => (
            <div className="my-3.5 w-full overflow-x-auto rounded-xl border border-zinc-800/90 bg-zinc-950/60 shadow-sm custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="transition-colors hover:bg-zinc-900/40">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 font-medium">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2 leading-relaxed">{children}</td>
          ),

          // Code: Inline vs CodeBlock
          code: ({ className: codeClassName, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(codeClassName || "");
            const isMultiLine = String(children).includes("\n") || Boolean(match);

            if (isMultiLine) {
              return (
                <CodeBlock language={match ? match[1] : undefined}>
                  {String(children).replace(/\n$/, "")}
                </CodeBlock>
              );
            }

            // Inline Code formatted like Shadcn badge
            return (
              <code
                className="rounded-md bg-zinc-800/90 text-emerald-300 font-mono text-xs px-1.5 py-0.5 border border-zinc-700/60 selection:bg-emerald-900"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Pre tag - pass through children (handled in code)
          pre: ({ children }) => <>{children}</>,

          // Links formatted with hover states and external indicator
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http") || href?.startsWith("//");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1 font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/40 hover:decoration-emerald-400 transition-colors"
              >
                <span>{children}</span>
                {isExternal && <ExternalLink className="w-3 h-3 shrink-0 opacity-80" />}
              </a>
            );
          },

          // Horizontal Divider (Separator)
          hr: () => <hr className="my-4 border-t border-zinc-800" />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default FormattedMessage;
