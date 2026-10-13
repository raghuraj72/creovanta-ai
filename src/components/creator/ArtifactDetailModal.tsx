'use client';

import React from 'react';
import { PortfolioArtifact } from '@/types';
import {
  X,
  Sparkles,
  ShieldCheck,
  FileCode,
  Sliders,
  CheckCircle2,
  Lock,
  Download,
  Eye,
  Heart,
  FileText,
} from 'lucide-react';

interface ArtifactDetailModalProps {
  artifact: PortfolioArtifact | null;
  onClose: () => void;
}

export function ArtifactDetailModal({ artifact, onClose }: ArtifactDetailModalProps) {
  if (!artifact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-glow rounded-2xl max-w-4xl w-full p-6 border border-violet-500/30 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {artifact.category}
              </span>
              <span className="text-xs text-slate-400">Aspect Ratio: {artifact.aspectRatio}</span>
            </div>
            <h3 className="font-bold text-white text-lg mt-1">{artifact.title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          {/* Main Visual Preview */}
          <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-white/10 max-h-80 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artifact.mediaUrl}
              alt={artifact.title}
              className="w-full h-full object-cover max-h-80"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-white flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>{artifact.views.toLocaleString()} views</span>
              <span>•</span>
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
              <span>{artifact.likes} likes</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Left column: Overview, Prompt & Workflow */}
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1">
                  Creative Description
                </h4>
                <p className="text-slate-300 leading-relaxed">{artifact.description}</p>
              </div>

              {/* Tools Used */}
              <div>
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">
                  AI Tools & Model Versions
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {artifact.toolsUsed.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-cyan-500/25 font-mono text-[11px]"
                    >
                      {tool.name} {tool.version}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prompt and Process Notes */}
              <div>
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1">
                  Disclosed Prompt & Latent Architecture
                </h4>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">
                  {artifact.promptOrProcessNotes}
                </div>
              </div>

              {/* Workflow Summary */}
              <div>
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1">
                  Production Workflow Summary
                </h4>
                <p className="text-slate-300 leading-relaxed">{artifact.workflowSummary}</p>
              </div>
            </div>

            {/* Right column: Human vs AI Ratio, Licensing & Evidence */}
            <div className="space-y-4">
              {/* Human Touch Disclosure Bar */}
              <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-violet-200 uppercase text-[11px] tracking-wider">
                    Human Touch vs AI Synthesis
                  </h4>
                  <span className="font-mono text-cyan-400 font-bold">
                    {artifact.humanTouchDisclosure.humanVFXPercentage}% Human Hand
                  </span>
                </div>

                {/* Multi-segment progress bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${artifact.humanTouchDisclosure.generativePercentage}%` }}
                    className="bg-violet-600 h-full"
                    title={`AI Generative: ${artifact.humanTouchDisclosure.generativePercentage}%`}
                  />
                  <div
                    style={{ width: `${artifact.humanTouchDisclosure.humanVFXPercentage}%` }}
                    className="bg-cyan-400 h-full"
                    title={`Human Post & VFX: ${artifact.humanTouchDisclosure.humanVFXPercentage}%`}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-violet-600 inline-block" />
                    Generative Synthesis ({artifact.humanTouchDisclosure.generativePercentage}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                    Human Retouch & Craft ({artifact.humanTouchDisclosure.humanVFXPercentage}%)
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 pt-1 border-t border-white/5">
                  {artifact.humanTouchDisclosure.details}
                </p>
              </div>

              {/* Commercial Rights Declaration */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  Commercial Licensing Declaration
                </h4>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Commercial Deployment: <strong>Permitted Worldwide</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Client Exclusive Buyout: <strong>Available</strong></span>
                  </div>
                </div>
              </div>

              {/* Attached Evidence Artifacts */}
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Attached Evidence & Reproducibility Files ({artifact.evidenceArtifacts.length})
                </h4>

                {artifact.evidenceArtifacts.length === 0 ? (
                  <p className="text-slate-500 italic text-[11px]">No external files attached.</p>
                ) : (
                  <div className="space-y-1.5">
                    {artifact.evidenceArtifacts.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-white/10 hover:border-violet-500/40 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-violet-400 shrink-0" />
                          <div>
                            <div className="font-medium text-slate-200 text-xs">{ev.title}</div>
                            <div className="text-[10px] text-slate-500">
                              {ev.kind} • {ev.fileSize}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Downloading verified proof file: "${ev.title}"`)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 text-[10px] flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 border border-white/10"
          >
            Close Artifact View
          </button>
        </div>
      </div>
    </div>
  );
}
