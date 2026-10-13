'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-store';
import {
  Sparkles, ArrowRight, ArrowLeft, Eye, EyeOff, Phone, Mail,
  ShieldCheck, Briefcase, Palette, Check, Loader2, AlertCircle, Info
} from 'lucide-react';

type Step = 'role' | 'details' | 'otp';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, verifyOTP, resendOTP } = useAuth();
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<'brand' | 'creator' | null>(null);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 'otp') {
      const stored = sessionStorage.getItem('creovanta_pending_otp_display');
      if (stored) setDemoOtp(stored);
      setResendTimer(30);
    }
  }, [step]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };
  const strength = getPasswordStrength(password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500'];

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Please enter your full name.');
    if (!identifier.trim()) return setError(`Please enter your ${loginMethod}.`);
    if (loginMethod === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(identifier)) {
      return setError('Please enter a valid email address.');
    }
    if (loginMethod === 'phone' && !/^[\+]?[0-9\-\s]{8,15}$/.test(identifier.replace(/\s/g, ''))) {
      return setError('Please enter a valid phone number (e.g. +91-9876543210).');
    }
    if (!company.trim()) return setError('Please enter your company or title.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    setIsLoading(true);
    const result = await signUp({ name, identifier, password, role: role!, companyOrTitle: company, loginMethod });
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Sign up failed.');
    } else if (result.needsOTP) {
      setStep('otp');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length !== 6) return setError('Please enter all 6 digits.');
    setIsLoading(true);
    const result = await verifyOTP(identifier, code);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Verification failed.');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } else {
      router.push('/dashboard');
    }
  };

  const handleResend = async () => {
    await resendOTP(identifier);
    const stored = sessionStorage.getItem('creovanta_pending_otp_display');
    if (stored) setDemoOtp(stored);
    setResendTimer(30);
    setOtp(['', '', '', '', '', '']);
    otpRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen ambient-mesh flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/8 blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-400/6 blur-3xl animate-pulse-glow pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[2px] shadow-lg shadow-violet-500/30">
          <div className="w-full h-full bg-[#090B14] rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
        <span className="font-extrabold tracking-wider text-xl bg-gradient-to-r from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent">
          CREOVANTA AI
        </span>
      </Link>

      {/* Step progress indicator */}
      <div className="flex items-center gap-3 mb-8">
        {(['role', 'details', 'otp'] as Step[]).map((s, i) => (
          <React.Fragment key={s}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              step === s
                ? 'bg-violet-600 border-violet-400 text-white scale-110'
                : (['role', 'details', 'otp'].indexOf(step) > i)
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                : 'bg-white/5 border-white/20 text-slate-500'
            }`}>
              {(['role', 'details', 'otp'].indexOf(step) > i) ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < 2 && <div className={`w-16 h-0.5 transition-all ${
              (['role', 'details', 'otp'].indexOf(step) > i) ? 'bg-violet-500' : 'bg-white/10'
            }`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Card */}
      <div className="glass-panel-glow rounded-2xl border border-violet-500/25 shadow-2xl w-full max-w-md p-8">

        {/* STEP 1: Role Selection */}
        {step === 'role' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-white">Join CREOVANTA AI</h1>
              <p className="text-sm text-slate-400 mt-1">Choose how you&apos;ll use the platform</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ value: 'brand', icon: Briefcase, label: 'Brand / Agency', desc: 'Discover creators, publish briefs, manage campaigns' },
                { value: 'creator', icon: Palette, label: 'AI Creator', desc: 'Showcase your portfolio, match with brands, earn' }]
                .map(({ value, icon: Icon, label, desc }) => (
                <button key={value} onClick={() => setRole(value as 'brand' | 'creator')}
                  className={`p-5 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                    role === value
                      ? 'border-violet-500 bg-violet-500/15 shadow-lg shadow-violet-500/20'
                      : 'border-white/10 bg-white/5 hover:border-violet-500/40'
                  }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    role === value ? 'bg-violet-500/30 text-cyan-300' : 'bg-white/10 text-slate-400'
                  }`}><Icon className="w-5 h-5" /></div>
                  <div className="font-bold text-white text-sm">{label}</div>
                  <div className="text-xs text-slate-400 mt-1">{desc}</div>
                  {role === value && <Check className="w-4 h-4 text-violet-400 mt-2" />}
                </button>
              ))}
            </div>
            <button onClick={() => { if (role) setStep('details'); else setError('Please select your role.'); }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 transition-all">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
            {error && <p className="text-rose-400 text-xs text-center">{error}</p>}
            <p className="text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-cyan-400 hover:underline">Sign In</Link>
            </p>
          </div>
        )}

        {/* STEP 2: Details */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="space-y-5">
            <div>
              <button type="button" onClick={() => setStep('role')} className="flex items-center gap-1 text-slate-400 hover:text-white text-xs mb-4">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <h1 className="text-2xl font-extrabold text-white">Create Your Account</h1>
              <p className="text-sm text-slate-400 mt-1">As: <span className="text-violet-300 font-semibold capitalize">{role}</span></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors" />
            </div>

            {/* Email/Phone Toggle */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-xs font-semibold text-slate-300">Sign up with</label>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{role === 'brand' ? 'Company Name' : 'Creative Title'}</label>
              <input value={company} onChange={e => setCompany(e.target.value)}
                placeholder={role === 'brand' ? 'e.g. CyberVogue Studio' : 'e.g. Neural Cinematographer'}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input value={password} onChange={e => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors" />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">{Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                      i < strength ? strengthColors[strength] : 'bg-slate-700'
                    }`} />
                  ))}</div>
                  <span className={`text-[11px] ${['', 'text-rose-400', 'text-amber-400', 'text-yellow-300', 'text-emerald-400'][strength]}`}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
              <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'} placeholder="Repeat password"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                  confirmPassword && confirmPassword !== password ? 'border-rose-500' : 'border-white/10 focus:border-cyan-400'
                }`} />
            </div>

            {error && <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

            <button type="submit" disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 disabled:opacity-60">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> Send OTP & Create Account</>}
            </button>
          </form>
        )}

        {/* STEP 3: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-cyan-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Verify Your Account</h1>
              <p className="text-sm text-slate-400 mt-1">Enter the 6-digit OTP sent to <span className="text-white font-semibold">{identifier}</span></p>
            </div>

            {/* Hackathon demo OTP display */}
            {demoOtp && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-amber-300 font-bold">Hackathon Demo Mode:</span>
                  <span className="text-amber-200"> Your OTP is </span>
                  <span className="font-mono font-extrabold text-amber-300 text-base tracking-widest">{demoOtp}</span>
                  <span className="text-amber-500 block text-[10px] mt-0.5">(In production this would arrive via SMS/Email)</span>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input key={i} ref={el => { otpRefs.current[i] = el; }}
                  value={digit} onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  maxLength={1} inputMode="numeric"
                  className="w-12 h-14 text-center text-xl font-mono font-bold rounded-xl bg-slate-900 border-2 border-white/15 text-white focus:outline-none focus:border-cyan-400 transition-colors" />
              ))}
            </div>

            {error && <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

            <button type="submit" disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-60">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Verify & Continue</>}
            </button>

            <div className="text-center text-xs text-slate-500">
              {resendTimer > 0 ? (
                <span>Resend OTP in <span className="text-cyan-400 font-mono">{resendTimer}s</span></span>
              ) : (
                <button type="button" onClick={handleResend} className="text-cyan-400 hover:underline">Resend OTP</button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
