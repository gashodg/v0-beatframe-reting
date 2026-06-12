import type { Metadata } from "next"
import { Barlow, Barlow_Semi_Condensed, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { CartProvider } from "@/components/cart/cart-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
})

const barlowSemiCondensed = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow-semi-condensed",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BeatFrame — Renting audiovisual para streaming y directos | Barcelona",
  description:
    "Alquiler de equipos audiovisuales para streaming y realización en directo en la industria musical. Cámaras, lentes, mixers, luces y más en Barcelona.",
  generator: "v0.app",
  keywords: [
    "renting audiovisual",
    "alquiler cámaras Barcelona",
    "streaming musical",
    "realización en directo",
    "BeatFrame",
    "mixer de video",
    "transmisión inalámbrica HDMI",
  ],
  openGraph: {
    title: "BeatFrame — Audiovisual Studio",
    description: "Renting de equipos audiovisuales para streaming y directos musicales en Barcelona.",
    type: "website",
    locale: "es_ES",
  },
}

export const viewport = {
  themeColor: "#0a0a0a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${barlow.variable} ${barlowSemiCondensed.variable} ${jetbrainsMono.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Suspense fallback={null}>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </Suspense>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
