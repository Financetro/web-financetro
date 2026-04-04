import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Financetro - Modern Finance Tracking",
  description: "Advanced SaaS dashboard for personal finance tracking.",
};

import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/30`}
      >
        <AuthProvider>
          {children}
          <Toaster theme="dark" richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
