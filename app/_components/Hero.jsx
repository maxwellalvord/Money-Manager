import React from 'react'
import { TrendingUp, PieChart, Calendar, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: <TrendingUp className="w-6 h-6 text-indigo-500" />,
    title: 'Smart Budgets',
    desc: 'Set monthly limits per category and get notified before you overspend.',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-100 dark:border-indigo-900/50',
  },
  {
    icon: <PieChart className="w-6 h-6 text-purple-500" />,
    title: 'Expense Insights',
    desc: 'Visual breakdowns show exactly where your money goes each month.',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-100 dark:border-purple-900/50',
  },
  {
    icon: <Calendar className="w-6 h-6 text-blue-500" />,
    title: 'Monthly Reports',
    desc: 'End-of-month summaries keep you accountable and help you improve over time.',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-100 dark:border-blue-900/50',
  },
]

const budgetBars = [
  { name: 'Housing', pct: 75, color: 'bg-indigo-400' },
  { name: 'Food & Dining', pct: 52, color: 'bg-purple-400' },
  { name: 'Transport', pct: 31, color: 'bg-blue-400' },
  { name: 'Entertainment', pct: 18, color: 'bg-pink-400' },
]

function Hero() {
  return (
    <div className="relative overflow-hidden">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-[#1e1040]">

        {/* decorative orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-500 opacity-[0.12] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full bg-purple-600 opacity-[0.14] blur-3xl" />
          <div className="absolute top-1/2 -left-16 w-64 h-64 rounded-full bg-blue-500 opacity-[0.08] blur-2xl" />
          <div className="absolute -bottom-12 left-1/2 w-80 h-80 rounded-full bg-indigo-400 opacity-[0.07] blur-3xl" />
        </div>

        {/* subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* ── Left — copy ─── */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-medium mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                Free · No credit card required
              </div>

              <h1 className="text-5xl lg:text-[4.5rem] font-extrabold text-white leading-[1.05] tracking-tight mb-6">
                Make Every
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-1">
                  Dollar Count
                </span>
              </h1>

              <p className="text-indigo-200/80 text-lg lg:text-xl leading-relaxed mb-10 max-w-md">
                Track spending, set smart budgets, and watch your savings grow — all in one place, completely free.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href="/sign-in"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-400/40 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Start Tracking
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* ── Right — mock dashboard ─── */}
            <div className="relative">
              <div className="rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 p-6 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white font-semibold text-base">Monthly Overview</p>
                    <p className="text-indigo-400 text-xs mt-0.5">May 2026</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center">
                    <PieChart className="w-4 h-4 text-indigo-300" />
                  </div>
                </div>

                {/* stat cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Budget', value: '$3,200', sub: 'This month', color: 'text-white' },
                    { label: 'Spent', value: '$1,840', sub: '57% used', color: 'text-white' },
                    { label: 'Saved', value: '$360', sub: '↑ Great!', color: 'text-emerald-400' },
                  ].map(s => (
                    <div key={s.label} className="bg-white/5 rounded-xl p-3">
                      <p className="text-indigo-300 text-[10px] font-medium uppercase tracking-wide">{s.label}</p>
                      <p className={`${s.color} text-lg font-bold mt-1`}>{s.value}</p>
                      <p className="text-indigo-400 text-[10px] mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>

                {/* budget bars */}
                <div className="space-y-3">
                  {budgetBars.map(item => (
                    <div key={item.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-indigo-200">{item.name}</span>
                        <span className="text-indigo-400">{item.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section className="bg-background py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-indigo-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Everything you need
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              Built for how you actually spend
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <div
                key={f.title}
                className={`group rounded-2xl ${f.bg} ${f.border} border p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center mb-5 shadow-sm border border-border">
                  {f.icon}
                </div>
                <h3 className="text-foreground font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA banner ────────────────────────── */}
      <section className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-950 py-20 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Ready to take control?
          </h2>
          <p className="text-indigo-300 mb-8 text-lg">
            It only takes 60 seconds to set up your first budget.
          </p>
          <Link
            href="/sign-in"
            className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-xl hover:bg-indigo-50 transition-all duration-200 hover:-translate-y-0.5"
          >
            Get started free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

    </div>
  )
}

export default Hero
