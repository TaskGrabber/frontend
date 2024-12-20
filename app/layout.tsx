import Loading from '@/app/loading'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Suspense } from 'react'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Task Grabber',
  description: 'Task Grabber',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${poppins.className} antialiased`}>
        <Suspense fallback={<Loading />}>
          <Toaster />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader
              color="#2299DD"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #2299DD,0 0 5px #2299DD"
              template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
              zIndex={1600}
              showAtBottom={false}
            />
            {children}
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
