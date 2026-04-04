"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNotificationsList } from "@/hooks/useNotificationsList";
import { format } from "date-fns";
import {
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Wallet,
  Coins,
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  Target,
  Activity,
  Clock,
  User,
} from "lucide-react";
import { useCurrencyStore } from "@/store/currencyStore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function Header() {
  const { user } = useAuthStore();
  const { currency, availableCurrencies, setCurrency } = useCurrencyStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationsList();
  
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    router.push(`/dashboard/transactions?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <header className="h-20 border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <form
            onSubmit={handleSearch}
            className="relative hidden sm:block w-96"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 bg-card/50 border-white/5 focus-visible:ring-primary/50"
            />
          </form>
        </div>

        <div className="flex items-center space-x-4">
          {/* Currency Switcher */}
          <div className="relative mr-2">
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-card border border-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="p-1 rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                <Coins size={16} />
              </div>
              <span className="text-sm font-bold font-mono">
                {currency.code}
              </span>
            </button>

            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-card border border-white/10 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-2 border-b border-white/5">
                  <Input
                    placeholder="Search currency..."
                    className="h-8 text-xs bg-white/5"
                    value={currencySearch}
                    onChange={(e) => setCurrencySearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="p-1 max-h-64 overflow-y-auto space-y-0.5 custom-scrollbar">
                  {availableCurrencies
                    .filter(
                      (c) =>
                        c.code
                          .toLowerCase()
                          .includes(currencySearch.toLowerCase()) ||
                        c.symbol
                          .toLowerCase()
                          .includes(currencySearch.toLowerCase()),
                    )
                    .map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c);
                          setShowCurrencyDropdown(false);
                          setCurrencySearch("");
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                          currency.code === c.code
                            ? "bg-primary/20 text-primary font-bold"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-primary bg-primary/10 w-6 h-6 flex items-center justify-center rounded text-xs shrink-0">
                            {c.symbol}
                          </span>
                          <span className="truncate">{c.code}</span>
                        </div>
                        {currency.code === c.code && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        )}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowCurrencyDropdown(false);
              }}
              className={`relative p-2 transition-colors rounded-full ${showNotifications ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-4 px-1 bg-primary text-[10px] text-primary-foreground font-black flex items-center justify-center rounded-full ring-2 ring-background animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-card border border-white/10 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
                  <h3 className="font-bold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-3 opacity-10" />
                      <p className="text-xs italic">Your inbox is clear</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-4 hover:bg-white/2 transition-colors relative group ${!n.read ? 'bg-primary/3' : ''}`}
                          onClick={() => !n.read && markAsRead(n.id)}
                        >
                          {!n.read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                          )}
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[11px] font-bold ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</span>
                            <span className="text-[9px] text-muted-foreground font-mono">
                              {format(new Date(n.createdAt), 'HH:mm')}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {n.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 bg-white/2 text-center border-t border-white/5">
                    <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors">
                      View all history
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium leading-none mb-1">
                {user?.displayName || "User"}
              </span>
              <span className="text-xs text-muted-foreground leading-none">
                {user?.email}
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-linear-to-tr from-primary to-primary-hover flex items-center justify-center text-primary-foreground font-bold shadow-md ring-2 ring-white/10 cursor-pointer overflow-hidden relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {user?.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : "U"}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 ml-2 text-muted-foreground hover:text-destructive transition-colors hidden sm:block"
              title="Log out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-background/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-400">
                  Financetro
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
              {[
                {
                  name: "Dashboard",
                  href: "/dashboard",
                  icon: LayoutDashboard,
                },
                {
                  name: "Transactions",
                  href: "/dashboard/transactions",
                  icon: ArrowRightLeft,
                },
                { name: "Wallets", href: "/dashboard/wallets", icon: Wallet },
                { name: "Loans", href: "/dashboard/loans", icon: Coins },
                {
                  name: "Analytics",
                  href: "/dashboard/analytics",
                  icon: PieChart,
                },
                { name: "Budget", href: "/dashboard/budget", icon: Target },
                { name: "Goals", href: "/dashboard/goals", icon: Activity },
                {
                  name: "Schedules",
                  href: "/dashboard/schedules",
                  icon: Clock,
                },
                { name: "Profile", href: "/dashboard/profile", icon: User },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-4 text-lg font-semibold text-muted-foreground hover:text-primary transition-all py-3 px-4 rounded-xl hover:bg-primary/10"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="flex items-center space-x-4 mb-6 px-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {user?.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div>
                  <p className="font-semibold">{user?.displayName || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-4 text-destructive font-bold border border-destructive/20 rounded-2xl hover:bg-destructive/10 transition-all flex items-center justify-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
