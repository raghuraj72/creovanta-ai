import { CreativeBrief, CreatorDNA } from '@/types';

export interface CopilotAnalysisResult {
  engineUsed: 'Gemini Generative API' | 'Creovanta Deterministic Intelligence Engine';
  suggestedTitle: string;
  refinedObjective: string;
  creativeConcept: string;
  recommendedStyles: string[];
  recommendedContentTypes: string[];
  recommendedTools: string[];
  recommendedDeliverables: Array<{
    format: string;
    aspectRatio: string;
    resolution: string;
    quantity: number;
    durationSeconds?: number;
  }>;
  suggestedBudget: { min: number; max: number };
  suggestedDeadlineDays: number;
  missingInformation: string[];
  conflictingRequirements: string[];
  clarifyingQuestions: string[];
}

export interface NaturalLanguageSearchParams {
  query: string;
  specialization?: string;
  tools?: string[];
  maxBudget?: number;
  maxTurnaroundDays?: number;
  commercialOnly?: boolean;
  aspectRatio?: string;
  evidenceRequired?: boolean;
  explanation: string;
}

/**
 * Intelligent deterministic extractor for rough creative ideas
 */
export function analyzeBriefIdeaLocally(rawPrompt: string): CopilotAnalysisResult {
  const lower = rawPrompt.toLowerCase();

  // Detect style
  const styles: string[] = [];
  if (lower.includes('cyber') || lower.includes('noir') || lower.includes('neon') || lower.includes('dark')) styles.push('Cyber-noir Hyperrealism');
  if (lower.includes('luxury') || lower.includes('elegance') || lower.includes('macro') || lower.includes('gold')) styles.push('Macro Luxury Kinetic');
  if (lower.includes('eco') || lower.includes('green') || lower.includes('solar') || lower.includes('organic')) styles.push('Solarpunk Editorial');
  if (lower.includes('surreal') || lower.includes('dream') || lower.includes('biomorph')) styles.push('Biomorphic Surrealism');
  if (lower.includes('anime') || lower.includes('manga') || lower.includes('japan')) styles.push('Anime Cinematic');
  if (styles.length === 0) styles.push('Macro Luxury Kinetic', 'Cyber-noir Hyperrealism');

  // Detect content types
  const contentTypes: string[] = [];
  if (lower.includes('video') || lower.includes('film') || lower.includes('teaser') || lower.includes('commercial')) contentTypes.push('Commercial Video');
  if (lower.includes('photo') || lower.includes('still') || lower.includes('poster') || lower.includes('key visual')) contentTypes.push('Key Visual');
  if (lower.includes('3d') || lower.includes('spatial') || lower.includes('splat') || lower.includes('model')) contentTypes.push('3D / Spatial');
  if (lower.includes('motion') || lower.includes('animation') || lower.includes('loop')) contentTypes.push('Generative Motion Design');
  if (contentTypes.length === 0) contentTypes.push('Commercial Video', 'Key Visual');

  // Detect tools
  const tools: string[] = [];
  if (lower.includes('sora') || lower.includes('runway') || lower.includes('video')) tools.push('Runway Gen-3 / Sora');
  if (lower.includes('midjourney')) tools.push('Midjourney v6.1');
  if (lower.includes('flux')) tools.push('Flux.1 Pro');
  if (lower.includes('comfy') || lower.includes('lora')) tools.push('ComfyUI Custom LoRA');
  if (lower.includes('firefly') || lower.includes('clean')) tools.push('Adobe Firefly (Clean Model)');
  if (tools.length === 0) tools.push('Runway Gen-3 / Sora', 'Flux.1 Pro', 'ComfyUI Custom LoRA');

  // Budget detection
  let minBudget = 4000;
  let maxBudget = 9000;
  const budgetMatch = rawPrompt.match(/\$?(\d+)[kK]?\s*(?:-|to)?\s*\$?(\d+)[kK]?/);
  if (budgetMatch) {
    let b1 = parseInt(budgetMatch[1]);
    let b2 = parseInt(budgetMatch[2]);
    if (b1 < 50) b1 *= 1000;
    if (b2 < 50) b2 *= 1000;
    minBudget = Math.min(b1, b2);
    maxBudget = Math.max(b1, b2);
  }

  // Turnaround days
  let days = 7;
  const daysMatch = rawPrompt.match(/(\d+)\s*(?:day|days|d\b)/);
  if (daysMatch) {
    days = parseInt(daysMatch[1]);
  }

  // Deliverables
  const deliverables = [
    {
      format: 'ProRes 422 HQ 4K',
      aspectRatio: lower.includes('vertical') || lower.includes('reel') || lower.includes('tiktok') ? '9:16' : '16:9',
      resolution: lower.includes('vertical') ? '2160x3840' : '3840x2160',
      quantity: 1,
      durationSeconds: 30,
    },
    {
      format: 'PNG Uncompressed 8K',
      aspectRatio: '1:1',
      resolution: '7680x7680',
      quantity: 2,
    },
  ];

  // Missing info detection
  const missing: string[] = [];
  if (!lower.includes('audience') && !lower.includes('customer') && !lower.includes('demographic')) {
    missing.push('Target demographic and primary customer persona not specified.');
  }
  if (!lower.includes('license') && !lower.includes('rights') && !lower.includes('commercial')) {
    missing.push('Commercial licensing buyout and territorial scope not defined.');
  }
  if (!lower.includes('audio') && !lower.includes('sound') && !lower.includes('music')) {
    missing.push('Audio requirements (human sound design vs AI voiceover) unstated.');
  }

  // Conflict detection
  const conflicts: string[] = [];
  if (days <= 3 && maxBudget < 3000) {
    conflicts.push('Aggressive timeline (<3 days) paired with modest budget may restrict top-tier verified creators.');
  }
  if (lower.includes('clean model') && lower.includes('midjourney')) {
    conflicts.push('Strict clean-training indemnification may conflict with certain non-enterprise diffusion model weights.');
  }

  // Clarifying questions
  const clarifyingQuestions = [
    'Will you require full copyright assignment and raw ComfyUI generation seed graphs upon handover?',
    'What primary distribution aspect ratios are prioritized (e.g. 16:9 broadcast vs 9:16 vertical reels)?',
    'Do you have established brand color hex codes or reference video moodboards to attach?',
  ];

  const suggestedTitle = rawPrompt.length > 50
    ? rawPrompt.split('.')[0].slice(0, 48) + '...'
    : rawPrompt || 'New AI Creative Campaign';

  return {
    engineUsed: 'Creovanta Deterministic Intelligence Engine',
    suggestedTitle: suggestedTitle.trim(),
    refinedObjective: `Execute a high-impact multimodal creative campaign: "${rawPrompt.trim()}" tailored for enterprise brand appeal and high-fidelity production.`,
    creativeConcept: `Synthesize organic cinematic textures with controlled latent camera trajectories, maintaining strict lighting cohesion and brand-safe aesthetics.`,
    recommendedStyles: styles,
    recommendedContentTypes: contentTypes,
    recommendedTools: tools,
    recommendedDeliverables: deliverables,
    suggestedBudget: { min: minBudget, max: maxBudget },
    suggestedDeadlineDays: days,
    missingInformation: missing,
    conflictingRequirements: conflicts,
    clarifyingQuestions,
  };
}

/**
 * Natural Language creator search parser
 */
export function parseNaturalLanguageCreatorSearch(query: string): NaturalLanguageSearchParams {
  const lower = query.toLowerCase();
  let maxBudget: number | undefined;
  let maxTurnaround: number | undefined;
  let commercialOnly = false;
  let evidenceRequired = false;
  let aspectRatio: string | undefined;
  const tools: string[] = [];
  let specialization: string | undefined;

  // Budget
  const budgetMatch = lower.match(/(?:under|below|less than|max|budget)\s*\$?(\d+)[kK]?/);
  if (budgetMatch) {
    let num = parseInt(budgetMatch[1]);
    if (num < 100) num *= 1000;
    maxBudget = num;
  }

  // Days
  const daysMatch = lower.match(/(?:within|under|in)\s*(\d+)\s*(?:days|day)/);
  if (daysMatch) {
    maxTurnaround = parseInt(daysMatch[1]);
  }

  // Verification & licensing
  if (lower.includes('verified') || lower.includes('audited') || lower.includes('evidence')) {
    evidenceRequired = true;
  }
  if (lower.includes('commercial') || lower.includes('enterprise') || lower.includes('clean')) {
    commercialOnly = true;
  }

  // Aspect ratio
  if (lower.includes('9:16') || lower.includes('vertical') || lower.includes('reel') || lower.includes('tiktok')) {
    aspectRatio = '9:16';
  } else if (lower.includes('16:9') || lower.includes('cinematic') || lower.includes('horizontal')) {
    aspectRatio = '16:9';
  } else if (lower.includes('1:1') || lower.includes('square')) {
    aspectRatio = '1:1';
  }

  // Tools
  if (lower.includes('sora')) tools.push('Sora');
  if (lower.includes('runway')) tools.push('Runway Gen-3');
  if (lower.includes('flux')) tools.push('Flux.1');
  if (lower.includes('midjourney')) tools.push('Midjourney');
  if (lower.includes('comfyui') || lower.includes('comfy')) tools.push('ComfyUI');
  if (lower.includes('kling')) tools.push('Kling');
  if (lower.includes('luma')) tools.push('Luma');

  // Specialization
  if (lower.includes('video') || lower.includes('cinematography')) specialization = 'Commercial Video';
  if (lower.includes('3d') || lower.includes('spatial') || lower.includes('splat')) specialization = '3D / Spatial';
  if (lower.includes('motion') || lower.includes('vfx')) specialization = 'Generative Motion Design';
  if (lower.includes('anime')) specialization = 'Anime Cinematic';
  if (lower.includes('fashion') || lower.includes('editorial')) specialization = 'Editorial Campaign';

  const explanations: string[] = [];
  if (tools.length > 0) explanations.push(`Tools: ${tools.join(', ')}`);
  if (maxBudget) explanations.push(`Budget ≤ $${maxBudget.toLocaleString()}`);
  if (maxTurnaround) explanations.push(`Turnaround ≤ ${maxTurnaround} days`);
  if (evidenceRequired) explanations.push(`Verified evidence required`);
  if (commercialOnly) explanations.push(`Full commercial license`);
  if (aspectRatio) explanations.push(`Ratio: ${aspectRatio}`);

  return {
    query,
    specialization,
    tools: tools.length > 0 ? tools : undefined,
    maxBudget,
    maxTurnaroundDays: maxTurnaround,
    commercialOnly,
    aspectRatio,
    evidenceRequired,
    explanation: explanations.length > 0 ? explanations.join(' • ') : 'Global semantic scan across creator DNA',
  };
}
