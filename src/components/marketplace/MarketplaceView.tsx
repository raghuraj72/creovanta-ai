'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { CreatorDNA, CreativeBrief } from '@/types';
import { CreatorCard } from './CreatorCard';
import { WhyThisMatchModal } from './WhyThisMatchModal';
import { CreatorCompareModal } from './CreatorCompareModal';
import { calculateFitScore } from '@/lib/matching-engine';
import { parseNaturalLanguageCreatorSearch } from '@/lib/ai-service';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Layers,
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

export function MarketplaceView() {
  const {
    creators,
    briefs,
    selectedBriefId,
    setSelectedBriefId,
    compareList,
    clearCompare,
    matchingWeights,
  } = useApp();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearchActive, setIsAiSearchActive] = useState(false);
  const [aiSearchSummary, setAiSearchSummary] = useState<string | null>(null);

  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [maxBudgetFilter, setMaxBudgetFilter] = useState<number>(15000);
  const [maxTurnaroundFilter, setMaxTurnaroundFilter] = useState<number>(14);
  const [commercialOnlyFilter, setCommercialOnlyFilter] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'fit' | 'budget_asc' | 'budget_desc' | 'turnaround' | 'rating'>('fit');

  // Modals
  const [selectedCreatorForWhy, setSelectedCreatorForWhy] = useState<CreatorDNA | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const activeBrief = briefs.find((b) => b.id === selectedBriefId) || null;

  // Handle Natural Language Search
  const handleAiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const parsed = parseNaturalLanguageCreatorSearch(searchQuery);
    setAiSearchSummary(parsed.explanation);

    if (parsed.tools && parsed.tools.length > 0) {
      setSelectedTool(parsed.tools[0]);
    }
    if (parsed.maxBudget) {
      setMaxBudgetFilter(parsed.maxBudget);
    }
    if (parsed.maxTurnaroundDays) {
      setMaxTurnaroundFilter(parsed.maxTurnaroundDays);
    }
    if (parsed.commercialOnly) {
      setCommercialOnlyFilter(true);
    }
    if (parsed.evidenceRequired) {
      setSelectedVerification('evidence_or_reviewed');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setAiSearchSummary(null);
    setSelectedSpecialization('all');
    setSelectedTool('all');
    setSelectedStyle('all');
    setSelectedFormat('all');
    setSelectedVerification('all');
    setMaxBudgetFilter(15000);
    setMaxTurnaroundFilter(14);
    setCommercialOnlyFilter(false);
    setSortBy('fit');
  };

  // Filter & Sort Logic
  const filteredCreators = useMemo(() => {
    return creators
      .filter((c) => {
        // Text search across name, handle, positioning, tools
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = c.displayName.toLowerCase().includes(q);
          const matchHandle = c.handle.toLowerCase().includes(q);
          const matchBio = c.positioningStatement.toLowerCase().includes(q);
          const matchTools = c.aiToolsAndModels.some((t) => t.toolName.toLowerCase().includes(q));
          const matchStyles = c.visualStyles.some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchHandle && !matchBio && !matchTools && !matchStyles) {
            return false;
          }
        }

        // Specialization
        if (selectedSpecialization !== 'all') {
          if (!c.specializations.includes(selectedSpecialization)) return false;
        }

        // Tool
        if (selectedTool !== 'all') {
          const hasTool = c.aiToolsAndModels.some((t) =>
            t.toolName.toLowerCase().includes(selectedTool.toLowerCase())
          );
          if (!hasTool) return false;
        }

        // Visual Style
        if (selectedStyle !== 'all') {
          if (!c.visualStyles.includes(selectedStyle)) return false;
        }

        // Deliverable Format
        if (selectedFormat !== 'all') {
          const hasFormat = c.deliverableFormats.some((f) =>
            f.toLowerCase().includes(selectedFormat.toLowerCase())
          );
          if (!hasFormat) return false;
        }

        // Verification level
        if (selectedVerification === 'independently_reviewed') {
          if (c.verifiedLevel !== 'independently_reviewed') return false;
        } else if (selectedVerification === 'evidence_or_reviewed') {
          if (c.verifiedLevel === 'self_declared') return false;
        } else if (selectedVerification === 'evidence_attached') {
          if (c.verifiedLevel !== 'evidence_attached') return false;
        }

        // Budget
        if (c.indicativeBudget.min > maxBudgetFilter) return false;

        // Turnaround
        if (c.turnaroundDays > maxTurnaroundFilter) return false;

        // Commercial license only
        if (commercialOnlyFilter && !c.commercialLicensing.commercialAllowed) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'fit' && activeBrief) {
          const scoreA = calculateFitScore(a, activeBrief, matchingWeights).overallScore;
          const scoreB = calculateFitScore(b, activeBrief, matchingWeights).overallScore;
          return scoreB - scoreA;
        }
        if (sortBy === 'budget_asc') {
          return a.indicativeBudget.min - b.indicativeBudget.min;
        }
        if (sortBy === 'budget_desc') {
          return b.indicativeBudget.min - a.indicativeBudget.min;
        }
        if (sortBy === 'turnaround') {
          return a.turnaroundDays - b.turnaroundDays;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return 0;
      });
  }, [
    creators,
    searchQuery,
    selectedSpecialization,
    selectedTool,
    selectedStyle,
    selectedFormat,
    selectedVerification,
    maxBudgetFilter,
    maxTurnaroundFilter,
    commercialOnlyFilter,
    sortBy,
    activeBrief,
    matchingWeights,
  ]);

  // Extract unique options for filter dropdowns
  const specializations = Array.from(new Set(creators.flatMap((c) => c.specializations)));
  const tools = ['Runway', 'Sora', 'Flux.1', 'Midjourney', 'ComfyUI', 'Kling', 'Luma', 'Firefly'];
  const styles = Array.from(new Set(creators.flatMap((c) => c.visualStyles)));

  // Compared creators array
  const comparedCreators = creators.filter((c) => compareList.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header & Target Brief Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-violet-500/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-cyan-400">
              Creative Intelligence Marketplace
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {filteredCreators.length} Available Creators
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Discover Verified AI Creators
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Evaluate authentic Creative DNA profiles, model proficiencies, ComfyUI evidence graphs, and deterministic compatibility.
          </p>
        </div>

        {/* Selected Brief Banner */}
        <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-600/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">
              Active Evaluation Brief
            </span>
            <span className="font-bold text-white max-w-[200px] truncate block">
              {activeBrief ? activeBrief.title : 'None Selected'}
            </span>
          </div>
          <select
            value={selectedBriefId || ''}
            onChange={(e) => setSelectedBriefId(e.target.value || null)}
            className="text-xs bg-slate-900 border border-violet-500/30 text-slate-200 rounded-lg px-2 py-1 focus:outline-none"
          >
            {briefs.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Search Bar with Natural Language AI Parser */}
      <div className="glass-panel-glow rounded-2xl p-4 border border-violet-500/25 space-y-3">
        <form onSubmit={handleAiSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search creators or type natural prompt (e.g. "Runway video director under $8k with verified commercial license")'
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-violet-500/25 transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Semantic Parse</span>
          </button>
        </form>

        {/* AI Parse Feedback Badge if present */}
        {aiSearchSummary && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Parsed Intent: <strong>{aiSearchSummary}</strong></span>
            </span>
            <button
              onClick={() => setAiSearchSummary(null)}
              className="text-slate-400 hover:text-white text-[11px]"
            >
              Clear
            </button>
          </div>
        )}

        {/* Quick Filter Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-white/5 text-xs">
          {/* Specialization Filter */}
          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
              Specialization
            </label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/10 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
            >
              <option value="all">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* AI Tool Filter */}
          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
              Tool / Model
            </label>
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/10 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
            >
              <option value="all">All AI Tools</option>
              {tools.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Audit Filter */}
          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
              Audit Status
            </label>
            <select
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/10 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="independently_reviewed">Independently Reviewed</option>
              <option value="evidence_or_reviewed">Evidence Attached or Higher</option>
              <option value="evidence_attached">Evidence Attached</option>
            </select>
          </div>

          {/* Max Budget Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] uppercase font-semibold text-slate-400">
                Max Budget
              </label>
              <span className="text-[10px] font-mono text-cyan-300">
                ${maxBudgetFilter.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="15000"
              step="500"
              value={maxBudgetFilter}
              onChange={(e) => setMaxBudgetFilter(parseInt(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          {/* Max Turnaround Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] uppercase font-semibold text-slate-400">
                Turnaround
              </label>
              <span className="text-[10px] font-mono text-cyan-300">
                ≤ {maxTurnaroundFilter} Days
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="14"
              step="1"
              value={maxTurnaroundFilter}
              onChange={(e) => setMaxTurnaroundFilter(parseInt(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'fit' | 'budget_asc' | 'budget_desc' | 'turnaround' | 'rating')}
              className="w-full bg-slate-900/90 border border-white/10 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
            >
              <option value="fit">Creative Fit Score</option>
              <option value="rating">Auditor Rating</option>
              <option value="budget_asc">Budget: Low to High</option>
              <option value="budget_desc">Budget: High to Low</option>
              <option value="turnaround">Turnaround Speed</option>
            </select>
          </div>
        </div>

        {/* Secondary Toggles & Clear */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
            <input
              type="checkbox"
              checked={commercialOnlyFilter}
              onChange={(e) => setCommercialOnlyFilter(e.target.checked)}
              className="rounded accent-violet-500 w-3.5 h-3.5"
            />
            <span>Full Commercial Rights Permitted Only</span>
          </label>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Main Creator Grid */}
      {filteredCreators.length === 0 ? (
        /* Empty State */
        <div className="glass-panel rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4 border border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mx-auto text-violet-300">
            <Filter className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Matching Creators Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              None of the creators match your strict combination of filters (budget, turnaround, tools, and commercial rights).
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white inline-flex items-center gap-1.5 shadow-lg shadow-violet-500/25"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filter Constraints
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              brief={activeBrief}
              onWhyThisMatch={(c) => setSelectedCreatorForWhy(c)}
            />
          ))}
        </div>
      )}

      {/* Floating Comparison Dock if candidates selected */}
      {comparedCreators.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-panel-glow rounded-2xl px-5 py-3 border border-cyan-400/30 shadow-2xl flex items-center gap-4 animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">
              Comparing ({comparedCreators.length}/3):
            </span>
            <div className="flex -space-x-2">
              {comparedCreators.map((c) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={c.id}
                  src={c.avatarUrl}
                  alt={c.displayName}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-[#090B14]"
                  title={c.displayName}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20"
            >
              Open Comparison Matrix
            </button>
            <button
              onClick={clearCompare}
              className="text-slate-400 hover:text-rose-400 text-xs p-1"
              title="Clear comparison list"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Why This Match Modal */}
      {selectedCreatorForWhy && activeBrief && (
        <WhyThisMatchModal
          creator={selectedCreatorForWhy}
          brief={activeBrief}
          isOpen={!!selectedCreatorForWhy}
          onClose={() => setSelectedCreatorForWhy(null)}
          onInvite={() => {
            alert(`Invitation sent to ${selectedCreatorForWhy.displayName} for "${activeBrief.title}"!`);
          }}
        />
      )}

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <CreatorCompareModal
          creators={comparedCreators}
          brief={activeBrief}
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
        />
      )}
    </div>
  );
}
