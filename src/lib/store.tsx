'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  CreatorDNA,
  CreativeBrief,
  Proposal,
  Project,
  MatchingWeights,
  AppNotification,
  UserRole,
  PortfolioArtifact,
} from '@/types';
import { DEMO_USERS } from './data/mock-users';
import { MOCK_CREATORS } from './data/mock-creators';
import { MOCK_BRIEFS } from './data/mock-briefs';
import { MOCK_PROPOSALS, MOCK_PROJECTS } from './data/mock-projects';
import { DEFAULT_MATCHING_WEIGHTS, normalizeWeights } from './matching-engine';

interface AppContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  creators: CreatorDNA[];
  briefs: CreativeBrief[];
  proposals: Proposal[];
  projects: Project[];
  shortlist: string[];
  compareList: string[];
  selectedBriefId: string | null;
  setSelectedBriefId: (id: string | null) => void;
  matchingWeights: MatchingWeights;
  notifications: AppNotification[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isDemoMode: boolean;
  resetDemoData: () => void;

  // Actions
  createBrief: (brief: Omit<CreativeBrief, 'id' | 'createdAt' | 'updatedAt'>) => CreativeBrief;
  updateBrief: (brief: CreativeBrief) => void;
  deleteBrief: (briefId: string) => void;
  toggleShortlist: (creatorId: string) => void;
  toggleCompare: (creatorId: string) => void;
  clearCompare: () => void;
  submitProposal: (proposal: Omit<Proposal, 'id' | 'submittedAt' | 'status'>) => Proposal;
  acceptProposal: (proposalId: string) => Project;
  rejectProposal: (proposalId: string) => void;
  submitDeliverable: (
    projectId: string,
    deliverable: { title: string; format: string; fileUrl: string; notes: string }
  ) => void;
  requestRevision: (projectId: string, notes: string) => void;
  approveDeliverables: (
    projectId: string,
    feedback: { rating: number; comment: string; creativeVisionScore: number; technicalExecutionScore: number; communicationScore: number }
  ) => void;
  updateCreatorProfile: (creator: CreatorDNA) => void;
  addPortfolioArtifact: (creatorId: string, artifact: Omit<PortfolioArtifact, 'id' | 'views' | 'likes'>) => void;
  updateWeights: (weights: MatchingWeights) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'creovanta_current_user',
  CREATORS: 'creovanta_creators_v1',
  BRIEFS: 'creovanta_briefs_v1',
  PROPOSALS: 'creovanta_proposals_v1',
  PROJECTS: 'creovanta_projects_v1',
  SHORTLIST: 'creovanta_shortlist_v1',
  WEIGHTS: 'creovanta_weights_v1',
  THEME: 'creovanta_theme_v1',
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-brand-1',
    title: 'New Proposal Received',
    message: 'Kaelen Vance submitted a proposal for "Aetheria Neural Headset Global Reveal".',
    type: 'proposal',
    link: '/dashboard',
    read: false,
    createdAt: '10m ago',
  },
  {
    id: 'notif-2',
    userId: 'user-brand-1',
    title: 'High Creative DNA Match',
    message: 'Aria Chen scored 94% compatibility for your Spatial Neural Headset brief.',
    type: 'match',
    link: '/marketplace?creator=creator-2',
    read: false,
    createdAt: '1h ago',
  },
  {
    id: 'notif-3',
    userId: 'user-creator-1',
    title: 'Proposal Accepted!',
    message: 'CyberVogue accepted your proposal for $7,500. Project is now active.',
    type: 'project',
    link: '/dashboard',
    read: false,
    createdAt: '2h ago',
  },
  {
    id: 'notif-4',
    userId: 'user-brand-1',
    title: 'Deliverables Ready for Review',
    message: 'Kaelen Vance submitted 4K ProRes master video for review on "Aetheria".',
    type: 'project',
    link: '/projects/proj-1',
    read: false,
    createdAt: '4h ago',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]);
  const [creators, setCreators] = useState<CreatorDNA[]>(MOCK_CREATORS);
  const [briefs, setBriefs] = useState<CreativeBrief[]>(MOCK_BRIEFS);
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [shortlist, setShortlist] = useState<string[]>(['creator-1', 'creator-4']);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [selectedBriefId, setSelectedBriefId] = useState<string | null>('brief-1');
  const [matchingWeights, setMatchingWeights] = useState<MatchingWeights>(DEFAULT_MATCHING_WEIGHTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light' | null;
      if (storedTheme) {
        setTheme(storedTheme);
        if (storedTheme === 'light') {
          document.documentElement.classList.add('light-theme');
        } else {
          document.documentElement.classList.remove('light-theme');
        }
      }

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) {
        const found = DEMO_USERS.find((u) => u.id === storedUser);
        if (found) setCurrentUser(found);
      }

      const storedCreators = localStorage.getItem(STORAGE_KEYS.CREATORS);
      if (storedCreators) setCreators(JSON.parse(storedCreators));

      const storedBriefs = localStorage.getItem(STORAGE_KEYS.BRIEFS);
      if (storedBriefs) setBriefs(JSON.parse(storedBriefs));

      const storedProposals = localStorage.getItem(STORAGE_KEYS.PROPOSALS);
      if (storedProposals) setProposals(JSON.parse(storedProposals));

      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) setProjects(JSON.parse(storedProjects));

      const storedShortlist = localStorage.getItem(STORAGE_KEYS.SHORTLIST);
      if (storedShortlist) setShortlist(JSON.parse(storedShortlist));

      const storedWeights = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
      if (storedWeights) setMatchingWeights(JSON.parse(storedWeights));
    } catch (e) {
      console.warn('LocalStorage read error, using seeded data', e);
    }
    setIsMounted(true);
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, currentUser.id);
      localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(creators));
      localStorage.setItem(STORAGE_KEYS.BRIEFS, JSON.stringify(briefs));
      localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      localStorage.setItem(STORAGE_KEYS.SHORTLIST, JSON.stringify(shortlist));
      localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(matchingWeights));
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.warn('LocalStorage write error', e);
    }
  }, [isMounted, currentUser, creators, briefs, proposals, projects, shortlist, matchingWeights, theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  const switchUser = (userId: string) => {
    const user = DEMO_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const resetDemoData = () => {
    setCreators(MOCK_CREATORS);
    setBriefs(MOCK_BRIEFS);
    setProposals(MOCK_PROPOSALS);
    setProjects(MOCK_PROJECTS);
    setShortlist(['creator-1', 'creator-4']);
    setCompareList([]);
    setSelectedBriefId('brief-1');
    setMatchingWeights(DEFAULT_MATCHING_WEIGHTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(DEMO_USERS[0]);
    localStorage.clear();
  };

  const createBrief = (briefData: Omit<CreativeBrief, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBrief: CreativeBrief = {
      ...briefData,
      id: `brief-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setBriefs((prev) => [newBrief, ...prev]);
    setSelectedBriefId(newBrief.id);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Brief Published',
      message: `"${newBrief.title}" has been published and is now matching candidate creators.`,
      type: 'system',
      link: '/marketplace',
      read: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newBrief;
  };

  const updateBrief = (updatedBrief: CreativeBrief) => {
    setBriefs((prev) =>
      prev.map((b) => (b.id === updatedBrief.id ? { ...updatedBrief, updatedAt: new Date().toISOString().split('T')[0] } : b))
    );
  };

  const deleteBrief = (briefId: string) => {
    setBriefs((prev) => prev.filter((b) => b.id !== briefId));
    if (selectedBriefId === briefId) {
      setSelectedBriefId(null);
    }
  };

  const toggleShortlist = (creatorId: string) => {
    setShortlist((prev) =>
      prev.includes(creatorId) ? prev.filter((id) => id !== creatorId) : [...prev, creatorId]
    );
  };

  const toggleCompare = (creatorId: string) => {
    setCompareList((prev) => {
      if (prev.includes(creatorId)) {
        return prev.filter((id) => id !== creatorId);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], creatorId]; // maintain maximum 3
      }
      return [...prev, creatorId];
    });
  };

  const clearCompare = () => setCompareList([]);

  const submitProposal = (proposalData: Omit<Proposal, 'id' | 'submittedAt' | 'status'>) => {
    const newProp: Proposal = {
      ...proposalData,
      id: `prop-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
    };
    setProposals((prev) => [newProp, ...prev]);

    // Send notification to brand
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: proposalData.brandId,
      title: 'New Proposal Submitted',
      message: `A creator submitted a proposal for $${proposalData.proposedBudget.toLocaleString()}.`,
      type: 'proposal',
      link: '/dashboard',
      read: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [notif, ...prev]);

    return newProp;
  };

  const acceptProposal = (proposalId: string) => {
    const prop = proposals.find((p) => p.id === proposalId);
    if (!prop) throw new Error('Proposal not found');

    const brief = briefs.find((b) => b.id === prop.briefId);
    const creator = creators.find((c) => c.id === prop.creatorId);

    // Update proposal status
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'accepted' } : p))
    );

    // Create new project
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      briefId: prop.briefId,
      proposalId: prop.id,
      brandId: prop.brandId,
      brandName: brief?.brandName || 'Brand Partner',
      creatorId: prop.creatorId,
      creatorName: creator?.displayName || 'Creator',
      title: brief?.title || 'Creative Campaign Project',
      status: 'active_project',
      contractAmount: prop.proposedBudget,
      escrowStatus: 'funded_placeholder',
      deliverables: [],
      revisionCount: 0,
      maxRevisions: brief?.revisionRounds || 2,
      timelineEvents: [
        {
          id: `time-${Date.now()}-1`,
          type: 'proposal_accepted',
          title: 'Proposal Accepted & Escrow Funded',
          description: `Contract initiated for $${prop.proposedBudget.toLocaleString()}. Timeline active.`,
          actor: currentUser.name,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProject, ...prev]);

    // Update brief status
    if (brief) {
      setBriefs((prev) =>
        prev.map((b) => (b.id === brief.id ? { ...b, status: 'in_progress' } : b))
      );
    }

    return newProject;
  };

  const rejectProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'declined' } : p))
    );
  };

  const submitDeliverable = (
    projectId: string,
    deliverable: { title: string; format: string; fileUrl: string; notes: string }
  ) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const newItem = {
          id: `deliv-${Date.now()}`,
          title: deliverable.title,
          format: deliverable.format,
          fileUrl: deliverable.fileUrl,
          previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
          notes: deliverable.notes,
          submittedAt: new Date().toISOString(),
          version: proj.deliverables.length + 1,
          status: 'pending' as const,
        };
        const updatedEvents = [
          ...proj.timelineEvents,
          {
            id: `time-${Date.now()}`,
            type: 'deliverable_submitted',
            title: `Deliverable Submitted: ${deliverable.title}`,
            description: deliverable.notes || 'Creator submitted high-resolution assets for review.',
            actor: currentUser.name,
            timestamp: new Date().toISOString(),
          },
        ];
        return {
          ...proj,
          status: 'deliverable_submitted',
          deliverables: [...proj.deliverables, newItem],
          timelineEvents: updatedEvents,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const requestRevision = (projectId: string, notes: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          status: 'revision_requested',
          revisionCount: proj.revisionCount + 1,
          revisionNotes: notes,
          timelineEvents: [
            ...proj.timelineEvents,
            {
              id: `time-${Date.now()}`,
              type: 'revision_requested',
              title: `Revision Requested (Round ${proj.revisionCount + 1})`,
              description: notes,
              actor: currentUser.name,
              timestamp: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const approveDeliverables = (
    projectId: string,
    feedback: { rating: number; comment: string; creativeVisionScore: number; technicalExecutionScore: number; communicationScore: number }
  ) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          status: 'completed',
          escrowStatus: 'released_placeholder',
          brandFeedback: {
            ...feedback,
            submittedAt: new Date().toISOString(),
          },
          timelineEvents: [
            ...proj.timelineEvents,
            {
              id: `time-${Date.now()}`,
              type: 'project_completed',
              title: 'Deliverables Approved & Project Completed',
              description: `Escrow released. Rated ${feedback.rating}/5 stars. "${feedback.comment}"`,
              actor: currentUser.name,
              timestamp: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const updateCreatorProfile = (updatedCreator: CreatorDNA) => {
    setCreators((prev) =>
      prev.map((c) => (c.id === updatedCreator.id ? updatedCreator : c))
    );
  };

  const addPortfolioArtifact = (
    creatorId: string,
    artifactData: Omit<PortfolioArtifact, 'id' | 'views' | 'likes'>
  ) => {
    const newArt: PortfolioArtifact = {
      ...artifactData,
      id: `port-${Date.now()}`,
      views: 1,
      likes: 0,
    };
    setCreators((prev) =>
      prev.map((c) => {
        if (c.id !== creatorId) return c;
        return {
          ...c,
          portfolio: [newArt, ...c.portfolio],
        };
      })
    );
  };

  const updateWeights = (weights: MatchingWeights) => {
    setMatchingWeights(normalizeWeights(weights));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        creators,
        briefs,
        proposals,
        projects,
        shortlist,
        compareList,
        selectedBriefId,
        setSelectedBriefId,
        matchingWeights,
        notifications,
        theme,
        toggleTheme,
        isDemoMode: true,
        resetDemoData,
        createBrief,
        updateBrief,
        deleteBrief,
        toggleShortlist,
        toggleCompare,
        clearCompare,
        submitProposal,
        acceptProposal,
        rejectProposal,
        submitDeliverable,
        requestRevision,
        approveDeliverables,
        updateCreatorProfile,
        addPortfolioArtifact,
        updateWeights,
        markNotificationAsRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
