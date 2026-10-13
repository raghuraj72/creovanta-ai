'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import {
  FolderOpen,
  Sparkles,
  DollarSign,
  ChevronRight,
  Package,
  RefreshCw,
} from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft_brief: { label: 'Draft Brief', color: 'bg-slate-700 text-slate-300 border-slate-600' },
  published_brief: { label: 'Published', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  accepted_proposal: { label: 'Proposal Accepted', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  active_project: { label: 'Active Project', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  deliverable_submitted: { label: 'Deliverable Under Review', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  brand_review: { label: 'Brand Review', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  revision_requested: { label: 'Revision Requested', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  approved: { label: 'Approved', color: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
};

export default function ProjectsPage() {
  const { projects } = useApp();
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'review' | 'completed'>('all');

  const filteredProjects = projects.filter((p) => {
    if (filterTab === 'active') return p.status === 'active_project' || p.status === 'accepted_proposal';
    if (filterTab === 'review') return p.status === 'deliverable_submitted' || p.status === 'revision_requested' || p.status === 'brand_review';
    if (filterTab === 'completed') return p.status === 'completed' || p.status === 'approved';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-violet-500/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-cyan-400">
              Project Delivery Lifecycle
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {projects.length} Total Projects
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Campaign Collaborations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track end-to-end deliverables, revision cycles, transparent escrow milestones, and completed creative archives.
          </p>
        </div>

        <Link
          href="/marketplace"
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center gap-1.5 shadow-lg shadow-violet-500/25 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Discover Creators</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-xs">
        {[
          { key: 'all', label: `All Projects (${projects.length})` },
          { key: 'active', label: `In Production (${projects.filter((p) => p.status === 'active_project').length})` },
          { key: 'review', label: `Review & Revisions (${projects.filter((p) => p.status === 'deliverable_submitted' || p.status === 'revision_requested').length})` },
          { key: 'completed', label: `Completed (${projects.filter((p) => p.status === 'completed').length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterTab(key as 'all' | 'active' | 'review' | 'completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterTab === key
                ? 'bg-violet-500/25 text-white border border-violet-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <FolderOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="font-bold text-white text-base">No Projects Found</h3>
          <p className="text-xs text-slate-400">
            No projects in this category. Start by awarding a proposal from a published brief.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map((proj) => {
            const statusInfo = STATUS_MAP[proj.status] || {
              label: proj.status,
              color: 'bg-slate-700 text-slate-300 border-slate-600',
            };
            return (
              <div
                key={proj.id}
                className="glass-panel-glow rounded-2xl p-5 border border-violet-500/20 hover:border-violet-500/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Contract: ${proj.contractAmount.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-cyan-400 font-medium">
                        • {proj.deliverables.length} Deliverable(s)
                      </span>
                    </div>
                    <Link
                      href={`/projects/${proj.id}`}
                      className="font-bold text-white text-base hover:text-cyan-300 transition-colors"
                    >
                      {proj.title}
                    </Link>
                    <div className="text-xs text-slate-400 mt-1">
                      Brand: <span className="text-slate-200 font-medium">{proj.brandName}</span> • Creator:{' '}
                      <span className="text-slate-200 font-medium">{proj.creatorName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/projects/${proj.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  </div>
                </div>

                {/* Progress bar and metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      Escrow:{' '}
                      <strong className="text-slate-200 capitalize">
                        {proj.escrowStatus.replace(/_/g, ' ')}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
                    <span>
                      Revisions:{' '}
                      <strong className="text-slate-200">
                        {proj.revisionCount} of {proj.maxRevisions} used
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      Latest update:{' '}
                      <strong className="text-slate-200">
                        {proj.timelineEvents[proj.timelineEvents.length - 1]?.title || 'Initiated'}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
