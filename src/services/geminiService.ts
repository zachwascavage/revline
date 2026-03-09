import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

// Store active chat sessions
const chatSessions: Record<string, any> = {};

export async function getProjectPlan(description: string, sessionId: string = 'default') {
  const ai = getAI();
  // Initialize chat session if it doesn't exist
  if (!chatSessions[sessionId]) {
    chatSessions[sessionId] = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are a witty, creative, and highly knowledgeable digital architect for a top-tier web design agency. Your goal is to help clients conceptualize their dream website. Be conversational, clever, and insightful—think of yourself as a design partner, not a salesperson. Keep responses punchy and helpful. If a client's vision is truly ambitious or complex, you might casually mention that we could dive deeper in a consultation, but never push for it. If you do mention a consultation, include this link: [Schedule a Consultation](/consultation).`,
      },
    });
  }

  const chat = chatSessions[sessionId];

  const response = await chat.sendMessage({ message: description });

  return response.text;
}

export async function saveChatSession(sessionId: string, messages: any[], userEmail: string | null = null, userName: string | null = null) {
  try {
    const ai = getAI();
    let summary = "New conversation";
    if (messages.length > 2) {
      const summaryResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Summarize the following conversation between a potential client and an AI assistant in 1-2 sentences. Focus on what the client is looking for:\n\n${messages.map(m => `${m.role}: ${m.text}`).join('\n')}`,
      });
      summary = summaryResponse.text || "Conversation summary unavailable.";
    }

    await fetch('/api/chat-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, userEmail, userName, messages, summary }),
    });
  } catch (err) {
    console.error('Failed to save chat session:', err);
  }
}

export async function getChatSessions() {
  try {
    const res = await fetch('/api/chat-sessions');
    if (!res.ok) throw new Error('Failed to fetch chat sessions');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
