'use client';

import Image from 'next/image';
import type { DonationGoal } from '@/types/store';

interface DonateSectionProps {
  goals: DonationGoal[];
}

function ProgressBar({ raised, goal }: { raised: number; goal: number }) {
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  return (
    <div className="relative h-1.5 w-full rounded-full bg-mist overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: 'var(--gold)' }}
      />
    </div>
  );
}

function DonationCard({ goal }: { goal: DonationGoal }) {
  const pct = Math.min(100, Math.round((goal.raisedAmount / goal.goalAmount) * 100));

  return (
    <div className="card-tap rounded-2xl bg-white shadow-warm-sm border border-mist overflow-hidden">
      {/* Image */}
      <div className="relative h-40 w-full bg-mist overflow-hidden">
        <Image
          src={goal.imageUrl}
          alt={goal.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 92vw, 600px"
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(26,17,10,0.65) 0%, transparent 55%)' }}
        />
        {/* Title over image */}
        <div className="absolute bottom-0 inset-x-0 px-4 pb-3">
          <h3 className="font-display text-[20px] italic font-normal text-white leading-tight line-clamp-1">
            {goal.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
        <p className="font-body text-[13px] text-warm-gray leading-relaxed line-clamp-2">
          {goal.description}
        </p>

        <ProgressBar raised={goal.raisedAmount} goal={goal.goalAmount} />

        {/* Stats row */}
        <div className="flex items-center justify-between font-body text-[12px]">
          <span className="text-ink font-semibold">
            ${goal.raisedAmount.toLocaleString()}
            <span className="font-normal text-warm-gray ml-1">
              of ${goal.goalAmount.toLocaleString()}
            </span>
          </span>
          <span className="font-semibold" style={{ color: 'var(--gold)' }}>
            {pct}% funded
          </span>
        </div>

        {/* CTA */}
        <button
          className="w-full rounded-xl py-3 font-body text-sm font-semibold text-white active:opacity-80 transition-opacity"
          style={{ backgroundColor: 'var(--parish-primary)' }}
        >
          ♡ &nbsp; Donate Now
        </button>
      </div>
    </div>
  );
}

export function DonateSection({ goals }: DonateSectionProps) {
  if (goals.length === 0) return null;

  return (
    <section className="px-4 pb-4">
      <SectionHeading>Support Our Parish</SectionHeading>
      <DonationList goals={goals} />
    </section>
  );
}

export function DonationList({ goals }: DonateSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      {goals.map((goal) => (
        <DonationCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}

/* Shared section heading with ornamental style */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-display-sm italic font-normal text-ink">{children}</h2>
      <div className="gold-hairline mt-1.5 w-12" />
    </div>
  );
}
