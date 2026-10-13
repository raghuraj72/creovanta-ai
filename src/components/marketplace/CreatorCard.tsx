'use client';

import React from 'react';
import Link from 'next/link';
import { CreatorDNA, CreativeBrief } from '@/types';
import { calculateFitScore } from '@/lib/matching-engine';
import { useApp } from '@/lib/store';
import {
  Sparkles,
  ShieldCheck,
  Clock,
  DollarSign,
  Bookmark,
  Check,
  SlidersHorizontal,
  ChevronRight,
  HelpCircle,
  Eye,
} from 'lucide-react';

interface CreatorCardProps {
  creator: CreatorDNA;
  brief: CreativeBrief | null;
  onWhyThisMatch: (creator: CreatorDNA) => void;
  onQuickView?: (creator: CreatorDNA) => void;
}

export function CreatorCard({
  creator,
  brief,
  onWhyThisMatch,
  onQuickView,
}: CreatorCardProps) {
  const { shortlist, toggleShortlist, compareList, toggleCompare, matchingWeights } = useApp();

  const isShortlisted = shortlist.includes(creator.id);
  const isCompared = compareList.includes(creator.id);

  // Compute fit score if a brief is active
  const matchResult = brief ? calculateFitScore(creator, brief, matchingWeights) : null;
  const isDisqualified = matchResult?.fitTier === 'Disqualified';

  // Badges & Evidence styling
  const getVerificationBadge = () => {
    switch (creator.verifiedLevel) {
      case 'independently_reviewed':
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm"
            title="Independently audited by accredited Creative Intelligence Standards Board"
          >
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            Audited & Verified
          </span>
        );
      case 'evidence_attached':
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30"
            title="Authentic raw ComfyUI graphs, timelines, and prompt logs attached"
          >
            <ShieldCheck className="w-3 h-3 text-violet-400" />
            Evidence Attached
          </span>
        );
      case 'self_declared':
      default:
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700"
            title="Self-declared claims only; independent audit pending"
          >
            Self-Declared
          </span>
        );
    }
  };

  const getFitBadgeColor = (score: number) => {
    if (isDisqualified) return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (score >= 90) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (score >= 75) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    if (score >= 60) return 'bg-violet-500/20 text-violet-300 border-violet-500/40';
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-violet-500/15 hover:border-violet-500/35 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 flex flex-col group">
      {/* Portfolio Cover Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={creator.portfolio[0]?.thumbnailUrl || creator.bannerUrl}
          alt={creator.displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090B14] via-[#090B14]/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div>{getVerificationBadge()}</div>

          <div className="flex items-center gap-1.5">
            {/* Compare Checkbox */}
            <button
              onClick={() => toggleCompare(creator.id)}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium backdrop-blur-md transition-colors border ${
                isCompared
                  ? 'bg-cyan-500/30 text-cyan-200 border-cyan-500/50'
                  : 'bg-black/40 text-slate-300 hover:text-white border-white/10'
              }`}
              title="Add to side-by-side comparison matrix"
            >
              {isCompared ? 'Comparing' : '+ Compare'}
            </button>

            {/* Shortlist button */}
            <button
              onClick={() => toggleShortlist(creator.id)}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-colors border ${
                isShortlisted
                  ? 'bg-violet-500 text-white border-violet-400'
                  : 'bg-black/40 text-slate-300 hover:text-white border-white/10'
              }`}
              title={isShortlisted ? 'Saved in Shortlist' : 'Save to Shortlist'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Live Fit Score Pill if Brief Selected */}
        {matchResult && (
          <div className="absolute bottom-3 right-3">
            <button
              onClick={() => onWhyThisMatch(creator)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border backdrop-blur-md shadow-lg transition-transform hover:scale-105 ${getFitBadgeColor(
                matchResult.overallScore
              )}`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{matchResult.overallScore}% Match</span>
              <HelpCircle className="w-3 h-3 opacity-70" />
            </button>
          </div>
        )}
      </div>

      {/* Creator Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Avatar & Name */}
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={creator.avatarUrl}
              alt={creator.displayName}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-violet-500/30 -mt-6 relative z-10 bg-slate-900 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <Link
                  href={`/creators/${creator.id}`}
                  className="font-bold text-white text-sm hover:text-cyan-300 transition-colors truncate"
                >
                  {creator.displayName}
                </Link>
                <div className="text-[11px] font-mono text-amber-300 flex items-center gap-0.5">
                  ★ {creator.rating}
                  <span className="text-slate-500">({creator.completedProjects})</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 truncate">@{creator.handle}</p>
            </div>
          </div>

          {/* Positioning statement */}
          <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
            {creator.positioningStatement}
          </p>

          {/* AI Tools & Models */}
          <div className="mt-3 flex flex-wrap gap-1">
            {creator.aiToolsAndModels.slice(0, 3).map((tool, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800/80 border border-slate-700/60 text-slate-300 font-medium"
              >
                {tool.toolName}
              </span>
            ))}
            {creator.aiToolsAndModels.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-white/5 text-slate-400 font-mono">
                +{creator.aiToolsAndModels.length - 3}
              </span>
            )}
          </div>

          {/* Formats and styles pills */}
          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="truncate">
              Styles: <span className="text-slate-300">{creator.visualStyles.slice(0, 2).join(', ')}</span>
            </span>
          </div>
        </div>

        {/* Footer Meta & Actions */}
        <div className="pt-3 border-t border-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Indicative Rate</span>
              <span className="font-semibold text-white font-mono">
                ${creator.indicativeBudget.min.toLocaleString()} - ${creator.indicativeBudget.max.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Est. Turnaround</span>
              <span className="font-semibold text-cyan-300 font-mono flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3 text-cyan-400" />
                {creator.turnaroundDays}d
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onWhyThisMatch(creator)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>Why Match?</span>
            </button>
            <Link
              href={`/creators/${creator.id}`}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-1 shadow-md shadow-violet-500/20"
            >
              <span>Creative DNA</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
