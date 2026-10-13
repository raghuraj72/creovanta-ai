'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { MatchingWeights, DimensionKey } from '@/types';
import { DEFAULT_MATCHING_WEIGHTS, normalizeWeights } from '@/lib/matching-engine';
import { Sliders, RefreshCw, X, Check, Info } from 'lucide-react';

interface WeightConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DIMENSION_CONFIGS: Array<{ key: DimensionKey; label: string; desc: string }> = [
  {
    key: 'skillsAndSpecialization',
    label: 'Skill & Specialization Match',
    desc: 'Alignment with campaign creative concept and content types (Default: 25%)',
  },
  {
    key: 'toolsAndWorkflow',
    label: 'Tools & Workflow Compatibility',
    desc: 'Proficiency in requested models (Sora, Runway, Midjourney, ComfyUI, etc.) (Default: 15%)',
  },
  {
    key: 'deliverableFormat',
    label: 'Deliverable Formats & Ratios',
    desc: 'Support for ProRes, 8K, WebGL, 9:16 vertical, 16:9, etc. (Default: 15%)',
  },
  {
    key: 'visualStyle',
    label: 'Visual Style Cohesion',
    desc: 'Cyber-noir, Solarpunk, Biomorphic, Luxury aesthetic alignment (Default: 10%)',
  },
  {
    key: 'budget',
    label: 'Budget Compatibility',
    desc: 'Indicative rates overlapping with brief target budget (Default: 10%)',
  },
  {
    key: 'deadlineTurnaround',
    label: 'Deadline & Turnaround',
    desc: 'Feasibility within campaign deadline and creator availability (Default: 10%)',
  },
  {
    key: 'commercialLicensing',
    label: 'Commercial-Use & Licensing',
    desc: 'Clean training guarantees, indemnity, and commercial buyout (Default: 10%)',
  },
  {
    key: 'evidenceVerification',
    label: 'Evidence & Verification Quality',
    desc: 'Independently audited workflows vs attached vs self-declared (Default: 5%)',
  },
];

export function WeightConfigModal({ isOpen, onClose }: WeightConfigModalProps) {
  const { matchingWeights, updateWeights } = useApp();
  const [weights, setWeights] = useState<MatchingWeights>(matchingWeights);

  if (!isOpen) return null;

  const handleSliderChange = (key: DimensionKey, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    updateWeights(normalizeWeights(weights));
    onClose();
  };

  const handleReset = () => {
    setWeights(DEFAULT_MATCHING_WEIGHTS);
    updateWeights(DEFAULT_MATCHING_WEIGHTS);
  };

  const currentTotal = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel-glow rounded-2xl max-w-xl w-full p-6 border border-violet-500/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-violet-500/20 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Creative DNA + Fit Engine Tuner</h3>
              <p className="text-xs text-slate-400">
                Adjust the 8 deterministic matching weights. Live normalized to 100%.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Weights Sliders */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {DIMENSION_CONFIGS.map(({ key, label, desc }) => (
            <div key={key} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">{label}</div>
                  <div className="text-[11px] text-slate-400">{desc}</div>
                </div>
                <div className="text-sm font-mono font-bold text-cyan-400 pl-2">
                  {weights[key]}%
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={weights[key]}
                onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                className="w-full accent-violet-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Footer info & actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Info className="w-4 h-4 text-violet-400" />
            <span className="text-slate-400">
              Raw Total: <strong className={currentTotal === 100 ? 'text-emerald-400' : 'text-amber-400'}>{currentTotal}%</strong> (Will auto-normalize)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center gap-1.5 shadow-lg shadow-violet-500/25"
            >
              <Check className="w-4 h-4" />
              Apply Weights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
