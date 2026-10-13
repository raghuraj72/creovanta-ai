'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import {
  FileText,
  Plus,
  Sparkles,
  DollarSign,
  Clock,
  Layers,
  ChevronRight,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

export default function BriefsListPage() {
  const { briefs, selectedBriefId, setSelectedBriefId, deleteBrief } = useApp();
  const { authUser } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-violet-500/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-cyan-400">
              Campaign Management
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {briefs.length} Campaign Briefs
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Brand Creative Briefs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Structured requirements objects driving the Creative DNA + Fit Engine.
          </p>
        </div>

        <Link
          href="/briefs/builder"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Brief Builder</span>
        </Link>
      </div>

      {/* Briefs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {briefs.map((brief) => {
          const isSelected = brief.id === selectedBriefId;
          return (
            <div
              key={brief.id}
              className={`glass-panel-glow rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-cyan-400/50 shadow-xl shadow-cyan-500/15 ring-1 ring-cyan-400/30'
                  : 'border-violet-500/15 hover:border-violet-500/35'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold capitalize ${
                      brief.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-700 text-slate-300 border-slate-600'
                    }`}
                  >
                    {brief.status}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 font-bold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Target Brief
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base leading-snug">{brief.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {brief.campaignObjective}
                </p>

                {/* Formats and styles */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {brief.visualStyleTags.map((style) => (
                    <span
                      key={style}
                      className="px-2 py-0.5 rounded text-[10px] bg-violet-500/10 text-violet-300 border border-violet-500/20"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meta & actions */}
              <div className="pt-3 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Target Budget</span>
                    <span className="font-mono font-bold text-white">
                      ${brief.budget.min.toLocaleString()} - ${brief.budget.max.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Deadline</span>
                    <span className="font-mono font-bold text-cyan-300">{brief.deadlineDays} Days</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setSelectedBriefId(brief.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Active Target' : 'Set as Target'}</span>
                  </button>
                  <Link
                    href="/marketplace"
                    className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                    title="Find Matching Creators for this brief"
                  >
                    <Sparkles className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
