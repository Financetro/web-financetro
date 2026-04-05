"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
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
  ChevronRight,
  CreditCard,
  Lock,
  Sparkles,
  Command,
  LineChart
} from "lucide-react";
import { useRef, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: "easeOut" as const,
    },
  }),
};

function LandingPageContent() {
  const currentYear = new Date().getFullYear();
  const searchParams = useSearchParams();
  const isAppMode = searchParams.get("mode") === "app";
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const yOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className="flex flex-col min-h-screen bg-[#06080C] text-white selection:bg-primary/30 overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] bg-emerald-900/20 blur-[150px] rounded-full mix-blend-screen opacity-50" />
      </div>

      {!isAppMode && (
        <header className="px-6 lg:px-12 h-24 flex items-center justify-between border-b border-white/5 backdrop-blur-2xl sticky top-0 z-50 bg-[#06080C]/70">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link className="flex items-center gap-3 group" href="/">
              <div className="relative p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors shadow-lg shadow-primary/5">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <Command className="h-6 w-6 text-primary relative z-10" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Financetro
              </span>
            </Link>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex ml-auto gap-8 mr-12 bg-white/5 px-8 py-3 rounded-full border border-white/5 backdrop-blur-lg shadow-xl"
          >
            {["Features", "Analytics", "Security", "Pricing"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-4"
          >
            <Link href="/login" passHref>
              <Button
                variant="ghost"
                className="text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 px-6 h-11 rounded-full hidden sm:inline-flex"
              >
                Log in
              </Button>
            </Link>
            <Link href="/register" passHref>
              <Button className="text-sm font-bold px-7 h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all hover:scale-105 active:scale-95">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </header>
      )}

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section ref={heroRef} className="relative w-full pt-32 pb-40 md:pt-48 md:pb-56 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
          <motion.div
            style={{ opacity: yOpacity, y: yParallax }}
            className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center space-y-10"
          >
            <motion.div
              custom={0} initial="hidden" animate="visible" variants={fadeIn}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/10 text-sm font-medium text-primary backdrop-blur-sm shadow-[0_0_20px_rgba(16,185,129,0.15)] group cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Financetro 2.0 is now live</span>
              <ChevronRight className="h-4 w-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
            </motion.div>

            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeIn} className="space-y-6 max-w-[1000px]">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 pb-4">
                MASTER YOUR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-cyan-400">
                  WEALTH
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-white/50 text-xl md:text-2xl font-light leading-relaxed">
                The most powerful, beautiful, and secure financial dashboard ever created. Track your cashflow with surgical precision.
              </p>
            </motion.div>

            <motion.div custom={2} initial="hidden" animate="visible" variants={fadeIn} className="flex flex-col sm:flex-row gap-5 pt-8">
              <Link href="/register" passHref>
                <Button
                  size="lg"
                  className="h-16 px-10 text-lg font-semibold rounded-full group bg-white text-black hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#demo" passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-10 text-lg font-semibold border-white/10 bg-white/5 backdrop-blur-xl rounded-full hover:bg-white/10 transition-all text-white/80"
                >
                  View Live Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="w-full max-w-[1200px] mx-auto mt-20 relative px-6 lg:px-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#06080C] via-transparent to-transparent z-20 h-full w-full pointer-events-none" />
            <div className="relative rounded-3xl border border-white/10 bg-[#0B0F14]/80 backdrop-blur-3xl shadow-2xl overflow-hidden glass p-4 md:p-6 transform-gpu lg:-rotate-2 lg:scale-105 transition-transform duration-700 hover:rotate-0 hover:scale-100 group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              <div className="rounded-xl overflow-hidden border border-white/5 bg-background/50 relative">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
                <img src="/mockup.png" alt="Financetro Dashboard Mockup" className="w-full h-auto relative z-10 rounded-lg shadow-2xl opacity-90 transition-opacity duration-500 group-hover:opacity-100" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <div className="w-full aspect-[16/9] flex items-center justify-center p-8 z-0 relative">
                  <div className="w-full h-full border border-white/10 rounded-xl bg-[#0F131A] p-6 flex flex-col gap-6 shadow-inset">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"><Wallet className="w-5 h-5 text-primary" /></div>
                        <div><div className="h-4 w-32 bg-white/10 rounded mb-2"></div><div className="h-3 w-20 bg-white/5 rounded"></div></div>
                      </div>
                      <div className="w-32 h-10 bg-white/5 rounded-full border border-white/10"></div>
                    </div>
                    <div className="flex gap-6 h-[40%]">
                      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="h-4 w-24 bg-white/10 rounded mb-6"></div>
                        <div className="h-10 w-48 bg-white/20 rounded"></div>
                      </div>
                      <div className="w-[30%] bg-white/5 border border-white/10 rounded-xl"></div>
                    </div>
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Social Proof */}
        <section className="py-16 border-y border-white/5 bg-white/[0.01] relative z-20">
          <div className="container mx-auto px-6">
            <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-10">
              Trusted by professionals from leading institutions
            </p>
            <div className="flex flex-wrap justify-center gap-10 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              {['GOLDMAN', 'REVOLUT', 'STRIPE', 'COINBASE', 'CHIME'].map((brand) => (
                <span key={brand} className="text-2xl font-black tracking-tight hover:text-white transition-colors">{brand}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-32 relative z-20 bg-[#06080C]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-24 max-w-3xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Engineered for Excellence
              </h2>
              <p className="text-white/50 text-xl font-light">
                Every tool you need to master your cashflow, unified in an interface that feels like magic.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 auto-rows-[300px]">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="md:col-span-2 lg:col-span-2 row-span-2 p-10 rounded-3xl bg-gradient-to-br from-[#0D1219] to-[#0A0D13] border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all">
                <div className="absolute top-0 right-0 p-10 text-primary/5 transition-transform duration-700 group-hover:scale-110 group-hover:text-primary/10">
                  <BarChart3 size={200} strokeWidth={0.5} />
                </div>
                <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <Target className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">Advanced Cashflow Intelligence</h3>
                <p className="text-white/50 text-lg leading-relaxed max-w-md">
                  Visualize your income and expenses with bleeding-edge interactive charts. Spot long-term trends before they become problems and simulate future wealth scenarios.
                </p>
                <div className="absolute bottom-10 right-10 hidden md:block">
                  <div className="w-48 h-32 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md p-4 shadow-xl translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-end gap-2 h-full w-full">
                      {[40, 70, 45, 90, 65, 100].map((h, i) => (
                        <motion.div key={i} className="w-full bg-primary/80 rounded-sm" initial={{ height: 0 }} whileInView={{ height: `${h}%` }} transition={{ duration: 0.5, delay: i * 0.1 }} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="p-8 rounded-3xl bg-gradient-to-b from-[#0D1219] to-[#0A0D13] border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500" />
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                  <Clock className="text-blue-400 h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Auto-Schedules</h3>
                <p className="text-white/50 leading-relaxed text-sm">Never miss a bill. Track recurring subscriptions with automated forecasts.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="p-8 rounded-3xl bg-gradient-to-b from-[#0D1219] to-[#0A0D13] border border-white/5 hover:border-purple-500/30 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors duration-500" />
                <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                  <PieChart className="text-purple-400 h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Smart Budgeting</h3>
                <p className="text-white/50 leading-relaxed text-sm">Dynamic spending caps that adapt to your lifestyle.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="col-span-1 md:col-span-2 lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-[#0D1219] to-[#0A0D13] border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden flex flex-col justify-center">
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full" />
                <div className="relative z-10 flex gap-8 items-center">
                  <div className="flex-1">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                      <Lock className="text-emerald-400 h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Owner-Only Security</h3>
                    <p className="text-white/50 leading-relaxed text-sm">End-to-end data isolation. Your records are encrypted and accessible only by you.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Analytics Showcase */}
        <section id="analytics" className="py-32 relative z-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 space-y-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                  <LineChart className="w-4 h-4" />
                  Deep Analytics
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white mb-6">Turn raw data into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">predictable wealth.</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                  {["Zero manual entry", "Expense warnings", "Custom mapping", "Tax export"].map((item, i) => (
                    <motion.div key={item} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0"><CheckCircle2 className="h-4 w-4 text-blue-400" /></div>
                      <span className="font-medium text-white/80">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="flex-1 relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="w-[120%] h-[120%] bg-[conic-gradient(at_center,transparent,rgba(59,130,246,0.1),transparent)] rounded-full" />
                  <div className="absolute w-full h-full bg-[#06080C] rounded-full flex items-center justify-center p-8 border border-white/5 shadow-2xl glass z-10 scale-[0.8] relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="absolute border border-white/5 rounded-full" style={{ width: `${i * 25}%`, height: `${i * 25}%` }} />
                      ))}
                    </div>
                    <div className="relative z-20 text-center">
                      <p className="text-white/40 text-sm uppercase tracking-widest mb-2 font-bold">Net Worth</p>
                      <h3 className="text-5xl md:text-6xl font-black text-white mb-4">$142,890</h3>
                      <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full font-bold text-sm"><TrendingUp className="w-4 h-4" /> +12.4% MONTH</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Access */}
        <section className="py-32 relative z-20 border-y border-white/5 bg-[#0A0D13]">
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <Globe className="w-16 h-16 text-primary/50 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">Built for a Borderless World</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'].map(curr => (
                <div key={curr} className="px-6 py-3 rounded-full border border-white/10 bg-white/5 font-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-default">{curr}</div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="pricing" className="py-40 relative z-20 overflow-hidden text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto space-y-10 glass p-12 md:p-20 rounded-[3rem] border-white/10 bg-[#0B0F14]/60 relative overflow-hidden">
            <h2 className="text-5xl md:text-7xl font-black text-white">Start mastering your money.</h2>
            <Link href="/register" passHref><Button size="lg" className="h-16 px-12 text-lg font-bold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_rgba(16,185,129,0.3)] transform transition hover:-translate-y-1">Create Free Account</Button></Link>
          </motion.div>
        </section>
      </main>

      {!isAppMode && (
        <footer className="py-20 border-t border-white/5 bg-[#06080C] relative z-20">
          <div className="container mx-auto px-6">
            <div className="grid gap-12 md:grid-cols-4 mb-20 text-sm">
              <div className="col-span-2 space-y-8">
                <Link className="flex items-center gap-2" href="/"><div className="p-2 bg-primary/10 rounded-lg border border-primary/20"><Command className="h-6 w-6 text-primary" /></div><span className="text-2xl font-black tracking-tight text-white">Financetro</span></Link>
                <p className="text-white/50 max-w-sm">The financial command center built for the modern professional.</p>
              </div>
              <div className="space-y-4 flex flex-col items-start leading-6"><h4 className="font-bold text-white">Resources</h4><Link href="#" className="text-white/50 hover:text-primary transition">Documentation</Link><Link href="#" className="text-white/50 hover:text-primary transition">API Reference</Link><Link href="#" className="text-white/50 hover:text-primary transition">Help Center</Link></div>
              <div className="space-y-4 flex flex-col items-start leading-6"><h4 className="font-bold text-white">Company</h4><Link href="/about" className="text-white/50 hover:text-primary transition">About</Link><Link href="/privacy" className="text-white/50 hover:text-primary transition">Privacy</Link><Link href="/terms" className="text-white/50 hover:text-primary transition">Terms</Link></div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5 text-sm text-white/40">
              <p>© {currentYear} Financetro. All rights reserved.</p>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Systems operational</div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06080C]" />}>
      <LandingPageContent />
    </Suspense>
  );
}
