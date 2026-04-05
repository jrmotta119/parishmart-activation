'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';

type AuthView = 'landing' | 'login' | 'signup' | 'forgot';

export function AccountPanel() {
  const [view, setView] = useState<AuthView>('landing');

  return (
    <div className="flex flex-col min-h-full bg-white pb-24">
      {view === 'landing' && <LandingView onLogin={() => setView('login')} onSignup={() => setView('signup')} />}
      {view === 'login'   && <LoginView   onBack={() => setView('landing')} onForgot={() => setView('forgot')} onSignup={() => setView('signup')} />}
      {view === 'signup'  && <SignupView  onBack={() => setView('landing')} onLogin={() => setView('login')} />}
      {view === 'forgot'  && <ForgotView  onBack={() => setView('login')} />}
    </div>
  );
}

// ── Shared primitives ──────────────────────────────────────────────────────────

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="flex items-center gap-1.5 font-body text-[13px] text-warm-gray mb-8 active:opacity-60 transition-opacity"
    >
      <ChevronLeft size={15} />
      Back
    </button>
  );
}

function LineInput({
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className="relative flex flex-col gap-1.5 group">
      <label className="font-body text-[11px] font-semibold uppercase tracking-widest text-warm-gray transition-colors group-focus-within:text-[var(--parish-primary)]">
        {label}
      </label>
      <div className="flex items-center border-b-2 border-mist transition-colors group-focus-within:border-[var(--parish-primary)]">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="flex-1 bg-transparent font-body text-[15px] text-ink py-2 outline-none placeholder:text-warm-gray/40"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="text-warm-gray/60 hover:text-warm-gray transition-colors ml-2"
            tabIndex={-1}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

function PrimaryButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      type="submit"
      className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-body text-[14px] font-semibold text-white transition-opacity active:opacity-80"
      style={{ backgroundColor: 'var(--parish-primary)' }}
    >
      {label}
      <ArrowRight size={15} />
    </button>
  );
}

function GhostButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl py-3.5 font-body text-[14px] font-medium border-2 transition-colors active:opacity-80"
      style={{ borderColor: 'var(--parish-primary)', color: 'var(--parish-primary)' }}
    >
      {label}
    </button>
  );
}

// ── Views ──────────────────────────────────────────────────────────────────────

function LandingView({ onLogin, onSignup }: { onLogin: () => void; onSignup: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 pt-12 pb-8" style={{ animation: 'fadeSlideUp 0.4s ease forwards' }}>
      {/* Logo */}
      <div className="mb-10">
        <Image
          src="https://parishmart-files-public.s3.us-east-2.amazonaws.com/logo/Logo+BLUE+crop.png"
          alt="ParishMart"
          width={160}
          height={50}
          className="object-contain"
          priority
          onError={(e) => {
            // Fallback to a text logo if image fails
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Headline */}
      <div className="text-center mb-10">
        <h2 className="font-display text-display-xl italic font-normal text-ink leading-tight">
          Welcome back.
        </h2>
        <p className="font-body text-[13px] text-warm-gray mt-2 leading-relaxed max-w-[260px]">
          Sign in to manage your orders, saved parishes, and giving history.
        </p>
      </div>

      {/* Hairline */}
      <div className="gold-hairline w-full mb-10" />

      {/* Actions */}
      <div className="w-full flex flex-col gap-3">
        <PrimaryButton label="Sign In" onClick={onLogin} />
        <GhostButton label="Create Account" onClick={onSignup} />
      </div>

      {/* Footer */}
      <p className="font-body text-[11px] text-warm-gray/60 text-center mt-8 leading-relaxed">
        By continuing, you agree to ParishMart's{' '}
        <span style={{ color: 'var(--parish-primary)' }}>Terms of Service</span>
        {' '}and{' '}
        <span style={{ color: 'var(--parish-primary)' }}>Privacy Policy</span>.
      </p>
    </div>
  );
}

function LoginView({
  onBack,
  onForgot,
  onSignup,
}: {
  onBack: () => void;
  onForgot: () => void;
  onSignup: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col px-6 pt-10 pb-8" style={{ animation: 'fadeSlideUp 0.35s ease forwards' }}>
      <BackButton onBack={onBack} />

      <div className="mb-8">
        <p className="font-body text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--parish-primary)' }}>
          Welcome back
        </p>
        <h2 className="font-display text-display-lg italic font-normal text-ink leading-tight">Sign In</h2>
      </div>

      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <LineInput label="Email Address" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <LineInput label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />

        <div className="flex justify-end -mt-2">
          <button
            type="button"
            onClick={onForgot}
            className="font-body text-[12px] font-medium transition-opacity active:opacity-60"
            style={{ color: 'var(--parish-primary)' }}
          >
            Forgot password?
          </button>
        </div>

        <PrimaryButton label="Sign In" />
      </form>

      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px bg-mist" />
        <span className="font-body text-[11px] text-warm-gray uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-mist" />
      </div>

      <p className="font-body text-[13px] text-warm-gray text-center">
        Don't have an account?{' '}
        <button
          onClick={onSignup}
          className="font-semibold transition-opacity active:opacity-60"
          style={{ color: 'var(--parish-primary)' }}
        >
          Sign up free
        </button>
      </p>
    </div>
  );
}

function SignupView({ onBack, onLogin }: { onBack: () => void; onLogin: () => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col px-6 pt-10 pb-8" style={{ animation: 'fadeSlideUp 0.35s ease forwards' }}>
      <BackButton onBack={onBack} />

      <div className="mb-8">
        <p className="font-body text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--parish-primary)' }}>
          Join the community
        </p>
        <h2 className="font-display text-display-lg italic font-normal text-ink leading-tight">Create Account</h2>
      </div>

      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-4">
          <LineInput label="First Name" value={firstName} onChange={setFirstName} autoComplete="given-name" />
          <LineInput label="Last Name" value={lastName} onChange={setLastName} autoComplete="family-name" />
        </div>
        <LineInput label="Email Address" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <LineInput label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />

        <p className="font-body text-[11px] text-warm-gray/70 leading-relaxed -mt-2">
          Must be at least 8 characters.
        </p>

        <PrimaryButton label="Create Account" />
      </form>

      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px bg-mist" />
        <span className="font-body text-[11px] text-warm-gray uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-mist" />
      </div>

      <p className="font-body text-[13px] text-warm-gray text-center">
        Already have an account?{' '}
        <button
          onClick={onLogin}
          className="font-semibold transition-opacity active:opacity-60"
          style={{ color: 'var(--parish-primary)' }}
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

function ForgotView({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-col px-6 pt-10 pb-8" style={{ animation: 'fadeSlideUp 0.35s ease forwards' }}>
      <BackButton onBack={onBack} />

      {!sent ? (
        <>
          <div className="mb-8">
            <p className="font-body text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--parish-primary)' }}>
              Reset password
            </p>
            <h2 className="font-display text-display-lg italic font-normal text-ink leading-tight">Forgot Password</h2>
            <p className="font-body text-[13px] text-warm-gray mt-3 leading-relaxed">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <LineInput label="Email Address" type="email" value={email} onChange={setEmail} autoComplete="email" />
            <PrimaryButton label="Send Reset Link" onClick={() => email && setSent(true)} />
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center text-center pt-8 gap-5" style={{ animation: 'fadeSlideUp 0.35s ease forwards' }}>
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(0,102,153,0.1)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--parish-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-display-md italic font-normal text-ink">Check your inbox</h3>
            <p className="font-body text-[13px] text-warm-gray mt-2 leading-relaxed">
              We sent a reset link to <span className="font-semibold text-ink">{email}</span>.
              It expires in 15 minutes.
            </p>
          </div>
          <button
            onClick={onBack}
            className="font-body text-[13px] font-medium mt-2 transition-opacity active:opacity-60"
            style={{ color: 'var(--parish-primary)' }}
          >
            Back to Sign In
          </button>
        </div>
      )}
    </div>
  );
}
