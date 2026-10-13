export type UserRole = 'brand' | 'creator' | 'reviewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  companyOrTitle: string;
  bio?: string;
  isDemoUser: boolean;
}

export type EvidenceLevel = 'self_declared' | 'evidence_attached' | 'independently_reviewed';

export interface AIToolProficiency {
  toolName: string;
  version: string;
  category: 'video' | 'image' | '3d' | 'audio' | 'upscaling' | 'workflow';
  proficiency: 'Expert' | 'Advanced' | 'Intermediate';
  commercialLicense: boolean;
  proofAttached: boolean;
}

export interface WorkflowStage {
  stepNumber: number;
  title: string;
  description: string;
  tooling: string;
  humanInterventionRatio: number; // 0 to 100 percentage
}

export interface CommercialLicensing {
  commercialAllowed: boolean;
  exclusiveRightsAvailable: boolean;
  trainingDataCleanGuarantee: boolean;
  copyrightIndemnitySupported: boolean;
  disclosedLicenseTerms: string;
}

export interface HumanReviewStatus {
  status: 'verified' | 'pending' | 'flagged' | 'unreviewed';
  reviewerName?: string;
  reviewedAt?: string;
  auditNotes?: string;
  evidenceCount: number;
}

export interface EvidenceDocument {
  id: string;
  title: string;
  kind: 'Workflow Screen Recording' | 'Raw ComfyUI Graph' | 'Project Timeline' | 'Prompt History Log' | 'Client Verification Letter';
  fileSize: string;
  url: string;
  verified: boolean;
}

export interface PortfolioArtifact {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: 'Commercial Video' | 'Key Visual' | '3D / Spatial' | 'Motion Graphic' | 'Editorial Campaign' | 'Audio-Visual';
  mediaType: 'video' | 'image' | 'interactive';
  mediaUrl: string;
  thumbnailUrl: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5' | '2.39:1';
  toolsUsed: Array<{ name: string; version: string }>;
  workflowSummary: string;
  promptOrProcessNotes: string;
  humanTouchDisclosure: {
    generativePercentage: number;
    humanVFXPercentage: number;
    colorGrading: boolean;
    soundDesignHuman: boolean;
    details: string;
  };
  licensingDeclaration: {
    commercialUsagePermitted: boolean;
    clientExclusive: boolean;
    platformRestrictions: string[];
  };
  evidenceLevel: EvidenceLevel;
  evidenceArtifacts: EvidenceDocument[];
  views: number;
  likes: number;
  featured?: boolean;
}

export interface CreatorDNA {
  id: string;
  userId: string;
  displayName: string;
  handle: string;
  avatarUrl: string;
  bannerUrl: string;
  positioningStatement: string; // e.g. "Speculative Cinematographer & Neural Video Director"
  bio: string;
  location: string;
  rating: number;
  reviewCount: number;
  completedProjects: number;
  verifiedLevel: EvidenceLevel;
  verifiedBadge?: {
    badgeName: string;
    auditor: string;
    date: string;
    auditScore: number;
  };
  indicativeBudget: {
    min: number;
    max: number;
    rateType: 'project' | 'day' | 'asset';
  };
  turnaroundDays: number;
  availability: 'immediate' | 'within_1_week' | 'within_2_weeks' | 'booked';
  specializations: string[];
  aiToolsAndModels: AIToolProficiency[];
  deliverableFormats: string[]; // e.g., 'ProRes 422 HQ 4K', 'MP4 H.265 60fps', 'PNG 8K', 'GLB'
  aspectRatios: string[];
  visualStyles: string[];
  workflowStages: WorkflowStage[];
  commercialLicensing: CommercialLicensing;
  humanReviewStatus: HumanReviewStatus;
  portfolio: PortfolioArtifact[];
  updatedAt: string;
}

export interface DeliverableRequirement {
  id: string;
  format: string;
  aspectRatio: string;
  resolution: string;
  quantity: number;
  durationSeconds?: number;
}

export interface CreativeBrief {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  title: string;
  status: 'draft' | 'published' | 'matching' | 'in_progress' | 'completed' | 'archived';
  campaignObjective: string;
  targetAudience: string;
  distributionChannels: string[];
  creativeConcept: string;
  visualStyleTags: string[];
  requiredContentTypes: string[];
  requiredDeliverables: DeliverableRequirement[];
  requiredToolsAndCapabilities: string[];
  mandatoryRequirements: string[]; // Hard constraints (e.g., "Full Commercial License Required", "ProRes 422 HQ", "Max 5 Days")
  softPreferences: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
    isFixed: boolean;
  };
  deadlineDays: number;
  deadlineDate: string;
  revisionRounds: number;
  licensingNeeds: {
    commercialUseRequired: boolean;
    perpetualExclusive: boolean;
    aiCleanModelRequired: boolean;
    notes: string;
  };
  brandRestrictions: string[];
  successCriteria: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchingWeights {
  skillsAndSpecialization: number; // default: 25
  toolsAndWorkflow: number;        // default: 15
  deliverableFormat: number;       // default: 15
  visualStyle: number;             // default: 10
  budget: number;                  // default: 10
  deadlineTurnaround: number;      // default: 10
  commercialLicensing: number;     // default: 10
  evidenceVerification: number;    // default: 5
}

export type DimensionKey = keyof MatchingWeights;

export interface DimensionScoreDetail {
  dimension: DimensionKey;
  label: string;
  score: number;
  maxScore: number;
  weightPercentage: number;
  matchedItems: string[];
  partialItems: string[];
  missingItems: string[];
  explanation: string;
}

export interface FitMatchResult {
  creatorId: string;
  briefId: string;
  overallScore: number; // 0 - 100
  fitTier: 'Exceptional Match' | 'Strong Match' | 'Moderate Match' | 'Low Compatibility' | 'Disqualified';
  dimensionBreakdown: Record<DimensionKey, DimensionScoreDetail>;
  hardConstraintsViolated: string[];
  licensingWarnings: string[];
  evidenceConfidence: 'High (Independently Reviewed)' | 'Medium (Evidence Attached)' | 'Low (Self-Declared)';
  plainEnglishSummary: string;
  whyThisMatch: string[];
  recommendedQuestions: string[];
  recommendedAction: string;
}

export interface Proposal {
  id: string;
  briefId: string;
  creatorId: string;
  brandId: string;
  proposedBudget: number;
  proposedTurnaroundDays: number;
  coverLetter: string;
  approachSummary: string;
  suggestedMilestones: Array<{
    name: string;
    days: number;
    deliverables: string;
  }>;
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn';
  submittedAt: string;
}

export type ProjectLifecycleStatus =
  | 'draft_brief'
  | 'published_brief'
  | 'creator_discovery'
  | 'proposal_submitted'
  | 'accepted_proposal'
  | 'active_project'
  | 'deliverable_submitted'
  | 'brand_review'
  | 'revision_requested'
  | 'approved'
  | 'completed';

export interface ProjectDeliverableItem {
  id: string;
  title: string;
  format: string;
  fileUrl: string;
  previewUrl: string;
  notes: string;
  submittedAt: string;
  version: number;
  status: 'pending' | 'approved' | 'revision_needed';
}

export interface ProjectTimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  actor: string;
  timestamp: string;
}

export interface Project {
  id: string;
  briefId: string;
  proposalId?: string;
  brandId: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  title: string;
  status: ProjectLifecycleStatus;
  contractAmount: number;
  escrowStatus: 'funded_placeholder' | 'in_review' | 'released_placeholder';
  deliverables: ProjectDeliverableItem[];
  revisionCount: number;
  maxRevisions: number;
  revisionNotes?: string;
  timelineEvents: ProjectTimelineEvent[];
  brandFeedback?: {
    rating: number;
    comment: string;
    creativeVisionScore: number;
    technicalExecutionScore: number;
    communicationScore: number;
    submittedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match' | 'proposal' | 'project' | 'system' | 'verification';
  link?: string;
  read: boolean;
  createdAt: string;
}
