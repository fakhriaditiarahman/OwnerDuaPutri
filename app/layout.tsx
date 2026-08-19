import { Geist_Mono, Public_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppNav } from "@/components/app-nav"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Owner Management",
  description: "Aplikasi manajemen harga modal barang untuk owner",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", publicSans.variable)}
    >
      <body>
        <ThemeProvider>
          <AppNav />
          <div className="md:pl-60">
            <main className="min-h-svh px-4 pb-24 pt-6 md:px-8 md:pb-10 md:pt-8">
              <div className="mx-auto w-full max-w-6xl">{children}</div>
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}