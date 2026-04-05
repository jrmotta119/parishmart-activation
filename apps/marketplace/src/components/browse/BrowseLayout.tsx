'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { HamburgerMenu } from '@/components/store/HamburgerMenu';
import { BottomNav } from '@/components/store/BottomNav';
import type { BottomNavTab } from '@/components/store/BottomNav';
import { useState } from 'react';

interface BrowseLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function BrowseLayout({ title, children }: BrowseLayoutProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleTabChange(tab: BottomNavTab) {
    if (tab === 'home') router.push('/');
    // search = stay on current browse page
    // cart is handled inside BottomNav via openCart() — never reaches here
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-parchment">
      <HamburgerMenu open={menuOpen} parishName="ParishMart" onClose={() => setMenuOpen(false)} />

      {/* Top bar */}
      <header
        className="sticky top-0 z-30 flex items-center px-3 py-3 safe-top flex-shrink-0"
        style={{ backgroundColor: 'var(--parish-primary)' }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-20"
          style={{ background: 'linear-gradient(90deg,transparent,#fff,transparent)' }}
        />

        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 active:bg-white/15"
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="flex-1 text-center px-1 min-w-0">
          <p className="font-body text-[10px] text-white/50 tracking-widest uppercase leading-none">ParishMart</p>
          <h1 className="font-display text-[18px] italic font-normal text-white leading-tight truncate mt-0.5">
            {title}
          </h1>
        </div>

        <div className="w-9" />
      </header>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Search tab is active on all browse pages */}
      <BottomNav activeTab="search" onTabChange={handleTabChange} />
    </div>
  );
}
