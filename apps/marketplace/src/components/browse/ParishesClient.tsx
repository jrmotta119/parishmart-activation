'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, MapPin } from 'lucide-react';
import { BrowseLayout } from './BrowseLayout';
import { FilterSortBar } from './FilterSortBar';
import type { ParishSummary } from '@/types/store';

const SORT_OPTIONS = [
  { key: 'name', label: 'Name A–Z' },
  { key: 'products', label: 'Most Products' },
  { key: 'donations', label: 'Most Campaigns' },
];

interface ParishesClientProps {
  parishes: ParishSummary[];
}

export function ParishesClient({ parishes }: ParishesClientProps) {
  const [query, setQuery] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [sort, setSort] = useState('name');

  const states = useMemo(() => {
    const s = new Set(parishes.map((p) => p.state));
    return [{ key: 'all', label: 'All States' }, ...Array.from(s).sort().map((st) => ({ key: st, label: st }))];
  }, [parishes]);

  const results = useMemo(() => {
    let list = [...parishes];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.state.toLowerCase().includes(q));
    }
    if (filterState !== 'all') list = list.filter((p) => p.state === filterState);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'products') list.sort((a, b) => b.productCount - a.productCount);
    else if (sort === 'donations') list.sort((a, b) => b.donationCount - a.donationCount);
    return list;
  }, [parishes, query, filterState, sort]);

  return (
    <BrowseLayout title="Parishes & Causes">
      <FilterSortBar
        searchQuery={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search parishes…"
        filters={states}
        activeFilter={filterState}
        onFilterChange={setFilterState}
        sortOptions={SORT_OPTIONS}
        activeSort={sort}
        onSortChange={setSort}
      />

      <div className="px-4 pt-4 pb-24 flex flex-col gap-3">
        {results.length === 0 && (
          <EmptyState label="No parishes found" />
        )}
        {results.map((parish) => (
          <Link
            key={parish.id}
            href={`/store/${parish.id}`}
            className="flex items-stretch gap-0 rounded-2xl bg-white border border-mist shadow-warm-sm overflow-hidden active:opacity-80 transition-opacity"
          >
            {/* Left color band */}
            <div className="w-1 flex-shrink-0" style={{ backgroundColor: parish.primaryColor }} />

            {/* Hero thumbnail */}
            <div className="relative h-24 w-28 flex-shrink-0 bg-mist">
              <Image src={parish.heroImageUrl} alt={parish.name} fill className="object-cover" sizes="112px" />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between px-3.5 py-3 min-w-0">
              <div>
                <p className="font-display text-[18px] italic font-normal text-ink leading-tight line-clamp-1">{parish.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-warm-gray flex-shrink-0" />
                  <p className="font-body text-[11px] text-warm-gray">{parish.city}, {parish.state}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <Stat n={parish.productCount} label="items" />
                <Stat n={parish.donationCount} label="campaigns" />
                <Stat n={parish.vendorCount} label="vendors" />
              </div>
            </div>

            <div className="flex items-center pr-3">
              <ChevronRight size={15} className="text-warm-gray/40" />
            </div>
          </Link>
        ))}
      </div>
    </BrowseLayout>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <span className="font-body text-[10px] text-warm-gray">
      <span className="font-semibold text-ink">{n}</span> {label}
    </span>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <span className="text-[36px] opacity-20" style={{ fontFamily: 'Georgia,serif', color: 'var(--gold)' }}>✛</span>
      <p className="font-display text-display-sm italic text-warm-gray">{label}</p>
    </div>
  );
}
