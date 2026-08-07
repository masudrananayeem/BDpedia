import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using BDpedia, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the site.`,
  },
  {
    title: '2. Using BDpedia',
    body: `BDpedia is an informational guide to Bangladesh's districts, places, history, culture and travel resources. You agree to use the site only for lawful purposes and not to misuse any feature, including attempting to disrupt the service, scrape content at scale, or interfere with other users' accounts.`,
  },
  {
    title: '3. Accounts',
    body: `Some features, such as saving preferences, commenting, or using the Budget Planner with your saved district, require an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. You may sign up with an email and password, or through a supported third-party sign-in provider.`,
  },
  {
    title: '4. Content Accuracy',
    body: `We work to keep information about districts, places, rivers, history and culture accurate and up to date, but BDpedia is provided on an "as is" basis. Travel details such as prices, timings, and accessibility can change, so please verify important details independently before you travel.`,
  },
  {
    title: '5. Intellectual Property',
    body: `The BDpedia name, logo, design, and original written content are the property of BDpedia. Images and third-party content are used for informational purposes; if you believe any content infringes your rights, please contact us and we will address it promptly.`,
  },
  {
    title: '6. User-Submitted Content',
    body: `If you submit content to BDpedia (such as messages through the Contact form), you confirm that you have the right to share it and grant us permission to use it for the purpose of operating and improving the site.`,
  },
  {
    title: '7. Limitation of Liability',
    body: `BDpedia and its contributors are not liable for any loss or damage arising from your use of the site or reliance on its content, including travel plans made based on information found here.`,
  },
  {
    title: '8. Changes to These Terms',
    body: `We may update these Terms of Service from time to time. Continued use of BDpedia after changes are posted means you accept the updated terms.`,
  },
  {
    title: '9. Contact Us',
    body: `If you have questions about these Terms of Service, please reach out through our Contact page.`,
  },
];

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
        <div className="mb-4 flex justify-center">
          <span className="p-3 bg-brand-green/10 rounded-2xl text-brand-green"><FileText size={32} /></span>
        </div>
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Please Read</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-heading">Terms of Service</h1>
        <p className="text-muted max-w-2xl mx-auto text-base leading-relaxed">
          These terms govern your use of BDpedia. Please read them carefully.
        </p>
        <p className="text-xs text-muted mt-4">Last updated: August 2026</p>
      </motion.div>

      <div className="space-y-8">
        {SECTIONS.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.4) }} className="bg-surface border border-line/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-lg md:text-xl font-bold mb-3 text-heading">{s.title}</h2>
            <p className="text-body leading-relaxed text-sm md:text-base" style={{ color: 'rgb(var(--c-body))' }}>{s.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}