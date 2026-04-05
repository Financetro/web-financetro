"use client";

import Link from "next/link";
import { Command, ChevronLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CMSContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isAppMode = searchParams.get("mode") === "app";

  return (
    <div className="flex flex-col min-h-screen bg-[#06080C] text-white selection:bg-primary/30 font-sans relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen opacity-50" />
      </div>

      {!isAppMode && (
        <header className="px-6 lg:px-12 h-24 flex items-center border-b border-white/5 backdrop-blur-2xl sticky top-0 z-50 bg-[#06080C]/70">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mr-8 font-medium">
            <ChevronLeft className="w-5 h-5" /> Home
          </Link>
          <Link className="flex items-center gap-3 group mx-auto absolute left-1/2 -translate-x-1/2" href="/">
            <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:border-primary/30 transition-colors">
              <Command className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Financetro
            </span>
          </Link>
        </header>
      )}

      <main className={`flex-1 relative z-10 container mx-auto px-4 ${isAppMode ? 'py-6' : 'py-20'} max-w-4xl`}>
        <div className="glass p-8 md:p-16 rounded-[2rem] border border-white/5 bg-[#0B0F14]/80 relative overflow-hidden backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>

      {!isAppMode && (
        <footer className="py-10 border-t border-white/5 bg-[#06080C] text-center text-white/40 text-sm">
          © {new Date().getFullYear()} Financetro Labs. All rights reserved.
        </footer>
      )}
    </div>
  );
}

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06080C]" />}>
      <CMSContent>{children}</CMSContent>
    </Suspense>
  );
}
