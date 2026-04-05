export const metadata = {
  title: "Terms of Service | Financetro",
  description: "Terms of Service and User Agreement for Financetro",
};

export default function TermsPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-4 border-b border-white/5 pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-2">
          Legal
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 leading-tight">
          Terms of Service
        </h1>
        <p className="text-white/40 text-lg">Effective Date: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="space-y-10 text-white/70 leading-relaxed font-light">
         <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Financetro ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service. This agreement creates a binding legal contract between you and Financetro Labs.
            </p>
         </section>
         
         <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">2. User Accounts & Security</h2>
            <p>
              You must provide accurate and complete information when creating an account. You are solely responsible for safeguarding the password and for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
         </section>
         
         <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">3. Financial Data & Privacy</h2>
            <p>
              We prioritize the security of your financial data. All sensitive information is encrypted at rest and in transit. By using the Service, you grant us permission to process your data exclusively for the purpose of providing the service to you. Financetro will never sell your personal financial data to third parties.
            </p>
         </section>

         <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">4. Prohibited Uses</h2>
            <p>
              You agree not to use the Service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/60">
              <li>In any way that violates any applicable national or international law.</li>
              <li>To exploit, harm, or attempt to exploit or harm minors.</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent.</li>
              <li>To impersonate or attempt to impersonate Financetro, a Financetro employee, or another user.</li>
            </ul>
         </section>

         <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">5. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
         </section>
      </div>
    </div>
  )
}
