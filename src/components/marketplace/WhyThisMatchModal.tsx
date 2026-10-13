'use client';

import React from 'react';
import { CreatorDNA, CreativeBrief } from '@/types';
import { calculateFitScore } from '@/lib/matching-engine';
import { useApp } from '@/lib/store';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Ban,
  Clock,
  DollarSign,
  ArrowRight,
  Bookmark,
  Share2,
} from 'lucide-react';

interface WhyThisMatchModalProps {
  creator: CreatorDNA;
  brief: CreativeBrief;
  isOpen: boolean;
  onClose: () => void;
  onInvite?: () => void;
}

export function WhyThisMatchModal({
  creator,
  brief,
  isOpen,
  onClose,
  onInvite,
}: WhyThisMatchModalProps) {
  const { matchingWeights, toggleShortlist, shortlist } = useApp();

  if (!isOpen) return null;

  const matchResult = calculateFitScore(creator, brief, matchingWeights);
  const isShortlisted = shortlist.includes(creator.id);

  // Score color helper
  const getScoreColor = (score: number, isDisqualified: boolean) => {
    if (isDisqualified) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 75) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (score >= 60) return 'text-violet-400 bg-violet-500/10 border-violet-500/30';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  const isDisqualified = matchResult.fitTier === 'Disqualified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-glow rounded-2xl max-w-2xl w-full p-6 border border-violet-500/30 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={creator.avatarUrl}
              alt={creator.displayName}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-violet-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg">{creator.displayName}</h3>
                <span className="text-xs text-slate-400">@{creator.handle}</span>
              </div>
              <p className="text-xs text-slate-300">
                Fit Engine Evaluation against: <span className="text-cyan-300 font-medium">&ldquo;{brief.title}&rdquo;</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Top Score Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-900/30 to-cyan-900/30 border border-violet-500/20 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Overall Creative DNA Fit Score
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {matchResult.overallScore}%
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getScoreColor(
                    matchResult.overallScore,
                    isDisqualified
                  )}`}
                >
                  {matchResult.fitTier}
                </span>
              </div>
            </div>

            <div className="text-right text-xs space-y-1">
              <div className="text-slate-400">
                Evidence Confidence:{' '}
                <strong className="text-slate-200">{matchResult.evidenceConfidence}</strong>
              </div>
              <div className="text-slate-400">
                Auditor Status:{' '}
                <strong className="text-cyan-300">{creator.humanReviewStatus.status}</strong>
              </div>
            </div>
          </div>

          {/* Hard Constraints Warning if any */}
          {matchResult.hardConstraintsViolated.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-rose-300">
                <Ban className="w-4 h-4 text-rose-400" />
                Hard Constraint Disqualification
              </div>
              {matchResult.hardConstraintsViolated.map((viol, i) => (
                <p key={i} className="text-rose-200/90 pl-6">
                  • {viol}
                </p>
              ))}
            </div>
          )}

          {/* Licensing warnings if any */}
          {matchResult.licensingWarnings.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Commercial Licensing Advisory
              </div>
              {matchResult.licensingWarnings.map((warn, i) => (
                <p key={i} className="text-amber-200/90 pl-5">
                  • {warn}
                </p>
              ))}
            </div>
          )}

          {/* Plain English Summary */}
          <div className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5">
            <span className="font-semibold text-white block mb-1">Algorithmic Reasoning:</span>
            {matchResult.plainEnglishSummary}
          </div>

          {/* 8 Dimension Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Dimension Breakdown (100% Normalized)
            </h4>

            <div className="space-y-2.5">
              {Object.values(matchResult.dimensionBreakdown).map((dim) => {
                const percentage = Math.round((dim.score / dim.maxScore) * 100);
                return (
                  <div key={dim.dimension} className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-200">{dim.label}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-400 text-[11px]">{dim.score} / {dim.maxScore} pts</span>
                        <span className="font-bold text-cyan-400">{percentage}%</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {dim.matchedItems.map((item, i) => (
                        <span
                          key={`m-${i}`}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {item}
                        </span>
                      ))}
                      {dim.partialItems.map((item, i) => (
                        <span
                          key={`p-${i}`}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/25"
                        >
                          ~ {item}
                        </span>
                      ))}
                      {dim.missingItems.map((item, i) => (
                        <span
                          key={`x-${i}`}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700"
                        >
                          ✕ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Questions to Ask */}
          <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-violet-300">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Recommended Clarifying Questions Before Hiring:
            </div>
            <ul className="space-y-1 text-slate-300 pl-5 list-disc text-[11px]">
              {matchResult.recommendedQuestions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={() => toggleShortlist(creator.id)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              isShortlisted
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            {isShortlisted ? 'In Shortlist' : 'Add to Shortlist'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
            >
              Close
            </button>
            {onInvite && (
              <button
                onClick={() => {
                  onClose();
                  onInvite();
                }}
                disabled={isDisqualified}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-white shadow-lg ${
                  isDisqualified
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                    : 'bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 shadow-violet-500/25'
                }`}
              >
                <span>Invite Creator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
