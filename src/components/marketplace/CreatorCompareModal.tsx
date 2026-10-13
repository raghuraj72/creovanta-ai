'use client';

import React from 'react';
import { CreatorDNA, CreativeBrief } from '@/types';
import { calculateFitScore } from '@/lib/matching-engine';
import { useApp } from '@/lib/store';
import {
  X,
  Sparkles,
  ShieldCheck,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Trash2,
} from 'lucide-react';

interface CreatorCompareModalProps {
  creators: CreatorDNA[];
  brief: CreativeBrief | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectCreator?: (creatorId: string) => void;
}

export function CreatorCompareModal({
  creators,
  brief,
  isOpen,
  onClose,
  onSelectCreator,
}: CreatorCompareModalProps) {
  const { matchingWeights, toggleCompare, clearCompare } = useApp();

  if (!isOpen || creators.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-glow rounded-2xl max-w-5xl w-full p-6 border border-violet-500/30 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-violet-500/20 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Candidate Comparison Matrix</h3>
              <p className="text-xs text-slate-400">
                {brief
                  ? `Benchmarked against "${brief.title}"`
                  : 'Comparing Creative DNA profiles side-by-side'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 px-2.5 py-1 rounded bg-white/5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Matrix Comparison Table */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className={`grid grid-cols-${creators.length} gap-4`}>
            {creators.map((c) => {
              const matchResult = brief ? calculateFitScore(c, brief, matchingWeights) : null;
              return (
                <div
                  key={c.id}
                  className="rounded-xl bg-slate-900/80 border border-white/10 p-4 space-y-4 flex flex-col justify-between"
                >
                  {/* Card top */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.avatarUrl}
                          alt={c.displayName}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-violet-500/30"
                        />
                        <div>
                          <h4 className="font-bold text-white text-sm">{c.displayName}</h4>
                          <span className="text-[11px] text-slate-400">@{c.handle}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCompare(c.id)}
                        className="text-slate-500 hover:text-rose-400 text-xs p-1"
                        title="Remove from comparison"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 italic">
                      &ldquo;{c.positioningStatement}&rdquo;
                    </p>

                    {/* Fit score if brief selected */}
                    {matchResult && (
                      <div className="p-3 rounded-lg bg-violet-950/40 border border-violet-500/25 space-y-1 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                          Creative Fit
                        </div>
                        <div className="text-2xl font-mono font-extrabold text-cyan-300">
                          {matchResult.overallScore}%
                        </div>
                        <span className="text-[10px] font-semibold text-violet-300">
                          {matchResult.fitTier}
                        </span>
                      </div>
                    )}

                    {/* Verification Status */}
                    <div className="space-y-1 text-xs">
                      <span className="text-slate-400 text-[11px] block">Audit Rigor:</span>
                      <div className="flex items-center gap-1.5 font-medium text-slate-200">
                        <ShieldCheck
                          className={`w-4 h-4 ${
                            c.verifiedLevel === 'independently_reviewed'
                              ? 'text-cyan-400'
                              : c.verifiedLevel === 'evidence_attached'
                              ? 'text-violet-400'
                              : 'text-amber-400'
                          }`}
                        />
                        <span className="capitalize">{c.verifiedLevel.replace('_', ' ')}</span>
                      </div>
                      {c.verifiedBadge && (
                        <p className="text-[10px] text-slate-400">
                          Audited by {c.verifiedBadge.auditor} ({c.verifiedBadge.auditScore}/100)
                        </p>
                      )}
                    </div>

                    {/* Rates & Turnaround */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/5">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Indicative Rate:</span>
                        <span className="font-semibold text-white font-mono">
                          ${c.indicativeBudget.min.toLocaleString()} - ${c.indicativeBudget.max.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Turnaround:</span>
                        <span className="font-semibold text-cyan-300 font-mono">
                          {c.turnaroundDays} Days
                        </span>
                      </div>
                    </div>

                    {/* AI Tool Stack */}
                    <div className="space-y-1 text-xs pt-1 border-t border-white/5">
                      <span className="text-slate-400 text-[10px] block">AI Tooling:</span>
                      <div className="flex flex-wrap gap-1">
                        {c.aiToolsAndModels.slice(0, 4).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/5 text-slate-300"
                          >
                            {t.toolName} ({t.proficiency})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Supported Formats */}
                    <div className="space-y-1 text-xs pt-1 border-t border-white/5">
                      <span className="text-slate-400 text-[10px] block">Supported Formats:</span>
                      <p className="text-[11px] text-slate-300">{c.deliverableFormats.join(', ')}</p>
                    </div>

                    {/* Commercial licensing */}
                    <div className="space-y-1 text-xs pt-1 border-t border-white/5">
                      <span className="text-slate-400 text-[10px] block">Commercial IP:</span>
                      <p className="text-[11px] text-slate-300">
                        {c.commercialLicensing.commercialAllowed ? '✓ Full Commercial Allowed' : '✕ Restricted / Non-commercial'}
                        {c.commercialLicensing.trainingDataCleanGuarantee && ' • Clean Model Guarantee'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/10">
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectCreator) onSelectCreator(c.id);
                      }}
                      className="w-full py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-violet-500/20"
                    >
                      <span>Select for Brief</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white bg-white/5 border border-white/10"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
