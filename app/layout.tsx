import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jb-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seguridad Avanzada | Donde los profesionales encuentran soluciones",
  description:
    "Videovigilancia, control de acceso y redes. Cámaras IP, DVR, NVR, las mejores marcas. Entregas en CDMX y todo México.",
};

/** Mobile-first: mayor tráfico en celulares. docs/design-mobile-first.md */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <Providers>
          <Suspense fallback={<header className="h-[180px] w-full bg-primary-nav" aria-hidden />}>
            <Header />
          </Suspense>
          <AnnouncementBanner />
          <div className="min-h-[60vh]">
            <main id="main-content" className="min-w-0 flex-1 px-4 py-4 sm:px-4 lg:px-6 lg:py-6" tabIndex={-1}>
              {children}
            </main>
          </div>
          <Footer />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
