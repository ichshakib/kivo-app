import { useState, useEffect } from 'react';
import { Logo } from './components/logo';
import { PanelLeftClose, Inbox, SquarePen } from 'lucide-react';

export function App() {
  const [page, setPage] = useState<'login' | 'dashboard'>('login');
  const [email, setEmail] = useState('');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (matches: boolean) => {
      setIsDark(matches);
      document.documentElement.classList.toggle('dark', matches);
    };

    updateTheme(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      updateTheme(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Continue with email:', email);
    }
  };

  return (
    <div
      className={`min-h-screen selection:bg-blue-500/30 transition-colors duration-200 ${
        isDark
          ? 'bg-[#111111] text-[#ededed] selection:text-white'
          : 'bg-[#f8f9fa] text-[#1a1a1a] selection:text-blue-900'
      }`}
    >
      {page === 'dashboard' ? (
        /* Workspace Screen with Full-Height Left Sidebar & Right Main Content */
        <div className="h-screen w-screen flex flex-row overflow-hidden">
          {/* Full-Height Left Sidebar */}
          <aside
            className={`w-64 h-screen flex flex-col justify-between p-4 border-r select-none transition-colors ${
              isDark
                ? 'bg-[#141414] border-white/[0.08] text-[#ededed]'
                : 'bg-[#f0f2f5] border-gray-200 text-gray-800'
            }`}
          >
            <div className="flex flex-col">
              {/* Top Sidebar Header aligned with window titlebar */}
              <div
                className="h-9 -mx-4 -mt-4 px-3 flex items-center justify-between border-b flex-shrink-0 select-none transition-colors"
                style={
                  {
                    WebkitAppRegion: 'drag',
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  } as React.CSSProperties
                }
              >
                {/* Left: Logo & Toggle Sidebar */}
                <div
                  className="flex items-center gap-1.5"
                  style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                >
                  <button
                    type="button"
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      isDark
                        ? 'hover:bg-white/[0.08] text-white'
                        : 'hover:bg-gray-200 text-gray-800'
                    }`}
                    title="Kivo"
                  >
                    <Logo size={18} isDark={isDark} />
                  </button>
                  <button
                    type="button"
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      isDark
                        ? 'hover:bg-white/[0.08] text-[#9b9b9b] hover:text-white'
                        : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                    }`}
                    title="Toggle Sidebar"
                  >
                    <PanelLeftClose className="size-4" />
                  </button>
                </div>

                {/* Right: Inbox & New Note */}
                <div
                  className="flex items-center gap-1"
                  style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                >
                  <button
                    type="button"
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      isDark
                        ? 'hover:bg-white/[0.08] text-[#9b9b9b] hover:text-white'
                        : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                    }`}
                    title="Inbox"
                  >
                    <Inbox className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      isDark
                        ? 'hover:bg-white/[0.08] text-[#9b9b9b] hover:text-white'
                        : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                    }`}
                    title="New Note"
                  >
                    <SquarePen className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-inherit">
              <button
                type="button"
                onClick={() => setPage('login')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  isDark
                    ? 'hover:bg-white/[0.06] text-[#9b9b9b] hover:text-white'
                    : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>← Back to Login</span>
              </button>
            </div>
          </aside>

          {/* Right Main Column (Titlebar + Main Content) */}
          <div className="flex-1 h-screen flex flex-col overflow-hidden">
            {/* Native Window Titlebar Drag Region for Main Area */}
            <div
              className="h-9 w-full flex-shrink-0 select-none"
              style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
            />

            {/* Right Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-8 overflow-auto">
              <div className="text-center">
                <h1
                  className={`text-2xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Main Content
                </h1>
              </div>
            </main>
          </div>
        </div>
      ) : (
        /* Login Screen with Top Drag Bar */
        <div className="min-h-screen flex flex-col justify-between">
          {/* Native Window Titlebar Drag Region */}
          <div
            className="h-9 w-full flex-shrink-0 select-none"
            style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
          />

          {/* Login Main Content Area */}
          <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-[420px] flex flex-col items-center">
              {/* Standalone Kivo Logo */}
              <Logo size={46} isDark={isDark} className="mb-6" />

              {/* Heading & Subtitle */}
              <h1
                className={`text-2xl font-bold tracking-tight text-center mb-1.5 ${
                  isDark ? 'text-white' : 'text-[#111827]'
                }`}
              >
                Your AI workspace.
              </h1>
              <p
                className={`text-sm text-center mb-8 font-normal ${
                  isDark ? 'text-[#9b9b9b]' : 'text-[#6b7280]'
                }`}
              >
                Log in to your Kivo account
              </p>

              {/* Form */}
              <form onSubmit={handleContinue} className="w-full">
                <div className="mb-4">
                  <label
                    htmlFor="email-input"
                    className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${
                      isDark ? 'text-[#8b8b8b]' : 'text-[#6b7280]'
                    }`}
                  >
                    Email
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className={`w-full h-11 px-3.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0085FF]/50 focus:border-[#0085FF] ${
                      isDark
                        ? 'bg-[#222222]/80 border border-white/[0.12] text-white placeholder:text-[#666666]'
                        : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 shadow-sm'
                    }`}
                  />
                  <p
                    className={`text-xs mt-2 leading-relaxed ${
                      isDark ? 'text-[#707070]' : 'text-[#9ca3af]'
                    }`}
                  >
                    Use an organization email to easily collaborate with teammates
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-[#0085FF] hover:bg-[#0073e6] active:bg-[#0062c4] text-white font-medium text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center justify-center"
                >
                  Continue
                </button>
              </form>

              {/* Divider */}
              <div className="relative w-full my-7 flex items-center justify-center">
                <div
                  className={`border-t w-full ${
                    isDark ? 'border-white/[0.08]' : 'border-gray-200'
                  }`}
                />
                <span
                  className={`px-3.5 text-xs absolute ${
                    isDark ? 'bg-[#111111] text-[#6e6e6e]' : 'bg-[#f8f9fa] text-[#9ca3af]'
                  }`}
                >
                  or continue with
                </span>
              </div>

              {/* OAuth & Auth Buttons Grid */}
              <div className="w-full space-y-2.5">
                {/* Row 1: Google, Apple, Microsoft */}
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => setPage('dashboard')}
                    className={`flex flex-col items-center justify-center gap-2 py-3 px-3 rounded-xl border active:scale-[0.98] transition-all cursor-pointer group shadow-sm ${
                      isDark
                        ? 'bg-[#1c1c1c] border-white/[0.08] hover:bg-[#252525] hover:border-white/[0.16] text-[#d4d4d4] hover:text-white'
                        : 'bg-white border-gray-200/80 hover:bg-gray-50 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <svg className="size-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span className="text-xs font-medium">Google</span>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center gap-2 py-3 px-3 rounded-xl border active:scale-[0.98] transition-all cursor-pointer group shadow-sm ${
                      isDark
                        ? 'bg-[#1c1c1c] border-white/[0.08] hover:bg-[#252525] hover:border-white/[0.16] text-[#d4d4d4] hover:text-white'
                        : 'bg-white border-gray-200/80 hover:bg-gray-50 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <svg
                      className={`size-5 fill-current ${isDark ? 'text-white' : 'text-black'}`}
                      viewBox="0 0 170 170"
                    >
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.59-7.79-11.72-14.25-6.25-9.8-11.08-20.73-14.48-32.8-3.4-12.07-5.1-23.36-5.1-33.87 0-14.25 3.69-26.04 11.08-35.37 7.39-9.33 16.59-14.12 27.6-14.38 4.8 0 10.33 1.25 16.59 3.75 6.26 2.5 10.35 3.8 12.27 3.89 1.57 0 5.86-1.39 12.87-4.17 7.01-2.78 12.82-3.95 17.43-3.5 13.04.88 23.34 5.92 30.89 15.12-11.45 6.94-17.06 16.51-16.83 28.71.22 9.58 3.96 17.65 11.22 24.21 7.26 6.56 15.93 10.23 26.02 11.01-2.01 6.18-4.63 12.56-7.87 19.14zM119.22 33.15c0-7.17 2.62-13.88 7.87-20.12 5.25-6.24 11.75-10.25 19.5-12.03.35 1.5.53 2.92.53 4.25 0 7.17-2.7 13.88-8.1 20.12-5.4 6.25-11.99 10.13-19.79 11.64-.02-1.32-.01-2.6-.01-3.86z" />
                    </svg>
                    <span className="text-xs font-medium">Apple</span>
                  </button>

                  {/* Microsoft */}
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center gap-2 py-3 px-3 rounded-xl border active:scale-[0.98] transition-all cursor-pointer group shadow-sm ${
                      isDark
                        ? 'bg-[#1c1c1c] border-white/[0.08] hover:bg-[#252525] hover:border-white/[0.16] text-[#d4d4d4] hover:text-white'
                        : 'bg-white border-gray-200/80 hover:bg-gray-50 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <svg className="size-5" viewBox="0 0 23 23">
                      <path fill="#f25022" d="M1 1h10v10H1z" />
                      <path fill="#00a4ef" d="M1 12h10v10H1z" />
                      <path fill="#7fba00" d="M12 1h10v10H12z" />
                      <path fill="#ffb900" d="M12 12h10v10H12z" />
                    </svg>
                    <span className="text-xs font-medium">Microsoft</span>
                  </button>
                </div>

                {/* Row 2: Passkey & SSO */}
                <div className="grid grid-cols-2 gap-2.5 max-w-[280px] mx-auto">
                  {/* Passkey */}
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center gap-2 py-3 px-3 rounded-xl border active:scale-[0.98] transition-all cursor-pointer group shadow-sm ${
                      isDark
                        ? 'bg-[#1c1c1c] border-white/[0.08] hover:bg-[#252525] hover:border-white/[0.16] text-[#d4d4d4] hover:text-white'
                        : 'bg-white border-gray-200/80 hover:bg-gray-50 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <svg
                      className={`size-5 stroke-current fill-none stroke-[1.75] ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <circle cx="9" cy="8" r="4" />
                      <path
                        d="M17 11v6m0-3h3m-3 3h2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-xs font-medium">Passkey</span>
                  </button>

                  {/* SSO */}
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center gap-2 py-3 px-3 rounded-xl border active:scale-[0.98] transition-all cursor-pointer group shadow-sm ${
                      isDark
                        ? 'bg-[#1c1c1c] border-white/[0.08] hover:bg-[#252525] hover:border-white/[0.16] text-[#d4d4d4] hover:text-white'
                        : 'bg-white border-gray-200/80 hover:bg-gray-50 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <svg
                      className={`size-5 stroke-current fill-none stroke-[1.75] ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <rect x="4" y="2" width="16" height="20" rx="2" strokeLinecap="round" />
                      <path
                        d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-xs font-medium">SSO</span>
                  </button>
                </div>
              </div>

              {/* Footer Disclaimer */}
              <p
                className={`text-center text-xs mt-8 leading-relaxed max-w-xs ${
                  isDark ? 'text-[#666666]' : 'text-gray-500'
                }`}
              >
                By continuing, you acknowledge that you understand and agree to the{' '}
                <a
                  href="#"
                  className={`underline transition-colors ${
                    isDark ? 'text-[#888888] hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Terms &amp; Conditions
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className={`underline transition-colors ${
                    isDark ? 'text-[#888888] hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
