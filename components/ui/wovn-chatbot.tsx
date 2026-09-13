import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Calendar,
} from "lucide-react";
import { useWebsiteData } from "@/context/website-data-context";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: "Our Services", prompt: "What services does Wovn Creatives offer?" },
  { label: "Meet the Team", prompt: "Who are the founders and team members at Wovn?" },
  { label: "Showcase Work", prompt: "Tell me about Wovn's showcase projects and work." },
  { label: "Book a Call", prompt: "How do I book a discovery or strategy call with Wovn?" },
];

export const WovnChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hello! I am **Wovn AI**. Ask me anything about our design and web engineering services, our founders & team, showcase projects, or booking a consultation.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const websiteData = useWebsiteData();
  const siteSettings = websiteData?.siteSettings;
  const teamMembers = websiteData?.teamMembers || [];
  const projects = websiteData?.projects || [];
  const services = websiteData?.services || [];

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch {
      // safe fallback
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages]);

  // Prevent background page scrolling when scrolling inside the chatbot modal
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal || !isOpen) return;

    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      const scrollable = modal.querySelector(".chatbot-messages-scroll") as HTMLElement | null;

      if (!scrollable) {
        e.preventDefault();
        return;
      }

      const isInsideScrollable = scrollable.contains(target) || target === scrollable;
      if (isInsideScrollable) {
        const { scrollTop, scrollHeight, clientHeight } = scrollable;
        const delta = e.deltaY;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

        // When reaching the boundary, prevent default to stop the website behind from scrolling
        if ((delta < 0 && isAtTop) || (delta > 0 && isAtBottom)) {
          e.preventDefault();
        }
      } else {
        // When cursor is over non-scrollable parts of chatbot (header, input, chips), prevent page scroll
        e.preventDefault();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      const scrollable = modal.querySelector(".chatbot-messages-scroll") as HTMLElement | null;
      if (!scrollable || !scrollable.contains(target)) {
        e.preventDefault();
      }
    };

    modal.addEventListener("wheel", onWheel, { passive: false });
    modal.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      modal.removeEventListener("wheel", onWheel);
      modal.removeEventListener("touchmove", onTouchMove);
    };
  }, [isOpen]);

  const handleCopy = (id: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Build context summary from live website data
    const calUrl = siteSettings?.calLink
      ? `https://cal.com/${siteSettings.calLink}`
      : "https://cal.com/wovn-creatives/w";
    const contextSummary = `
Site Settings: Agency: ${siteSettings?.agencyName || "WOVN CREATIVES"}, Tagline: "${siteSettings?.heroHeadingLine1 || "Generic?"} ${siteSettings?.heroHeadingLine2 || "Maybe try us."}", Location: ${siteSettings?.location || "Lahore, Pakistan"}, Email: ${siteSettings?.contactEmail || "wovn.hq@gmail.com"}, Cal Link: ${calUrl}
Team (${teamMembers.length}): ${teamMembers.map((t) => `${t.name} (${t.role})`).join(", ")}
Services (${services.length}): ${services.map((s) => `${s.number} - ${s.tagline}`).join(" | ")}
Projects (${projects.length}): ${projects.map((p) => `${p.title} (${p.desc})`).join(", ")}
    `.trim();

    try {
      const historyPayload = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          contextData: contextSummary,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const botReply = data?.text || "Thank you for reaching out to Wovn Creatives.";

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "model",
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error("Chat request error:", err);
      // Fallback response so user never gets a broken UI
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "model",
          text: "Wovn Creatives is a premier creative studio specializing in UI/UX Design (Framer), Visual Branding & Identity, Modern Web Engineering, 3D Kinetic Visuals, and AI Automations. You can reach our team directly at wovn.hq@gmail.com or book a strategy call at [cal.com/wovn-creatives/w](https://cal.com/wovn-creatives/w).",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simple, safe formatter for markdown bold, bullet points, and links
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[.*?\]\(.*?\))/g);

    return parts.map((part, i) => {
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const [, label, url] = linkMatch;
        return (
          <a
            key={`link-${i}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-cyan-500 hover:text-cyan-400 underline font-medium break-all"
          >
            {label}
            <ExternalLink className="w-3 h-3 inline shrink-0" />
          </a>
        );
      }

      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return (
        <React.Fragment key={`text-${i}`}>
          {boldParts.map((bp, j) => {
            if (bp.startsWith("**") && bp.endsWith("**")) {
              return (
                <strong key={`bold-${j}`} className="font-semibold text-zinc-950 dark:text-white">
                  {bp.slice(2, -2)}
                </strong>
              );
            }
            return bp;
          })}
        </React.Fragment>
      );
    });
  };

  const calHref = siteSettings?.calLink
    ? `https://cal.com/${siteSettings.calLink}`
    : "https://cal.com/wovn-creatives/w";

  return (
    <>
      {/* Floating Modal Window */}
      {isOpen && (
        <div
          ref={modalRef}
          id="wovn-chatbot-modal"
          style={{ overscrollBehavior: "contain" }}
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-8 z-50 w-[calc(100vw-32px)] sm:w-[400px] h-[540px] max-h-[calc(100vh-110px)] flex flex-col rounded-3xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl shadow-black/25 dark:shadow-black/70 overflow-hidden select-text overscroll-contain transition-all duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm">
                <Bot className="w-4 h-4 text-white dark:text-zinc-950" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-zinc-950"></span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white leading-none tracking-tight">
                  Wovn AI
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-normal">
                  Studio Assistant • Active
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              title="Close chat"
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Messages with isolated scroll */}
          <div
            style={{ overscrollBehavior: "contain" }}
            className="chatbot-messages-scroll flex-1 p-4 overflow-y-auto space-y-3.5 overscroll-contain"
          >
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed tracking-normal ${
                      isUser
                        ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-tr-xs shadow-xs"
                        : "bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 border border-zinc-200/70 dark:border-zinc-800/80 rounded-tl-xs shadow-2xs"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{renderFormattedText(m.text)}</div>

                    {!isUser && (
                      <div className="mt-2 pt-1.5 border-t border-zinc-200/50 dark:border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
                        <span>{m.timestamp}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(m.id, m.text)}
                          className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-emerald-500" />
                              <span className="text-emerald-500 font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  {isUser && (
                    <span className="text-[10px] text-zinc-400 mt-1 px-1">{m.timestamp}</span>
                  )}
                </div>
              );
            })}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-start gap-2">
                <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl rounded-tl-xs px-4 py-2.5 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          {messages.length <= 3 && !loading && (
            <div className="px-3.5 py-2 border-t border-zinc-100 dark:border-zinc-900 flex flex-wrap gap-1.5 bg-zinc-50/50 dark:bg-zinc-900/30">
              {QUICK_PROMPTS.map((qp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(qp.prompt)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/90 dark:border-zinc-800 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <span>{qp.label}</span>
                  <ChevronRight className="w-2.5 h-2.5 text-zinc-400" />
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40"
          >
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about Wovn Creatives..."
                disabled={loading}
                className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 text-xs sm:text-sm text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 transition-colors shadow-2xs"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-1 p-1.5 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-30 transition-colors cursor-pointer shadow-2xs"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="text-[10px] text-zinc-400">WOVN Creative Studio</span>
              <a
                href={calHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center gap-1 font-medium text-[11px]"
              >
                <Calendar className="w-3 h-3 text-zinc-400" /> Book Strategy Call
              </a>
            </div>
          </form>
        </div>
      )}

      {/* Floating Round Circle Trigger Button */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-white shadow-lg border border-zinc-800 dark:border-zinc-700 transition-all duration-150 cursor-pointer active:scale-95"
          aria-label={isOpen ? "Close Wovn AI chatbot" : "Open Wovn AI chatbot"}
          title={isOpen ? "Close AI Assistant" : "Ask Wovn AI"}
          id="wovn-chatbot-trigger-btn"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </>
  );
};
