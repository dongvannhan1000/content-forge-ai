import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { SettingsProvider } from '@/contexts/settings-context'
import { ArticlesProvider } from '@/contexts/articles-context'
import { JobProvider } from '@/contexts/job-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ContentForge AI',
  description: 'Generate, schedule, and manage AI-powered content',
  generator: 'v0.app',
  icons: {
    icon: '/contentforge-icon.png',
    apple: '/contentforge-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <SettingsProvider>
              <ArticlesProvider>
                <JobProvider>
                  {children}
                </JobProvider>
              </ArticlesProvider>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
