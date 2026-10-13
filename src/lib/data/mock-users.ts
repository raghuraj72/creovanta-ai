import { User } from '@/types';

export const DEMO_USERS: User[] = [
  {
    id: 'user-brand-1',
    name: 'Elena Rostova',
    email: 'elena@cybervogue.studio',
    role: 'brand',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    companyOrTitle: 'VP of Creative Direction, CyberVogue',
    bio: 'Oversees multimodal global campaigns bridging haute couture and generative cyber-cinematography.',
    isDemoUser: true,
  },
  {
    id: 'user-creator-1',
    name: 'Kaelen Vance',
    email: 'kaelen@neuralvance.art',
    role: 'creator',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    companyOrTitle: 'Generative Cinematographer & Sora Specialist',
    bio: 'Pioneering temporal consistency in AI film. Certified Sora & Runway Gen-3 Alpha director with 25+ commercial brand campaigns.',
    isDemoUser: true,
  },
  {
    id: 'user-creator-2',
    name: 'Aria Chen',
    email: 'aria@solarpunk3d.design',
    role: 'creator',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    companyOrTitle: 'Spatial Generative & 3D Gaussian Splatting Lead',
    bio: 'Bridging generative diffusion, custom ComfyUI LoRAs, and interactive 3D assets for high-end luxury products.',
    isDemoUser: true,
  },
  {
    id: 'user-reviewer-1',
    name: 'Dr. Marcus Thorne',
    email: 'm.thorne@creative-intel.org',
    role: 'reviewer',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    companyOrTitle: 'Chief Verification Auditor, CREOVANTA Ethics Board',
    bio: 'Independent verification auditor reviewing AI workflow provenance, copyright boundaries, and node reproducibility.',
    isDemoUser: true,
  },
];
