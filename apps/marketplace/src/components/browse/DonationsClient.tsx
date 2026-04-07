'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { BrowseLayout } from './BrowseLayout';
import { FilterSortBar } from './FilterSortBar';
import type { DonationGoal, ParishSummary } from '@/types/store';

const SORT_OPTIONS = [
  { key: 'funded', label: 'Most Funded %' },
  { key: 'remaining', label: 'Most Remaining' },
  { key: 'goal', label: 'Largest Goal' },
];

interface DonationsClientProps {
  goals: DonationGoal[];
  parishes: ParishSummary[];
}

export function DonationsClient({ goals, parishes }: DonationsClientProps) {
  const [query, setQuery] = useState('');
  const [filterParish, setFilterParish] = useState('all');
  const [sort, setSort] = useState('funded');

  const parishFilters = useMemo(() => [
    { key: 'all', label: 'All Parishes' },
    ...parishes.map((p) => ({ key: p.id, label: p.name.replace('Parish', '').replace('Our Lady of', 'OL').trim() })),
  ], [parishes]);

  const results = useMemo(() => {
    let list = [...goals];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((g) => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q) || g.parishName.toLowerCase().includes(q));
    }
    if (filterParish !== 'all') list = list.filter((g) => g.parishId === filterParish);
    if (sort === 'funded') list.sort((a, b) => (b.raisedAmount / b.goalAmount) - (a.raisedAmount / a.goalAmount));
    else if (sort === 'remaining') list.sort((a, b) => (b.goalAmount - b.raisedAmount) - (a.goalAmount - a.raisedAmount));
    else if (sort === 'goal') list.sort((a, b) => b.goalAmount - a.goalAmount);
    return list;
  }, [goals, query, filterParish, sort]);

  return (
    <BrowseLayout title="All Donations">
      <FilterSortBar
        searchQuery={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search campaigns…"
        filters={parishFilters}
        activeFilter={filterParish}
        onFilterChange={setFilterParish}
        sortOptions={SORT_OPTIONS}
        activeSort={sort}
        onSortChange={setSort}
      />

      <div className="px-4 pt-4 pb-24 flex flex-col gap-3">
        {results.length === 0 && (
          <div className="py-20 flex flex-col items-center gap-3">
            <span className="text-[36px] opacity-20" style={{ fontFamily: 'Georgia,serif', color: 'var(--gold)' }}>✛</span>
            <p className="font-display text-display-sm italic text-warm-gray">No campaigns found</p>
          </div>
        )}
        {results.map((goal) => {
          const pct = Math.min(100, Math.round((goal.raisedAmount / goal.goalAmount) * 100));
          return (
            <Link key={goal.id} href={`/donation/${goal.id}`} className="rounded-2xl bg-white border border-mist shadow-warm-sm overflow-hidden block active:opacity-90 transition-opacity">
              {/* Image */}
              <div className="relative h-40 w-full bg-mist">
                <Image src={goal.imageUrl} alt={goal.title} fill className="object-cover" sizes="92vw" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(26,17,10,0.65) 0%,transparent 55%)' }} />
                <div className="absolute bottom-0 inset-x-0 px-4 pb-3">
                  <p
                    className="self-start font-body text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5 mb-1.5 inline-block"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
                  >
                    {goal.parishName}
                  </p>
                  <h3 className="font-display text-[20px] italic font-normal text-white leading-tight line-clamp-1">{goal.title}</h3>
                </div>
              </div>

              {/* Body */}
              <div className="px-4 pt-3 pb-4">
                <p className="font-body text-[13px] text-warm-gray leading-relaxed line-clamp-2">{goal.description}</p>

                {/* Progress */}
                <div className="mt-3 h-1.5 w-full rounded-full bg-mist overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: 'var(--gold)' }} />
                </div>

                <div className="flex items-center justify-between mt-2 font-body text-[12px]">
                  <span className="text-ink font-semibold">
                    ${goal.raisedAmount.toLocaleString()}
                    <span className="font-normal text-warm-gray ml-1">of ${goal.goalAmount.toLocaleString()}</span>
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--gold)' }}>{pct}% funded</span>
                </div>

                <button
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-body text-sm font-semibold text-white active:opacity-80 transition-opacity"
                  style={{ backgroundColor: 'var(--parish-primary)' }}
                >
                  <Heart size={14} />
                  Donate to {goal.parishName.replace(' Parish', '')}
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </BrowseLayout>
  );
}
