'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { CreativeBrief } from '@/types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Cpu,
  Layers,
  DollarSign,
  Clock,
  Loader2,
  Plus,
  Trash2,
  FileText,
  Info,
} from 'lucide-react';

const STEPS = [
  'Campaign Goal & Audience',
  'Content Type & Concept',
  'Style & Visual Mood',
  'Deliverables & Ratios',
  'Tools & Capabilities',
  'Budget & Turnaround',
  'Commercial Licensing',
  'Review & Publish',
];

export default function BriefBuilderPage() {
  const router = useRouter();
  const { createBrief } = useApp();
  const { authUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);

  // Copilot State
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [copilotFeedback, setCopilotFeedback] = useState<{
    missing: string[];
    conflicts: string[];
    questions: string[];
    engineUsed: string;
  } | null>(null);

  // Form State
  const [title, setTitle] = useState('Neuromorphic Audio Launch Campaign');
  const [campaignObjective, setCampaignObjective] = useState(
    'Create an otherworldly 45-second commercial teaser and 3 key visual stills showcasing our brain-computer interface earbuds.'
  );
  const [targetAudience, setTargetAudience] = useState(
    'Audiophiles, spatial computing developers, and cyber-aesthetic trendsetters aged 22-40.'
  );
  const [distributionChannels, setDistributionChannels] = useState<string[]>([
    'YouTube 4K',
    'Instagram Reels',
    'Times Square Billboard',
  ]);
  const [creativeConcept, setCreativeConcept] = useState(
    'Floating acoustic waves rendered as iridescent liquid mercury forming into precision acoustic drivers.'
  );
  const [visualStyles, setVisualStyles] = useState<string[]>([
    'Cyber-noir Hyperrealism',
    'Macro Luxury Kinetic',
  ]);
  const [requiredContentTypes, setRequiredContentTypes] = useState<string[]>([
    'Commercial Video',
    'Key Visual',
  ]);
  const [deliverables, setDeliverables] = useState<
    Array<{ format: string; aspectRatio: string; resolution: string; quantity: number }>
  >([
    { format: 'ProRes 422 HQ 4K', aspectRatio: '16:9', resolution: '3840x2160', quantity: 1 },
    { format: 'MP4 H.265 60fps', aspectRatio: '9:16', resolution: '2160x3840', quantity: 2 },
  ]);
  const [requiredTools, setRequiredTools] = useState<string[]>([
    'Runway Gen-3 / Sora',
    'Flux.1 Pro',
    'ComfyUI Custom LoRA',
  ]);
  const [mandatoryRequirements, setMandatoryRequirements] = useState<string[]>([
    'Full Commercial License Required with Enterprise Buyout',
    'ProRes 422 HQ master delivery mandatory',
  ]);
  const [softPreferences, setSoftPreferences] = useState<string[]>([
    'Prior experience with luxury consumer electronics',
  ]);
  const [budgetMin, setBudgetMin] = useState(5000);
  const [budgetMax, setBudgetMax] = useState(9500);
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [revisionRounds, setRevisionRounds] = useState(2);
  const [commercialUseRequired, setCommercialUseRequired] = useState(true);
  const [cleanModelRequired, setCleanModelRequired] = useState(true);
  const [licensingNotes, setLicensingNotes] = useState(
    'Enterprise worldwide commercial distribution rights without expiration or geo-blocks.'
  );
  const [brandRestrictions, setBrandRestrictions] = useState<string[]>([
    'Zero copyrighted brand names in generative prompts',
    'No distorted human hands or facial glitches',
  ]);
  const [successCriteria, setSuccessCriteria] = useState(
    'Photorealistic luxury automotive-grade reflections and pristine acoustic wave fluid dynamics.'
  );

  // AI Copilot Integration
  const handleRunCopilot = async () => {
    if (!copilotInput.trim()) return;
    setIsCopilotLoading(true);
    try {
      const res = await fetch('/api/ai/brief-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: copilotInput }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.suggestedTitle) setTitle(data.suggestedTitle);
        if (data.refinedObjective) setCampaignObjective(data.refinedObjective);
        if (data.creativeConcept) setCreativeConcept(data.creativeConcept);
        if (data.recommendedStyles && data.recommendedStyles.length > 0) {
          setVisualStyles(data.recommendedStyles);
        }
        if (data.recommendedContentTypes && data.recommendedContentTypes.length > 0) {
          setRequiredContentTypes(data.recommendedContentTypes);
        }
        if (data.recommendedTools && data.recommendedTools.length > 0) {
          setRequiredTools(data.recommendedTools);
        }
        if (data.suggestedBudget) {
          setBudgetMin(data.suggestedBudget.min);
          setBudgetMax(data.suggestedBudget.max);
        }
        if (data.suggestedDeadlineDays) {
          setDeadlineDays(data.suggestedDeadlineDays);
        }
        setCopilotFeedback({
          missing: data.missingInformation || [],
          conflicts: data.conflictingRequirements || [],
          questions: data.clarifyingQuestions || [],
          engineUsed: data.engineUsed || 'Creovanta Deterministic Intelligence Engine',
        });
      }
    } catch (e) {
      console.warn('Copilot error', e);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const handlePublish = () => {
    const newBrief = createBrief({
      brandId: authUser?.id || 'user-brand-1',
      brandName: authUser?.companyOrTitle || 'CyberVogue Studio',
      brandLogo:
        authUser?.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      title,
      status: 'published',
      campaignObjective,
      targetAudience,
      distributionChannels,
      creativeConcept,
      visualStyleTags: visualStyles,
      requiredContentTypes,
      requiredDeliverables: deliverables.map((d, idx) => ({
        id: `del-${idx + 1}`,
        format: d.format,
        aspectRatio: d.aspectRatio,
        resolution: d.resolution,
        quantity: d.quantity,
      })),
      requiredToolsAndCapabilities: requiredTools,
      mandatoryRequirements,
      softPreferences,
      budget: {
        min: budgetMin,
        max: budgetMax,
        currency: 'USD',
        isFixed: false,
      },
      deadlineDays,
      deadlineDate: new Date(Date.now() + deadlineDays * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      revisionRounds,
      licensingNeeds: {
        commercialUseRequired,
        perpetualExclusive: true,
        aiCleanModelRequired: cleanModelRequired,
        notes: licensingNotes,
      },
      brandRestrictions,
      successCriteria,
    });

    router.push('/marketplace');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-violet-500/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-cyan-400">
              Interactive Brief Engine
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Brand Creative Brief Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build precision requirements for the Creative DNA + Fit Engine with integrated AI Copilot refinement.
          </p>
        </div>

        <Link
          href="/marketplace"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </Link>
      </div>

      {/* AI Copilot Input Bar */}
      <div className="glass-panel-glow rounded-2xl p-5 border border-cyan-400/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">AI Brief Copilot</h3>
            <span className="text-[10px] text-cyan-300 font-mono px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20">
              Rule-Based NLP & Gemini
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Paste rough thoughts to auto-fill fields & detect missing info
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={copilotInput}
            onChange={(e) => setCopilotInput(e.target.value)}
            placeholder='e.g. "Luxury zero-gravity sneaker commercial for TikTok 9:16 and 4K under $8k in 5 days with verified clean model"'
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleRunCopilot}
            disabled={isCopilotLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-lg shadow-violet-500/25 disabled:opacity-60"
          >
            {isCopilotLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Refine With Copilot</span>
              </>
            )}
          </button>
        </div>

        {/* Copilot feedback diagnosis */}
        {copilotFeedback && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-xs space-y-2 animate-fade-in">
            <div className="flex items-center justify-between font-bold text-cyan-300">
              <span>Copilot Diagnostic Scan ({copilotFeedback.engineUsed})</span>
            </div>
            {copilotFeedback.missing.length > 0 && (
              <div>
                <span className="font-semibold text-amber-300">Missing Information Identified:</span>
                <ul className="list-disc pl-5 text-slate-300 text-[11px] space-y-0.5 mt-0.5">
                  {copilotFeedback.missing.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            {copilotFeedback.conflicts.length > 0 && (
              <div>
                <span className="font-semibold text-rose-300">Conflicting Requirements Detected:</span>
                <ul className="list-disc pl-5 text-slate-300 text-[11px] space-y-0.5 mt-0.5">
                  {copilotFeedback.conflicts.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            {copilotFeedback.questions.length > 0 && (
              <div>
                <span className="font-semibold text-violet-300">Recommended Clarifying Questions:</span>
                <ul className="list-disc pl-5 text-slate-300 text-[11px] space-y-0.5 mt-0.5">
                  {copilotFeedback.questions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stepper Progress Bar */}
      <div className="glass-panel rounded-xl p-3 border border-white/5 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {STEPS.map((s, idx) => (
            <button
              key={s}
              onClick={() => setCurrentStep(idx)}
              className={`flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg transition-colors whitespace-nowrap ${
                currentStep === idx
                  ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-500/20'
                  : currentStep > idx
                  ? 'text-cyan-400 bg-cyan-950/30 font-medium'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-white/10">
                {idx + 1}
              </span>
              <span>{s}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Wizard Form Panels */}
      <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 border border-violet-500/25 shadow-2xl min-h-[420px] flex flex-col justify-between">
        <div>
          {/* STEP 1: Campaign Goal & Target Audience */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-white">Step 1: Campaign Goal & Target Audience</h3>
              <p className="text-xs text-slate-400">
                Define the high-level campaign identity, commercial purpose, and primary audience demographics.
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Campaign Objective</label>
                <textarea
                  rows={3}
                  value={campaignObjective}
                  onChange={(e) => setCampaignObjective(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Content Type & Creative Concept */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-white">Step 2: Content Type & Creative Concept</h3>
              <p className="text-xs text-slate-400">
                Detail the visual story, generative framing, and specific content types required.
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Creative Concept Narrative</label>
                <textarea
                  rows={4}
                  value={creativeConcept}
                  onChange={(e) => setCreativeConcept(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Required Content Types</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Commercial Video',
                    'Key Visual',
                    '3D / Spatial',
                    'Generative Motion Design',
                    'Editorial Campaign',
                    'Audio-Visual Performance',
                  ].map((ct) => (
                    <button
                      key={ct}
                      type="button"
                      onClick={() =>
                        setRequiredContentTypes((prev) =>
                          prev.includes(ct) ? prev.filter((x) => x !== ct) : [...prev, ct]
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        requiredContentTypes.includes(ct)
                          ? 'bg-violet-600 text-white border-violet-400'
                          : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Style, Mood & Brand Guidelines */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-white">Step 3: Style, Mood & Visual Guidelines</h3>
              <p className="text-xs text-slate-400">
                Select visual style aesthetics to match with creator portfolios and style embeddings.
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  'Cyber-noir Hyperrealism',
                  'Macro Luxury Kinetic',
                  'Atmospheric Volumetric',
                  'Solarpunk Editorial',
                  'Biomorphic Surrealism',
                  'Minimalist Precision',
                  'Anime Cinematic',
                  'Glitch Cyberpunk',
                ].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() =>
                      setVisualStyles((prev) =>
                        prev.includes(st) ? prev.filter((x) => x !== st) : [...prev, st]
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      visualStyles.includes(st)
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                        : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Success Criteria</label>
                <input
                  type="text"
                  value={successCriteria}
                  onChange={(e) => setSuccessCriteria(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Deliverables, Aspect Ratios & Formats */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Step 4: Deliverables & Aspect Ratios</h3>
                  <p className="text-xs text-slate-400">Specify exact delivery formats and aspect ratios.</p>
                </div>
                <button
                  onClick={() =>
                    setDeliverables((prev) => [
                      ...prev,
                      { format: 'ProRes 422 HQ 4K', aspectRatio: '16:9', resolution: '3840x2160', quantity: 1 },
                    ])
                  }
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-cyan-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Deliverable
                </button>
              </div>

              <div className="space-y-2">
                {deliverables.map((d, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-white/10 text-xs">
                    <select
                      value={d.format}
                      onChange={(e) => {
                        const next = [...deliverables];
                        next[idx].format = e.target.value;
                        setDeliverables(next);
                      }}
                      className="bg-slate-800 border border-white/10 text-white rounded-lg px-2 py-1.5 focus:outline-none"
                    >
                      <option value="ProRes 422 HQ 4K">ProRes 422 HQ 4K</option>
                      <option value="MP4 H.265 60fps">MP4 H.265 60fps</option>
                      <option value="PNG Uncompressed 8K">PNG Uncompressed 8K</option>
                      <option value="GLB / USDZ 3D">GLB / USDZ 3D</option>
                      <option value="OpenEXR 32-bit">OpenEXR 32-bit</option>
                    </select>

                    <select
                      value={d.aspectRatio}
                      onChange={(e) => {
                        const next = [...deliverables];
                        next[idx].aspectRatio = e.target.value;
                        setDeliverables(next);
                      }}
                      className="bg-slate-800 border border-white/10 text-white rounded-lg px-2 py-1.5 focus:outline-none"
                    >
                      <option value="16:9">16:9 (Landscape)</option>
                      <option value="9:16">9:16 (Vertical Reels)</option>
                      <option value="1:1">1:1 (Square)</option>
                      <option value="4:5">4:5 (Social Feed)</option>
                      <option value="2.39:1">2.39:1 (Cinemascope)</option>
                    </select>

                    <input
                      type="number"
                      value={d.quantity}
                      min={1}
                      onChange={(e) => {
                        const next = [...deliverables];
                        next[idx].quantity = parseInt(e.target.value) || 1;
                        setDeliverables(next);
                      }}
                      className="w-16 bg-slate-800 border border-white/10 text-white rounded-lg px-2 py-1.5 focus:outline-none"
                      placeholder="Qty"
                    />

                    {deliverables.length > 1 && (
                      <button
                        onClick={() => setDeliverables((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Required Tools & Capabilities */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-white">Step 5: Required Tools & Pipeline Capabilities</h3>
              <p className="text-xs text-slate-400">
                Select generative models and production pipeline requirements.
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  'Runway Gen-3 / Sora',
                  'Flux.1 Pro',
                  'Midjourney v6.1',
                  'ComfyUI Custom LoRA',
                  'Topaz Video AI',
                  'Luma Genie / Dream Machine',
                  'Adobe Firefly (Clean Model)',
                  'Unreal Engine 5 NeRF',
                ].map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() =>
                      setRequiredTools((prev) =>
                        prev.includes(tool) ? prev.filter((x) => x !== tool) : [...prev, tool]
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      requiredTools.includes(tool)
                        ? 'bg-violet-600 text-white border-violet-400'
                        : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Mandatory Hard Constraints (Disqualification Rules)
                </label>
                <div className="space-y-1.5">
                  {mandatoryRequirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Budget, Deadline & Revisions */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-white">Step 6: Budget, Deadline & Turnaround</h3>
              <p className="text-xs text-slate-400">
                Establish financial parameters and maximum allowable turnaround timeframe.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Min Budget ($)</label>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Max Budget ($)</label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Max Turnaround (Days)</label>
                  <input
                    type="number"
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Revision Rounds Included</label>
                  <input
                    type="number"
                    value={revisionRounds}
                    onChange={(e) => setRevisionRounds(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Commercial Licensing & Indemnity */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-white">Step 7: Commercial Usage, Licensing & Restrictions</h3>
              <p className="text-xs text-slate-400">
                Ensure strict copyright indemnity and enterprise commercial safety.
              </p>

              <div className="space-y-2">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={commercialUseRequired}
                    onChange={(e) => setCommercialUseRequired(e.target.checked)}
                    className="rounded accent-violet-600"
                  />
                  <span>Commercial Use Buyout Mandatory (Exclude non-commercial creators)</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cleanModelRequired}
                    onChange={(e) => setCleanModelRequired(e.target.checked)}
                    className="rounded accent-violet-600"
                  />
                  <span>Clean Model Guarantee or Indemnity Policy Required</span>
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Licensing Terms & Scope</label>
                <textarea
                  rows={3}
                  value={licensingNotes}
                  onChange={(e) => setLicensingNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* STEP 8: Review & Publish */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-white">Step 8: Review & Publish Brief</h3>
              <p className="text-xs text-slate-400">
                Confirm structured requirements before broadcasting to the marketplace and running the Fit Engine.
              </p>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Title:</span>
                  <span className="font-bold text-white">{title}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Budget Range:</span>
                  <span className="font-mono text-cyan-300">
                    ${budgetMin.toLocaleString()} - ${budgetMax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Turnaround:</span>
                  <span className="font-mono text-violet-300">{deadlineDays} Days</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Deliverables:</span>
                  <span className="text-slate-200">
                    {deliverables.map((d) => `${d.quantity}x ${d.format} (${d.aspectRatio})`).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Commercial Safety:</span>
                  <span className="text-emerald-400 font-semibold">
                    {commercialUseRequired ? 'Commercial Buyout Required' : 'Standard'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white bg-white/5 disabled:opacity-40 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(STEPS.length - 1, prev + 1))}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-violet-500/25"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-cyan-500/25"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish & Run Fit Engine</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
