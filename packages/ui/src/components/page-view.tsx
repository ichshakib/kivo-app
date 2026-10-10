'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Home,
  FileText,
  PanelLeft,
} from 'lucide-react';
import { PageItem, updatePageInApi } from '../lib/page-api';
import { TiptapEditor } from './tiptap-editor';
import { getPageIcon } from './page-tree';
import { AiSidebar } from './ai-sidebar';
import { AiAvatar } from './ai-avatar';
import { cn } from '../lib/utils';

export interface PageViewProps {
  page: PageItem | null;
  onPageUpdate?: (updatedPage: PageItem) => void;
  token?: string | null;
  isDark?: boolean;
  showHeader?: boolean;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function PageView({
  page,
  onPageUpdate,
  token,
  isDark = true,
  showHeader = true,
  isSidebarOpen = true,
  onToggleSidebar,
}: PageViewProps) {
  const [title, setTitle] = useState(page?.title || '');
  const [content, setContent] = useState(page?.content || '');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  // Sync state when incoming page changes
  useEffect(() => {
    if (page) {
      setTitle(page.title || '');
      setContent(page.content || '');
    }
  }, [page?.id]);

  // Debounced auto-save to Cloud Database (PostgreSQL) via API
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveUpdates = useCallback(
    (updates: Partial<PageItem>) => {
      if (!page?.id) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const updated = await updatePageInApi(page.id, updates, token);
          if (updated && onPageUpdate) {
            onPageUpdate(updated);
          }
        } catch (err) {
          console.error('[PageView] Failed to auto-save page to cloud:', err);
        }
      }, 600);
    },
    [page?.id, token, onPageUpdate]
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    saveUpdates({ title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    saveUpdates({ content: newContent });
  };

  if (!page) {
    return (
      <div className="flex-1 h-full min-h-0 flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="max-w-md space-y-3">
          <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
            <FileText className="size-6" />
          </div>
          <h2 className={cn('text-lg font-medium', isDark ? 'text-white' : 'text-gray-900')}>
            No page selected
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Select a page from the sidebar or click &ldquo;Add a page&rdquo; to start drafting your ideas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex-1 h-full min-h-0 flex flex-row overflow-hidden relative select-none transition-colors',
        isDark ? 'bg-[#191919] text-[#e0e0e0]' : 'bg-[#ffffff] text-[#1a1a1a]'
      )}
    >
      {/* Center Main Document Column (shrinks when right sidebar is open) */}
      <div className="flex-1 h-full min-h-0 flex flex-col overflow-hidden relative min-w-0">
        {/* 1. Top Clean Header (Only page name, no Private or right buttons) */}
      {showHeader && (
        <header
          className={cn(
            'h-10 px-4 flex items-center justify-between border-b shrink-0 z-20 backdrop-blur-sm select-none',
            isDark
              ? 'bg-[#191919]/90 border-white/[0.06] text-[#d4d4d4]'
              : 'bg-white/90 border-black/[0.06] text-[#37352f]'
          )}
        >
          {/* Left: Sidebar toggle if closed + Page Breadcrumb */}
          <div className="flex items-center gap-2 text-xs">
            {!isSidebarOpen && onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className={cn(
                  'p-1 rounded-md transition-colors cursor-pointer mr-0.5',
                  isDark
                    ? 'hover:bg-white/[0.08] text-[#9b9b9b] hover:text-white'
                    : 'hover:bg-black/[0.06] text-[#6b6966] hover:text-black'
                )}
                title="Open sidebar"
              >
                <PanelLeft className="size-4" />
              </button>
            )}
            {getPageIcon({ ...page, title }, 'size-3.5')}
            <span className={cn('text-xs font-medium truncate max-w-sm', isDark ? 'text-white/90' : 'text-gray-900')}>
              {title || 'Untitled'}
            </span>
          </div>

          {/* Right: Clean, no buttons */}
          <div className="flex items-center" />
        </header>
      )}

      {/* 2. Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Cover Banner (Aesthetic monochrome banner with "prioritise deen over dunya.") */}
        <div className="relative w-full h-48 sm:h-56 bg-gradient-to-br from-[#ebebe9] via-[#dcdcd8] to-[#c8c8c4] flex items-center justify-center select-none overflow-hidden">
          {/* Subtle radial ambient light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/70 via-transparent to-black/10" />

          {/* Left 4-point sparkle star */}
          <div className="absolute left-[12%] sm:left-[20%] top-1/2 -translate-y-1/2 text-black/80">
            <svg viewBox="0 0 24 24" className="size-8 sm:size-10 fill-current">
              <path d="M12 0 C12 7 17 12 24 12 C17 12 12 17 12 24 C12 17 7 12 0 12 C7 12 12 7 12 0 Z" />
            </svg>
          </div>

          {/* Center text in editorial serif typography */}
          <div className="relative text-center font-serif leading-tight tracking-tight text-[#1a1a1a]">
            <div className="text-3xl sm:text-4xl md:text-5xl font-normal">
              prioritise <span className="text-[#4e6752] italic font-medium">deen</span>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-normal">over dunya.</div>
          </div>

          {/* Right 4-point sparkle star */}
          <div className="absolute right-[12%] sm:right-[20%] top-1/2 -translate-y-1/2 text-black/80">
            <svg viewBox="0 0 24 24" className="size-8 sm:size-10 fill-current">
              <path d="M12 0 C12 7 17 12 24 12 C17 12 12 17 12 24 C12 17 7 12 0 12 C7 12 12 7 12 0 Z" />
            </svg>
          </div>
        </div>

        {/* Content Body Container - starts from the left instead of centered */}
        <div className="w-full max-w-4xl px-8 sm:px-14 pb-24">
          {/* 3. Overlapping Notion-Style Page Icon */}
          <div className="relative -mt-9 sm:-mt-11 mb-5 flex items-center">
            <div
              className={cn(
                'size-16 sm:size-18 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer',
                isDark
                  ? 'bg-[#202020] border-4 border-[#191919] text-white'
                  : 'bg-white border-4 border-white text-gray-900 shadow-md'
              )}
            >
              {page.icon === 'home' || !page.icon ? (
                <Home className="size-8 sm:size-9" />
              ) : (
                <FileText className="size-8 sm:size-9" />
              )}
            </div>
          </div>

          {/* 4. Document Title Input */}
          <div className="mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled"
              className={cn(
                'w-full font-serif text-3xl sm:text-4xl font-bold bg-transparent outline-none border-none p-0 tracking-tight leading-tight',
                isDark ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'
              )}
            />
          </div>

          {/* 5. Tiptap Rich-Text Editor (Starts directly below title, fills the whole page) */}
          <div className="flex-1 min-h-[calc(100vh-320px)] w-full pb-20">
            <TiptapEditor
              content={content}
              onChange={handleContentChange}
              placeholder="Press 'space' for AI or '/' for commands"
              isDark={isDark}
              token={token}
            />
          </div>
        </div>
      </div>

        {/* 3. Bottom-Right Floating Action Button (FAB) - with user's uploaded AI character avatar */}
        {!isRightSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsRightSidebarOpen(true)}
            className="absolute bottom-6 right-6 size-12 rounded-full bg-white shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer z-30 border border-black/10 group overflow-hidden p-1"
            title="Open AI Assistant"
          >
            <div className="size-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <AiAvatar className="size-full object-cover rounded-full transition-transform group-hover:scale-110" />
            </div>
          </button>
        )}
      </div>

      {/* 4. Resizable Right AI Sidebar (Takes full height and naturally shrinks document column) */}
      {isRightSidebarOpen && (
        <AiSidebar
          isDark={isDark}
          onClose={() => setIsRightSidebarOpen(false)}
          pageTitle={title}
          pageContent={content}
        />
      )}
    </div>
  );
}

export default PageView;
