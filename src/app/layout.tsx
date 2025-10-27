import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { LanguageProvider } from "@/context/language-context";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { Playfair_Display, PT_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  weight: "700",
});

const ptSans = PT_Sans({
  subsets: ["latin"],
  variable: "--font-pt-sans",
  weight: ["400", "700"],
});


export const metadata: Metadata = {
  title: "Avis Explorer",
  description: "Identify birds by photo, song, or description.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-body antialiased",
          playfairDisplay.variable,
          ptSans.variable
        )}
      >
        <FirebaseClientProvider>
          <LanguageProvider>
            <div className="background-container">
              <div className="background-overlay"></div>
              <Header />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
