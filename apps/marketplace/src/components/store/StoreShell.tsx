'use client';

import { useState } from 'react';
import type { ParishStore } from '@/types/store';
import { TopBar } from './TopBar';
import { HamburgerMenu } from './HamburgerMenu';
import { StoreLanding } from './StoreLanding';
import { ProductGrid } from './ProductGrid';
import { DonateSection } from './DonateSection';
import { VendorCard } from './VendorCard';
import { StoreSearch } from './StoreSearch';
import { BottomNav } from './BottomNav';
import type { BottomNavTab } from './BottomNav';

type StoreView = 'home' | 'religious' | 'merch' | 'donations' | 'vendors' | 'search';

const VIEW_TITLES: Record<StoreView, string> = {
  home: '',
  religious: 'Religious Articles',
  merch: 'Parish Merch',
  donations: 'Donate',
  vendors: 'Local Business',
  search: 'Search',
};

interface StoreShellProps {
  store: ParishStore;
}

export function StoreShell({ store }: StoreShellProps) {
  const [view, setView] = useState<StoreView>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isHome = view === 'home';
  const isSearch = view === 'search';

  function navigateTo(v: StoreView) {
    setView(v);
  }

  function handleBottomNav(tab: BottomNavTab) {
    if (tab === 'home') navigateTo('home');
    else if (tab === 'search') navigateTo('search');
    // cart tab is handled inside BottomNav via openCart() — never reaches here
  }

  // Search tab is active whenever the user is in a search/browse view
  const activeTab: BottomNavTab = view === 'search' ? 'search' : 'home';

  const religiousProducts = store.products.filter((p) => p.category === 'religious');
  const merchProducts = store.products.filter((p) => p.category === 'merch');

  return (
    <div
      className="flex flex-col h-screen overflow-hidden bg-parchment"
      style={
        {
          '--parish-primary': store.primaryColor,
          '--parish-accent': store.accentColor,
        } as React.CSSProperties
      }
    >
      {/* Hamburger drawer */}
      <HamburgerMenu
        open={menuOpen}
        parishName={store.name}
        onClose={() => setMenuOpen(false)}
      />

      {/* Top bar */}
      <TopBar
        parishName={store.name}
        showBack={!isHome && !isSearch}
        viewTitle={isHome ? store.name : VIEW_TITLES[view]}
        onMenuClick={() => setMenuOpen(true)}
        onBack={() => navigateTo('home')}
      />

      {/* Main scrollable area */}
      <main className="flex-1 overflow-y-auto">
        {/* ── HOME ─────────────────────────────────── */}
        {isHome && (
          <StoreLanding store={store} onNavigate={(v) => navigateTo(v)} />
        )}

        {/* ── RELIGIOUS ────────────────────────────── */}
        {view === 'religious' && (
          <div className="pt-5 pb-24">
            <ProductGrid
              products={religiousProducts}
              context={{ type: 'parish', parishName: store.name }}
            />
            {religiousProducts.length === 0 && (
              <EmptyState label="No religious items yet" />
            )}
          </div>
        )}

        {/* ── MERCH ────────────────────────────────── */}
        {view === 'merch' && (
          <div className="pt-5 pb-24">
            <ProductGrid
              products={merchProducts}
              context={{ type: 'parish', parishName: store.name }}
            />
            {merchProducts.length === 0 && (
              <EmptyState label="No merch items yet" />
            )}
          </div>
        )}

        {/* ── DONATIONS ────────────────────────────── */}
        {view === 'donations' && (
          <div className="pt-5 pb-24">
            <DonateSection goals={store.donationGoals} />
            {store.donationGoals.length === 0 && (
              <EmptyState label="No active campaigns" />
            )}
          </div>
        )}

        {/* ── VENDORS ──────────────────────────────── */}
        {view === 'vendors' && (
          <div className="pt-5 pb-24 px-4">
            <div className="mb-4">
              <h2 className="font-display text-display-sm italic font-normal text-ink">
                Community Supporters
              </h2>
              <div className="gold-hairline mt-1.5 w-10" />
            </div>
            {store.vendors.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {store.vendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            ) : (
              <EmptyState label="No local businesses yet" />
            )}
          </div>
        )}

        {/* ── SEARCH ───────────────────────────────── */}
        {isSearch && (
          <div className="flex flex-col pb-24" style={{ minHeight: 'calc(100vh - 56px)' }}>
            <StoreSearch
              store={store}
              query={searchQuery}
              onQueryChange={setSearchQuery}
            />
          </div>
        )}
      </main>

      {/* Bottom nav — always visible */}
      <BottomNav activeTab={activeTab} onTabChange={handleBottomNav} />
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <span
        className="text-[36px] leading-none opacity-20"
        style={{ fontFamily: 'Georgia,serif', color: 'var(--gold)' }}
      >
        ✛
      </span>
      <p className="font-display text-display-sm italic text-warm-gray">{label}</p>
    </div>
  );
}
