import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Cpu, Lock, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-violet-500/15 bg-[#07080E] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-white tracking-wider">CREOVANTA AI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The AI Creative Intelligence Marketplace. Empowering brands with proof of creativity, transparent algorithm matching, and authenticated generative workflows.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400">
            <Shield className="w-3.5 h-3.5" />
            <span>CISB Audit Protocol v2.4 Compliant</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/marketplace" className="hover:text-cyan-300 transition-colors">Creator Marketplace</Link></li>
            <li><Link href="/briefs/builder" className="hover:text-cyan-300 transition-colors">AI Brief Builder</Link></li>
            <li><Link href="/dashboard" className="hover:text-cyan-300 transition-colors">Brand Workspace</Link></li>
            <li><Link href="/projects" className="hover:text-cyan-300 transition-colors">Project Lifecycle</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Creative DNA</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="text-slate-400">Deterministic Fit Engine (8 Dimensions)</span></li>
            <li><span className="text-slate-400">Evidence Provenance Audits</span></li>
            <li><span className="text-slate-400">ComfyUI & LoRA Verification</span></li>
            <li><span className="text-slate-400">Commercial Indemnity Riders</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Ethical AI Standards</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Never presenting self-reported claims as independently verified facts. Distinguishing self-declared, evidence-attached, and reviewed assets.
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-violet-500/10 text-violet-300 text-[11px] border border-violet-500/25">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>Enterprise IP Safe</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div>
          © 2026 CREOVANTA AI. All rights reserved. Hackathon Creative Intelligence Challenge Edition.
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="hover:text-slate-200 cursor-pointer">Verification Manifesto</span>
          <span className="hover:text-slate-200 cursor-pointer">Algorithmic Transparency</span>
          <span className="hover:text-slate-200 cursor-pointer">Terms of Commercial Use</span>
        </div>
      </div>
    </footer>
  );
}
