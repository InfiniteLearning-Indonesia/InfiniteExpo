import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/context/AuthContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InfiniteExpo - Infinite Learning Capstone Exhibition",
  description: "Discover innovative capstone projects built by talented mentees from Infinite Learning Indonesia. Where ideas come to life.",
  keywords: ["Infinite Learning", "Exhibition", "Capstone Project", "Web Development", "AI", "Mobile Dev", "Game Dev"],
  authors: [{ name: "Infinite Learning Indonesia" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
