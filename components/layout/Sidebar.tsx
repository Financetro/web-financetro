"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebarStore";
import {
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  Target,
  User,
  Wallet,
  Clock,
  ChevronLeft,
  ChevronRight,
  Zap,
  Activity,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowRightLeft,
  },
  { name: "Wallets", href: "/dashboard/wallets", icon: Wallet },
  { name: "Loans", href: "/dashboard/loans", icon: Coins },
  { name: "Analytics", href: "/dashboard/analytics", icon: PieChart },
  { name: "Budget", href: "/dashboard/budget", icon: Target },
  { name: "Goals", href: "/dashboard/goals", icon: Activity }, // Changed to Activity for variety
  { name: "Schedules", href: "/dashboard/schedules", icon: Clock },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-white/5 bg-card/50 backdrop-blur-3xl h-screen sticky top-0 transition-all duration-500 ease-in-out z-50",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Header / Logo */}
      <div
        className={cn(
          "p-6 flex items-center transition-all duration-500",
          isCollapsed ? "justify-center" : "space-x-3",
        )}
      >
        <div className="p-2 bg-primary/20 rounded-xl shrink-0 group hover:rotate-12 transition-transform">
          <Wallet className="h-6 w-6 text-primary" />
        </div>
        {!isCollapsed && (
          <span className="text-2xl font-black tracking-tighter animate-in fade-in slide-in-from-left-4 duration-500 text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-400">
            Financetro
          </span>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground border border-background shadow-lg hover:scale-110 active:scale-95 transition-all z-[60]"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-visible",
                isActive
                  ? "text-primary bg-primary/10 shadow-inner"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                isCollapsed && "justify-center px-0",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-all duration-300",
                  isActive
                    ? "text-primary scale-110"
                    : "text-muted-foreground group-hover:text-foreground group-hover:scale-110",
                )}
              />

              {!isCollapsed && (
                <span className="ml-3 font-medium text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-4">
                  {item.name}
                </span>
              )}

              {/* Tooltip for Collapsed State */}
              {isCollapsed && (
                <div className="absolute left-16 px-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[100] shadow-xl">
                  {item.name}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-primary rotate-45" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Upgrade Card */}
      <div className="p-4 mt-auto">
        {isCollapsed ? (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex justify-center group cursor-pointer relative overflow-visible">
            <Zap className="h-5 w-5 text-primary animate-pulse" />

            {/* Upgrade Tooltip */}
            <div className="absolute left-16 px-3 py-1.5 bg-[#FFD700] text-black text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[100] shadow-xl">
              Upgrade to Pro
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#FFD700] rotate-45" />
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 border border-primary/20 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
            <h4 className="font-bold text-sm mb-1">Go Premium</h4>
            <p className="text-[10px] text-muted-foreground mb-3 opacity-80 leading-tight">
              Get detailed insights and advanced goals.
            </p>
            <Button
              size="sm"
              className="w-full text-[10px] h-8 font-black uppercase tracking-widest bg-primary text-primary-foreground rounded-lg shadow-lg shadow-primary/20"
            >
              Upgrade
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
