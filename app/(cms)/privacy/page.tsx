export const metadata = {
  title: "Privacy Policy | Financetro",
  description: "Privacy Policy and Data Protection guidelines for Financetro",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-4 border-b border-white/5 pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
          Security & Privacy
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 leading-tight">
          Privacy Policy
        </h1>
        <p className="text-white/40 text-lg">Last modified: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="space-y-10 text-white/70 leading-relaxed font-light">
         <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">1. Introduction</h2>
            <p>
              At Financetro, we recognize that your financial data is highly sensitive. This Privacy Policy outlines the types of information we gather when you use our services, how that information is used, and the rigorous steps we take to safeguard it.
            </p>
         </section>
         
         <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">2. Information We Collect</h2>
            <p>
              We collect information to provide better services to our users. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/60">
              <li><strong className="text-white">Account Information:</strong> Name, email address, and authentication credentials.</li>
              <li><strong className="text-white">Financial Data:</strong> Transactions, account balances, categorization rules, and budget limits that you input or sync.</li>
              <li><strong className="text-white">Technical Data:</strong> IP address, browser type, operating system, and interaction metrics.</li>
            </ul>
         </section>
         
         <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">3. How We Use Your Data</h2>
            <p>
              The data we collect is used strictly to power your Financetro experience. Specifically, we use it to calculate your analytics, predict cashflow, and send you relevant notifications (like over-budget alerts). We do not run ads, and we do not sell your personal or financial data to data brokers.
            </p>
         </section>

         <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">4. Data Encryption & Security</h2>
            <p>
              We implement industry-standard security measures. Your financial data is encrypted at rest using AES-256 and in transit using TLS 1.3. We utilize Firebase infrastructure which complies with major security certifications (ISO 27001, SOC 2, HIPAA).
            </p>
         </section>

         <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">5. Your Rights (GDPR & CCPA)</h2>
            <p>
              Depending on your location, you have the right to access, correct, delete, or restrict the processing of your personal data. You can export all your transaction data at any time from the dashboard, or permanently delete your account and all associated data within the settings page.
            </p>
         </section>
      </div>
    </div>
  )
}
