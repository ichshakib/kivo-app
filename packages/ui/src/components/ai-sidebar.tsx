'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronsRight,
  MoreHorizontal,
  MessageSquarePlus,
  PanelRight,
  AlignLeft,
  Languages,
  Sparkles,
  CheckCircle2,
  ArrowUp,
  ArrowUpCircle,
  Plus,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AiAvatar } from './ai-avatar';

export interface AiSidebarProps {
  isDark?: boolean;
  onClose: () => void;
  pageTitle?: string;
  pageContent?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Hand-drawn face sketch avatar matching Notion AI logo in the provided design
 */
export function AiSidebar({
  isDark = true,
  onClose,
  pageTitle = 'Home',
  pageContent: _pageContent = '',
}: AiSidebarProps) {
  const [width, setWidth] = useState<number>(272);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Restore saved width
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kivo_ai_sidebar_width');
      if (saved) {
        const parsed = parseInt(saved, 10);
        const max = typeof window !== 'undefined' ? Math.floor(window.innerWidth * 0.40) : 500;
        if (!isNaN(parsed) && parsed >= 272 && parsed <= max) {
          setWidth(parsed);
        }
      }
    } catch {}
  }, []);

  // Left-edge Resizer logic
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const min = 272;
      const max = Math.floor(window.innerWidth * 0.40);
      const delta = startX - moveEvent.clientX; // Dragging left increases width
      const clamped = Math.max(min, Math.min(startWidth + delta, max));
      setWidth(clamped);
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      const min = 272;
      const max = Math.floor(window.innerWidth * 0.40);
      const delta = startX - upEvent.clientX;
      const finalWidth = Math.max(min, Math.min(startWidth + delta, max));
      try {
        localStorage.setItem('kivo_ai_sidebar_width', String(finalWidth));
      } catch {}
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const resetWidth = () => {
    setWidth(272);
    try {
      localStorage.setItem('kivo_ai_sidebar_width', '272');
    } catch {}
  };

  const handleSendMessage = (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: prompt,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Generate response based on prompt
    setTimeout(() => {
      let reply = `Here's what I found for **"${prompt}"** in *${pageTitle || 'this page'}*:\n\n`;

      if (prompt.toLowerCase().includes('summarize')) {
        reply = `### Summary of ${pageTitle || 'Page'}\n\n` +
          `• **Core Focus**: Clear structure and organized workspace documentation.\n` +
          `• **Key Takeaway**: Keep concepts prioritized and actionable.\n` +
          `• **Status**: Active cloud document.`;
      } else if (prompt.toLowerCase().includes('translate')) {
        reply = `### Translation: ${pageTitle || 'Page'}\n\n` +
          `Here is the translated essence into Spanish / French / Arabic:\n\n` +
          `*Priorizar el propósito sobre lo efímero.*`;
      } else if (prompt.toLowerCase().includes('task') || prompt.toLowerCase().includes('tracker')) {
        reply = `### Suggested Action Items:\n\n` +
          `1. [ ] Outline milestone deliverables for ${pageTitle || 'project'}.\n` +
          `2. [ ] Review references and key notes.\n` +
          `3. [ ] Set next review deadline.`;
      } else if (prompt.toLowerCase().includes('insight')) {
        reply = `### Insights for ${pageTitle || 'this document'}:\n\n` +
          `The page is concise and well-framed. Consider expanding on project dependencies and next steps for team alignment.`;
      } else {
        reply += `I'm your workspace AI assistant. How would you like me to develop or format this further?`;
      }

      const assistantMsg: Message = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: reply,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 450);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleStartNewChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <aside
      style={{ width: `${width}px` }}
      className={cn(
        'h-full flex flex-col justify-between select-none relative shrink-0 border-l z-30 transition-[width] duration-150',
        isResizing ? 'transition-none select-none' : '',
        isDark
          ? 'bg-[#191919] border-white/[0.08] text-[#ededed]'
          : 'bg-[#ffffff] border-black/[0.08] text-[#1a1a1a]'
      )}
    >
      {/* 1. Left Resize Handle */}
      <div
        onMouseDown={startResizing}
        onDoubleClick={resetWidth}
        className="absolute top-0 left-0 w-1.5 h-full cursor-col-resize z-40"
        title="Drag to resize AI sidebar (double-click to reset)"
      />

      {/* 2. Top Header Bar */}
      <div
        className={cn(
          'h-11 px-3.5 flex items-center justify-between border-b shrink-0',
          isDark ? 'border-white/[0.06] bg-[#191919]' : 'border-black/[0.06] bg-white'
        )}
      >
        {/* Left: Avatar + "New AI chat" + dropdown arrow */}
        <button
          type="button"
          onClick={handleStartNewChat}
          className={cn(
            'flex items-center gap-2 p-1 -ml-1 rounded-lg transition-colors cursor-pointer group',
            isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.05]'
          )}
        >
          <div className="size-6 rounded-full flex items-center justify-center overflow-hidden bg-white border border-black/10 shrink-0">
            <AiAvatar className="size-full object-cover" />
          </div>
          <span className="text-xs font-semibold tracking-tight">New AI chat</span>
          <ChevronDown className="size-3 text-[#888888] group-hover:text-current transition-colors" />
        </button>

        {/* Right Action Icons: New Chat, Panel, More, and Collapse (>>) */}
        <div className="flex items-center gap-1 text-[#888888]">
          <button
            type="button"
            onClick={handleStartNewChat}
            className={cn(
              'p-1.5 rounded-md transition-colors cursor-pointer',
              isDark ? 'hover:bg-white/[0.08] hover:text-white' : 'hover:bg-black/[0.06] hover:text-black'
            )}
            title="Start new chat"
          >
            <MessageSquarePlus className="size-4" />
          </button>

          <button
            type="button"
            className={cn(
              'p-1.5 rounded-md transition-colors cursor-pointer',
              isDark ? 'hover:bg-white/[0.08] hover:text-white' : 'hover:bg-black/[0.06] hover:text-black'
            )}
            title="Sidebar view"
          >
            <PanelRight className="size-4" />
          </button>

          <button
            type="button"
            className={cn(
              'p-1.5 rounded-md transition-colors cursor-pointer',
              isDark ? 'hover:bg-white/[0.08] hover:text-white' : 'hover:bg-black/[0.06] hover:text-black'
            )}
            title="More actions"
          >
            <MoreHorizontal className="size-4" />
          </button>

          {/* >> Collapse Button (closes the right sidebar) */}
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-1.5 rounded-md transition-colors cursor-pointer text-[#888888]',
              isDark ? 'hover:bg-white/[0.08] hover:text-white' : 'hover:bg-black/[0.06] hover:text-black'
            )}
            title="Close sidebar (>>)"
          >
            <ChevronsRight className="size-4.5" />
          </button>
        </div>
      </div>

      {/* 3. Middle Content Area (Initial Suggestions OR Message Stream) */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col justify-end">
        {messages.length === 0 ? (
          /* Empty / Initial state matching image */
          <div className="space-y-6 pb-2">
            {/* Notion AI Avatar badge in center */}
            <div className="flex flex-col items-start">
              <div className="size-16 rounded-full flex items-center justify-center overflow-hidden mb-3 shadow-sm bg-white border border-black/10">
                <AiAvatar className="size-full object-cover" />
              </div>

              {/* Bold Title */}
              <h2 className="text-xl font-bold tracking-tight text-white mb-2">
                How can I help you today?
              </h2>
            </div>

            {/* Suggested Action Buttons List */}
            <div className="space-y-1">
              {/* Option 1: Summarize */}
              <button
                type="button"
                onClick={() => handleSendMessage('Summarize this page')}
                className={cn(
                  'w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-normal transition-colors text-left cursor-pointer',
                  isDark
                    ? 'text-[#d4d4d4] hover:bg-white/[0.06] hover:text-white'
                    : 'text-[#333333] hover:bg-black/[0.05] hover:text-black'
                )}
              >
                <AlignLeft className="size-4.5 text-[#9b9b9b] shrink-0" />
                <span className="truncate">Summarize this page</span>
              </button>

              {/* Option 2: Translate */}
              <button
                type="button"
                onClick={() => handleSendMessage('Translate this page')}
                className={cn(
                  'w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-normal transition-colors text-left cursor-pointer',
                  isDark
                    ? 'text-[#d4d4d4] hover:bg-white/[0.06] hover:text-white'
                    : 'text-[#333333] hover:bg-black/[0.05] hover:text-black'
                )}
              >
                <Languages className="size-4.5 text-[#9b9b9b] shrink-0" />
                <span className="truncate">Translate this page</span>
              </button>

              {/* Option 3: Analyze insights */}
              <button
                type="button"
                onClick={() => handleSendMessage('Analyze for insights')}
                className={cn(
                  'w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-normal transition-colors text-left cursor-pointer',
                  isDark
                    ? 'text-[#d4d4d4] hover:bg-white/[0.06] hover:text-white'
                    : 'text-[#333333] hover:bg-black/[0.05] hover:text-black'
                )}
              >
                <Sparkles className="size-4.5 text-[#9b9b9b] shrink-0" />
                <span className="truncate">Analyze for insights</span>
              </button>

              {/* Option 4: Create task tracker */}
              <button
                type="button"
                onClick={() => handleSendMessage('Create a task tracker')}
                className={cn(
                  'w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-normal transition-colors text-left cursor-pointer',
                  isDark
                    ? 'text-[#d4d4d4] hover:bg-white/[0.06] hover:text-white'
                    : 'text-[#333333] hover:bg-black/[0.05] hover:text-black'
                )}
              >
                <CheckCircle2 className="size-4.5 text-[#9b9b9b] shrink-0" />
                <span className="truncate">Create a task tracker</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Chat Message Stream */
          <div className="space-y-4 pb-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex flex-col text-xs leading-relaxed',
                  m.role === 'user' ? 'items-end' : 'items-start'
                )}
              >
                {m.role === 'user' ? (
                  <div
                    className={cn(
                      'px-3.5 py-2 rounded-2xl max-w-[85%] text-xs',
                      isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
                    )}
                  >
                    {m.content}
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 max-w-full">
                    <div className="size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 overflow-hidden bg-white border border-black/10">
                      <AiAvatar className="size-full object-cover" />
                    </div>
                    <div
                      className={cn(
                        'flex-1 text-xs whitespace-pre-wrap leading-relaxed',
                        isDark ? 'text-[#d4d4d4]' : 'text-[#2e2e2e]'
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#8e8e8e]">
                <Loader2 className="size-3.5 animate-spin text-[#0085FF]" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 4. Bottom Input Area matching design */}
      <div className="p-3 pt-0 shrink-0 select-none">
        {/* Blue Quota / Pro Notice Callout */}
        <div
          className={cn(
            'px-3 py-2 rounded-t-xl text-xs flex items-center gap-2 border border-b-0 leading-tight',
            isDark
              ? 'bg-[#182638] border-[#223956] text-[#90bbf0]'
              : 'bg-[#e8f2fc] border-[#cfe2f8] text-[#1d6fc2]'
          )}
        >
          <ArrowUpCircle className="size-4 shrink-0 text-[#3b82f6]" />
          <span className="truncate">
            You&apos;ve run out of free AI responses.{' '}
            <span className="font-semibold underline cursor-pointer hover:opacity-80">
              Upgrade Notion AI
            </span>
            .
          </span>
        </div>

        {/* Input Card Container */}
        <div
          className={cn(
            'p-2.5 rounded-b-xl border flex flex-col gap-2 shadow-sm',
            isDark
              ? 'bg-[#202020] border-white/[0.08] text-white'
              : 'bg-[#f7f7f5] border-black/[0.08] text-black'
          )}
        >
          {/* Text Input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask Notion AI"
            rows={2}
            className="w-full bg-transparent border-none outline-none text-xs sm:text-[13px] placeholder-[#6e6e6e] resize-none leading-relaxed"
          />

          {/* Bottom Card Toolbar: (+) (Shield) ... (Auto) (Submit) */}
          <div className="flex items-center justify-between pt-1">
            {/* Left Icons */}
            <div className="flex items-center gap-1.5 text-[#888888]">
              <button
                type="button"
                className={cn(
                  'p-1 rounded-md transition-colors cursor-pointer',
                  isDark ? 'hover:bg-white/[0.08] hover:text-white' : 'hover:bg-black/[0.06] hover:text-black'
                )}
                title="Add context or file"
              >
                <Plus className="size-3.5" />
              </button>
              <button
                type="button"
                className={cn(
                  'p-1 rounded-md transition-colors cursor-pointer',
                  isDark ? 'hover:bg-white/[0.08] hover:text-white' : 'hover:bg-black/[0.06] hover:text-black'
                )}
                title="Private & Secure AI"
              >
                <ShieldCheck className="size-3.5" />
              </button>
            </div>

            {/* Right: Model Pill + Submit Arrow Button */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-[11px] font-medium px-2 py-0.5 rounded-md cursor-pointer transition-colors',
                  isDark
                    ? 'text-[#888888] hover:text-white hover:bg-white/[0.06]'
                    : 'text-[#666666] hover:text-black hover:bg-black/[0.05]'
                )}
                title="AI Model Selection"
              >
                Auto
              </span>

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!input.trim()}
                className={cn(
                  'size-6 rounded-full flex items-center justify-center transition-all cursor-pointer',
                  input.trim()
                    ? isDark
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-black text-white hover:bg-gray-800'
                    : isDark
                      ? 'bg-white/10 text-[#666666] cursor-not-allowed'
                      : 'bg-black/10 text-[#999999] cursor-not-allowed'
                )}
                title="Send message"
              >
                <ArrowUp className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AiSidebar;
