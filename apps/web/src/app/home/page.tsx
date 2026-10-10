'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  PanelLeft,
  Loader2,
  Sparkles,
  Plus,
  FileText,
  Home,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Logo } from '@/components/logo';
import { WebSidebar } from '@/components/sidebar';
import { useAuth } from '@/lib/auth-context';
import { PageView } from '@repo/ui/components/page-view';
import {
  PageItem,
  fetchPagesFromApi,
  createPageInApi,
  deletePageFromApi,
  findPageById,
  insertPageInTree,
  updatePageInTree,
  deletePageFromTree,
} from '@repo/ui/lib/page-api';

export default function WebHomePage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, signOut } = useAuth();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<string>('home');

  // Real pages loaded from PostgreSQL API (Zero dummy data)
  const [pages, setPages] = useState<PageItem[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isLoadingPages, setIsLoadingPages] = useState<boolean>(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if user is not authenticated once auth finishes checking
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch real cloud pages on mount or auth change
  const loadPages = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingPages(true);
    try {
      const data = await fetchPagesFromApi(token);
      setPages(data);
      if (data.length > 0 && data[0]) {
        setSelectedPageId((prev) => prev || data[0]!.id);
      }
    } catch (err) {
      console.error('[Web] Failed to fetch pages from cloud:', err);
    } finally {
      setIsLoadingPages(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (isAuthenticated) {
      loadPages();
    }
  }, [isAuthenticated, loadPages]);

  // Create page in cloud database
  const handleCreatePage = useCallback(
    async (parentId?: string | null) => {
      try {
        const created = await createPageInApi(
          {
            title: 'Untitled',
            parentId: parentId || null,
            icon: parentId ? 'file' : 'home',
            quote: 'If you can dream it, you can do it.',
            content: '',
          },
          token
        );
        if (created) {
          setPages((prev) => insertPageInTree(prev, created, parentId));
          setSelectedPageId(created.id);
          setActiveItem(created.id);
        }
      } catch (err) {
        console.error('[Web] Failed to create page:', err);
      }
    },
    [token]
  );

  // Delete page from cloud database
  const handleDeletePage = useCallback(
    async (id: string) => {
      try {
        const ok = await deletePageFromApi(id, token);
        if (ok) {
          setPages((prev) => {
            const next = deletePageFromTree(prev, id);
            if (selectedPageId === id) {
              const fallback = next.length > 0 && next[0] ? next[0].id : null;
              setSelectedPageId(fallback);
              setActiveItem(fallback || 'home');
            }
            return next;
          });
        }
      } catch (err) {
        console.error('[Web] Failed to delete page:', err);
      }
    },
    [token, selectedPageId]
  );

  // Update page in local tree when changed in PageView
  const handlePageUpdate = useCallback((updatedPage: PageItem) => {
    setPages((prev) => updatePageInTree(prev, updatedPage.id, updatedPage));
  }, []);

  const handleSelectPage = useCallback((page: PageItem) => {
    setSelectedPageId(page.id);
    setActiveItem(page.id);
  }, []);

  const handleSelectItem = useCallback(
    (item: string) => {
      if (item === 'chat') {
        setActiveItem('chat');
      } else {
        if (selectedPageId) {
          setActiveItem(selectedPageId);
        } else if (pages.length > 0 && pages[0]) {
          setSelectedPageId(pages[0].id);
          setActiveItem(pages[0].id);
        } else {
          setActiveItem('home');
        }
      }
    },
    [pages, selectedPageId]
  );

  const isDark = mounted ? resolvedTheme === 'dark' : true;
  const selectedPage = selectedPageId ? findPageById(pages, selectedPageId) : null;

  if (isLoading || !isAuthenticated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#191919] text-[#ededed]">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <Logo size={42} isDark={true} />
          <div className="flex items-center gap-2.5 text-sm text-[#9b9b9b]">
            <Loader2 className="size-4 animate-spin text-[#0085FF]" />
            <span>Loading workspace...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen w-screen flex flex-row overflow-hidden select-none transition-colors duration-150 ${
        isDark
          ? 'bg-[#191919] text-[#ededed] selection:bg-blue-500/30 selection:text-white'
          : 'bg-[#ffffff] text-[#1a1a1a] selection:bg-blue-500/20 selection:text-blue-900'
      }`}
    >
      {/* Notion-style Left Sidebar */}
      {isSidebarOpen && (
        <WebSidebar
          user={user}
          onToggleSidebar={() => setIsSidebarOpen(false)}
          activeItem={activeItem}
          onSelectItem={handleSelectItem}
          onSignOut={() => signOut()}
          pages={pages}
          selectedPageId={selectedPageId}
          onSelectPage={handleSelectPage}
          onCreatePage={handleCreatePage}
          onDeletePage={handleDeletePage}
        />
      )}

      {/* Right Column */}
      <div className="flex-1 h-screen flex flex-col overflow-hidden relative">
        {/* Top header when on Chat or empty state */}
        {(activeItem === 'chat' || !selectedPage) && (
          <div
            className={`h-10 px-4 flex items-center justify-between border-b shrink-0 select-none ${
              isDark ? 'border-white/[0.06] bg-[#191919]' : 'border-black/[0.06] bg-[#ffffff]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs">
              {!isSidebarOpen && (
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className={`p-1 rounded-md transition-colors cursor-pointer mr-0.5 ${
                    isDark
                      ? 'hover:bg-white/[0.08] text-[#9b9b9b] hover:text-white'
                      : 'hover:bg-black/[0.06] text-[#6b6966] hover:text-black'
                  }`}
                  title="Open sidebar"
                >
                  <PanelLeft className="size-4" />
                </button>
              )}
              {activeItem === 'chat' ? (
                <Sparkles className="size-3.5 text-violet-400 shrink-0" />
              ) : (
                <Home className="size-3.5 text-gray-400 shrink-0" />
              )}
              <span className="font-medium text-xs">
                {activeItem === 'chat' ? 'Chat' : 'Home'}
              </span>
            </div>
          </div>
        )}

        {/* Content View Switching */}
        {activeItem === 'chat' ? (
          /* Chat & AI Assistant View */
          <div
            className={`flex-1 h-full flex flex-col items-center justify-center p-8 text-center select-none ${
              isDark ? 'bg-[#191919]' : 'bg-[#ffffff]'
            }`}
          >
            <div className="max-w-md space-y-4">
              <div className="size-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto text-violet-400">
                <Sparkles className="size-7" />
              </div>
              <h2 className="text-xl font-semibold">Gemini AI Assistant</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Chat, summarize your workspace pages, brainstorm new content, and ask questions about your documents in real-time.
              </p>
            </div>
          </div>
        ) : selectedPage ? (
          /* Real Page with Tiptap Editor & Cover Banner matching user screenshot */
          <PageView
            page={selectedPage}
            onPageUpdate={handlePageUpdate}
            token={token}
            isDark={isDark}
            showHeader={true}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />
        ) : isLoadingPages ? (
          /* Loading State */
          <div className="flex-1 h-screen flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-[#0085FF]" />
          </div>
        ) : (
          /* Zero Dummy Data - Clean Empty State */
          <div
            className={`flex-1 h-screen flex flex-col items-center justify-center p-8 text-center select-none ${
              isDark ? 'bg-[#191919]' : 'bg-[#ffffff]'
            }`}
          >
            <div className="max-w-md space-y-4">
              <div
                className={`size-14 rounded-2xl flex items-center justify-center mx-auto ${
                  isDark ? 'bg-white/5 border border-white/10 text-gray-400' : 'bg-black/5 border border-black/10 text-gray-600'
                }`}
              >
                <FileText className="size-7" />
              </div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                No pages yet
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your workspace is fresh and clean. Click below to add your first cloud page.
              </p>
              <button
                type="button"
                onClick={() => handleCreatePage(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-medium text-xs shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Add a page</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
