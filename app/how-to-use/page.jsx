import Header from '@/app/_components/Header'
import {
  ArrowRight, Wallet, PiggyBank, ReceiptText, RefreshCw,
  CalendarDays, TrendingUp, Repeat, Target, Lightbulb,
  BookOpen, Zap, Shield,
} from 'lucide-react'
import Link from 'next/link'

/* ─── data ─────────────────────────────────────────────── */

const steps = [
  {
    n: '1',
    title: 'Set your monthly budget',
    body: 'On first sign-in you\'ll be asked for your total monthly income or spending limit. Every budget category you create draws from this number.',
    color: 'bg-indigo-500',
    light: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
  },
  {
    n: '2',
    title: 'Create budget categories',
    body: 'Head to Budgets and create categories — Groceries, Rent, Fun. Give each one an emoji and a dollar limit. The allocation bar shows how much of your monthly total is still unassigned.',
    color: 'bg-purple-500',
    light: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
  },
  {
    n: '3',
    title: 'Log expenses as you spend',
    body: 'Open a budget and type a name + amount, then press Enter. Or use Quick Add on the Expenses page to log without leaving the overview.',
    color: 'bg-pink-500',
    light: 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800',
  },
  {
    n: '4',
    title: 'End your period & save',
    body: 'When your budget period closes you\'ll be prompted to Continue (keeping budgets, rolling leftover to Savings) or Start Fresh (clean slate for the new month).',
    color: 'bg-emerald-500',
    light: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
  },
]

const featureSections = [
  {
    tag: 'Budgets',
    icon: <Wallet className="w-5 h-5" />,
    accent: 'text-indigo-500',
    tagBg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300',
    rows: [
      { label: 'Allocation bar', detail: 'Shows how much of your monthly total is still available to assign to new budgets.' },
      { label: 'Due dates', detail: 'Attach an optional due day to a budget — it shows as a coloured dot on the Budget Calendar.' },
      { label: 'Override', detail: 'Tick Override when an expense exceeds the budget limit so you\'re never blocked, just informed.' },
      { label: 'Delete', detail: 'Deleting a budget also removes all its associated expenses and recurring templates.' },
    ],
  },
  {
    tag: 'Expenses',
    icon: <ReceiptText className="w-5 h-5" />,
    accent: 'text-purple-500',
    tagBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300',
    rows: [
      { label: 'Quick Add', detail: 'The Expenses page has a single panel to pick a budget and add an entry without drilling into that budget.' },
      { label: 'Enter key', detail: 'Press Enter from the name or amount field to submit — no mouse needed.' },
      { label: 'Savings credit', detail: 'When you top up a budget from Savings a green "+ From Savings" row appears; it doesn\'t count as spending.' },
      { label: 'Delete confirm', detail: 'Both the expense table and transfer history require a second confirmation before deleting.' },
    ],
  },
  {
    tag: 'Recurring',
    icon: <Repeat className="w-5 h-5" />,
    accent: 'text-pink-500',
    tagBg: 'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300',
    rows: [
      { label: 'Set it up', detail: 'Inside any budget scroll to Recurring Expenses, enter a name, amount, and a due day between 1 and 28.' },
      { label: 'Auto-fire', detail: 'On or after the due day the expense is automatically logged when you open the dashboard.' },
      { label: 'Period rules', detail: 'Recurring expenses survive "Continue Last Month" but are wiped on "Start Fresh".' },
      { label: 'Remove anytime', detail: 'Click the trash icon next to a recurring entry to delete the template (past logs stay).' },
    ],
  },
  {
    tag: 'Savings',
    icon: <PiggyBank className="w-5 h-5" />,
    accent: 'text-yellow-500',
    tagBg: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400',
    rows: [
      { label: 'Auto rollover', detail: 'Leftover budget at month end is moved to Savings automatically — no manual action needed.' },
      { label: 'Savings goal', detail: 'Set a target amount on the Savings page; a progress bar shows how close you are.' },
      { label: 'Transfers', detail: 'Transfer from Savings into any budget to give it extra room mid-month.' },
      { label: 'Balance accuracy', detail: 'Savings credits don\'t inflate a budget\'s "spent" total — the remaining always stays correct.' },
    ],
  },
  {
    tag: 'Calendar & Reports',
    icon: <CalendarDays className="w-5 h-5" />,
    accent: 'text-blue-500',
    tagBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300',
    rows: [
      { label: 'Three views', detail: 'Switch between current month, next month, and a compact split view using the arrow buttons.' },
      { label: 'Due-date dots', detail: 'Budget due dates appear as coloured dots; past-this-month dates automatically show in next month\'s column.' },
      { label: 'Monthly statement', detail: 'Each period generates a statement with total spent, saved, and a per-budget breakdown.' },
      { label: 'Force end', detail: 'Use "Force End Budget Period" in the header to close a period early at any time.' },
    ],
  },
]

const scenarios = [
  {
    icon: <Target className="w-4 h-4 text-indigo-400" />,
    title: 'Monthly household budget',
    steps: ['Create budgets for Rent, Groceries, Utilities, Transport', 'Set your period end day to match your pay cycle', 'Log expenses as they happen', 'At month end Continue to keep the same budgets'],
  },
  {
    icon: <Repeat className="w-4 h-4 text-pink-400" />,
    title: 'Tracking fixed bills',
    steps: ['Open the relevant budget (e.g. Subscriptions)', 'Add each bill as a Recurring Expense with its due day', 'Bills appear automatically — no manual logging', 'Delete any time when a subscription ends'],
  },
  {
    icon: <PiggyBank className="w-4 h-4 text-yellow-400" />,
    title: 'Saving for a goal',
    steps: ['Set a savings goal amount on the Savings page', 'Spend carefully each month to leave a surplus', 'Surplus auto-moves to Savings at period end', 'Watch the progress bar fill toward your goal'],
  },
  {
    icon: <Zap className="w-4 h-4 text-emerald-400" />,
    title: 'Emergency top-ups',
    steps: ['Unexpected expense blows a budget category', 'Open Savings → Transfer to Budget', 'Pick the budget and enter the amount', 'A green credit entry records the inflow'],
  },
  {
    icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
    title: 'Reviewing last month',
    steps: ['Open the dashboard after a period ends', 'Scroll to the Monthly Statement card', 'See total spent, saved, and per-budget detail', 'Use patterns to adjust limits next month'],
  },
  {
    icon: <Lightbulb className="w-4 h-4 text-blue-400" />,
    title: 'Staying on track daily',
    steps: ['Check the dashboard each morning (30 seconds)', 'Bar chart shows which categories are close to limit', 'Expenses pie shows where money is going', 'Budget cards turn red when a limit is breached'],
  },
]

/* ─── page ─────────────────────────────────────────────── */

export default function HowToUsePage() {
  return (
    <div className="relative overflow-hidden">
      <Header />

      {/* ── Hero — compact, editorial ──────────── */}
      <section className="relative bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.035]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.5) 39px,rgba(255,255,255,.5) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,.5) 39px,rgba(255,255,255,.5) 40px)' }} />
          <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-violet-600 opacity-[0.18] blur-3xl" />
          <div className="absolute -left-16 bottom-0 w-64 h-64 rounded-full bg-indigo-400 opacity-[0.12] blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-violet-300 text-xs font-semibold tracking-wide mb-6">
              <BookOpen className="w-3 h-3" />
              User guide
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Learn Money Manager<br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                in minutes, not hours.
              </span>
            </h1>
            <p className="text-white/60 text-base lg:text-lg leading-relaxed max-w-md">
              A practical guide covering every feature — from your first budget to automated recurring expenses and month-end savings.
            </p>
          </div>

          {/* Table-of-contents preview */}
          <div className="w-full lg:w-72 bg-white/[0.06] backdrop-blur border border-white/10 rounded-2xl p-5 flex flex-col gap-2">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">What's covered</p>
            {['Getting started (4 steps)', 'Budgets & expenses', 'Recurring expenses', 'Savings & goals', 'Calendar & reports', 'Common scenarios'].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-white/70">
                <span className="w-5 h-5 rounded-full bg-violet-500/30 text-violet-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Getting Started — vertical timeline ── */}
      <section className="bg-background py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-indigo-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Start here</p>
          <h2 className="text-3xl font-extrabold text-foreground mb-12">Four steps to get going</h2>

          <div className="relative">
            {/* connector line */}
            <div className="absolute left-5 top-6 bottom-6 w-px bg-border" />

            <div className="flex flex-col gap-8">
              {steps.map((s) => (
                <div key={s.n} className="flex gap-5">
                  <div className={`w-10 h-10 rounded-full ${s.color} text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-lg z-10`}>
                    {s.n}
                  </div>
                  <div className={`flex-1 rounded-xl border ${s.light} p-5`}>
                    <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature reference — alternating rows ── */}
      <section className="bg-muted/30 py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-purple-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Feature reference</p>
          <h2 className="text-3xl font-extrabold text-foreground mb-12">Everything, explained</h2>

          <div className="flex flex-col gap-10">
            {featureSections.map((f) => (
              <div key={f.tag}>
                <div className="flex items-center gap-2.5 mb-4">
                  <span className={`${f.accent}`}>{f.icon}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${f.tagBg}`}>{f.tag}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {f.rows.map((r) => (
                    <div key={r.label} className="bg-background border border-border rounded-xl px-4 py-3 flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{r.label}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{r.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scenarios — numbered story cards ──── */}
      <section className="bg-background py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-pink-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Common scenarios</p>
          <h2 className="text-3xl font-extrabold text-foreground mb-12">How people use it</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {scenarios.map((s, i) => (
              <div key={s.title} className="border border-border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-4xl font-black text-muted-foreground/20 leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-sm leading-snug">{s.title}</h3>
                <ol className="flex flex-col gap-1.5">
                  {s.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="w-4 h-4 rounded-full bg-muted text-muted-foreground text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{j + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-20 px-6">
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.5) 39px,rgba(255,255,255,.5) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,.5) 39px,rgba(255,255,255,.5) 40px)' }} />
        <div className="relative mx-auto max-w-xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-400/30 mb-6">
            <Shield className="w-6 h-6 text-violet-300" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">You're ready to go.</h2>
          <p className="text-white/50 mb-8">Free forever. No credit card. Takes 60 seconds to set up.</p>
          <Link
            href="/sign-in"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-violet-500/20"
          >
            Start Tracking Free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  )
}
