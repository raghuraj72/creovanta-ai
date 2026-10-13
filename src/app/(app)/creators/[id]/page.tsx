'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { calculateFitScore } from '@/lib/matching-engine';
import { ArtifactDetailModal } from '@/components/creator/ArtifactDetailModal';
import { WhyThisMatchModal } from '@/components/marketplace/WhyThisMatchModal';
import { PortfolioArtifact } from '@/types';
import {
  ArrowLeft, Sparkles, ShieldCheck, Clock, DollarSign,
  Bookmark, GitCompare, Star, CheckCircle2, AlertTriangle,
  FileCode, Eye, Heart, ExternalLink, Layers, Info,
  ChevronDown, ChevronUp, MapPin, Award
} from 'lucide-react';

export default function CreatorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { creators, briefs, selectedBriefId, toggleShortlist, shortlist, matchingWeights, toggleCompare, compareList, submitProposal } = useApp();
  const { authUser } = useAuth();

  const [selectedArtifact, setSelectedArtifact] = useState<PortfolioArtifact | null>(null);
  const [showWhyMatch, setShowWhyMatch] = useState(false);
  const [expandWorkflow, setExpandWorkflow] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalBudget, setProposalBudget] = useState('');
  const [proposalCover, setProposalCover] = useState('');
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const creator = creators.find(c => c.id === id);
  const activeBrief = briefs.find(b => b.id === selectedBriefId) || null;
  const isShortlisted = shortlist.includes(id || '');
  const isCompared = compareList.includes(id || '');

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Creator not found.</p>
          <Link href="/marketplace" className="text-cyan-400 hover:underline">← Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  const matchResult = activeBrief ? calculateFitScore(creator, activeBrief, matchingWeights) : null;

  const getVerificationStyle = () => {
    switch (creator.verifiedLevel) {
      case 'independently_reviewed': return { bg: 'bg-cyan-500/15', border: 'border-cyan-500/35', text: 'text-cyan-300', label: 'Independently Reviewed & Audited' };
      case 'evidence_attached': return { bg: 'bg-violet-500/15', border: 'border-violet-500/35', text: 'text-violet-300', label: 'Evidence-Attached Profile' };
      default: return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-300', label: 'Self-Declared Profile' };
    }
  };
  const vStyle = getVerificationStyle();

  const handleSubmitProposal = () => {
    if (!activeBrief || !authUser) return;
    const budget = parseFloat(proposalBudget);
    if (!budget || budget <= 0) { alert('Please enter a valid budget'); return; }
    if (!proposalCover.trim()) { alert('Please enter a cover letter'); return; }
    submitProposal({
      briefId: activeBrief.id,
      creatorId: creator.id,
      brandId: activeBrief.brandId,
      proposedBudget: budget,
      proposedTurnaroundDays: creator.turnaroundDays,
      coverLetter: proposalCover,
      approachSummary: `Custom approach for ${activeBrief.title}`,
      suggestedMilestones: [
        { name: 'Creative Direction Lock', days: Math.floor(creator.turnaroundDays / 3), deliverables: 'Moodboards and concept deck' },
        { name: 'Final Delivery', days: creator.turnaroundDays, deliverables: 'All contracted assets' }
      ],
    });
    setProposalSubmitted(true);
    setShowProposalForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 border border-violet-500/20">
        <div className="h-56 w-full">
          <img src={creator.bannerUrl} alt={creator.displayName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090B14] via-[#090B14]/60 to-transparent" />
        </div>

        {/* Profile overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <img src={creator.avatarUrl} alt={creator.displayName}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-violet-500/40 shadow-2xl bg-slate-900" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-white">{creator.displayName}</h1>
              <span className="text-slate-400 text-sm">@{creator.handle}</span>
              {creator.verifiedLevel === 'independently_reviewed' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> CISB Verified
                </span>
              )}
            </div>
            <p className="text-slate-300 text-sm italic">{creator.positioningStatement}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-violet-400" />{creator.location}</span>
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {creator.rating} ({creator.reviewCount} reviews)</span>
              <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-cyan-400" />{creator.completedProjects} completed projects</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => toggleShortlist(creator.id)}
              className={`p-2.5 rounded-xl border transition-all ${isShortlisted ? 'bg-violet-500 border-violet-400 text-white' : 'bg-black/40 border-white/20 text-slate-300 hover:text-white backdrop-blur-sm'}`}>
              <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
            </button>
            <button onClick={() => toggleCompare(creator.id)}
              className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${isCompared ? 'bg-cyan-500/30 border-cyan-500/50 text-cyan-200' : 'bg-black/40 border-white/20 text-slate-300 hover:text-white backdrop-blur-sm'}`}>
              {isCompared ? 'In Compare' : '+ Compare'}
            </button>
            {matchResult && (
              <button onClick={() => setShowWhyMatch(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all">
                <Sparkles className="w-3.5 h-3.5" /> {matchResult.overallScore}% Match — Why?
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="glass-panel rounded-2xl p-6 border border-violet-500/15">
            <h2 className="font-bold text-white mb-3 flex items-center gap-2"><Info className="w-4 h-4 text-cyan-400" /> About</h2>
            <p className="text-slate-300 text-sm leading-relaxed">{creator.bio}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {creator.specializations.map(spec => (
                <span key={spec} className="px-2.5 py-1 rounded-lg text-xs bg-violet-500/15 text-violet-300 border border-violet-500/25">{spec}</span>
              ))}
            </div>
          </div>

          {/* AI Tools & Models */}
          <div className="glass-panel rounded-2xl p-6 border border-violet-500/15">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Layers className="w-4 h-4 text-cyan-400" /> AI Tools & Models</h2>
            <div className="space-y-3">
              {creator.aiToolsAndModels.map((tool, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div>
                    <div className="font-semibold text-white text-sm">{tool.toolName}</div>
                    <div className="text-xs text-slate-400">Version: {tool.version} · {tool.category}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {tool.commercialLicense && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Commercial
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      tool.proficiency === 'Expert' ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25' :
                      tool.proficiency === 'Advanced' ? 'bg-violet-500/15 text-violet-300 border-violet-500/25' :
                      'bg-slate-700 text-slate-400 border-slate-600'
                    }`}>{tool.proficiency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Production Workflow */}
          <div className="glass-panel rounded-2xl p-6 border border-violet-500/15">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2"><FileCode className="w-4 h-4 text-cyan-400" /> Production Workflow</h2>
              <button onClick={() => setExpandWorkflow(v => !v)} className="text-slate-400 hover:text-white">
                {expandWorkflow ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            {(expandWorkflow || creator.workflowStages.length <= 2) && (
              <div className="space-y-3">
                {creator.workflowStages.map((stage, i) => (
                  <div key={i} className="flex gap-4 p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0 mt-0.5">
                      {stage.stepNumber}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{stage.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{stage.description}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] text-slate-500">Tools: {stage.tooling}</span>
                        <span className="text-[11px] font-mono text-cyan-300">{stage.humanInterventionRatio}% Human</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!expandWorkflow && creator.workflowStages.length > 2 && (
              <button onClick={() => setExpandWorkflow(true)} className="text-xs text-cyan-400 hover:underline mt-2">
                Show all {creator.workflowStages.length} workflow stages
              </button>
            )}
          </div>

          {/* Portfolio */}
          <div className="glass-panel rounded-2xl p-6 border border-violet-500/15">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Eye className="w-4 h-4 text-cyan-400" /> Portfolio ({creator.portfolio.length} works)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {creator.portfolio.map((artifact) => (
                <button key={artifact.id} onClick={() => setSelectedArtifact(artifact)}
                  className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition-all hover:shadow-lg hover:shadow-violet-500/10 text-left">
                  <div className="h-44 overflow-hidden bg-slate-900">
                    <img src={artifact.thumbnailUrl} alt={artifact.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090B14] via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/40 text-violet-200 backdrop-blur-sm border border-violet-500/30">{artifact.category}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded backdrop-blur-sm border ${
                        artifact.evidenceLevel === 'independently_reviewed' ? 'bg-cyan-500/30 border-cyan-500/40 text-cyan-200' :
                        artifact.evidenceLevel === 'evidence_attached' ? 'bg-violet-500/30 border-violet-500/40 text-violet-200' :
                        'bg-slate-700/80 border-slate-600 text-slate-300'
                      }`}>
                        {artifact.evidenceLevel.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="font-semibold text-white text-sm mt-1 truncate">{artifact.title}</div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{artifact.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-400" />{artifact.likes}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="glass-panel-glow rounded-2xl p-5 border border-violet-500/25">
            <h3 className="font-bold text-white text-sm mb-4">At a Glance</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400">Indicative Rate</span>
                <span className="font-mono font-bold text-white">${creator.indicativeBudget.min.toLocaleString()} – ${creator.indicativeBudget.max.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400">Turnaround</span>
                <span className="font-mono font-bold text-cyan-300 flex items-center gap-1"><Clock className="w-3 h-3" />{creator.turnaroundDays} Days</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400">Availability</span>
                <span className={`font-semibold capitalize ${creator.availability === 'immediate' ? 'text-emerald-400' : creator.availability === 'booked' ? 'text-rose-400' : 'text-amber-300'}`}>
                  {creator.availability.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400">Audit Status</span>
                <span className={`font-semibold text-xs ${vStyle.text}`}>
                  {creator.verifiedLevel === 'independently_reviewed' ? 'CISB Verified ✓' : creator.verifiedLevel === 'evidence_attached' ? 'Evidence Attached' : 'Self-Declared'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400">Deliverable Formats</span>
                <span className="text-slate-300 text-right max-w-[150px] text-[11px]">{creator.deliverableFormats.slice(0, 2).join(', ')}</span>
              </div>
            </div>

            {/* Match Score */}
            {matchResult && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400">Creative Fit Score</span>
                  <span className="font-mono font-extrabold text-cyan-400 text-lg">{matchResult.overallScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${matchResult.overallScore}%` }} />
                </div>
                <p className="text-[10px] text-violet-300 mt-1.5 font-semibold">{matchResult.fitTier}</p>
                <button onClick={() => setShowWhyMatch(true)}
                  className="mt-2 w-full py-2 rounded-lg text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 transition-colors">
                  Why This Match? →
                </button>
              </div>
            )}
          </div>

          {/* Commercial Licensing */}
          <div className="glass-panel rounded-2xl p-5 border border-violet-500/15">
            <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-cyan-400" /> Commercial Licensing</h3>
            <div className="space-y-2 text-xs text-slate-300">
              {[
                { label: 'Commercial Use', value: creator.commercialLicensing.commercialAllowed },
                { label: 'Exclusive Rights', value: creator.commercialLicensing.exclusiveRightsAvailable },
                { label: 'Clean Model Guarantee', value: creator.commercialLicensing.trainingDataCleanGuarantee },
                { label: 'Copyright Indemnity', value: creator.commercialLicensing.copyrightIndemnitySupported },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{label}</span>
                  {value ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">{creator.commercialLicensing.disclosedLicenseTerms}</p>
          </div>

          {/* Invite / Propose */}
          {authUser?.role === 'brand' && activeBrief && (
            <div className="glass-panel-glow rounded-2xl p-5 border border-violet-500/25">
              <h3 className="font-bold text-white text-sm mb-3">Invite to Brief</h3>
              <p className="text-xs text-slate-400 mb-3">Active brief: <span className="text-violet-300 font-medium">{activeBrief.title}</span></p>
              {proposalSubmitted ? (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Invitation sent successfully!
                </div>
              ) : showProposalForm ? (
                <div className="space-y-3">
                  <input type="number" value={proposalBudget} onChange={e => setProposalBudget(e.target.value)}
                    placeholder="Proposed budget ($)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400" />
                  <textarea value={proposalCover} onChange={e => setProposalCover(e.target.value)}
                    placeholder="Message to creator..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 resize-none" />
                  <div className="flex gap-2">
                    <button onClick={() => setShowProposalForm(false)} className="flex-1 py-2 rounded-xl text-xs border border-white/10 text-slate-400 hover:text-white">Cancel</button>
                    <button onClick={handleSubmitProposal} className="flex-1 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white">Send Invite</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowProposalForm(true)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-violet-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Send Invitation
                </button>
              )}
            </div>
          )}

          {/* Visual Styles */}
          <div className="glass-panel rounded-2xl p-5 border border-violet-500/15">
            <h3 className="font-bold text-white text-sm mb-3">Visual Style Repertoire</h3>
            <div className="flex flex-wrap gap-1.5">
              {creator.visualStyles.map(style => (
                <span key={style} className="px-2.5 py-1 rounded-lg text-xs bg-violet-500/10 text-violet-300 border border-violet-500/20">{style}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Artifact Detail Modal */}
      <ArtifactDetailModal artifact={selectedArtifact} onClose={() => setSelectedArtifact(null)} />

      {/* Why This Match Modal */}
      {showWhyMatch && activeBrief && (
        <WhyThisMatchModal creator={creator} brief={activeBrief} isOpen={showWhyMatch}
          onClose={() => setShowWhyMatch(false)}
          onInvite={() => { setShowWhyMatch(false); setShowProposalForm(true); }} />
      )}
    </div>
  );
}
