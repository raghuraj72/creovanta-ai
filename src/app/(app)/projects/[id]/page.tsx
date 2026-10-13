'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import {
  ArrowLeft, Clock, DollarSign, CheckCircle2, AlertTriangle,
  ChevronRight, FileText, Package, MessageSquare, Star, RefreshCw,
  Upload, Send, User, Calendar, Activity
} from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft_brief: { label: 'Draft Brief', color: 'bg-slate-700 text-slate-300 border-slate-600' },
  published_brief: { label: 'Published', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  accepted_proposal: { label: 'Proposal Accepted', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  active_project: { label: 'Active Project', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  deliverable_submitted: { label: 'Under Review', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  brand_review: { label: 'Brand Review', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  revision_requested: { label: 'Revision Requested', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  approved: { label: 'Approved', color: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { authUser } = useAuth();
  const { projects, approveDeliverables, requestRevision, submitDeliverable } = useApp();

  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [showDeliverableForm, setShowDeliverableForm] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [deliverableTitle, setDeliverableTitle] = useState('');
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [actionDone, setActionDone] = useState('');

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Project not found.</p>
          <Link href="/projects" className="text-cyan-400 hover:underline">← All Projects</Link>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[project.status] || { label: project.status, color: 'bg-slate-700 text-slate-300 border-slate-600' };
  const isBrand = authUser?.role === 'brand';
  const canApprove = isBrand && (project.status === 'deliverable_submitted' || project.status === 'brand_review');
  const canRequestRevision = isBrand && project.status === 'deliverable_submitted' && project.revisionCount < project.maxRevisions;
  const canSubmitDeliverable = !isBrand && (project.status === 'active_project' || project.status === 'revision_requested');

  const handleApprove = () => {
    if (!feedbackComment.trim()) { alert('Please leave a comment.'); return; }
    approveDeliverables(project.id, {
      rating: feedbackRating,
      comment: feedbackComment,
      creativeVisionScore: feedbackRating,
      technicalExecutionScore: feedbackRating,
      communicationScore: Math.min(feedbackRating, 5),
    });
    setShowFeedbackForm(false);
    setActionDone('approved');
  };

  const handleRevision = () => {
    if (!revisionNotes.trim()) { alert('Please describe the revision.'); return; }
    requestRevision(project.id, revisionNotes);
    setShowRevisionForm(false);
    setActionDone('revision');
  };

  const handleSubmitDeliverable = () => {
    if (!deliverableTitle.trim()) { alert('Please enter deliverable title.'); return; }
    submitDeliverable(project.id, {
      title: deliverableTitle,
      format: 'Submitted File',
      fileUrl: '#deliverable-file',
      notes: deliverableNotes,
    });
    setShowDeliverableForm(false);
    setActionDone('submitted');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All Projects
      </Link>

      {/* Header */}
      <div className="glass-panel-glow rounded-2xl p-6 border border-violet-500/25 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className="text-xs text-slate-500">#{project.id.slice(-6).toUpperCase()}</span>
            </div>
            <h1 className="text-xl font-extrabold text-white">{project.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-violet-400" />
                {isBrand ? `Creator: ${project.creatorName}` : `Brand: ${project.brandName}`}
              </span>
              <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                Contract: ${project.contractAmount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5 text-violet-400" />
                Revisions: {project.revisionCount}/{project.maxRevisions}
              </span>
              <span className={`flex items-center gap-1 font-semibold ${
                project.escrowStatus === 'released_placeholder' ? 'text-emerald-400' : 'text-amber-300'
              }`}>
                <DollarSign className="w-3.5 h-3.5" />
                Escrow: {project.escrowStatus === 'funded_placeholder' ? 'Funded (Placeholder)' :
                  project.escrowStatus === 'released_placeholder' ? 'Released ✓' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {canSubmitDeliverable && !showDeliverableForm && (
              <button onClick={() => setShowDeliverableForm(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-cyan-600 text-white flex items-center gap-1.5 shadow-lg">
                <Upload className="w-3.5 h-3.5" /> Submit Deliverable
              </button>
            )}
            {canApprove && !showFeedbackForm && (
              <button onClick={() => setShowFeedbackForm(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Release
              </button>
            )}
            {canRequestRevision && !showRevisionForm && (
              <button onClick={() => setShowRevisionForm(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Request Revision
              </button>
            )}
          </div>
        </div>

        {/* Status notification */}
        {actionDone === 'approved' && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Project approved! Escrow released (placeholder). Feedback recorded.
          </div>
        )}
        {actionDone === 'revision' && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Revision requested. The creator has been notified.
          </div>
        )}
        {actionDone === 'submitted' && (
          <div className="mt-4 p-3.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs flex items-center gap-2">
            <Upload className="w-4 h-4" /> Deliverable submitted for brand review.
          </div>
        )}
      </div>

      {/* Action Forms */}
      {showFeedbackForm && (
        <div className="glass-panel-glow rounded-2xl p-6 border border-emerald-500/25 mb-6 space-y-4">
          <h2 className="font-bold text-white flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Approve & Submit Feedback</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Overall Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(r => (
                <button key={r} onClick={() => setFeedbackRating(r)}
                  className={`w-9 h-9 rounded-lg text-lg transition-all ${feedbackRating >= r ? 'text-amber-400 scale-110' : 'text-slate-600'}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Feedback Comment</label>
            <textarea value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)}
              placeholder="Describe the quality of work, communication, and creative vision..."
              rows={3} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowFeedbackForm(false)} className="px-4 py-2 rounded-xl text-xs border border-white/10 text-slate-400 hover:text-white">Cancel</button>
            <button onClick={handleApprove} className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white">Confirm Approval</button>
          </div>
        </div>
      )}

      {showRevisionForm && (
        <div className="glass-panel rounded-2xl p-6 border border-amber-500/25 mb-6 space-y-4">
          <h2 className="font-bold text-white flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Request Revision ({project.maxRevisions - project.revisionCount} remaining)</h2>
          <textarea value={revisionNotes} onChange={e => setRevisionNotes(e.target.value)}
            placeholder="Describe the specific revision needed. Be clear and constructive."
            rows={4} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 resize-none" />
          <div className="flex gap-2">
            <button onClick={() => setShowRevisionForm(false)} className="px-4 py-2 rounded-xl text-xs border border-white/10 text-slate-400">Cancel</button>
            <button onClick={handleRevision} className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white">Send Revision Request</button>
          </div>
        </div>
      )}

      {showDeliverableForm && (
        <div className="glass-panel-glow rounded-2xl p-6 border border-violet-500/25 mb-6 space-y-4">
          <h2 className="font-bold text-white flex items-center gap-2"><Upload className="w-4 h-4 text-cyan-400" /> Submit Deliverable</h2>
          <input value={deliverableTitle} onChange={e => setDeliverableTitle(e.target.value)}
            placeholder="Deliverable title (e.g. Final_4K_Master_ProRes.mov)"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400" />
          <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center text-slate-500 text-xs">
            <Upload className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>File upload coming in production mode. Enter file details below.</p>
          </div>
          <textarea value={deliverableNotes} onChange={e => setDeliverableNotes(e.target.value)}
            placeholder="Notes about this deliverable: format, content, special instructions..."
            rows={3} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 resize-none" />
          <div className="flex gap-2">
            <button onClick={() => setShowDeliverableForm(false)} className="px-4 py-2 rounded-xl text-xs border border-white/10 text-slate-400">Cancel</button>
            <button onClick={handleSubmitDeliverable} className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Submit for Review
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deliverables */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-violet-500/15">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-cyan-400" /> Deliverables ({project.deliverables.length})</h2>
            {project.deliverables.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p>No deliverables submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {project.deliverables.map(deliv => (
                  <div key={deliv.id} className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-white text-sm">{deliv.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{deliv.format}</div>
                        {deliv.notes && <p className="text-xs text-slate-300 mt-2">{deliv.notes}</p>}
                        <div className="text-[11px] text-slate-500 mt-1.5">
                          Submitted: {new Date(deliv.submittedAt).toLocaleString()} · Version {deliv.version}
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold shrink-0 ${
                        deliv.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        deliv.status === 'revision_needed' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                        'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>{deliv.status.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback */}
          {project.brandFeedback && (
            <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Brand Feedback</h2>
              <div className="flex items-center gap-2 mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`text-xl ${i < project.brandFeedback!.rating ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
                ))}
                <span className="text-sm font-bold text-white ml-1">{project.brandFeedback.rating}/5</span>
              </div>
              <p className="text-slate-300 text-sm italic leading-relaxed">&ldquo;{project.brandFeedback.comment}&rdquo;</p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: 'Creative Vision', score: project.brandFeedback.creativeVisionScore },
                  { label: 'Technical Execution', score: project.brandFeedback.technicalExecutionScore },
                  { label: 'Communication', score: project.brandFeedback.communicationScore },
                ].map(({ label, score }) => (
                  <div key={label} className="text-center p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <div className="text-lg font-bold text-amber-400">{score}/5</div>
                    <div className="text-[11px] text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="glass-panel rounded-2xl p-6 border border-violet-500/15 h-fit">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-400" /> Activity Log</h2>
          <div className="space-y-3 relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-violet-500/15" />
            {[...project.timelineEvents].reverse().map((event, i) => (
              <div key={event.id} className="flex gap-3 relative">
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-violet-500/30 flex items-center justify-center shrink-0 z-10 text-xs">
                  {i === 0 ? '●' : '○'}
                </div>
                <div className="pb-3">
                  <div className="font-semibold text-white text-xs">{event.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{event.description}</div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                    <span>{event.actor}</span>
                    <span>·</span>
                    <span>{new Date(event.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
