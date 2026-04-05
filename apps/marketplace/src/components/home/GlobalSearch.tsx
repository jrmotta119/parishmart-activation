'use client';

import { useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ChevronRight, MapPin, ShoppingBag, Heart, Store } from 'lucide-react';
import { getAllProducts, getAllDonations, getAllVendors, getAllParishes } from '@/lib/mockData';

interface GlobalSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
}

// Load all data once at module level (mock — will be API calls later)
const ALL_PARISHES = getAllParishes();
const ALL_PRODUCTS = getAllProducts();
const ALL_DONATIONS = getAllDonations();
const ALL_VENDORS = getAllVendors();

export function GlobalSearch({ query, onQueryChange }: GlobalSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return {
      parishes: ALL_PARISHES.filter(
        (p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)
      ),
      products: ALL_PRODUCTS.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      ).slice(0, 6),
      donations: ALL_DONATIONS.filter(
        (d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
      ).slice(0, 4),
      vendors: ALL_VENDORS.filter(
        (v) => v.name.toLowerCase().includes(q) || v.tagline.toLowerCase().includes(q) || v.category.toLowerCase().includes(q)
      ).slice(0, 4),
    };
  }, [query]);

  const total = results
    ? results.parishes.length + results.products.length + results.donations.length + results.vendors.length
    : 0;

  return (
    <div className="flex flex-col flex-1">
      {/* Search input */}
      <div
        className="sticky top-0 z-10 bg-white border-b border-mist px-4 py-3"
        style={{ boxShadow: '0 2px 12px rgba(26,17,10,0.06)' }}
      >
        <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5" style={{ backgroundColor: '#F5F1EB' }}>
          <Search size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search all parishes, products, donations…"
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

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Empty prompt */}
        {!query && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 px-8">
            <span className="text-[40px] leading-none opacity-20" style={{ fontFamily: 'Georgia,serif', color: 'var(--gold)' }}>✛</span>
            <p className="font-display text-display-sm italic text-warm-gray text-center">Search across ParishMart</p>
            <p className="font-body text-[12px] text-warm-gray/70 text-center leading-relaxed">
              Find parishes, products, donation campaigns, and local businesses
            </p>
          </div>
        )}

        {/* No results */}
        {query && total === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <p className="font-display text-display-md italic text-warm-gray">No results</p>
            <p className="font-body text-sm text-warm-gray/70">Nothing matched &ldquo;{query}&rdquo;</p>
          </div>
        )}

        {/* Results */}
        {results && total > 0 && (
          <div className="pt-4 flex flex-col gap-6">

            {/* Parishes */}
            {results.parishes.length > 0 && (
              <section className="px-4">
                <SectionLabel Icon={Store} label="Parishes" count={results.parishes.length} />
                <div className="flex flex-col gap-2 mt-3">
                  {results.parishes.map((p) => (
                    <Link key={p.id} href={`/store/${p.id}`}
                      className="flex items-center gap-3 rounded-xl bg-white border border-mist px-3 py-2.5 active:bg-parchment">
                      <div className="relative h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image src={p.heroImageUrl} alt={p.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-[16px] italic font-normal text-ink leading-tight">{p.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={10} className="text-warm-gray" />
                          <p className="font-body text-[11px] text-warm-gray">{p.city}, {p.state}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-warm-gray/40" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Products */}
            {results.products.length > 0 && (
              <section className="px-4">
                <SectionLabel Icon={ShoppingBag} label="Products" count={results.products.length} />
                <div className="flex flex-col gap-2 mt-3">
                  {results.products.map((p) => (
                    <Link key={p.id} href={`/store/${p.parishId}`}
                      className="flex items-center gap-3 rounded-xl bg-white border border-mist px-3 py-2.5 active:bg-parchment">
                      <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-mist">
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-[16px] italic font-normal text-ink leading-tight line-clamp-1">{p.name}</p>
                        <p className="font-body text-[11px] text-warm-gray mt-0.5">
                          ${p.price.toFixed(2)} · {p.parishName.replace(' Parish', '')}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-warm-gray/40" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Donations */}
            {results.donations.length > 0 && (
              <section className="px-4">
                <SectionLabel Icon={Heart} label="Campaigns" count={results.donations.length} />
                <div className="flex flex-col gap-2 mt-3">
                  {results.donations.map((d) => {
                    const pct = Math.min(100, Math.round((d.raisedAmount / d.goalAmount) * 100));
                    return (
                      <Link key={d.id} href={`/store/${d.parishId}`}
                        className="flex items-center gap-3 rounded-xl bg-white border border-mist px-3 py-2.5 active:bg-parchment">
                        <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-mist">
                          <Image src={d.imageUrl} alt={d.title} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-[16px] italic font-normal text-ink leading-tight line-clamp-1">{d.title}</p>
                          <p className="font-body text-[11px] mt-0.5" style={{ color: 'var(--gold)' }}>
                            {pct}% funded · {d.parishName.replace(' Parish', '')}
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-warm-gray/40" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Vendors */}
            {results.vendors.length > 0 && (
              <section className="px-4">
                <SectionLabel Icon={Store} label="Local Businesses" count={results.vendors.length} />
                <div className="flex flex-col gap-2 mt-3">
                  {results.vendors.map((v) => (
                    <Link key={v.id} href={`/vendor/${v.id}`}
                      className="flex items-center gap-3 rounded-xl bg-white border border-mist px-3 py-2.5 active:bg-parchment">
                      <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-mist">
                        <Image src={v.logoUrl} alt={v.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-[16px] italic font-normal text-ink leading-tight line-clamp-1">{v.name}</p>
                        <p className="font-body text-[11px] text-warm-gray mt-0.5">
                          {v.category} · {v.parishName.replace(' Parish', '')}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-warm-gray/40" />
                    </Link>
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

function SectionLabel({ Icon, label, count }: { Icon: React.ElementType; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={13} style={{ color: 'var(--gold)' }} />
      <span className="font-body text-[11px] font-semibold uppercase tracking-widest text-warm-gray">{label}</span>
      <span className="font-body text-[10px] font-semibold rounded-full px-2 py-0.5"
        style={{ backgroundColor: 'rgba(0,102,153,0.1)', color: 'var(--gold)' }}>
        {count}
      </span>
      <div className="flex-1 h-px bg-mist" />
    </div>
  );
}
