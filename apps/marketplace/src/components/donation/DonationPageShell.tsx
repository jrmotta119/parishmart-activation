'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { BottomNav } from '@/components/store/BottomNav';
import type { BottomNavTab } from '@/components/store/BottomNav';
import type { DonationGoal, ParishStore } from '@/types/store';

interface DonationPageShellProps {
  donation: DonationGoal;
  parish: ParishStore | null;
}

export function DonationPageShell({ donation, parish }: DonationPageShellProps) {
  const router = useRouter();
  const pct = Math.min(100, Math.round((donation.raisedAmount / donation.goalAmount) * 100));
  const remaining = donation.goalAmount - donation.raisedAmount;

  function handleTabChange(tab: BottomNavTab) {
    if (tab === 'home') router.push('/');
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-parchment">

      {/* ── Header ── */}
      <header
        className="flex-shrink-0 flex items-center px-3 py-3 safe-top z-30"
        style={{ backgroundColor: 'var(--parish-primary)' }}
      >
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 active:bg-white/15"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="flex-1 text-center px-2 min-w-0">
          <p className="font-body text-[10px] text-white/50 tracking-widest uppercase leading-none">
            {parish ? parish.name : 'ParishMart'}
          </p>
          <h1 className="font-display text-[17px] italic font-normal text-white leading-tight truncate mt-0.5">
            Campaign
          </h1>
        </div>

        <div className="w-9" />
      </header>

      {/* ── Scrollable content ── */}
      <main className="flex-1 overflow-y-auto">

        {/* ── Campaign image ── */}
        <div className="relative bg-white border-b border-mist" style={{ height: 240 }}>
          <Image
            src={donation.imageUrl}
            alt={donation.title}
            fill
            className="object-contain"
            style={{ padding: '16px' }}
            sizes="100vw"
            priority
          />
        </div>

        {/* ── Content ── */}
        <div className="px-4 pt-5 pb-6">

          {/* Parish context */}
          {parish && (
            <Link
              href={`/store/${parish.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl border border-mist p-3 mb-5 active:opacity-75 transition-opacity"
            >
              <div className="relative h-9 w-9 flex-shrink-0 rounded-xl overflow-hidden">
                <Image src={parish.logoUrl} alt={parish.name} fill className="object-cover" sizes="36px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-[9px] uppercase tracking-[0.14em] text-warm-gray leading-none mb-0.5">
                  Campaign by
                </p>
                <p className="font-display text-[15px] italic font-normal text-ink truncate leading-tight">
                  {parish.name}
                </p>
              </div>
              <ChevronRight size={14} className="flex-shrink-0 text-warm-gray/40" />
            </Link>
          )}

          {/* Title */}
          <h2 className="font-display text-[26px] italic font-normal text-ink leading-tight mb-4">
            {donation.title}
          </h2>

          {/* Progress block */}
          <div className="bg-white rounded-2xl border border-mist p-4 mb-5">
            {/* Bar */}
            <div className="h-2.5 w-full rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'var(--mist)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: 'var(--parish-primary)' }}
              />
            </div>

            {/* Stats */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-body text-[22px] font-bold leading-none" style={{ color: 'var(--parish-primary)' }}>
                  ${donation.raisedAmount.toLocaleString()}
                </p>
                <p className="font-body text-[11px] text-warm-gray mt-1">
                  raised of ${donation.goalAmount.toLocaleString()} goal
                </p>
              </div>
              <div className="text-right">
                <p className="font-body text-[22px] font-bold leading-none text-ink">
                  {pct}%
                </p>
                <p className="font-body text-[11px] text-warm-gray mt-1">funded</p>
              </div>
            </div>

            {remaining > 0 && (
              <p className="font-body text-[11px] text-warm-gray mt-3 pt-3 border-t border-mist">
                <span className="font-semibold text-ink">${remaining.toLocaleString()}</span> still needed to reach the goal
              </p>
            )}

            {donation.endsAt && (
              <p className="font-body text-[11px] text-warm-gray mt-2">
                Campaign ends <span className="font-semibold text-ink">
                  {new Date(donation.endsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </p>
            )}
          </div>

          <div className="gold-hairline mb-5" />

          {/* Description */}
          <div className="mb-6">
            <p className="font-body text-[10px] uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--warm-gray)' }}>
              About this campaign
            </p>
            <p className="font-body text-[14px] text-ink leading-relaxed">
              {donation.description}
            </p>
          </div>

          {/* Parish chip */}
          <Link
            href={`/store/${donation.parishId}`}
            className="inline-flex items-center gap-1 font-body text-[10px] font-semibold uppercase tracking-wider rounded-full px-3 py-1 active:opacity-70"
            style={{ backgroundColor: 'rgba(27,79,114,0.08)', color: 'var(--parish-primary)', border: '1px solid rgba(27,79,114,0.18)' }}
          >
            {donation.parishName}
          </Link>
        </div>
      </main>

      {/* ── Sticky donate bar ── */}
      <div className="flex-shrink-0 bg-white border-t border-mist px-4 py-3 flex items-center gap-4">
        <div className="flex-shrink-0">
          <p className="font-body text-[9px] uppercase tracking-widest text-warm-gray leading-none mb-1">Funded</p>
          <p className="font-body text-[20px] font-bold leading-none" style={{ color: 'var(--parish-primary)' }}>
            {pct}%
          </p>
        </div>
        <button
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl text-white font-body font-semibold text-[15px] active:opacity-80 transition-opacity"
          style={{ backgroundColor: 'var(--parish-primary)' }}
        >
          <Heart size={18} />
          Donate to this Campaign
        </button>
      </div>

      <BottomNav activeTab="search" onTabChange={handleTabChange} />
    </div>
  );
}
