import type React from "react"
import type { Metadata } from "next"
// import { Inter } from "next/font/google"
import './globals.css';
import { ThemeProvider } from "../components/theme-provider"
import { SessionProvider } from "next-auth/react";

// const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: " Moteregna Admin Dashboard"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {/* <SessionProvider> */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        {/* </SessionProvider> */}
      </body>
    </html>
  )
}



