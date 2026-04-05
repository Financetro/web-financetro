import { Command, Heart, Focus, Globe } from "lucide-react";

export const metadata = {
  title: "About Us | Financetro",
  description: "Learn more about Financetro and our mission.",
};

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-6 pb-8">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl border border-primary/20 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <Command className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">
          Our Mission
        </h1>
        <p className="text-white/50 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
          We believe that financial clarity is the foundation of freedom. Financetro was built to give professionals absolute control over their wealth.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 pt-8 border-t border-white/5">
        <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
           <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
             <Focus className="h-6 w-6 text-emerald-500" />
           </div>
           <h3 className="text-xl font-bold text-white">Hyper-Focused</h3>
           <p className="text-white/50 text-sm leading-relaxed">
             We stripped away the noise, ads, and unnecessary upsells found in traditional finance apps. Just raw, powerful analytics.
           </p>
        </div>

        <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors">
           <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
             <Heart className="h-6 w-6 text-blue-500" />
           </div>
           <h3 className="text-xl font-bold text-white">Design matters</h3>
           <p className="text-white/50 text-sm leading-relaxed">
             Managing your money shouldn't feel like looking at a 1990s spreadsheet. We build software that feels like magic.
           </p>
        </div>

        <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors">
           <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
             <Globe className="h-6 w-6 text-purple-500" />
           </div>
           <h3 className="text-xl font-bold text-white">Global standard</h3>
           <p className="text-white/50 text-sm leading-relaxed">
             Built natively with multi-currency support, designed for the modern digital nomad or global citizen.
           </p>
        </div>
      </div>

      <div className="pt-12 space-y-6">
        <h2 className="text-3xl font-bold text-white border-b border-white/5 pb-4">The Story</h2>
        <div className="space-y-4 text-white/70 font-light leading-relaxed">
          <p>
            Financetro started as a personal tool. Our founders were frustrated with the existing landscape of financial trackers—they were either too simple and lacked deep analytics, or too complex and unintuitive. Worse, most of them sold user data to credit card companies to stay afloat.
          </p>
          <p>
            We decided to build the ultimate alternative: a premium, high-performance web dashboard paired with an equally powerful mobile app. We poured hundreds of hours into perfecting the UI, utilizing modern React ecosystems and extremely fast databases.
          </p>
          <p>
            Today, Financetro is the command center for thousands of professionals who refuse to settle for mediocrity when it comes to their financial destiny.
          </p>
        </div>
      </div>
    </div>
  )
}
