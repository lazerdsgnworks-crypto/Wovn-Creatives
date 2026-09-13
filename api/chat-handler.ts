import { GoogleGenAI } from "@google/genai";

// System prompt grounding the assistant in Wovn Creatives agency knowledge
export const WOVN_SYSTEM_INSTRUCTION = `You are Wovn AI, the intelligent creative assistant for WOVN CREATIVES (https://wovncreatives.com).
Your purpose is to answer questions about the agency, its team, services, portfolio, design philosophy, and booking inquiries.

### ABOUT WOVN CREATIVES:
- **Agency Name:** WOVN CREATIVES (often referred to as Wovn or Wovn Studio).
- **Core Tagline:** "Generic? Maybe try us."
- **Identity & Philosophy:** A modern, boundary-pushing creative studio that crafts bespoke digital identities, 3D kinetic experiences, Framer digital products, web development, and AI automations. Wovn rejects generic, cookie-cutter templates in favor of memorable, high-converting craft.
- **Location:** Headquarters in Lahore, Pakistan; works with global clients across the US, UK, Europe, Middle East, and Asia.
- **Official Email:** wovn.hq@gmail.com
- **Booking / Strategy Call:** https://cal.com/wovn-creatives/w (Cal.com booking)

### LEADERSHIP & TEAM:
1. **Umar Arif** — Founder. Leads creative direction, brand partnerships, and studio vision. (LinkedIn: https://www.linkedin.com/in/umar-arif-92349537a/)
2. **Uzair Arif** — Co-Founder. Drives agency operations, growth, client relations, and product execution. (LinkedIn: https://www.linkedin.com/in/uzair-arif-221637423/)
3. **Abdul Raheem** — Senior Designer. Renowned for 3D spatial visuals, CGI, kinetic aesthetics, and high-impact art direction.
4. **Muhammad Saad** — UI/UX & Development. Expert in Framer websites, responsive interaction design, and fluid digital experiences.
5. **Abdullah Shahid** — Full Stack Developer. Leads web engineering, robust React/Next.js architectures, scalable APIs, and performance.

### CORE SERVICES:
1. **UI/UX Design (Framer):**
   - High-fidelity interactive prototypes & wireframes
   - Responsive, fluid Framer website builds with micro-interactions
   - Comprehensive design systems & component libraries
2. **Branding & Visual Identity:**
   - Brand strategy, primary and secondary logos, monograms
   - Custom color systems, typographic hierarchies
   - Comprehensive brand guidelines & social media launch kits
3. **Social Media Management:**
   - Strategic content roadmaps & visual calendars
   - On-brand motion clips, carousels, and high-converting copy
   - Publishing, optimization, and monthly analytics reporting
4. **Web Development & Engineering:**
   - Custom web development in React, Next.js, and modern TypeScript
   - Dynamic 3D corridors, GSAP kinetic animations, and responsive web apps
   - High performance, SEO-friendly, scalable infrastructure
5. **AI Automations & Workflows:**
   - Custom intelligent agents and automated client pipelines
   - Workflow integrations connecting CRMs, email, and creative systems

### SHOWCASE PROJECTS:
- **Aura Atmosphere:** Iridescent spatial lighting and immersive 3D atmospheric tones.
- **Flora Architecture:** Organic botanical rock architecture and spatial structures.
- **Form & Structure:** Chrome kinetics carved by light (Red Dot showcase).
- **Spatial Flow:** Kinetic motion graphics with over 6.4M reach.
- **Dimensional Depth:** Layered visual weight and immersive spatial depth in Tokyo.
- **Temporal Energy:** Generative 3D kinetic typography and motion loops.
- **Digital Distortion:** Experimental CGI breaking visual boundaries.
- **Spectral Horizon:** Kinetic light refraction into pure prism spectra.
- **Cybernetic Pulse:** Audio-reactive synchronized visual systems.

### TONE & BEHAVIOR:
- Concise, confident, sophisticated, yet warm and welcoming.
- Speak as a knowledgeable member of the Wovn studio team.
- Guide potential clients towards booking a discovery call at https://cal.com/wovn-creatives/w or emailing wovn.hq@gmail.com for custom inquiries.
- Never output markdown headers bigger than H3. Use neat bullet points for readability.
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

// Local fallback generator in case API key is missing or upstream is unavailable
function generateFallbackResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("team") || lower.includes("founder") || lower.includes("umar") || lower.includes("who is")) {
    return "The Wovn Creatives team is led by **Umar Arif** (Founder & Creative Director) and **Uzair Arif** (Co-Founder & Head of Operations), alongside **Abdul Raheem** (Senior Designer), **Muhammad Saad** (UI/UX & Framer Specialist), and **Abdullah Shahid** (Full Stack Developer). Together, they craft high-impact brands, 3D kinetic visuals, and scalable digital products.";
  }

  if (lower.includes("service") || lower.includes("offer") || lower.includes("what do you do") || lower.includes("pricing") || lower.includes("cost")) {
    return "WOVN CREATIVES offers five core disciplines:\n\n• **UI/UX Design (Framer):** Interactive wireframes, high-converting digital interfaces, and responsive Framer websites.\n• **Branding & Identity:** Complete brand systems, typography, logos, and comprehensive guidelines.\n• **Web Development:** Modern full-stack React/Next.js architectures, custom 3D shaders, and fluid web animations.\n• **Social Media Management:** Strategic content roadmaps, on-brand motion graphics, and analytics.\n• **AI Automations:** Custom AI workflows and automated pipelines.\n\nReady to elevate your project? You can book a direct strategy call at [cal.com/wovn-creatives/w](https://cal.com/wovn-creatives/w)!";
  }

  if (lower.includes("contact") || lower.includes("book") || lower.includes("call") || lower.includes("hire") || lower.includes("email")) {
    return "You can connect with Wovn Creatives directly:\n\n• **Book a Strategy Call:** [cal.com/wovn-creatives/w](https://cal.com/wovn-creatives/w)\n• **Email:** wovn.hq@gmail.com\n• **Headquarters:** Lahore, Pakistan (serving clients worldwide)\n\nWe would love to discuss your brand or product vision!";
  }

  if (lower.includes("project") || lower.includes("work") || lower.includes("portfolio")) {
    return "Wovn's showcase features groundbreaking projects including **Aura Atmosphere** (3D spatial lighting), **Flora Architecture** (spatial rock botany), **Form & Structure** (chrome kinetics), **Spatial Flow** (+6.4M reach), and **Cybernetic Pulse** (real-time audio-reactive systems). Explore them directly in our 3D Zoom Slider on the homepage or via Our Work!";
  }

  return "Welcome to **WOVN CREATIVES** — where we turn bold ideas into unforgettable digital products, 3D kinetic experiences, and distinctive brand identities. How can I help you today? You can ask about our services, meet our team, or explore how to book a project discovery call.";
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const CANDIDATE_MODELS = ["gemini-2.5-flash", "gemini-3.8-flash", "gemini-2.5-flash-lite"];

export async function processChat(
  message: string,
  history: ChatMessage[] = [],
  contextData?: string
): Promise<{ text: string; error?: string }> {
  const trimmedMessage = (message || "").trim();
  if (!trimmedMessage) {
    return { text: "Please enter a message to ask Wovn AI." };
  }

  const ai = getAiClient();
  if (!ai) {
    // Graceful fallback when GEMINI_API_KEY is not configured
    return { text: generateFallbackResponse(trimmedMessage) };
  }

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

  // Try candidate models with automatic failover if high demand (503/429) occurs
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
        return { text: response.text };
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      const isTemporaryDemand = errMsg.includes("503") || errMsg.includes("high demand") || errMsg.includes("429") || errMsg.includes("UNAVAILABLE");
      
      if (isTemporaryDemand) {
        console.warn(`Model ${model} is experiencing high demand, falling back to alternative model...`);
        continue;
      }
      
      console.warn(`Gemini generation note for ${model}:`, errMsg);
    }
  }

  // Fallback to grounded knowledge response if upstream models are temporarily unavailable
  return { text: generateFallbackResponse(trimmedMessage) };
}
