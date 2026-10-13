'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'brand' | 'creator';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl: string;
  companyOrTitle: string;
  bio: string;
  isVerified: boolean;
  createdAt: string;
  loginMethod: 'email' | 'phone';
}

interface AuthContextType {
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string; needsOTP?: boolean }>;
  verifyOTP: (identifier: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  resendOTP: (identifier: string) => Promise<void>;
  signIn: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
}

export interface SignUpData {
  name: string;
  identifier: string; // email or phone
  password: string;
  role: UserRole;
  companyOrTitle: string;
  loginMethod: 'email' | 'phone';
}

// In-memory user store (localStorage backed) — simulates a real user DB
interface StoredUser extends AuthUser {
  passwordHash: string;
  otpCode?: string;
  otpExpiry?: number;
  otpVerified: boolean;
}

const AUTH_STORAGE_KEY = 'creovanta_auth_users_v2';
const AUTH_SESSION_KEY = 'creovanta_auth_session_v2';

function hashPassword(password: string): string {
  // Simple deterministic hash for demo (in production use bcrypt server-side)
  let hash = 0;
  const str = password + 'creovanta_salt_2026';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
}

// Pre-seeded demo accounts
const SEED_USERS: StoredUser[] = [
  {
    id: 'auth-brand-1',
    name: 'Elena Rostova',
    email: 'elena@cybervogue.studio',
    phone: '+91-9876543210',
    role: 'brand',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    companyOrTitle: 'VP Creative Direction, CyberVogue',
    bio: 'Overseeing global AI-powered campaigns for luxury brands.',
    isVerified: true,
    createdAt: '2026-01-10',
    loginMethod: 'email',
    passwordHash: hashPassword('Demo@1234'),
    otpVerified: true,
  },
  {
    id: 'auth-creator-1',
    name: 'Kaelen Vance',
    email: 'kaelen@neuralvance.art',
    phone: '+91-9123456789',
    role: 'creator',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    companyOrTitle: 'Generative Cinematographer & Sora Specialist',
    bio: 'Pioneering temporal consistency in AI film.',
    isVerified: true,
    createdAt: '2026-01-15',
    loginMethod: 'email',
    passwordHash: hashPassword('Demo@1234'),
    otpVerified: true,
  },
];

function ensureSeedUsers() {
  const users = getStoredUsers();
  if (users.length === 0) {
    saveStoredUsers(SEED_USERS);
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ensureSeedUsers();
    try {
      const sessionRaw = localStorage.getItem(AUTH_SESSION_KEY);
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        const users = getStoredUsers();
        const found = users.find((u) => u.id === session.userId && u.otpVerified);
        if (found) {
          const { passwordHash, otpCode, otpExpiry, otpVerified, ...safeUser } = found;
          setAuthUser(safeUser);
        }
      }
    } catch {
      /* ignore */
    }
    setIsLoading(false);
  }, []);

  const signUp = async (data: SignUpData): Promise<{ success: boolean; error?: string; needsOTP?: boolean }> => {
    const users = getStoredUsers();
    const existingEmail = users.find((u) => u.email === data.identifier);
    const existingPhone = users.find((u) => u.phone === data.identifier);

    if (existingEmail || existingPhone) {
      return { success: false, error: 'An account with this email or phone already exists. Please sign in.' };
    }

    const otp = generateOTP();
    const newUser: StoredUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: data.name,
      email: data.loginMethod === 'email' ? data.identifier : '',
      phone: data.loginMethod === 'phone' ? data.identifier : undefined,
      role: data.role,
      avatarUrl: `https://api.dicebear.com/8.x/adventurer/svg?seed=${encodeURIComponent(data.name)}`,
      companyOrTitle: data.companyOrTitle,
      bio: '',
      isVerified: false,
      createdAt: new Date().toISOString().split('T')[0],
      loginMethod: data.loginMethod,
      passwordHash: hashPassword(data.password),
      otpCode: otp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // 10 min
      otpVerified: false,
    };

    users.push(newUser);
    saveStoredUsers(users);

    // Simulate sending OTP — show it in console for hackathon demo
    console.log(`🔐 CREOVANTA OTP for ${data.identifier}: ${otp}`);
    // Store OTP in sessionStorage for demo display
    sessionStorage.setItem('creovanta_pending_otp_display', otp);
    sessionStorage.setItem('creovanta_pending_identifier', data.identifier);

    return { success: true, needsOTP: true };
  };

  const verifyOTP = async (identifier: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const userIdx = users.findIndex((u) => u.email === identifier || u.phone === identifier);

    if (userIdx === -1) return { success: false, error: 'Account not found.' };

    const user = users[userIdx];
    if (!user.otpCode) return { success: false, error: 'No OTP was issued. Please sign up again.' };
    if (user.otpExpiry && Date.now() > user.otpExpiry) {
      return { success: false, error: 'OTP expired. Please request a new one.' };
    }
    if (user.otpCode !== otp) {
      return { success: false, error: 'Incorrect OTP. Please check and try again.' };
    }

    users[userIdx] = { ...user, otpVerified: true, isVerified: true, otpCode: undefined, otpExpiry: undefined };
    saveStoredUsers(users);

    const { passwordHash, otpCode, otpExpiry, otpVerified, ...safeUser } = users[userIdx];
    setAuthUser(safeUser);
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ userId: safeUser.id }));
    sessionStorage.removeItem('creovanta_pending_otp_display');
    sessionStorage.removeItem('creovanta_pending_identifier');

    return { success: true };
  };

  const resendOTP = async (identifier: string) => {
    const users = getStoredUsers();
    const userIdx = users.findIndex((u) => u.email === identifier || u.phone === identifier);
    if (userIdx === -1) return;

    const otp = generateOTP();
    users[userIdx] = {
      ...users[userIdx],
      otpCode: otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
    };
    saveStoredUsers(users);
    console.log(`🔐 Resent OTP for ${identifier}: ${otp}`);
    sessionStorage.setItem('creovanta_pending_otp_display', otp);
  };

  const signIn = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const user = users.find((u) => u.email === identifier || u.phone === identifier);

    if (!user) {
      return { success: false, error: 'No account found with this email or phone number.' };
    }
    if (user.passwordHash !== hashPassword(password)) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    if (!user.otpVerified) {
      return { success: false, error: 'Please verify your account via OTP first.' };
    }

    const { passwordHash, otpCode, otpExpiry, otpVerified, ...safeUser } = user;
    setAuthUser(safeUser);
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ userId: safeUser.id }));
    return { success: true };
  };

  const signOut = () => {
    setAuthUser(null);
    localStorage.removeItem(AUTH_SESSION_KEY);
  };

  const updateProfile = (data: Partial<AuthUser>) => {
    if (!authUser) return;
    const updated = { ...authUser, ...data };
    setAuthUser(updated);

    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === authUser.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      saveStoredUsers(users);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isAuthenticated: !!authUser,
        isLoading,
        signUp,
        verifyOTP,
        resendOTP,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
