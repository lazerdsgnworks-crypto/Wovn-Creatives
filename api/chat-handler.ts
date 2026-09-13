import { GoogleGenAI } from "@google/genai";
import { cleanChatReply } from "../lib/utils";

// Webhook endpoint for Wovn Chat
export const N8N_CHAT_WEBHOOK_URL = "https://lazer1234.app.n8n.cloud/webhook/wovnchat";

// System prompt grounding the assistant in Wovn Creatives agency knowledge
export const WOVN_SYSTEM_INSTRUCTION = `You are Wovn AI, the intelligent creative assistant for WOVN CREATIVES (https://wovncreatives.com).
Your purpose is to answer questions about the agency, its team, services, portfolio, design philosophy, and booking inquiries.

### ABOUT WOVN CREATIVES:
- Agency Name: WOVN CREATIVES (often referred to as Wovn or Wovn Studio).
- Core Tagline: "Generic? Maybe try us."
- Identity & Philosophy: A modern, boundary-pushing creative studio that crafts bespoke digital identities, 3D kinetic experiences, Framer digital products, web development, and AI automations. Wovn rejects generic, cookie-cutter templates in favor of memorable, high-converting craft.
- Location: Headquarters in Lahore, Pakistan; works with global clients across the US, UK, Europe, Middle East, and Asia.
- Official Email: wovn.hq@gmail.com
- Booking / Strategy Call: https://cal.com/wovn-creatives/w (Cal.com booking)

### LEADERSHIP & TEAM:
1. Umar Arif — Founder. Leads creative direction, brand partnerships, and studio vision. (LinkedIn: https://www.linkedin.com/in/umar-arif-92349537a/)
2. Uzair Arif — Co-Founder. Drives agency operations, growth, client relations, and product execution. (LinkedIn: https://www.linkedin.com/in/uzair-arif-221637423/)
3. Abdul Raheem — Senior Designer. Renowned for 3D spatial visuals, CGI, kinetic aesthetics, and high-impact art direction.
4. Muhammad Saad — UI/UX & Development. Expert in Framer websites, responsive interaction design, and fluid digital experiences.
5. Abdullah Shahid — Full Stack Developer. Leads web engineering, robust React/Next.js architectures, scalable APIs, and performance.

### CORE SERVICES:
1. UI/UX Design (Framer): Interactive prototypes, wireframes, and responsive Framer websites.
2. Branding & Visual Identity: Brand strategy, logos, color systems, typography, and complete guidelines.
3. Social Media Management: Strategic content calendars, high-converting motion graphics, and analytics.
4. Web Development & Engineering: Modern full-stack React/Next.js architectures, custom animations, and responsive web apps.
5. AI Automations & Workflows: Intelligent agents and automated pipelines.

### SHOWCASE PROJECTS:
- Aura Atmosphere: Iridescent spatial lighting and immersive 3D atmospheric tones.
- Flora Architecture: Organic botanical rock architecture and spatial structures.
- Form & Structure: Chrome kinetics carved by light (Red Dot showcase).
- Spatial Flow: Kinetic motion graphics with over 6.4M reach.
- Dimensional Depth: Layered visual weight and immersive spatial depth in Tokyo.
- Cybernetic Pulse: Audio-reactive synchronized visual systems.

### TONE & BEHAVIOR:
- Concise, confident, sophisticated, yet warm and welcoming.
- Speak as a knowledgeable member of the Wovn studio team.
- Guide potential clients towards booking a discovery call at https://cal.com/wovn-creatives/w or emailing wovn.hq@gmail.com for custom inquiries.
- Avoid using asterisks or unescaped strings in your output.
`;

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Local fallback generator in case upstream services are temporarily unavailable
function generateFallbackResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("team") || lower.includes("founder") || lower.includes("umar") || lower.includes("who is")) {
    return "The Wovn Creatives team is led by Umar Arif (Founder & Creative Director) and Uzair Arif (Co-Founder & Head of Operations), alongside Abdul Raheem (Senior Designer), Muhammad Saad (UI/UX & Framer Specialist), and Abdullah Shahid (Full Stack Developer). Together, they craft high-impact brands, 3D kinetic visuals, and scalable digital products.";
  }

  if (lower.includes("service") || lower.includes("offer") || lower.includes("what do you do") || lower.includes("pricing") || lower.includes("cost")) {
    return "WOVN CREATIVES offers five core disciplines:\n\n• UI/UX Design (Framer): Interactive wireframes, high-converting digital interfaces, and responsive Framer websites.\n• Branding & Identity: Complete brand systems, typography, logos, and comprehensive guidelines.\n• Web Development: Modern full-stack React/Next.js architectures, custom 3D shaders, and fluid web animations.\n• Social Media Management: Strategic content roadmaps, on-brand motion graphics, and analytics.\n• AI Automations: Custom AI workflows and automated pipelines.\n\nReady to elevate your project? You can book a direct strategy call at cal.com/wovn-creatives/w!";
  }

  if (lower.includes("contact") || lower.includes("book") || lower.includes("call") || lower.includes("hire") || lower.includes("email")) {
    return "You can connect with Wovn Creatives directly:\n\n• Book a Strategy Call: cal.com/wovn-creatives/w\n• Email: wovn.hq@gmail.com\n• Headquarters: Lahore, Pakistan (serving clients worldwide)\n\nWe would love to discuss your brand or product vision!";
  }

  if (lower.includes("project") || lower.includes("work") || lower.includes("portfolio")) {
    return "Wovn's showcase features groundbreaking projects including Aura Atmosphere (3D spatial lighting), Flora Architecture (spatial rock botany), Form & Structure (chrome kinetics), Spatial Flow (+6.4M reach), and Cybernetic Pulse (real-time audio-reactive systems). Explore them directly in our 3D Zoom Slider on the homepage or via Our Work!";
  }

  return "Welcome to WOVN CREATIVES — where we turn bold ideas into unforgettable digital products, 3D kinetic experiences, and distinctive brand identities. How can I help you today? You can ask about our services, meet our team, or explore how to book a project discovery call.";
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const CANDIDATE_MODELS = ["gemini-2.5-flash", "gemini-3.8-flash", "gemini-2.5-flash-lite"];

/**
 * Extracts text message from diverse n8n webhook response structures
 */
function extractTextFromWebhookResponse(data: any): string | null {
  if (data === null || data === undefined) return null;
  if (typeof data === "string") return data.trim();

  // If array, inspect first item
  if (Array.isArray(data)) {
    if (data.length === 0) return null;
    const first = data[0];
    if (typeof first === "string") return first.trim();
    if (typeof first === "object" && first !== null) {
      return extractTextFromWebhookResponse(first);
    }
    return String(first);
  }

  if (typeof data === "object") {
    // Standard n8n response properties
    if (typeof data.output === "string" && data.output.trim()) return data.output;
    if (typeof data.response === "string" && data.response.trim()) return data.response;
    if (typeof data.text === "string" && data.text.trim()) return data.text;
    if (typeof data.message === "string" && data.message.trim()) return data.message;
    if (typeof data.reply === "string" && data.reply.trim()) return data.reply;
    if (typeof data.result === "string" && data.result.trim()) return data.result;
    if (typeof data.content === "string" && data.content.trim()) return data.content;

    // Nested data property
    if (data.data) {
      const nested = extractTextFromWebhookResponse(data.data);
      if (nested) return nested;
    }

    // Search for first non-empty string value
    for (const key of Object.keys(data)) {
      if (typeof data[key] === "string" && data[key].trim().length > 0) {
        return data[key];
      }
    }
  }

  return null;
}

/**
 * Calls n8n webhook endpoint with strictly userId, sessionId, and chatInput
 */
async function callN8nWebhook(
  message: string,
  userId?: string,
  sessionId?: string
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    // Strictly send userId, sessionId, and chatInput
    const payload = {
      userId: userId || "guest_user",
      sessionId: sessionId || "session_default",
      chatInput: message,
    };

    const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`n8n webhook returned status ${response.status}`);
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await response.json();
      return extractTextFromWebhookResponse(json);
    } else {
      const text = await response.text();
      return text ? text.trim() : null;
    }
  } catch (err: any) {
    console.warn("n8n webhook error:", err?.message || err);
    return null;
  }
}

export async function processChat(
  message: string,
  history: ChatMessage[] = [],
  contextData?: string,
  userId?: string,
  sessionId?: string
): Promise<{ text: string; error?: string }> {
  const trimmedMessage = (message || "").trim();
  if (!trimmedMessage) {
    return { text: "Please enter a message to ask Wovn AI." };
  }

  // 1. Primary: Call the configured n8n webhook with strictly userId, sessionId, chatInput
  const webhookReply = await callN8nWebhook(trimmedMessage, userId, sessionId);
  if (webhookReply && webhookReply.trim().length > 0) {
    return { text: cleanChatReply(webhookReply) };
  }

  // 2. Fallback: Gemini AI SDK with failover if webhook is unreachable
  const ai = getAiClient();
  if (ai) {
    const formattedContents = [
      ...history.slice(-8).map((h) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      {
        role: "user",
        parts: [{ text: trimmedMessage }],
      },
    ];

    const dynamicInstruction = contextData
      ? `${WOVN_SYSTEM_INSTRUCTION}\n\n### CURRENT LIVE SITE DATA CONTEXT:\n${contextData}`
      : WOVN_SYSTEM_INSTRUCTION;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: formattedContents,
          config: {
            systemInstruction: dynamicInstruction,
            temperature: 0.7,
          },
        });

        if (response.text) {
          return { text: cleanChatReply(response.text) };
        }
      } catch (err: any) {
        console.warn(`Gemini generation note for ${model}:`, err?.message || err);
      }
    }
  }

  // 3. Grounded local fallback
  return { text: cleanChatReply(generateFallbackResponse(trimmedMessage)) };
}
