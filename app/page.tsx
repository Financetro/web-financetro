import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  PieChart,
  Shield,
  Wallet,
  CheckCircle2,
  Zap,
  Globe,
  Star,
  Clock,
  Target,
  TrendingUp,
  Layout,
} from "lucide-react";

export default function LandingPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-background text-white selection:bg-primary/30">
      {/* Navbar */}
      <header className="px-6 lg:px-20 h-20 flex items-center justify-between border-b border-white/5 backdrop-blur-xl sticky top-0 z-100 bg-background/80">
        <Link className="flex items-center gap-2" href="/">
          <div className="p-2 bg-primary/20 rounded-xl">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-400">
            Financetro
          </span>
        </Link>
        <nav className="hidden md:flex ml-auto gap-8 mr-10">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#analytics"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Analytics
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex gap-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-sm font-semibold hover:bg-white/5 px-6"
            >
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button className="text-sm font-bold px-6 shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-20 pb-20 md:pt-32 md:pb-40 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30" />
          <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full -z-10 animate-pulse" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-primary animate-bounce">
                <span className="p-1 rounded-full bg-primary animate-ping inline-block" />
                Trusted by 50,000+ professionals
              </div>

              <div className="space-y-6 max-w-4xl">
                <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] text-white">
                  OWN YOUR{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-green-300">
                    FINANCIAL
                  </span>{" "}
                  DESTINY
                </h1>
                <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl lg:text-2xl font-medium leading-relaxed">
                  The ultimate dashboard to monitor wealth, track recurring
                  bills, and hit savings goals with surgical precision.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="h-14 px-10 text-lg font-bold rounded-2xl group"
                  >
                    Build My Portfolio
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-10 text-lg font-semibold border-white/10 bg-white/5 backdrop-blur-md rounded-2xl"
                  >
                    Watch Demo
                  </Button>
                </Link>
              </div>

              {/* Main Dashboard Mockup Image */}
              <div className="w-full max-w-6xl mt-16 rounded-3xl border border-white/10 bg-card/30 backdrop-blur-2xl p-2 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />
                <img
                  src="/mockup.png"
                  alt="Financetro Dashboard"
                  className="w-full rounded-2xl transition-transform duration-1000 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 border-y border-white/5 bg-white/1">
          <div className="container mx-auto px-6">
            <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-12">
              Empowering teams at
            </p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all">
              <span className="text-2xl font-bold">GOLDMAN</span>
              <span className="text-2xl font-bold">REVOLUT</span>
              <span className="text-2xl font-bold">STRIPE</span>
              <span className="text-2xl font-bold">COINBASE</span>
              <span className="text-2xl font-bold">CHIME</span>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">
                Engineered for Excellence
              </h2>
              <p className="text-muted-foreground text-lg">
                Every tool you need to master your cashflow, unified in one
                sleek interface.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="md:col-span-2 p-8 rounded-3xl bg-card border border-white/5 relative overflow-hidden group hover:border-primary/50 transition-all">
                <div className="absolute top-0 right-0 p-8 text-primary/10 transition-transform group-hover:scale-125">
                  <BarChart3 size={120} strokeWidth={1} />
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                  <TrendingUp className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Deep Cashflow Intelligence
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                  Visualize your income and expenses with state-of-the-art
                  interactive charts. Spot trends before they become problems.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-card border border-white/5 hover:border-blue-500/50 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
                  <Clock className="text-blue-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">Auto-Schedules</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Never miss a bill again. Track recurring subscriptions and
                  income with automated alerts and cashflow forecasting.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-card border border-white/5 hover:border-purple-500/50 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
                  <Target className="text-purple-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">Savings Goals</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Gamify your savings. Set targets for houses, vacations, or
                  emergencies and watch your progress in real-time.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-8 rounded-3xl bg-[#151921] border border-white/5 hover:border-primary/50 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                  <Zap className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">CSV Export</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Take your data with you. Export your entire transaction
                  history to CSV with one click for external analysis.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="md:col-span-2 p-8 rounded-3xl bg-card border border-white/5 hover:border-green-500/50 transition-all group relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 text-green-500/5 transition-transform group-hover:scale-110">
                  <Shield size={200} strokeWidth={1} />
                </div>
                <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-6">
                  <Shield className="text-green-500 h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Owner-Only Security</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                  Your data is your business. We implement end-to-end data
                  isolation, ensuring only you can ever view your financial
                  records.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-8 rounded-3xl bg-card border border-white/5 hover:border-amber-500/50 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-6">
                  <PieChart className="text-amber-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">Smart Budgeting</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Set monthly spending caps and get notified as you approach
                  your limits, helping you stay fiscally responsible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Showcase */}
        <section id="analytics" className="py-32 bg-white/2">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                <div className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  Metrics
                </div>
                <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
                  Insightful data, <br /> better decisions.
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Financetro doesn't just list numbers. It analyzes them. See
                  your top spending categories, monthly growth, and savings
                  velocity at a glance. We turn your raw data into a roadmap for
                  wealth.
                </p>
                <ul className="space-y-4">
                  {[
                    "Year-over-year trends",
                    "Category breakdown charts",
                    "Income vs. Expense ratio",
                    "Savings milestone tracking",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button className="h-14 px-10 font-bold rounded-2xl mt-4">
                    Demo Analytics
                  </Button>
                </Link>
              </div>
              <div className="flex-1 relative">
                <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-30 rounded-full" />
                <div className="relative border border-white/10 rounded-3xl overflow-hidden bg-card shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-700">
                  <img src="/mockup.png" alt="Analytics Preview" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing / CTA Section */}
        <section id="pricing" className="py-32 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-[500px] bg-primary/10 blur-[150px] -z-10 opacity-30" />
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-10">
              <h2 className="text-4xl md:text-7xl font-black">
                Zero cost. <br />
                Infinite control.
              </h2>
              <p className="text-xl text-muted-foreground">
                Financetro is currently 100% free while in beta. Join thousands
                of users who are already mastering their finances.
              </p>
              <div className="pt-6">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="h-16 px-12 text-xl font-bold rounded-2xl shadow-xl shadow-primary/30"
                  >
                    Create Your Account
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
                <p className="mt-6 text-sm text-muted-foreground">
                  No credit card required • GDPR Compliant
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-4 mb-20">
            <div className="col-span-2 space-y-6">
              <Link className="flex items-center gap-2" href="/">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-400">
                  Financetro
                </span>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                State-of-the-art financial management built for modern
                professionals. Precision tracking, deep analytics, and
                uncompromising security.
              </p>
              <div className="flex gap-4">
                {[Globe, Star, Layout].map((Icon, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-xs tracking-widest">
                Platform
              </h4>
              <nav className="flex flex-col gap-4">
                <Link
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                  href="#"
                >
                  Features
                </Link>
                <Link
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                  href="#"
                >
                  Security
                </Link>
                <Link
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                  href="#"
                >
                  Pricing
                </Link>
                <Link
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                  href="#"
                >
                  Mobile App
                </Link>
              </nav>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-xs tracking-widest">
                Resources
              </h4>
              <nav className="flex flex-col gap-4">
                <Link
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                  href="#"
                >
                  Financial Guide
                </Link>
                <Link
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                  href="#"
                >
                  API Docs
                </Link>
                <Link
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                  href="#"
                >
                  Support
                </Link>
              </nav>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Financetro Labs. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link className="hover:text-white transition-colors" href="#">
                Terms
              </Link>
              <Link className="hover:text-white transition-colors" href="#">
                Privacy
              </Link>
              <Link className="hover:text-white transition-colors" href="#">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
