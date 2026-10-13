'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { Navbar } from '@/components/common/Navbar';
import { DemoModeBanner } from '@/components/common/DemoModeBanner';
import { Footer } from '@/components/common/Footer';
import { WeightConfigModal } from '@/components/admin/WeightConfigModal';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [weightsModalOpen, setWeightsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090B14]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[2px] animate-pulse">
            <div className="w-full h-full bg-[#090B14] rounded-[10px] flex items-center justify-center">
              <span className="text-cyan-400 text-xl">✦</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm">Loading CREOVANTA AI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col ambient-mesh">
      <DemoModeBanner />
      <Navbar onOpenWeightsModal={() => setWeightsModalOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WeightConfigModal isOpen={weightsModalOpen} onClose={() => setWeightsModalOpen(false)} />
    </div>
  );
}
