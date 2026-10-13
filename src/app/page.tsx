'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-store';
import {
  Sparkles, ArrowRight, ShieldCheck, Cpu, Layers, BarChart3,
  FileText, GitCompare, Star, Zap, Lock, CheckCircle2, Users, TrendingUp
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const stats = [
    { label: 'Verified Creators', value: '127', icon: Users },
    { label: 'Published Briefs', value: '43', icon: FileText },
    { label: 'Client Satisfaction', value: '98.6%', icon: Star },
    { label: 'Avg Turnaround', value: '5.2 Days', icon: Zap },
  ];

  const features = [
    { icon: Cpu, title: 'Creative DNA Engine', desc: 'Every creator has a structured DNA profile: AI tools, model versions, verified workflow stages, evidence quality, and Commercial licensing status.' },
    { icon: FileText, title: 'AI Brief Builder', desc: '8-step structured brief with AI Copilot to transform rough ideas into structured requirements, detect conflicts, and suggest missing information.' },
    { icon: BarChart3, title: '8-Dimension Fit Score', desc: 'Deterministic weighted scoring across skills, tools, formats, style, budget, deadline, licensing, and evidence — with full transparency.' },
    { icon: ShieldCheck, title: 'Evidence Verification', desc: 'Self-declared, evidence-attached, and independently reviewed tiers. Never presenting unverified claims as authenticated facts.' },
    { icon: Layers, title: 'Full Project Lifecycle', desc: 'Brief → Discovery → Proposal → Project → Deliverable → Review → Revision → Completion with state badges and audit trail.' },
    { icon: GitCompare, title: 'Comparison Matrix', desc: 'Compare up to 3 creators side-by-side against a brief. AI budget, tools, licensing, evidence, and fit score in one view.' },
  ];

  return (
    <div className="min-h-screen ambient-mesh relative overflow-x-hidden">
      {/* Ambient orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/6 blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-400/5 blur-3xl animate-pulse-glow pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 w-full glass-panel border-b border-violet-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1.5px]">
              <div className="w-full h-full bg-[#090B14] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-cyan-400" />
              </div>
            </div>
            <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent">CREOVANTA AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/marketplace" className="hidden sm:block text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">Marketplace</Link>
            {isAuthenticated ? (
              <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center gap-1.5 shadow-lg shadow-violet-500/25">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link href="/auth/signin" className="text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">Sign In</Link>
                <Link href="/auth/signup" className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/25">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-semibold text-violet-300 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          AI Creative Intelligence Marketplace
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[0.95] mb-6">
          <span className="bg-gradient-to-r from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent">CREOVANTA</span>
          <span className="text-white"> AI</span>
        </h1>
        <p className="text-xl sm:text-2xl text-slate-300 font-light mb-4 max-w-2xl mx-auto">
          Proof of Creativity.<br />
          <span className="text-cyan-300 font-semibold">Intelligence in Every Match.</span>
        </p>
        <p className="text-slate-400 max-w-xl mx-auto mb-10 text-sm sm:text-base">
          Connect brands with the world&apos;s most verified AI creators through transparent DNA-based matching, evidence audits, and a complete project lifecycle.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/marketplace" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-base flex items-center gap-2 shadow-xl shadow-violet-500/30 transition-all hover:scale-105">
            <Sparkles className="w-5 h-5" /> Explore Creators
          </Link>
          <Link href={isAuthenticated ? '/briefs/builder' : '/auth/signup'}
            className="px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 hover:border-violet-500/40 text-white font-semibold text-base flex items-center gap-2 transition-all">
            <FileText className="w-5 h-5" /> Post a Brief
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 mb-24">
        <div className="glass-panel-glow rounded-2xl p-6 border border-violet-500/20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mx-auto mb-2">
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">The Intelligence Layer</h2>
          <p className="text-slate-400 max-w-lg mx-auto">Purpose-built tools for the generative AI creative economy.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-panel rounded-2xl p-6 border border-violet-500/15 hover:border-violet-500/35 transition-all hover:shadow-lg hover:shadow-violet-500/10 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-600/30 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Verification Trust Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="glass-panel-glow rounded-2xl p-8 border border-cyan-500/20">
          <h2 className="text-2xl font-black text-white mb-2 text-center">Transparent Evidence Standards</h2>
          <p className="text-slate-400 text-center text-sm mb-8">We never present self-declared claims as independently verified facts.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { tier: 'Self-Declared', color: 'amber', icon: '⚠️', desc: 'Creator claims their own capabilities without attached proof files. Information presented as reported, not verified.' },
              { tier: 'Evidence Attached', color: 'violet', icon: '📎', desc: 'Raw ComfyUI graphs, DaVinci timelines, prompt history logs, or screen recordings are attached and viewable.' },
              { tier: 'Independently Reviewed', color: 'cyan', icon: '✅', desc: 'An authorized CISB auditor has independently verified workflow reproducibility, copyright boundaries, and tool authenticity.' },
            ].map(({ tier, color, icon, desc }) => (
              <div key={tier} className={`p-5 rounded-xl border ${
                color === 'cyan' ? 'border-cyan-500/30 bg-cyan-500/5' :
                color === 'violet' ? 'border-violet-500/30 bg-violet-500/5' :
                'border-amber-500/30 bg-amber-500/5'
              }`}>
                <div className="text-2xl mb-2">{icon}</div>
                <h3 className={`font-bold mb-2 ${
                  color === 'cyan' ? 'text-cyan-300' : color === 'violet' ? 'text-violet-300' : 'text-amber-300'
                }`}>{tier}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
        <div className="glass-panel-glow rounded-2xl p-10 border border-violet-500/25">
          <h2 className="text-3xl font-black text-white mb-3">Ready to Build Smarter Campaigns?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Join 127+ verified AI creators and leading brand teams on CREOVANTA AI.</p>
          <Link href={isAuthenticated ? '/dashboard' : '/auth/signup'}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-base shadow-xl shadow-violet-500/30 hover:scale-105 transition-all">
            {isAuthenticated ? 'Open Dashboard' : 'Start Free'} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-violet-500/15 py-8 text-center text-xs text-slate-500">
        <p>© 2026 CREOVANTA AI. Hackathon Creative Intelligence Challenge Edition.</p>
        <p className="mt-1">Built with Next.js 15 + Tailwind 4 + Deterministic Fit Engine</p>
      </footer>
    </div>
  );
}
