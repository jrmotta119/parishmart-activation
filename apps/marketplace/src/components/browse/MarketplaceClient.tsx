'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { BrowseLayout } from './BrowseLayout';
import { FilterSortBar } from './FilterSortBar';
import type { StoreVendor, ParishSummary } from '@/types/store';

const SORT_OPTIONS = [
  { key: 'name', label: 'Name A–Z' },
  { key: 'parish', label: 'By Parish' },
  { key: 'category', label: 'By Category' },
];

interface MarketplaceClientProps {
  vendors: StoreVendor[];
  parishes: ParishSummary[];
  categories: string[];
}

export function MarketplaceClient({ vendors, parishes, categories }: MarketplaceClientProps) {
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sort, setSort] = useState('name');

  const categoryFilters = useMemo(() => [
    { key: 'all', label: 'All Categories' },
    ...categories.map((c) => ({ key: c, label: c })),
  ], [categories]);

  // Build a map of parishId → primaryColor for color coding
  const parishColors = useMemo(() => {
    const map: Record<string, string> = {};
    parishes.forEach((p) => { map[p.id] = p.primaryColor; });
    return map;
  }, [parishes]);

  const results = useMemo(() => {
    let list = [...vendors];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((v) =>
        v.name.toLowerCase().includes(q) ||
        v.tagline.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.parishName.toLowerCase().includes(q)
      );
    }
    if (filterCategory !== 'all') list = list.filter((v) => v.category === filterCategory);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'parish') list.sort((a, b) => a.parishName.localeCompare(b.parishName));
    else if (sort === 'category') list.sort((a, b) => a.category.localeCompare(b.category));
    return list;
  }, [vendors, query, filterCategory, sort]);

  // Group by parish when sorted by parish
  const grouped = sort === 'parish';

  return (
    <BrowseLayout title="Marketplace">
      <FilterSortBar
        searchQuery={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search local businesses…"
        filters={categoryFilters}
        activeFilter={filterCategory}
        onFilterChange={setFilterCategory}
        sortOptions={SORT_OPTIONS}
        activeSort={sort}
        onSortChange={setSort}
      />

      {/* Result count */}
      <div className="px-4 pt-3 pb-1">
        <p className="font-body text-[11px] text-warm-gray">
          {results.length} business{results.length !== 1 ? 'es' : ''} supporting their parishes
        </p>
      </div>

      <div className="px-4 pb-24 pt-2 flex flex-col gap-2.5">
        {results.length === 0 && (
          <div className="py-20 flex flex-col items-center gap-3">
            <span className="text-[36px] opacity-20" style={{ fontFamily: 'Georgia,serif', color: 'var(--gold)' }}>✛</span>
            <p className="font-display text-display-sm italic text-warm-gray">No businesses found</p>
          </div>
        )}
        {results.map((vendor) => (
          <VendorBrowseCard key={vendor.id} vendor={vendor} parishColor={parishColors[vendor.parishId] ?? '#1A56A0'} />
        ))}
      </div>
    </BrowseLayout>
  );
}

function VendorBrowseCard({ vendor, parishColor }: { vendor: StoreVendor; parishColor: string }) {
  return (
    <Link href={`/vendor/${vendor.id}`} className="flex items-stretch gap-0 rounded-2xl bg-white border border-mist shadow-warm-sm overflow-hidden active:opacity-80 transition-opacity">
      {/* Parish color band */}
      <div className="w-1 flex-shrink-0" style={{ backgroundColor: parishColor }} />

      {/* Logo */}
      <div className="relative h-20 w-20 flex-shrink-0 bg-mist">
        <Image src={vendor.logoUrl} alt={vendor.name} fill className="object-cover" sizes="80px" />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between px-3.5 py-3 min-w-0">
        <div>
          <p className="font-display text-[17px] italic font-normal text-ink leading-tight line-clamp-1">{vendor.name}</p>
          <p className="font-body text-[12px] text-warm-gray mt-0.5 line-clamp-1">{vendor.tagline}</p>
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span
            className="font-body text-[9px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
            style={{ backgroundColor: 'rgba(0,102,153,0.08)', color: 'var(--gold-muted,#004D73)', border: '1px solid rgba(0,102,153,0.2)' }}
          >
            {vendor.category}
          </span>
          <span
            className="font-body text-[9px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
            style={{ backgroundColor: parishColor + '15', color: parishColor }}
          >
            {vendor.parishName.replace(' Parish', '').replace('Our Lady of Guadalupe', 'Our Lady')}
          </span>
        </div>
      </div>

      <div className="flex items-center pr-3.5">
        <ExternalLink size={14} style={{ color: 'var(--gold)' }} />
      </div>
    </Link>
  );
}
