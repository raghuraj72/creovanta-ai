'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import { DEMO_USERS } from '@/lib/data/mock-users';
import {
  Sparkles,
  Search,
  Bell,
  Sun,
  Moon,
  UserCheck,
  ChevronDown,
  Layers,
  FileText,
  Briefcase,
  Sliders,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  onOpenWeightsModal?: () => void;
}

export function Navbar({ onOpenWeightsModal }: NavbarProps) {
  const pathname = usePathname();
  const {
    currentUser,
    switchUser,
    briefs,
    selectedBriefId,
    setSelectedBriefId,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    theme,
    toggleTheme,
    resetDemoData,
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBriefMenu, setShowBriefMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);
  const currentBrief = briefs.find((b) => b.id === selectedBriefId);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-violet-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all">
              <div className="w-full h-full bg-[#090B14] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent">
                  CREOVANTA
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  AI
                </span>
              </div>
              <p className="text-[9px] text-slate-400 tracking-wider uppercase font-medium hidden sm:block">
                Proof of Creativity
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/marketplace"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                pathname === '/marketplace'
                  ? 'bg-violet-500/20 text-violet-200 font-semibold border border-violet-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Marketplace
            </Link>
            <Link
              href="/briefs/builder"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                pathname.startsWith('/briefs')
                  ? 'bg-violet-500/20 text-violet-200 font-semibold border border-violet-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Brief Builder
            </Link>
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                pathname === '/dashboard'
                  ? 'bg-violet-500/20 text-violet-200 font-semibold border border-violet-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Workspace
            </Link>
            <Link
              href="/projects"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                pathname.startsWith('/projects')
                  ? 'bg-violet-500/20 text-violet-200 font-semibold border border-violet-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Projects
            </Link>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5">
          {/* Active Brief Selector for live fit engine */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowBriefMenu(!showBriefMenu)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-slate-900/80 border border-violet-500/25 hover:border-violet-500/50 transition-all text-slate-200"
              title="Active target brief used by the Creative DNA + Fit Engine"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-slate-400">Brief:</span>
              <span className="font-medium max-w-[140px] truncate text-violet-200">
                {currentBrief ? currentBrief.title : 'None Selected'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showBriefMenu && (
              <div className="absolute right-0 mt-2 w-72 glass-panel-glow rounded-xl p-2 shadow-2xl z-50">
                <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Target Brief for Fit Engine
                </div>
                <div className="space-y-1 mt-1 max-h-56 overflow-y-auto">
                  {briefs.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSelectedBriefId(b.id);
                        setShowBriefMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-start justify-between gap-2 transition-colors ${
                        b.id === selectedBriefId
                          ? 'bg-violet-500/30 text-white font-medium border border-violet-500/40'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate font-medium">{b.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {b.brandName} • ${b.budget.min.toLocaleString()} - ${b.budget.max.toLocaleString()}
                        </div>
                      </div>
                      {b.id === selectedBriefId && <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-white/10">
                  <Link
                    href="/briefs/builder"
                    onClick={() => setShowBriefMenu(false)}
                    className="block text-center text-xs text-cyan-400 hover:underline py-1"
                  >
                    + Create New Brief
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Engine Weights Live Tuner button */}
          {onOpenWeightsModal && (
            <button
              onClick={onOpenWeightsModal}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 text-xs hidden sm:flex items-center gap-1.5"
              title="Tune the 8 algorithm dimension weights"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline text-xs">Weights</span>
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 glass-panel-glow rounded-xl p-3 shadow-2xl z-50">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-semibold text-white">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] text-cyan-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">No notifications yet</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                          n.read ? 'bg-white/2 text-slate-400' : 'bg-violet-500/15 text-slate-200 border border-violet-500/25'
                        }`}
                      >
                        <div className="flex items-center justify-between font-medium text-white mb-0.5">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-500">{n.createdAt}</span>
                        </div>
                        <p className="text-[11px] text-slate-300">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10"
            title="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-violet-400" />}
          </button>

          {/* User Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-violet-500/30 hover:border-violet-500/60 transition-all text-xs"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-violet-500/40"
              />
              <div className="hidden sm:block text-left pr-1">
                <div className="font-semibold text-white truncate max-w-[100px] leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-cyan-300 font-medium capitalize">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 glass-panel-glow rounded-xl p-3 shadow-2xl z-50">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Switch Demo Persona
                </div>
                <div className="space-y-1.5">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                        user.id === currentUser.id
                          ? 'bg-violet-500/25 border border-violet-500/40 text-white'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10"
                      />
                      <div className="flex-1 truncate">
                        <div className="font-semibold text-white flex items-center justify-between">
                          <span>{user.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 uppercase font-mono">
                            {user.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {user.companyOrTitle}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Demo State</span>
                  <button
                    onClick={() => {
                      resetDemoData();
                      setShowUserMenu(false);
                    }}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
