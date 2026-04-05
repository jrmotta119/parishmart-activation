'use client';

import { useMemo, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import type { ParishStore } from '@/types/store';
import { ProductCard } from './ProductCard';
import { VendorCard } from './VendorCard';
import { DonationList } from './DonateSection';

interface StoreSearchProps {
  store: ParishStore;
  query: string;
  onQueryChange: (q: string) => void;
}

export function StoreSearch({ store, query, onQueryChange }: StoreSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return {
      products: store.products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      ),
      vendors: store.vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.tagline.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
      ),
      goals: store.donationGoals.filter(
        (g) => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
      ),
    };
  }, [query, store]);

  const totalResults = results
    ? results.products.length + results.vendors.length + results.goals.length
    : 0;

  return (
    <div className="flex flex-col flex-1">
      {/* Search bar */}
      <div
        className="sticky top-0 z-10 bg-white border-b border-mist px-4 py-3"
        style={{ boxShadow: '0 2px 12px rgba(26,17,10,0.06)' }}
      >
        <div
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
          style={{ backgroundColor: '#F5F1EB' }}
        >
          <Search size={15} style={{ color: 'var(--gold)' }} className="flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            placeholder={`Search in ${store.name}…`}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="flex-1 bg-transparent font-body text-sm text-ink placeholder:text-warm-gray outline-none"
          />
          {query && (
            <button onClick={() => onQueryChange('')} aria-label="Clear">
              <X size={14} className="text-warm-gray" />
            </button>
          )}
        </div>
      </div>

      {/* States */}
      <div className="flex-1 overflow-y-auto">
        {!query && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span
              className="text-[40px] font-body leading-none opacity-20"
              style={{ fontFamily: 'Georgia,serif' }}
            >
              ✛
            </span>
            <p className="font-display text-display-sm italic text-warm-gray">
              Search your parish store
            </p>
            <p className="font-body text-[12px] text-warm-gray/70 text-center max-w-[200px]">
              Products, merch, donation campaigns, and community vendors
            </p>
          </div>
        )}

        {query && totalResults === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <p className="font-display text-display-md italic text-warm-gray">No results</p>
            <p className="font-body text-sm text-warm-gray/70">
              Nothing found for &ldquo;{query}&rdquo;
            </p>
          </div>
        )}

        {results && totalResults > 0 && (
          <div className="pt-5 pb-6 flex flex-col gap-6">
            {results.products.length > 0 && (
              <section className="px-4">
                <ResultsLabel count={results.products.length} label="Products" />
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {results.products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}

            {results.goals.length > 0 && (
              <section className="px-4">
                <ResultsLabel count={results.goals.length} label="Donations" />
                <div className="mt-3">
                  <DonationList goals={results.goals} />
                </div>
              </section>
            )}

            {results.vendors.length > 0 && (
              <section className="px-4">
                <ResultsLabel count={results.vendors.length} label="Vendors" />
                <div className="flex flex-col gap-2.5 mt-3">
                  {results.vendors.map((v) => (
                    <VendorCard key={v.id} vendor={v} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsLabel({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-body text-[11px] font-semibold uppercase tracking-widest text-warm-gray">
        {label}
      </span>
      <span
        className="font-body text-[10px] font-semibold rounded-full px-2 py-0.5"
        style={{
          backgroundColor: 'rgba(0,102,153,0.1)',
          color: 'var(--gold)',
        }}
      >
        {count}
      </span>
      <div className="flex-1 h-px bg-mist" />
    </div>
  );
}
