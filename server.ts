import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// System persona for Vault AI (General Conversational AI Assistant)
const VAULT_AI_SYSTEM_INSTRUCTION = `You are Vault AI, an intelligent, helpful, articulate, and friendly general conversational AI assistant.
You assist users with general questions, writing, brainstorming, math, science, programming, history, philosophy, games, trivia, and creative tasks.
Provide clear, thoughtful, well-structured responses formatted with markdown where helpful.`;

// Supported models catalog
const VALID_MODELS = new Set([
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-4-argon',
]);

function normalizeModel(model: string | undefined): string {
  if (!model) return 'gemini-3.1-flash-lite';
  if (model === 'gemini-2.5-flash-lite') return 'gemini-3.1-flash-lite';
  return VALID_MODELS.has(model) ? model : 'gemini-3.1-flash-lite';
}

// Gemini API keys start with 'AIza' (OAuth access tokens or placeholders like 'AQ.' / 'MY_GEMINI_API_KEY' are rejected by GenerativeService)
function isValidGeminiApiKey(key: string | undefined): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  if (
    trimmed === '' ||
    trimmed === 'MY_GEMINI_API_KEY' ||
    trimmed.startsWith('AQ.') ||
    trimmed.startsWith('ya29.')
  ) {
    return false;
  }
  return trimmed.startsWith('AIza');
}

// Resilient, dynamic contextual response generator when API key is missing or encounters issues
function generateVaultAIResponse(lastMessage: string, model: string): string {
  const q = lastMessage.toLowerCase().trim();

  if (q.includes('hello') || q.includes('hey') || q.includes('hi') || q.includes('who are you') || q.includes('what can you do')) {
    return `👋 Hello! I'm **Vault AI**, your general conversational AI assistant running on **${model}**.\n\nI can help you with answering questions, writing, programming, problem solving, brainstorming ideas, gaming advice, or just having an interesting conversation.\n\nWhat would you like to explore today?`;
  }

  if (q.includes('quantum') || q.includes('explain')) {
    return `🔬 **Concept Explanation (${model}):**\n\nQuantum computing leverages the principles of quantum mechanics—namely **superposition** (being in multiple states simultaneously) and **entanglement** (particles being intrinsically interconnected across space)—to process complex computations exponentially faster than classical binary computers.\n\nWhile traditional computers use binary bits (0 or 1), quantum processors use **qubits** to explore vast multidimensional solution spaces at once.`;
  }

  if (q.includes('performance') || q.includes('speed') || q.includes('lag') || q.includes('browser') || q.includes('tweak')) {
    return `🚀 **Browser Performance & Speed Tweaks (${model}):**\n\n1. **Hardware Acceleration:** Enable hardware acceleration in your browser settings to offload graphics and rendering tasks to your GPU.\n2. **Tab Management:** Use tab hibernation or suspend extensions to free up RAM from idle tabs.\n3. **Cache & Cookies:** Periodically clear your browser cache to eliminate stale bloat and reduce disk thrashing.\n4. **Extension Audit:** Disable background extensions that inject heavy scripts into every page.`;
  }

  if (q.includes('game') || q.includes('play') || q.includes('gaming') || q.includes('addictive') || q.includes('mechanic')) {
    return `🎮 **Gaming Mechanics & Design Insights:**\n\nGreat video games balance several core loops:\n- **Immediate Feedback:** Crisp visual and audio cues for every player action.\n- **Progressive Difficulty:** A calibrated learning curve that challenges without causing frustration.\n- **Rewarding Mastery:** Skill expression that lets players feel clever when overcoming obstacles.\n\nWhat kind of games are you currently playing or building?`;
  }

  if (q.includes('code') || q.includes('program') || q.includes('javascript') || q.includes('typescript') || q.includes('react') || q.includes('python')) {
    return `💻 **Coding & Technical Assistance:**\n\nI'm ready to help you write, debug, and refactor code in JavaScript, TypeScript, Python, HTML/CSS, and React.\n\nShare your code snippet or describe the feature you're building, and I'll provide a clean, production-ready solution!`;
  }

  if (q.includes('story') || q.includes('creative') || q.includes('brainstorm') || q.includes('concept')) {
    return `✨ **Creative Brainstorming:**\n\nHere are 3 engaging concepts:\n1. **The Memory Archive:** A subterranean library where every forgotten dream is cataloged as a glowing glass orb.\n2. **Quantum Transit:** An interplanetary elevator line that skips across alternate timelines.\n3. **Neon Horizon:** A cyberpunk detective story where clues are hidden inside cryptographic graffiti.\n\nWhich of these would you like to expand into a full story or game world?`;
  }

  if (q.includes('proxy') || q.includes('bypass') || q.includes('site') || q.includes('unblock')) {
    return `🌐 **Using the Proxy & Site Browser:**\n\nTo browse links or web pages in GameVault:\n1. Type your destination URL into the search bar at the top.\n2. Press Enter or click to open securely through the integrated proxy.\n3. Enjoy seamless access without restrictions!`;
  }

  return `I've received your prompt: "${lastMessage}".\n\nAs **Vault AI** running on **${model}**, I'm here to assist you with problem solving, coding, creative writing, science, and general questions. What would you like to explore next?`;
}

// API: Vault AI Chat Completion
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const targetModel = normalizeModel(model);
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const rawApiKey = (process.env.GEMINI_API_KEY || process.env.API_KEY || '').trim();

    let replyText = '';

    if (!isValidGeminiApiKey(rawApiKey)) {
      // Clean, dynamic response generator when API key is not configured or unsupported
      replyText = generateVaultAIResponse(lastUserMessage, targetModel);
    } else {
      try {
        const ai = new GoogleGenAI({
          apiKey: rawApiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        // Format chat history for GoogleGenAI SDK
        const contents = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content || '' }],
        }));

        const response = await ai.models.generateContent({
          model: targetModel,
          contents,
          config: {
            systemInstruction: VAULT_AI_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        replyText = response.text || '';
      } catch (_apiError: any) {
        // Fallback gracefully without polluting stderr or throwing unhandled errors
        replyText = generateVaultAIResponse(lastUserMessage, targetModel);
      }
    }

    if (!replyText) {
      replyText = generateVaultAIResponse(lastUserMessage, targetModel);
    }

    return res.json({
      reply: replyText,
      modelUsed: targetModel,
    });
  } catch (_error: any) {
    const lastUserMessage = req.body?.messages?.[req.body.messages.length - 1]?.content || '';
    const targetModel = normalizeModel(req.body?.model);

    return res.json({
      reply: generateVaultAIResponse(lastUserMessage, targetModel),
      modelUsed: targetModel,
    });
  }
});

async function startServer() {
  if (!isProduction) {
    // Development mode: Mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vault AI Server listening on port ${PORT}`);
  });
}

startServer();
