"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useSidebarStore } from "@/store/sidebarStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthStore();
  const { isCollapsed } = useSidebarStore();
  const { fetchRates } = useCurrencyStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchRates();
    }
  }, [user, fetchRates]);

  if (loading || !user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Verifying credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-500 ease-in-out",
          isCollapsed ? "ml-0" : "ml-0",
        )}
      >
        <Header />
        <main className="flex-1 p-6 lg:p-10 pb-20 md:pb-10 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)_0%,transparent_40%)] opacity-5 pointer-events-none" />
          {children}
        </main>
      </div>

      {/* Mobile FAB */}
      <Link
        href="/dashboard/transactions?add=true"
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all outline-4 outline-background"
      >
        <Plus className="h-7 w-7" />
      </Link>
    </div>
  );
}
