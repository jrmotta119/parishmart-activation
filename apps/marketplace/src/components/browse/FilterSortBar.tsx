'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
}

interface SortOption {
  key: string;
  label: string;
}

interface FilterSortBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchPlaceholder?: string;
  filters: FilterOption[];       // e.g. [{ key: 'all', label: 'All' }, { key: 'miami', label: 'Miami' }]
  activeFilter: string;
  onFilterChange: (key: string) => void;
  sortOptions: SortOption[];
  activeSort: string;
  onSortChange: (key: string) => void;
}

export function FilterSortBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search…',
  filters,
  activeFilter,
  onFilterChange,
  sortOptions,
  activeSort,
  onSortChange,
}: FilterSortBarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const currentSort = sortOptions.find((s) => s.key === activeSort);

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-mist"
         style={{ boxShadow: '0 2px 12px rgba(26,17,10,0.06)' }}>
      {/* Search row */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <div
          className="flex flex-1 items-center gap-2 rounded-xl px-3.5 py-2.5"
          style={{ backgroundColor: '#F5F1EB' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--gold)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent font-body text-sm text-ink placeholder:text-warm-gray outline-none"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')}>
              <X size={13} className="text-warm-gray" />
            </button>
          )}
        </div>

        {/* Sort button */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 font-body text-xs font-medium border border-mist bg-white active:bg-parchment transition-colors"
            style={{ color: 'var(--parish-primary)' }}
          >
            <SlidersHorizontal size={13} />
            {currentSort?.label ?? 'Sort'}
          </button>

          {/* Sort dropdown */}
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
              <div
                className="absolute right-0 top-full mt-1.5 z-30 rounded-xl bg-white shadow-warm-md border border-mist overflow-hidden"
                style={{ minWidth: '160px' }}
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => { onSortChange(opt.key); setSortOpen(false); }}
                    className="flex w-full items-center justify-between px-4 py-2.5 font-body text-sm text-ink active:bg-parchment transition-colors"
                    style={opt.key === activeSort ? { color: 'var(--parish-primary)', fontWeight: 600 } : {}}
                  >
                    {opt.label}
                    {opt.key === activeSort && <span style={{ color: 'var(--gold)' }}>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter chips */}
      {filters.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-3">
          {filters.map((f) => {
            const isActive = f.key === activeFilter;
            return (
              <button
                key={f.key}
                onClick={() => onFilterChange(f.key)}
                className="flex-shrink-0 rounded-full px-3.5 py-1.5 font-body text-xs font-medium transition-colors"
                style={
                  isActive
                    ? { backgroundColor: 'var(--parish-primary)', color: '#fff' }
                    : { backgroundColor: '#F5F1EB', color: '#6B5E52', border: '1px solid #E8E0D4' }
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
