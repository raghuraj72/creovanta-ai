'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-store';
import { Sparkles, Mail, Phone, Eye, EyeOff, Loader2, AlertCircle, Info, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim()) return setError(`Please enter your ${loginMethod}.`);
    if (!password.trim()) return setError('Please enter your password.');
    setIsLoading(true);
    const result = await signIn(identifier, password);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Sign in failed.');
    } else {
      router.push('/dashboard');
    }
  };

  const fillDemo = (email: string) => {
    setIdentifier(email);
    setPassword('Demo@1234');
    setLoginMethod('email');
  };

  return (
    <div className="min-h-screen ambient-mesh flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-600/8 blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-cyan-400/6 blur-3xl animate-pulse-glow pointer-events-none" />

      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[2px] shadow-lg shadow-violet-500/30">
          <div className="w-full h-full bg-[#090B14] rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
        <span className="font-extrabold tracking-wider text-xl bg-gradient-to-r from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent">CREOVANTA AI</span>
      </Link>

      <div className="glass-panel-glow rounded-2xl border border-violet-500/25 shadow-2xl w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to your CREOVANTA workspace</p>
        </div>

        {/* Demo credentials */}
        <div className="p-3.5 rounded-xl bg-violet-950/50 border border-violet-500/25 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-violet-300 font-semibold"><Info className="w-3.5 h-3.5 text-cyan-400" /> Demo Accounts</div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => fillDemo('elena@cybervogue.studio')}
              className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-left hover:border-violet-500/40 transition-colors">
              <div className="text-[11px] font-bold text-white">Brand (Elena)</div>
              <div className="text-[10px] text-slate-400">elena@cybervogue.studio</div>
            </button>
            <button type="button" onClick={() => fillDemo('kaelen@neuralvance.art')}
              className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-left hover:border-violet-500/40 transition-colors">
              <div className="text-[11px] font-bold text-white">Creator (Kaelen)</div>
              <div className="text-[10px] text-slate-400">kaelen@neuralvance.art</div>
            </button>
          </div>
          <p className="text-[10px] text-slate-500">Password for both: <span className="font-mono text-cyan-300">Demo@1234</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-xs font-semibold text-slate-300">Sign in with</label>
              <div className="flex rounded-lg overflow-hidden border border-white/10">
                {(['email', 'phone'] as const).map(m => (
                  <button key={m} type="button" onClick={() => { setLoginMethod(m); setIdentifier(''); }}
                    className={`px-3 py-1 text-xs font-medium flex items-center gap-1 transition-colors ${
                      loginMethod === m ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}>
                    {m === 'email' ? <Mail className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                    {m === 'email' ? 'Email' : 'Phone'}
                  </button>
                ))}
              </div>
            </div>
            <input value={identifier} onChange={e => setIdentifier(e.target.value)}
              placeholder={loginMethod === 'email' ? 'you@example.com' : '+91-9876543210'}
              type={loginMethod === 'email' ? 'email' : 'tel'}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <input value={password} onChange={e => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'} placeholder="Your password"
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors" />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

          <button type="submit" disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 disabled:opacity-60">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-cyan-400 hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
