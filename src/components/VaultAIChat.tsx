import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Lock,
  Unlock,
  ChevronDown,
  RotateCcw,
  Bot,
  User,
  ShieldAlert,
  Check,
  Zap,
  Info,
  ExternalLink,
  Gamepad2,
  Copy,
  Terminal,
} from 'lucide-react';
import { ChatMessage, AIModelOption } from '../types';

export const VAULT_AI_UNLOCKED_KEY = 'gamevault_ai_models_unlocked';
export const VAULT_AI_CHAT_HISTORY_KEY = 'gamevault_ai_chat_history_v1';
const MODEL_PASSCODE = 'gemini_gamevault';

export const AVAILABLE_MODELS: AIModelOption[] = [
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    badge: 'Default • Ultra Fast',
    description: 'Instant responses with lightweight latency, perfect for quick questions and gaming tips.',
    isDefault: true,
    requiresUnlock: false,
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    badge: 'Flagship Speed',
    description: 'High-capability flagship flash model delivering comprehensive answers in seconds.',
    requiresUnlock: true,
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    badge: 'Multimodal Intelligence',
    description: 'Balanced multimodal intelligence for complex queries, troubleshooting, and explanations.',
    requiresUnlock: true,
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    badge: 'Deep Reasoning',
    description: 'Maximum depth, code generation, and multi-step analytical problem solving.',
    requiresUnlock: true,
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    badge: 'Frontier AI',
    description: 'Next-generation reasoning model for complex STEM and coding challenges.',
    requiresUnlock: true,
  },
];

const SUGGESTED_PROMPTS = [
  {
    icon: Sparkles,
    label: 'Explain a Concept',
    text: 'Explain quantum computing in simple terms that anyone can understand.',
  },
  {
    icon: Gamepad2,
    label: 'Game Mechanics',
    text: 'What makes video game mechanics addictive, rewarding, and fun?',
  },
  {
    icon: Zap,
    label: 'Computer Speed Tips',
    text: 'Give me 4 quick tweaks to boost browser performance and reduce input lag.',
  },
  {
    icon: Terminal,
    label: 'Creative Brainstorming',
    text: 'Give me 3 creative story premises or video game concepts with unique plot twists.',
  },
];

export const VaultAIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(VAULT_AI_CHAT_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // storage error
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content:
          "👋 Hello! I'm **Vault AI**, your general conversational AI assistant.\n\nFeel free to ask me anything—from questions, writing, and coding, to gaming tips, trivia, and brainstorming. Gemini Flash Lite is active by default, and you can unlock advanced reasoning models in the model selector!",
        timestamp: Date.now(),
        modelUsed: 'gemini-3.1-flash-lite',
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.1-flash-lite');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Check if advanced models are unlocked forever on this device
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(VAULT_AI_UNLOCKED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save chat history to local storage
  useEffect(() => {
    try {
      localStorage.setItem(VAULT_AI_CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [messages]);

  // Autoscroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Close model menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setIsModelMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUnlockCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcodeInput.trim();
    if (clean === MODEL_PASSCODE) {
      try {
        localStorage.setItem(VAULT_AI_UNLOCKED_KEY, 'true');
      } catch {
        // ignore
      }
      setIsUnlocked(true);
      setPasscodeError('');
      setPasscodeSuccess(true);
      setTimeout(() => {
        setPasscodeSuccess(false);
      }, 3000);
    } else {
      setPasscodeError('Incorrect passcode. Try again.');
      setTimeout(() => setPasscodeError(''), 2500);
    }
  };

  const handleSelectModel = (model: AIModelOption) => {
    if (model.requiresUnlock && !isUnlocked) {
      // Prompt user to enter passcode
      setPasscodeError('Enter access code below to unlock this model');
      return;
    }
    setSelectedModel(model.id);
    setIsModelMenuOpen(false);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputPrompt).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't generate a response. Please try again.",
        timestamp: Date.now(),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Unable to complete response**\n\n${
          err.message || 'Connection glitch.'
        }\n\n*Tip: Please check your network connection or try again.*`,
        timestamp: Date.now(),
        isError: true,
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3500);
      return;
    }
    setConfirmClear(false);
    const resetMsg: ChatMessage = {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        "✨ Chat cleared! I'm **Vault AI**, ready for new questions, writing, or conversation. What's on your mind?",
      timestamp: Date.now(),
      modelUsed: selectedModel,
    };
    setMessages([resetMsg]);
    try {
      localStorage.removeItem(VAULT_AI_CHAT_HISTORY_KEY);
    } catch {
      // ignore
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeModelObj =
    AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  return (
    <div className="flex flex-col h-full w-full bg-neutral-950 overflow-hidden animate-fade-in relative">
      {/* Top Header - Full Width Edge to Edge */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 border-b border-neutral-800/80 bg-neutral-950/95 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-600/10 border border-orange-500/40 text-orange-400 shadow-md shadow-orange-500/10">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Vault AI</h1>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              General conversational AI companion
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearChat}
            title="Reset conversation"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              confirmClear
                ? 'border-red-500/60 bg-red-950/50 text-red-300 hover:bg-red-900/60 shadow-sm shadow-red-500/20'
                : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{confirmClear ? 'Click to Confirm Clear' : 'Clear Chat'}</span>
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                  isUser
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-neutral-800 text-orange-400 border border-neutral-700'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-600/15'
                    : message.isError
                    ? 'bg-red-950/40 border border-red-900/60 text-red-200'
                    : 'bg-neutral-900/90 border border-neutral-800/80 text-neutral-200 shadow-md'
                }`}
              >
                {/* Assistant Model Badge */}
                {!isUser && message.modelUsed && (
                  <div className="flex items-center justify-between gap-2 mb-1.5 text-[10px] text-neutral-400 border-b border-neutral-800/60 pb-1">
                    <span className="font-mono text-orange-400 font-medium">
                      {AVAILABLE_MODELS.find((m) => m.id === message.modelUsed)?.name || message.modelUsed}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(message.id, message.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white flex items-center gap-1 cursor-pointer"
                      title="Copy message"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Content with basic formatted styling */}
                <div className="whitespace-pre-wrap break-words font-sans">
                  {message.content}
                </div>

                {/* Timestamp */}
                <div
                  className={`mt-1.5 text-[10px] font-mono ${
                    isUser ? 'text-orange-200/80 text-right' : 'text-neutral-500'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator Bubble */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-orange-400 border border-neutral-700">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl px-4 py-3 text-sm text-neutral-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-bounce"></span>
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs text-neutral-400 ml-1 font-mono">
                Vault AI is reasoning with {activeModelObj.name}...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Prompt Chips (when few messages) */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-4 sm:px-6 lg:px-8 py-2.5 border-t border-neutral-800/60 bg-neutral-950/70 shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="text-[11px] font-medium text-neutral-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-orange-400" />
              <span>Suggested questions:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_PROMPTS.map((prompt, idx) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt.text)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-orange-500/40 text-left text-xs text-neutral-300 hover:text-white transition-all cursor-pointer group"
                  >
                    <Icon className="h-4 w-4 text-orange-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="truncate">{prompt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Input Bar & Model Picker - Pill Shaped Unified Capsule */}
      <div className="p-3 sm:p-5 lg:px-8 border-t border-neutral-800/80 bg-neutral-950/95 shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* Unified Pill-shaped container wrapping input, model selector, and send button */}
          <div className="relative flex items-center gap-2 rounded-full border border-neutral-700/80 bg-neutral-900/90 pl-4 sm:pl-5 pr-2 py-1.5 shadow-2xl focus-within:border-orange-500/80 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all backdrop-blur-md">
            {/* Seamless input without internal border */}
            <input
              type="text"
              ref={inputRef}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Vault AI anything... (Press Enter to send)"
              className="flex-1 bg-transparent border-0 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-0 font-sans py-2"
            />

            {/* Model Selector Pill */}
            <div className="relative shrink-0" ref={modelMenuRef}>
              <button
                type="button"
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-700/70 bg-neutral-800/90 hover:bg-neutral-800 hover:border-neutral-600 text-xs text-neutral-200 transition-colors cursor-pointer whitespace-nowrap"
                title="Select Gemini AI Model"
              >
                <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                <span className="font-medium max-w-[100px] sm:max-w-[140px] truncate">{activeModelObj.name}</span>
                {activeModelObj.requiresUnlock && !isUnlocked && (
                  <Lock className="h-3 w-3 text-amber-400" />
                )}
                <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
              </button>

              {/* Model Menu Dropdown */}
              {isModelMenuOpen && (
                <div className="absolute bottom-full right-0 mb-3 w-80 sm:w-96 rounded-2xl border border-neutral-800 bg-neutral-950/98 p-3 shadow-2xl backdrop-blur-xl z-50 animate-fade-in divide-y divide-neutral-800/80">
                  <div className="pb-2.5">
                    <div className="flex items-center justify-between text-xs text-neutral-300 font-semibold mb-1">
                      <span>Choose Gemini Model</span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {isUnlocked ? 'All Unlocked' : 'Code Protected'}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-tight">
                      Flash Lite is free by default. Advanced models unlock with access code.
                    </p>
                  </div>

                  {/* Models List */}
                  <div className="py-2 space-y-1.5 max-h-60 overflow-y-auto">
                    {AVAILABLE_MODELS.map((m) => {
                      const isLocked = m.requiresUnlock && !isUnlocked;
                      const isSelected = selectedModel === m.id;

                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => handleSelectModel(m)}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-500/15 border border-orange-500/40 text-orange-300'
                              : isLocked
                              ? 'opacity-60 bg-neutral-900/40 hover:bg-neutral-900/70 text-neutral-400 border border-transparent'
                              : 'hover:bg-neutral-900 text-neutral-200 border border-transparent'
                          }`}
                        >
                          <div className="mt-0.5">
                            {isLocked ? (
                              <Lock className="h-4 w-4 text-amber-400 shrink-0" />
                            ) : isSelected ? (
                              <Check className="h-4 w-4 text-orange-400 shrink-0" />
                            ) : (
                              <Sparkles className="h-4 w-4 text-neutral-500 shrink-0" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-semibold truncate text-white">
                                {m.name}
                              </span>
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                                  m.isDefault
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                    : isLocked
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                                }`}
                              >
                                {m.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-0.5 line-clamp-2">
                              {m.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Inline Unlock Code Bar (Permanent for device once unlocked) */}
                  <div className="pt-2.5">
                    {isUnlocked ? (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span>Advanced models unlocked forever for this device!</span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleUnlockCodeSubmit} className="space-y-1.5">
                        <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          <span>Enter code to unlock advanced models:</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={passcodeInput}
                            onChange={(e) => setPasscodeInput(e.target.value)}
                            placeholder="Enter access code..."
                            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Unlock
                          </button>
                        </div>
                        {passcodeError && (
                          <div className="text-[11px] text-red-400 font-medium animate-pulse">
                            {passcodeError}
                          </div>
                        )}
                        {passcodeSuccess && (
                          <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            <span>Unlocked successfully!</span>
                          </div>
                        )}
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Circular Send Button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputPrompt.trim()}
              className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all cursor-pointer shadow-md shadow-orange-500/25 active:scale-95"
              title="Send message"
            >
              {isLoading ? (
                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
