'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { useAuth } from '@/lib/auth-context';
import { AlertCircle, CheckCircle2, Loader2, LogOut, User } from 'lucide-react';

export default function LoginPage() {
  const {
    user,
    isAuthenticated,
    isGoogleSigningIn,
    error,
    signInWithGoogle,
    signInWithDemoGoogle,
    signOut,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Continue with email:', email);
    }
  };

  const handleOAuth = (provider: string) => {
    if (provider === 'google') {
      signInWithGoogle();
      return;
    }
    console.log('OAuth provider:', provider);
  };

  const handleDemoSignIn = async () => {
    setIsDemoLoading(true);
    await signInWithDemoGoogle();
    setIsDemoLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px] flex flex-col items-center">
        {/* 1. Standalone Kivo Logo */}
        <div className="mb-6 flex items-center justify-center">
          <Logo size={48} className="text-foreground" isDark={undefined} />
        </div>

        {/* 2. Heading & Subtitle */}
        <h1 className="text-2xl font-bold tracking-tight text-center mb-1.5 text-foreground">
          {isAuthenticated ? 'Welcome back!' : 'Your AI workspace.'}
        </h1>
        <p className="text-sm text-center mb-6 font-normal text-muted-foreground">
          {isAuthenticated
            ? 'You are currently signed in to your Kivo account.'
            : 'Log in to your Kivo account'}
        </p>

        {/* Error Alert Banner */}
        {error && (
          <div className="w-full mb-6 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
            <button
              onClick={clearError}
              className="text-destructive/70 hover:text-destructive text-xs font-semibold underline ml-1 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* If Authenticated: Show Profile & Sign Out */}
        {isAuthenticated && user ? (
          <div className="w-full bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-4">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="size-14 rounded-full object-cover border-2 border-[#0085FF]"
                />
              ) : (
                <div className="size-14 rounded-full bg-[#0085FF] text-white flex items-center justify-center font-bold text-xl shadow-md">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-[#0085FF] font-medium mb-0.5">
                  <CheckCircle2 className="size-3.5" />
                  <span>Authenticated with Google</span>
                </div>
                <h2 className="text-base font-semibold text-foreground truncate">{user.name}</h2>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex flex-col gap-2.5">
              <Link
                href="/"
                className="w-full h-11 rounded-lg bg-[#0085FF] hover:bg-[#0073e6] active:bg-[#0062c4] text-white font-medium text-sm transition-all shadow-md shadow-blue-500/10 flex items-center justify-center"
              >
                Go to Workspace
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="w-full h-11 rounded-lg border border-border bg-card hover:bg-muted active:bg-muted/80 text-foreground font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 3. Form */}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-4">
                <label
                  htmlFor="email-input"
                  className="block text-[11px] font-bold mb-2 uppercase tracking-wider text-muted-foreground"
                >
                  Email
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your email address..."
                  required
                  className={`w-full h-11 px-3.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0085FF]/50 focus:border-[#0085FF] bg-card border text-foreground placeholder:text-muted-foreground/60 ${
                    isFocused ? 'border-[#0085FF]' : 'border-border'
                  }`}
                />
                <p className="text-xs mt-2 leading-relaxed text-muted-foreground/80">
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

            {/* 4. Divider */}
            <div className="relative w-full my-7 flex items-center justify-center">
              <div className="border-t w-full border-border" />
              <span className="px-3.5 text-xs absolute bg-background text-muted-foreground">
                or continue with
              </span>
            </div>

            {/* 5. OAuth & Auth Buttons Grid */}
            <div className="w-full space-y-2.5">
              {/* Row 1: Google, Apple, Microsoft */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* Google */}
                <button
                  type="button"
                  disabled={isGoogleSigningIn}
                  onClick={() => handleOAuth('google')}
                  className="flex flex-col items-center justify-center gap-2 py-3 px-3 rounded-xl border border-border bg-card hover:bg-muted active:scale-[0.98] transition-all cursor-pointer group shadow-sm text-foreground disabled:opacity-60"
                >
                  {isGoogleSigningIn ? (
                    <Loader2 className="size-5 animate-spin text-[#0085FF]" />
                  ) : (
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
                  )}
                  <span className="text-xs font-medium">
                    {isGoogleSigningIn ? 'Connecting...' : 'Google'}
                  </span>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  onClick={() => handleOAuth('apple')}
                  className="flex flex-col items-center justify-center gap-2 py-3 px-3 rounded-xl border border-border bg-card hover:bg-muted active:scale-[0.98] transition-all cursor-pointer group shadow-sm text-foreground"
                >
                  <svg className="size-5 fill-current text-foreground" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.59-7.79-11.72-14.25-6.25-9.8-11.08-20.73-14.48-32.8-3.4-12.07-5.1-23.36-5.1-33.87 0-14.25 3.69-26.04 11.08-35.37 7.39-9.33 16.59-14.12 27.6-14.38 4.8 0 10.33 1.25 16.59 3.75 6.26 2.5 10.35 3.8 12.27 3.89 1.57 0 5.86-1.39 12.87-4.17 7.01-2.78 12.82-3.95 17.43-3.5 13.04.88 23.34 5.92 30.89 15.12-11.45 6.94-17.06 16.51-16.83 28.71.22 9.58 3.96 17.65 11.22 24.21 7.26 6.56 15.93 10.23 26.02 11.01-2.01 6.18-4.63 12.56-7.87 19.14zM119.22 33.15c0-7.17 2.62-13.88 7.87-20.12 5.25-6.24 11.75-10.25 19.5-12.03.35 1.5.53 2.92.53 4.25 0 7.17-2.7 13.88-8.1 20.12-5.4 6.25-11.99 10.13-19.79 11.64-.02-1.32-.01-2.6-.01-3.86z" />
                  </svg>
                  <span className="text-xs font-medium">Apple</span>
                </button>

                {/* Microsoft */}
                <button
                  type="button"
                  onClick={() => handleOAuth('microsoft')}
                  className="flex flex-col items-center justify-center gap-2 py-3 px-3 rounded-xl border border-border bg-card hover:bg-muted active:scale-[0.98] transition-all cursor-pointer group shadow-sm text-foreground"
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
                  onClick={() => handleOAuth('passkey')}
                  className="flex flex-col items-center justify-center gap-2 py-3 px-3 rounded-xl border border-border bg-card hover:bg-muted active:scale-[0.98] transition-all cursor-pointer group shadow-sm text-foreground"
                >
                  <svg
                    className="size-5 stroke-current fill-none stroke-[1.75] text-foreground"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="9" cy="8" r="4" />
                    <path d="M17 11v6m0-3h3m-3 3h2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs font-medium">Passkey</span>
                </button>

                {/* SSO */}
                <button
                  type="button"
                  onClick={() => handleOAuth('sso')}
                  className="flex flex-col items-center justify-center gap-2 py-3 px-3 rounded-xl border border-border bg-card hover:bg-muted active:scale-[0.98] transition-all cursor-pointer group shadow-sm text-foreground"
                >
                  <svg
                    className="size-5 stroke-current fill-none stroke-[1.75] text-foreground"
                    viewBox="0 0 24 24"
                  >
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <path
                      d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-xs font-medium">SSO</span>
                </button>
              </div>

              {/* Quick Dev Demo Google Sign-In button for testing API backend logging */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isDemoLoading}
                  onClick={handleDemoSignIn}
                  className="w-full py-2 px-3 rounded-lg border border-dashed border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 text-[#0085FF] text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isDemoLoading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <User className="size-3.5" />
                  )}
                  <span>Test Web Google Auth (Sync &amp; Server Log)</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* 6. Footer Terms & Privacy */}
        <div className="mt-8 text-center text-xs text-muted-foreground leading-relaxed">
          By continuing, you acknowledge that you understand and agree to the{' '}
          <Link href="/privacy" className="underline hover:text-foreground transition-colors">
            Terms &amp; Conditions
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
