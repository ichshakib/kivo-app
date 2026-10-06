import { Inter, DM_Sans } from 'next/font/google';
import type { Metadata } from 'next';

import { Footer } from '@/components/blocks/footer';
import { Navbar } from '@/components/blocks/navbar';
import { StyleGlideProvider } from '@/components/styleglide-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kivo.app'),
  title: {
    default: 'Kivo - Modern Document & Workspace Ecosystem',
    template: '%s | Kivo',
  },
  description: 'A modern workspace template built with shadcn/ui, Tailwind & Next.js.',
  icons: {
    icon: [{ url: '/favicon/favicon.ico' }, { url: '/favicon/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    title: 'Kivo - Modern Document & Workspace Ecosystem',
    description: 'A modern workspace template built with shadcn/ui, Tailwind & Next.js.',
    siteName: 'Kivo',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kivo - Modern Document & Workspace Ecosystem',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <StyleGlideProvider />
            <Navbar />
            <main className="">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
