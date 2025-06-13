import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/ui/Header'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: 'Stunning Dartboard',
  description: 'Scorekeeping for all your darts games',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}> 
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
