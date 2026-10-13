'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { AlertCircle, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

export function DemoModeBanner() {
  const { isDemoMode, resetDemoData, currentUser } = useApp();

  if (!isDemoMode) return null;

  return (
    <div className="w-full bg-gradient-to-r from-violet-950/80 via-slate-900/90 to-cyan-950/80 border-b border-violet-500/20 py-1.5 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 font-semibold text-[10px] border border-cyan-400/30">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            HACKATHON DEMO MODE ACTIVE
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Local persistence enabled. Current session as: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role}).
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Zero cloud credentials required
          </span>
          <button
            onClick={resetDemoData}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
            title="Reset seeded demo data back to clean state"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
}
