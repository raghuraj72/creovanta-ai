import { CreatorDNA, CreativeBrief, MatchingWeights, FitMatchResult, DimensionScoreDetail, DimensionKey } from '@/types';

export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  skillsAndSpecialization: 25,
  toolsAndWorkflow: 15,
  deliverableFormat: 15,
  visualStyle: 10,
  budget: 10,
  deadlineTurnaround: 10,
  commercialLicensing: 10,
  evidenceVerification: 5,
};

/**
 * Normalizes user custom weights to guarantee they sum to exactly 100
 */
export function normalizeWeights(weights: MatchingWeights): MatchingWeights {
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  if (sum === 0) return DEFAULT_MATCHING_WEIGHTS;
  if (sum === 100) return weights;

  const factor = 100 / sum;
  return {
    skillsAndSpecialization: Math.round(weights.skillsAndSpecialization * factor * 10) / 10,
    toolsAndWorkflow: Math.round(weights.toolsAndWorkflow * factor * 10) / 10,
    deliverableFormat: Math.round(weights.deliverableFormat * factor * 10) / 10,
    visualStyle: Math.round(weights.visualStyle * factor * 10) / 10,
    budget: Math.round(weights.budget * factor * 10) / 10,
    deadlineTurnaround: Math.round(weights.deadlineTurnaround * factor * 10) / 10,
    commercialLicensing: Math.round(weights.commercialLicensing * factor * 10) / 10,
    evidenceVerification: Math.round(weights.evidenceVerification * factor * 10) / 10,
  };
}

/**
 * Deterministic calculation of Creative DNA + Fit Engine Match Score
 */
export function calculateFitScore(
  creator: CreatorDNA,
  brief: CreativeBrief,
  customWeights: MatchingWeights = DEFAULT_MATCHING_WEIGHTS
): FitMatchResult {
  const weights = normalizeWeights(customWeights);
  const hardConstraintsViolated: string[] = [];
  const licensingWarnings: string[] = [];

  // ==========================================
  // 1. SKILLS & SPECIALIZATIONS (25%)
  // ==========================================
  const requiredSkills = brief.requiredContentTypes || [];
  const creatorSpecs = creator.specializations.map((s) => s.toLowerCase());

  const matchedSkills: string[] = [];
  const partialSkills: string[] = [];
  const missingSkills: string[] = [];

  if (requiredSkills.length === 0) {
    matchedSkills.push('General alignment');
  } else {
    for (const req of requiredSkills) {
      const reqLower = req.toLowerCase();
      const hasExact = creatorSpecs.some((s) => s.includes(reqLower) || reqLower.includes(s));
      if (hasExact) {
        matchedSkills.push(req);
      } else {
        const hasKeyword = creatorSpecs.some((s) => {
          const words = reqLower.split(/\s+/);
          return words.some((w) => w.length > 3 && s.includes(w));
        });
        if (hasKeyword) {
          partialSkills.push(req);
        } else {
          missingSkills.push(req);
        }
      }
    }
  }

  const skillScoreRaw = requiredSkills.length > 0
    ? (matchedSkills.length * 1.0 + partialSkills.length * 0.5) / requiredSkills.length
    : 0.85;
  const skillsScore = Math.min(1, Math.max(0, skillScoreRaw));

  // ==========================================
  // 2. TOOLS & WORKFLOW (15%)
  // ==========================================
  const requiredTools = brief.requiredToolsAndCapabilities || [];
  const creatorTools = creator.aiToolsAndModels.map((t) => `${t.toolName} ${t.version}`.toLowerCase());

  const matchedTools: string[] = [];
  const partialTools: string[] = [];
  const missingTools: string[] = [];

  if (requiredTools.length === 0) {
    matchedTools.push('Flexible AI stack');
  } else {
    for (const req of requiredTools) {
      const reqLower = req.toLowerCase();
      const hasTool = creator.aiToolsAndModels.find((t) => {
        const full = `${t.toolName} ${t.version}`.toLowerCase();
        return full.includes(reqLower) || reqLower.includes(t.toolName.toLowerCase());
      });

      if (hasTool) {
        if (hasTool.proficiency === 'Expert') {
          matchedTools.push(`${hasTool.toolName} ${hasTool.version} (Expert)`);
        } else {
          matchedTools.push(`${hasTool.toolName} ${hasTool.version} (${hasTool.proficiency})`);
        }
      } else {
        const partial = creator.aiToolsAndModels.find((t) => {
          const parts = reqLower.split(/[\s/]+/);
          return parts.some((p) => p.length > 3 && t.toolName.toLowerCase().includes(p));
        });
        if (partial) {
          partialTools.push(`${req} (Covered by ${partial.toolName})`);
        } else {
          missingTools.push(req);
        }
      }
    }
  }

  const toolScoreRaw = requiredTools.length > 0
    ? (matchedTools.length * 1.0 + partialTools.length * 0.5) / requiredTools.length
    : 0.9;
  const toolsScore = Math.min(1, Math.max(0, toolScoreRaw));

  // ==========================================
  // 3. DELIVERABLE FORMAT & ASPECT RATIOS (15%)
  // ==========================================
  const requiredFormats = brief.requiredDeliverables || [];
  const creatorFormats = creator.deliverableFormats.map((f) => f.toLowerCase());
  const creatorRatios = creator.aspectRatios;

  const matchedDeliverables: string[] = [];
  const partialDeliverables: string[] = [];
  const missingDeliverables: string[] = [];

  if (requiredFormats.length === 0) {
    matchedDeliverables.push('Standard media deliverables supported');
  } else {
    for (const req of requiredFormats) {
      const formatMatch = creatorFormats.some(
        (cf) => cf.includes(req.format.toLowerCase()) || req.format.toLowerCase().includes(cf)
      );
      const ratioMatch = creatorRatios.includes(req.aspectRatio);

      if (formatMatch && ratioMatch) {
        matchedDeliverables.push(`${req.format} (${req.aspectRatio})`);
      } else if (formatMatch || ratioMatch) {
        partialDeliverables.push(`${req.format} (${req.aspectRatio}) [${formatMatch ? 'format ok' : 'ratio ok'}]`);
      } else {
        missingDeliverables.push(`${req.format} (${req.aspectRatio})`);
      }
    }
  }

  const deliverableScoreRaw = requiredFormats.length > 0
    ? (matchedDeliverables.length * 1.0 + partialDeliverables.length * 0.6) / requiredFormats.length
    : 0.85;
  const deliverableScore = Math.min(1, Math.max(0, deliverableScoreRaw));

  // ==========================================
  // 4. VISUAL STYLE (10%)
  // ==========================================
  const requiredStyles = brief.visualStyleTags || [];
  const creatorStyles = creator.visualStyles.map((s) => s.toLowerCase());

  const matchedStyles: string[] = [];
  const missingStyles: string[] = [];

  if (requiredStyles.length === 0) {
    matchedStyles.push('Universal stylistic adaptability');
  } else {
    for (const req of requiredStyles) {
      const match = creatorStyles.some(
        (cs) => cs.includes(req.toLowerCase()) || req.toLowerCase().includes(cs)
      );
      if (match) {
        matchedStyles.push(req);
      } else {
        missingStyles.push(req);
      }
    }
  }

  const styleScoreRaw = requiredStyles.length > 0
    ? matchedStyles.length / requiredStyles.length
    : 0.85;
  const visualStyleScore = Math.min(1, Math.max(0, styleScoreRaw));

  // ==========================================
  // 5. BUDGET COMPATIBILITY (10%)
  // ==========================================
  const briefBudgetMax = brief.budget.max;
  const briefBudgetMin = brief.budget.min;
  const creatorMin = creator.indicativeBudget.min;
  const creatorMax = creator.indicativeBudget.max;

  let budgetScore = 1.0;
  let budgetExplanation = '';

  if (creatorMin <= briefBudgetMax && creatorMax >= briefBudgetMin) {
    budgetScore = 1.0;
    budgetExplanation = `Indicative rate ($${creatorMin.toLocaleString()} - $${creatorMax.toLocaleString()}) overlaps smoothly with brief budget ($${briefBudgetMin.toLocaleString()} - $${briefBudgetMax.toLocaleString()})`;
  } else if (creatorMin > briefBudgetMax) {
    const diffRatio = (creatorMin - briefBudgetMax) / briefBudgetMax;
    if (diffRatio < 0.25) {
      budgetScore = 0.6;
      budgetExplanation = `Creator minimum ($${creatorMin.toLocaleString()}) slightly exceeds budget max ($${briefBudgetMax.toLocaleString()}) by ${Math.round(diffRatio * 100)}%`;
    } else {
      budgetScore = 0.1;
      budgetExplanation = `Creator minimum ($${creatorMin.toLocaleString()}) substantially exceeds target budget max ($${briefBudgetMax.toLocaleString()})`;
    }
  } else {
    budgetScore = 0.9;
    budgetExplanation = `Creator rates ($${creatorMin.toLocaleString()}) are comfortably within budget`;
  }

  // ==========================================
  // 6. DEADLINE & TURNAROUND (10%)
  // ==========================================
  const requiredDays = brief.deadlineDays || 14;
  const creatorDays = creator.turnaroundDays;
  let deadlineScore = 1.0;
  let turnaroundExplanation = '';

  if (creatorDays <= requiredDays) {
    deadlineScore = 1.0;
    turnaroundExplanation = `Estimated turnaround of ${creatorDays} days easily meets required ${requiredDays} day deadline`;
  } else {
    const overrun = creatorDays - requiredDays;
    if (overrun <= 3) {
      deadlineScore = 0.6;
      turnaroundExplanation = `Estimated turnaround (${creatorDays}d) is ${overrun} days longer than target (${requiredDays}d), but negotiable`;
    } else {
      deadlineScore = 0.2;
      turnaroundExplanation = `Creator requires ${creatorDays} days, exceeding the strict ${requiredDays} day deadline`;
    }
  }

  if (creator.availability === 'booked') {
    deadlineScore = Math.min(deadlineScore, 0.2);
    turnaroundExplanation += ' (Creator is currently fully booked)';
  }

  // ==========================================
  // 7. COMMERCIAL-USE & LICENSING (10%)
  // ==========================================
  let commercialScore = 1.0;
  const matchedLicensing: string[] = [];
  const missingLicensing: string[] = [];

  const needsCommercial = brief.licensingNeeds.commercialUseRequired;
  const needsCleanModel = brief.licensingNeeds.aiCleanModelRequired;
  const needsExclusive = brief.licensingNeeds.perpetualExclusive;

  if (needsCommercial) {
    if (creator.commercialLicensing.commercialAllowed) {
      matchedLicensing.push('Commercial rights permitted');
    } else {
      missingLicensing.push('Commercial usage restricted by creator');
      commercialScore -= 0.6;
      licensingWarnings.push('Creator profile does NOT permit full commercial deployment.');
    }
  }

  if (needsCleanModel) {
    if (creator.commercialLicensing.trainingDataCleanGuarantee) {
      matchedLicensing.push('Clean training data guarantee');
    } else {
      missingLicensing.push('No clean training data guarantee');
      commercialScore -= 0.25;
      licensingWarnings.push('Model clean guarantee is absent from creator DNA.');
    }
  }

  if (needsExclusive) {
    if (creator.commercialLicensing.exclusiveRightsAvailable) {
      matchedLicensing.push('Exclusive rights available');
    } else {
      missingLicensing.push('Exclusive rights not guaranteed');
      commercialScore -= 0.15;
    }
  }

  commercialScore = Math.max(0, commercialScore);

  // ==========================================
  // 8. EVIDENCE & VERIFICATION (5%)
  // ==========================================
  let evidenceScore = 0.5;
  let evidenceExplanation = '';
  if (creator.verifiedLevel === 'independently_reviewed') {
    evidenceScore = 1.0;
    evidenceExplanation = `Independently audited by ${creator.verifiedBadge?.auditor || 'Creative Intelligence Board'} (${creator.verifiedBadge?.auditScore || 95}/100)`;
  } else if (creator.verifiedLevel === 'evidence_attached') {
    evidenceScore = 0.75;
    evidenceExplanation = 'Authentic ComfyUI workflows, timelines, and prompt recordings attached';
  } else {
    evidenceScore = 0.35;
    evidenceExplanation = 'Self-declared claims only; independent audit not yet conducted';
  }

  // ==========================================
  // HARD CONSTRAINTS CHECK
  // ==========================================
  for (const mandatory of brief.mandatoryRequirements || []) {
    const mandLower = mandatory.toLowerCase();
    if (mandLower.includes('commercial') && !creator.commercialLicensing.commercialAllowed) {
      hardConstraintsViolated.push(`Mandatory commercial usage rights are not offered by this creator.`);
    }
    if (mandLower.includes('prores') && !creatorFormats.some((f) => f.includes('prores'))) {
      hardConstraintsViolated.push(`Mandatory ProRes delivery format is not supported.`);
    }
    if (mandLower.includes('verified') && creator.verifiedLevel === 'self_declared') {
      hardConstraintsViolated.push(`Mandatory evidence-verified portfolio status not met (creator is self-declared).`);
    }
    if (mandLower.includes('max') && mandLower.includes('day')) {
      const matchDays = mandLower.match(/(\d+)\s*day/);
      if (matchDays && creator.turnaroundDays > parseInt(matchDays[1])) {
        hardConstraintsViolated.push(`Turnaround (${creator.turnaroundDays}d) violates mandatory max timeline (${matchDays[1]}d).`);
      }
    }
  }

  // Dimension breakdown object
  const breakdown: Record<DimensionKey, DimensionScoreDetail> = {
    skillsAndSpecialization: {
      dimension: 'skillsAndSpecialization',
      label: 'Skills & Specialization',
      score: Math.round(skillsScore * weights.skillsAndSpecialization * 10) / 10,
      maxScore: weights.skillsAndSpecialization,
      weightPercentage: weights.skillsAndSpecialization,
      matchedItems: matchedSkills,
      partialItems: partialSkills,
      missingItems: missingSkills,
      explanation: `${matchedSkills.length} matches, ${partialSkills.length} partial, ${missingSkills.length} missing.`,
    },
    toolsAndWorkflow: {
      dimension: 'toolsAndWorkflow',
      label: 'AI Tools & Workflow',
      score: Math.round(toolsScore * weights.toolsAndWorkflow * 10) / 10,
      maxScore: weights.toolsAndWorkflow,
      weightPercentage: weights.toolsAndWorkflow,
      matchedItems: matchedTools,
      partialItems: partialTools,
      missingItems: missingTools,
      explanation: `${matchedTools.length} model proficiencies verified.`,
    },
    deliverableFormat: {
      dimension: 'deliverableFormat',
      label: 'Formats & Aspect Ratios',
      score: Math.round(deliverableScore * weights.deliverableFormat * 10) / 10,
      maxScore: weights.deliverableFormat,
      weightPercentage: weights.deliverableFormat,
      matchedItems: matchedDeliverables,
      partialItems: partialDeliverables,
      missingItems: missingDeliverables,
      explanation: `${matchedDeliverables.length} format requirements fulfilled.`,
    },
    visualStyle: {
      dimension: 'visualStyle',
      label: 'Visual Style Cohesion',
      score: Math.round(visualStyleScore * weights.visualStyle * 10) / 10,
      maxScore: weights.visualStyle,
      weightPercentage: weights.visualStyle,
      matchedItems: matchedStyles,
      partialItems: [],
      missingItems: missingStyles,
      explanation: `${matchedStyles.length} style aesthetics matched.`,
    },
    budget: {
      dimension: 'budget',
      label: 'Budget Alignment',
      score: Math.round(budgetScore * weights.budget * 10) / 10,
      maxScore: weights.budget,
      weightPercentage: weights.budget,
      matchedItems: [budgetExplanation],
      partialItems: [],
      missingItems: [],
      explanation: budgetExplanation,
    },
    deadlineTurnaround: {
      dimension: 'deadlineTurnaround',
      label: 'Turnaround & Availability',
      score: Math.round(deadlineScore * weights.deadlineTurnaround * 10) / 10,
      maxScore: weights.deadlineTurnaround,
      weightPercentage: weights.deadlineTurnaround,
      matchedItems: [turnaroundExplanation],
      partialItems: [],
      missingItems: [],
      explanation: turnaroundExplanation,
    },
    commercialLicensing: {
      dimension: 'commercialLicensing',
      label: 'Licensing & Indemnity',
      score: Math.round(commercialScore * weights.commercialLicensing * 10) / 10,
      maxScore: weights.commercialLicensing,
      weightPercentage: weights.commercialLicensing,
      matchedItems: matchedLicensing,
      partialItems: [],
      missingItems: missingLicensing,
      explanation: matchedLicensing.join(', ') || 'Licensing conditions pending negotiation.',
    },
    evidenceVerification: {
      dimension: 'evidenceVerification',
      label: 'Evidence & Audit Rigor',
      score: Math.round(evidenceScore * weights.evidenceVerification * 10) / 10,
      maxScore: weights.evidenceVerification,
      weightPercentage: weights.evidenceVerification,
      matchedItems: [evidenceExplanation],
      partialItems: [],
      missingItems: [],
      explanation: evidenceExplanation,
    },
  };

  // Compute final overall score
  let totalScore = Object.values(breakdown).reduce((sum, item) => sum + item.score, 0);
  totalScore = Math.min(100, Math.max(0, Math.round(totalScore)));

  // If hard constraints violated, cap or flag
  let fitTier: FitMatchResult['fitTier'] = 'Moderate Match';
  if (hardConstraintsViolated.length > 0) {
    fitTier = 'Disqualified';
    totalScore = Math.min(totalScore, 42); // visually cap to reflect violation
  } else if (totalScore >= 90) {
    fitTier = 'Exceptional Match';
  } else if (totalScore >= 75) {
    fitTier = 'Strong Match';
  } else if (totalScore >= 60) {
    fitTier = 'Moderate Match';
  } else {
    fitTier = 'Low Compatibility';
  }

  // Why this match highlights
  const whyThisMatch: string[] = [];
  if (matchedSkills.length > 0) whyThisMatch.push(`Mastery in ${matchedSkills.slice(0, 2).join(' & ')} matches campaign concept.`);
  if (matchedTools.length > 0) whyThisMatch.push(`Production-grade workflow with ${matchedTools[0]}.`);
  if (budgetScore >= 0.9) whyThisMatch.push(`Budget aligns within client parameters.`);
  if (deadlineScore >= 0.9) whyThisMatch.push(`Turnaround comfortably accommodates the ${brief.deadlineDays}-day deadline.`);
  if (creator.verifiedLevel === 'independently_reviewed') whyThisMatch.push(`Verified evidence audit confirms authentic neural workflow.`);

  // Recommended questions
  const recommendedQuestions: string[] = [];
  if (missingTools.length > 0) {
    recommendedQuestions.push(`Can you accommodate ${missingTools.join(', ')} or provide equivalent quality with your primary pipeline?`);
  }
  if (licensingWarnings.length > 0) {
    recommendedQuestions.push(`Are you willing to issue an indemnified commercial rider for this enterprise campaign?`);
  }
  if (creator.availability === 'within_1_week' || creator.availability === 'within_2_weeks') {
    recommendedQuestions.push(`Can you confirm availability to start immediately on day 1 upon proposal award?`);
  }
  if (recommendedQuestions.length === 0) {
    recommendedQuestions.push(`What is your preferred iteration cadency during initial prompt exploration?`);
    recommendedQuestions.push(`Would you like to review reference moodboards before locking timeline milestones?`);
  }

  const plainEnglishSummary = hardConstraintsViolated.length > 0
    ? `Creator is disqualified due to ${hardConstraintsViolated.length} hard constraint conflict(s): ${hardConstraintsViolated[0]}`
    : `${creator.displayName} is scored as a ${fitTier} (${totalScore}%) for "${brief.title}". Strengths include ${matchedSkills.slice(0, 2).join(', ')} and workflow tooling compatibility.`;

  const evidenceConfidence = creator.verifiedLevel === 'independently_reviewed'
    ? 'High (Independently Reviewed)'
    : creator.verifiedLevel === 'evidence_attached'
    ? 'Medium (Evidence Attached)'
    : 'Low (Self-Declared)';

  const recommendedAction = hardConstraintsViolated.length > 0
    ? 'Review disqualification reason or request an exception from the creator.'
    : totalScore >= 80
    ? 'Invite creator to submit proposal or save to campaign shortlist.'
    : 'Inspect missing requirements or compare with alternative candidates.';

  return {
    creatorId: creator.id,
    briefId: brief.id,
    overallScore: totalScore,
    fitTier,
    dimensionBreakdown: breakdown,
    hardConstraintsViolated,
    licensingWarnings,
    evidenceConfidence,
    plainEnglishSummary,
    whyThisMatch,
    recommendedQuestions,
    recommendedAction,
  };
}
