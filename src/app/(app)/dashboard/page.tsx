'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import { calculateFitScore } from '@/lib/matching-engine';
import {
  Sparkles, FileText, Bookmark, FolderOpen, ArrowRight,
  Clock, DollarSign, Plus, ChevronRight, ShieldCheck,
  BarChart3, Users, Zap, TrendingUp, AlertCircle, CheckCircle2
} from 'lucide-react';

const STATUS_BADGES: Record<string, string> = {
  published: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  draft: 'bg-slate-700 text-slate-300 border-slate-600',
  in_progress: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  completed: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  active_project: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  deliverable_submitted: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  accepted: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  declined: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

export default function DashboardPage() {
  const { authUser } = useAuth();
  const { briefs, creators, projects, proposals, shortlist, matchingWeights } = useApp();

  if (!authUser) return null;

  const myBriefs = briefs.filter(b => b.brandId === 'user-brand-1');
  const myProjects = projects.filter(p => authUser.role === 'brand' ? p.brandId === 'user-brand-1' : p.creatorId === 'creator-1');
  const shortlistedCreators = creators.filter(c => shortlist.includes(c.id));
  const myProposals = proposals.filter(p => authUser.role === 'brand' ? p.brandId === 'user-brand-1' : p.creatorId === 'creator-1');
  const activeBrief = briefs.find(b => b.status === 'published');

  if (authUser.role === 'creator') {
    // Creator Dashboard
    const openBriefs = briefs.filter(b => b.status === 'published');
    const activeProjects = myProjects.filter(p => p.status === 'active_project' || p.status === 'deliverable_submitted');
    const completedProjects = myProjects.filter(p => p.status === 'completed');

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Creator Workspace</h1>
            <p className="text-slate-400 text-sm mt-1">Welcome back, {authUser.name}</p>
          </div>
          <Link href="/marketplace" className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5" /> Browse Briefs
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Open Briefs', value: openBriefs.length, icon: FileText, color: 'violet' },
            { label: 'Active Projects', value: activeProjects.length, icon: FolderOpen, color: 'cyan' },
            { label: 'Proposals Sent', value: myProposals.length, icon: Sparkles, color: 'indigo' },
            { label: 'Completed', value: completedProjects.length, icon: CheckCircle2, color: 'emerald' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-panel rounded-xl p-4 border border-violet-500/15">
              <Icon className={`w-5 h-5 mb-2 text-${color}-400`} />
              <div className="text-2xl font-bold text-white font-mono">{value}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        {/* Matching Open Briefs */}
        <div className="glass-panel-glow rounded-2xl p-6 border border-violet-500/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400" /> Matching Open Briefs</h2>
            <Link href="/marketplace" className="text-xs text-cyan-400 hover:underline">Browse All</Link>
          </div>
          <div className="space-y-3">
            {openBriefs.map(brief => {
              const creator = creators[0];
              const score = creator ? calculateFitScore(creator, brief, matchingWeights) : null;
              return (
                <div key={brief.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-violet-500/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{brief.title}</div>
                    <div className="text-xs text-slate-400">{brief.brandName} · ${brief.budget.min.toLocaleString()}-${brief.budget.max.toLocaleString()} · {brief.deadlineDays}d deadline</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {score && <span className="text-xs font-mono font-bold text-cyan-300">{score.overallScore}% fit</span>}
                    <Link href={`/marketplace`} className="text-xs px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30">Submit Proposal</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Projects */}
        <div className="glass-panel rounded-2xl p-6 border border-violet-500/15">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-cyan-400" /> My Projects</h2>
          {myProjects.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No projects yet. Browse briefs and submit your first proposal!</p>
          ) : (
            <div className="space-y-3">
              {myProjects.map(proj => (
                <Link key={proj.id} href={`/projects/${proj.id}`} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-violet-500/30 transition-colors block">
                  <div>
                    <div className="font-semibold text-white text-sm">{proj.title}</div>
                    <div className="text-xs text-slate-400">{proj.brandName} · ${proj.contractAmount.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS_BADGES[proj.status] || STATUS_BADGES['active_project']}`}>
                      {proj.status.replace(/_/g, ' ')}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Brand Dashboard
  const pendingProposals = myProposals.filter(p => p.status === 'pending');
  const activeProjects = myProjects.filter(p => ['active_project', 'deliverable_submitted', 'brand_review'].includes(p.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-bold text-cyan-400">Brand Workspace</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Welcome, {authUser.name.split(' ')[0]}</h1>
          <p className="text-slate-400 text-sm">{authUser.companyOrTitle}</p>
        </div>
        <Link href="/briefs/builder" className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-violet-500/25">
          <Plus className="w-4 h-4" /> Create New Brief
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Campaigns', value: myBriefs.filter(b => b.status === 'published' || b.status === 'in_progress').length, icon: TrendingUp, color: 'violet' },
          { label: 'Draft Briefs', value: myBriefs.filter(b => b.status === 'draft').length, icon: FileText, color: 'slate' },
          { label: 'Creator Shortlist', value: shortlist.length, icon: Bookmark, color: 'cyan' },
          { label: 'Active Projects', value: activeProjects.length, icon: FolderOpen, color: 'indigo' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-panel rounded-xl p-4 border border-violet-500/15 hover:border-violet-500/30 transition-colors">
            <Icon className={`w-5 h-5 mb-2 ${color === 'violet' ? 'text-violet-400' : color === 'cyan' ? 'text-cyan-400' : color === 'indigo' ? 'text-indigo-400' : 'text-slate-400'}`} />
            <div className="text-2xl font-bold text-white font-mono">{value}</div>
            <div className="text-xs text-slate-400">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Briefs column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel-glow rounded-2xl p-6 border border-violet-500/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2"><FileText className="w-4 h-4 text-cyan-400" /> My Campaigns</h2>
              <Link href="/briefs" className="text-xs text-cyan-400 hover:underline">All Briefs</Link>
            </div>
            <div className="space-y-3">
              {myBriefs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm mb-3">No briefs yet.</p>
                  <Link href="/briefs/builder" className="text-xs text-cyan-400 hover:underline">+ Create your first brief</Link>
                </div>
              ) : myBriefs.map(b => (
                <div key={b.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-violet-500/30 transition-colors">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="font-semibold text-white text-sm truncate">{b.title}</div>
                    <div className="text-xs text-slate-400">${b.budget.min.toLocaleString()}-${b.budget.max.toLocaleString()} · {b.deadlineDays}d deadline</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS_BADGES[b.status] || STATUS_BADGES['draft']}`}>
                      {b.status.replace(/_/g, ' ')}
                    </span>
                    <Link href="/marketplace" className="text-[10px] text-violet-300 hover:text-violet-200">
                      <Sparkles className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects */}
          <div className="glass-panel rounded-2xl p-6 border border-violet-500/15">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2"><FolderOpen className="w-4 h-4 text-cyan-400" /> Active Projects</h2>
              <Link href="/projects" className="text-xs text-cyan-400 hover:underline">All Projects</Link>
            </div>
            {myProjects.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No active projects.</p>
            ) : (
              <div className="space-y-3">
                {myProjects.slice(0, 3).map(proj => (
                  <Link key={proj.id} href={`/projects/${proj.id}`} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-violet-500/30 transition-colors block">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="font-semibold text-white text-sm truncate">{proj.title}</div>
                      <div className="text-xs text-slate-400">{proj.creatorName} · ${proj.contractAmount.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${STATUS_BADGES[proj.status] || STATUS_BADGES['active_project']}`}>
                        {proj.status.replace(/_/g, ' ')}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Pending Proposals */}
          {pendingProposals.length > 0 && (
            <div className="glass-panel rounded-2xl p-5 border border-amber-500/25">
              <h2 className="font-bold text-white text-sm mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-400" /> Proposals to Review ({pendingProposals.length})</h2>
              {pendingProposals.map(prop => {
                const creator = creators.find(c => c.id === prop.creatorId);
                return (
                  <div key={prop.id} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                    <div className="font-semibold text-white">{creator?.displayName}</div>
                    <div className="text-slate-400">${prop.proposedBudget.toLocaleString()} · {prop.proposedTurnaroundDays}d</div>
                    <Link href="/projects" className="text-amber-300 hover:underline block">Review →</Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Shortlisted Creators */}
          <div className="glass-panel rounded-2xl p-5 border border-violet-500/15">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white text-sm flex items-center gap-1.5"><Bookmark className="w-4 h-4 text-cyan-400" /> Shortlist ({shortlist.length})</h2>
              <Link href="/marketplace" className="text-xs text-cyan-400 hover:underline">Browse</Link>
            </div>
            {shortlistedCreators.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-3">No creators saved yet.</p>
            ) : (
              <div className="space-y-2.5">
                {shortlistedCreators.slice(0, 4).map(c => {
                  const score = activeBrief ? calculateFitScore(c, activeBrief, matchingWeights) : null;
                  return (
                    <Link key={c.id} href={`/creators/${c.id}`} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors block">
                      <img src={c.avatarUrl} alt={c.displayName} className="w-8 h-8 rounded-lg object-cover ring-1 ring-violet-500/30" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{c.displayName}</div>
                        {score && <div className="text-[10px] text-cyan-300 font-mono">{score.overallScore}% fit</div>}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
