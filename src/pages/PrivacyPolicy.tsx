import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `When you create a BDpedia account we collect your name, email address, and (optionally) your district and profile picture. If you sign in with Google or another provider, we receive the basic profile information that provider shares with us. We also automatically collect limited technical data — such as browser type, device information, and pages visited — to help us keep the site secure and improve it over time.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use your information to create and manage your account, personalize your experience (for example, remembering your district for the Budget Planner), send you newsletters or updates you've opted into, respond to messages sent through our Contact form, and keep BDpedia secure and running smoothly. We do not sell your personal information to third parties.`,
  },
  {
    title: '3. Cookies & Local Storage',
    body: `BDpedia uses your browser's local storage to keep you signed in and to remember basic preferences such as your theme. We do not use invasive third-party advertising trackers.`,
  },
  {
    title: '4. Third-Party Services',
    body: `We rely on trusted third-party services to operate BDpedia, including our authentication provider (for sign-in), our database and hosting providers, and Cloudinary for image storage. These providers only receive the data necessary to perform their function and are bound by their own privacy and security practices.`,
  },
  {
    title: '5. Data Retention & Deletion',
    body: `We retain your account information for as long as your account is active. You can update your profile at any time from your Profile page. If you'd like your account and associated data deleted, please contact us through the Contact page and we will process your request.`,
  },
  {
    title: '6. Children\u2019s Privacy',
    body: `BDpedia is not directed at children under 13, and we do not knowingly collect personal information from children under 13.`,
  },
  {
    title: '7. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. Significant changes will be reflected by updating the "last updated" date below. Continued use of BDpedia after changes are posted means you accept the updated policy.`,
  },
  {
    title: '8. Contact Us',
    body: `If you have any questions about this Privacy Policy or how your data is handled, please reach out through our Contact page.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
        <div className="mb-4 flex justify-center">
          <span className="p-3 bg-brand-green/10 rounded-2xl text-brand-green"><ShieldCheck size={32} /></span>
        </div>
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Your Privacy</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-heading">Privacy Policy</h1>
        <p className="text-muted max-w-2xl mx-auto text-base leading-relaxed">
          This Privacy Policy explains what information BDpedia collects, how we use it, and the choices you have.
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