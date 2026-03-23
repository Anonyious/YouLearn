'use client';

import { useState, useEffect } from 'react';
import { Menu, X, BookOpen, BarChart2, Share2, Zap, ChevronDown, Play, CheckCircle2, Circle } from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: 'Any playlist, instant course',
    desc: 'Paste a YouTube playlist URL and get a fully structured, ordered course in seconds. No setup, no friction.',
    tag: 'Course creation',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Zero noise. Pure focus.',
    desc: 'No ads, no sidebar recommendations, no comments pulling you away. Just the video and your notes.',
    tag: 'Distraction-free',
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    title: 'Know exactly where you are',
    desc: 'Mark lessons complete, track your percentage, and resume from exactly where you stopped — across any device.',
    tag: 'Progress tracking',
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: 'Share with one link',
    desc: 'Every course gets a unique public URL. Share with teammates, study groups, or the whole internet.',
    tag: 'Sharing',
  },
];

const steps = [
  { number: '01', title: 'Find a playlist', desc: 'Any public YouTube playlist works.' },
  { number: '02', title: 'Paste the URL', desc: 'We structure it into an ordered course instantly.' },
  { number: '03', title: 'Learn without noise', desc: 'Clean player. No ads, no recommendations.' },
  { number: '04', title: 'Track everything', desc: 'Mark lessons done, see your progress, resume anytime.' },
];

const testimonials = [
  {
    name: 'Riya S.',
    role: 'CS Student',
    quote: 'I finally finished a full DSA playlist without getting distracted. This is the only way I learn now.',
    avatar: 'R',
  },
  {
    name: 'Arjun M.',
    role: 'Self-taught Developer',
    quote: 'Progress tracking keeps me accountable. I know exactly where I am in every course, every day.',
    avatar: 'A',
  },
  {
    name: 'Priya K.',
    role: 'Design Student',
    quote: 'Sharing courses with my study group changed how we learn together. Incredibly simple to use.',
    avatar: 'P',
  },
];

const faqs = [
  { q: 'Is YourLearn free?', a: 'Yes, completely free. Create an account and start learning immediately — no credit card required.' },
  { q: 'Which YouTube playlists work?', a: 'Any public YouTube playlist. Just paste the URL and we handle the rest.' },
  { q: 'Can I add individual videos?', a: 'Yes — use Custom Course mode to paste individual YouTube video links and build your own course from scratch.' },
  { q: 'Can I share my courses?', a: 'Every course gets a unique share link. Anyone with the link can view the course.' },
  { q: 'Does it work on mobile?', a: 'Fully responsive — phone, tablet, or desktop.' },
];

// ─── Mock UI Hero Component ───────────────────────────────────────────────────

function ProductMockup() {
  const lessons = [
    { title: 'Introduction to the course', done: true },
    { title: 'Core concepts explained', done: true },
    { title: 'Building your first project', done: false, active: true },
    { title: 'Advanced patterns', done: false },
    { title: 'Final project walkthrough', done: false },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Glow effect behind mockup */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30 dark:opacity-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-3xl scale-95" />

      {/* Browser chrome */}
      <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700/60 shadow-2xl dark:shadow-black/50 bg-white dark:bg-zinc-900">
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <div className="flex-1 mx-4 px-3 py-1 rounded-md bg-zinc-200 dark:bg-zinc-700 text-xs text-zinc-500 dark:text-zinc-400">
            yourlearn.app/course/javascript-mastery
          </div>
        </div>

        {/* App content */}
        <div className="flex h-[380px] md:h-[440px]">
          {/* Sidebar */}
          <div className="w-64 hidden md:flex flex-col border-r border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
              <p className="text-xs text-zinc-400 mb-1">Course</p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">JavaScript Mastery</p>
              {/* Progress bar */}
              <div className="mt-3 w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full">
                <div className="h-full w-[40%] bg-indigo-500 rounded-full" />
              </div>
              <p className="text-xs text-zinc-400 mt-1">2 of 5 lessons · 40%</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {lessons.map((l, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                    l.active
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50'
                  }`}
                >
                  {l.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className={`w-3.5 h-3.5 flex-shrink-0 ${l.active ? 'text-indigo-500' : 'text-zinc-300 dark:text-zinc-600'}`} />
                  )}
                  <span className="line-clamp-1">{l.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Video area */}
            <div className="flex-1 bg-zinc-900 dark:bg-black relative flex items-center justify-center">
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(45deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
                }}
              />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                </div>
                <p className="text-white/60 text-xs">Building your first project</p>
              </div>
              {/* Fake progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div className="h-full w-[35%] bg-indigo-400" />
              </div>
            </div>

            {/* Lesson info bar */}
            <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between bg-white dark:bg-zinc-900">
              <div>
                <p className="text-xs font-medium text-zinc-900 dark:text-white">Building your first project</p>
                <p className="text-xs text-zinc-400 mt-0.5">Lesson 3 of 5</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium">
                Mark complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Item ────────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-colors ${open ? 'border-indigo-300 dark:border-indigo-700' : 'border-zinc-200 dark:border-zinc-800'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-sm text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
      >
        {q}
        <ChevronDown className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <p className="px-6 pb-5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') router.push('/dashboard');
  }, [status, router]);

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="w-7 h-7 rounded-full border-[3px] border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d] text-zinc-900 dark:text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0d0d0d]/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              Your<span className="text-indigo-600 dark:text-indigo-400">Learn</span>
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {['#features', '#how', '#faq'].map((href, i) => (
              <a key={i} href={href} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
                {['Features', 'How it works', 'FAQ'][i]}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Link href="/login" className="hidden md:block text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition px-3 py-1.5">
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-all"
            >
              Get started
            </Link>
            <button className="md:hidden p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-[#0d0d0d]"
            >
              <div className="px-6 py-5 flex flex-col gap-4">
                {[['#features', 'Features'], ['#how', 'How it works'], ['#faq', 'FAQ']].map(([href, label]) => (
                  <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="text-sm text-zinc-600 dark:text-zinc-300">
                    {label}
                  </a>
                ))}
                <div className="flex gap-3 pt-2">
                  <Link href="/login" className="flex-1 text-center text-sm py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700">Login</Link>
                  <Link href="/register" className="flex-1 text-center text-sm py-2.5 rounded-xl bg-indigo-600 text-white">Get started</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Turn YouTube into your classroom
            </div>

            <h1 className="text-fluid-hero font-extrabold tracking-tight mb-6">
              Learn from YouTube<br />
              <span className="text-indigo-600 dark:text-indigo-400">
                Without Distractions
              </span>
            </h1>

            <p className="text-fluid-body text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mb-8">
              Paste a playlist, get a structured course. No ads, no recommendations, no endless scroll — just focused learning.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="px-7 py-3 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/20"
              >
                Start learning free →
              </Link>
              <Link
                href="/login"
                className="px-7 py-3 text-sm font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-600 text-zinc-700 dark:text-zinc-300 transition-all"
              >
                Already have an account
              </Link>
            </div>

            <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-600">Free forever · No credit card</p>
          </motion.div>

          {/* Product mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <ProductMockup />
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-100 dark:border-zinc-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">Features</p>
            <h2 className="text-fluid-h2 font-bold tracking-tight">Built for serious learners</h2>
            <p className="mt-4 text-zinc-500 dark:text-zinc-400 text-base max-w-xl mx-auto">
              Everything you need to finish what you start.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-300 flex flex-col gap-4"
              >
                <div>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mb-3">
                    {f.tag}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-sm mb-2">{f.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">Process</p>
            <h2 className="text-fluid-h2 font-bold tracking-tight">Up and learning in 2 minutes</h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-700 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-xl flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20 relative z-10">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-2 text-sm">{step.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[180px]">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-100 dark:border-zinc-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">Testimonials</p>
            <h2 className="text-fluid-h2 font-bold tracking-tight">Loved by learners</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl p-6 flex flex-col gap-5"
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-zinc-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">FAQ</p>
            <h2 className="text-fluid-h2 font-bold tracking-tight">Common questions</h2>
          </div>
          <div className="space-y-2.5">
            {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-indigo-600 dark:bg-indigo-900/40 dark:border-y dark:border-indigo-800/40">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-fluid-h2 font-bold text-white mb-4">Start learning today</h2>
          <p className="text-indigo-200 text-base mb-8">Free forever. No credit card. No distractions.</p>
          <Link
            href="/register"
            className="inline-block px-8 py-3.5 text-sm font-semibold rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 transition-all hover:scale-[1.02] shadow-xl shadow-indigo-900/20"
          >
            Get started free →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t border-zinc-100 dark:border-zinc-800/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold text-zinc-900 dark:text-white">
            Your<span className="text-indigo-600 dark:text-indigo-400">Learn</span>
          </span>
          <p className="text-xs text-zinc-400">© 2026 YourLearn · Focused learning for the determined.</p>
          <div className="flex gap-6 text-xs text-zinc-400">
            {[['#features', 'Features'], ['#how', 'How it works'], ['#faq', 'FAQ']].map(([href, label]) => (
              <a key={href} href={href} className="hover:text-zinc-900 dark:hover:text-white transition">{label}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}