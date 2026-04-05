'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, ChevronRight, UserPlus, PlusSquare, Mail, Info, HelpCircle } from 'lucide-react';
import { HamburgerMenu } from '@/components/store/HamburgerMenu';
import { BottomNav } from '@/components/store/BottomNav';
import type { BottomNavTab } from '@/components/store/BottomNav';
import { GlobalSearch } from './GlobalSearch';
import { AccountPanel } from '@/components/account/AccountPanel';
import type { ParishSummary } from '@/types/store';

const BROWSE_CARDS = [
  { href: '/browse/parishes',    label: 'Parishes & Causes',  sublabel: 'Browse all parish stores',         imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=600&q=80' },
  { href: '/browse/products',    label: 'All Products',       sublabel: 'Religious articles & merch',       imageUrl: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=600&q=80' },
  { href: '/browse/donations',   label: 'All Donations',      sublabel: 'Active campaigns across parishes', imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80' },
  { href: '/browse/marketplace', label: 'Marketplace',        sublabel: 'Local businesses that give back',  imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80' },
];

const CTA_CARDS = [
  {
    href: '/become-a-seller',
    label: 'Sell With Us',
    sublabel: 'Support a parish by becoming a vendor',
    Icon: UserPlus,
    accent: '#1A56A0',
  },
  {
    href: '/create-store',
    label: 'Create Your Store',
    sublabel: 'Set up your parish or cause store',
    Icon: PlusSquare,
    accent: '#1A5C38',
  },
];

const FOOTER_LINKS = [
  { href: '/about',   label: 'About Us',   Icon: Info },
  { href: '/contact', label: 'Contact Us', Icon: Mail },
  { href: '/faq',     label: 'FAQs',       Icon: HelpCircle },
];

interface HomeShellProps {
  parishes: ParishSummary[];
  totalProducts: number;
  totalDonations: number;
  totalVendors: number;
}

export function HomeShell({ parishes }: HomeShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<BottomNavTab>('home');
  const [searchQuery, setSearchQuery] = useState('');

  function handleTabChange(tab: BottomNavTab) {
    // cart tab is handled inside BottomNav via openCart() — never reaches here
    setActiveTab(tab);
    if (tab !== 'search') setSearchQuery('');
  }

  const isSearch = activeTab === 'search';
  const isAccount = activeTab === 'account';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-parchment">
      <HamburgerMenu open={menuOpen} parishName="ParishMart" onClose={() => setMenuOpen(false)} />

      {/* Top bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 safe-top flex-shrink-0"
        style={{ backgroundColor: 'var(--parish-primary)' }}
      >
        <button
          onClick={() => setMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 active:bg-white/15"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <Image
          src="https://parishmart-files-public.s3.us-east-2.amazonaws.com/logo/Logo+WHITE+crop.png"
          alt="ParishMart"
          width={120}
          height={38}
          className="object-contain"
          priority
        />

        <div className="w-9" />
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">

        {/* ── GLOBAL SEARCH ─────────────────── */}
        {isSearch && (
          <div className="flex flex-col pb-24" style={{ minHeight: 'calc(100vh - 60px)' }}>
            <GlobalSearch query={searchQuery} onQueryChange={setSearchQuery} />
          </div>
        )}

        {/* ── ACCOUNT ───────────────────────── */}
        {isAccount && <AccountPanel />}

        {/* ── HOME CONTENT ──────────────────── */}
        {!isSearch && !isAccount && (
          <>
            {/* Hero tagline */}
            <div className="px-5 pt-6 pb-4 welcome-reveal">
              <div className="ornament text-[10px] font-body tracking-widest uppercase mb-3"
                   style={{ color: 'var(--gold)' }}>
                <span>Faith · Community · Commerce</span>
              </div>
              <h2 className="font-display text-display-xl italic font-normal text-ink leading-tight">
                Your faith community's marketplace
              </h2>
              <p className="font-body text-sm text-warm-gray mt-2 leading-relaxed">
                Support parishes, buy meaningful goods, donate to causes, and discover
                local businesses that give back.
              </p>

            </div>

            {/* Gold hairline */}
            <div className="gold-hairline mx-5 mb-5" />

            {/* 4 browse cards */}
            <div className="grid grid-cols-2 gap-3 px-4 pb-6">
              {BROWSE_CARDS.map((card, i) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="card-reveal relative flex flex-col justify-end rounded-2xl overflow-hidden"
                  style={{ minHeight: '156px', animationDelay: `${0.05 + i * 0.07}s` }}
                >
                  {/* Background image */}
                  <Image
                    src={card.imageUrl}
                    alt={card.label}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.62) 100%)' }} />
                  {/* Text */}
                  <div className="relative z-10 p-4">
                    <h3 className="font-display text-[20px] italic font-normal text-white leading-tight">{card.label}</h3>
                    <p className="font-body text-[11px] text-white/70 mt-0.5">{card.sublabel}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Featured parishes */}
            <div className="px-4 pb-6">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <h3 className="font-display text-display-sm italic font-normal text-ink">Featured Parishes</h3>
                  <div className="gold-hairline mt-1.5 w-10" />
                </div>
                <Link href="/browse/parishes" className="font-body text-[12px] font-medium" style={{ color: 'var(--parish-primary)' }}>
                  See all
                </Link>
              </div>

              <div className="flex flex-col gap-2.5">
                {parishes.map((parish) => (
                  <Link
                    key={parish.id}
                    href={`/store/${parish.id}`}
                    className="flex items-center gap-3.5 rounded-2xl bg-white border border-mist shadow-warm-sm p-3 active:bg-parchment transition-colors"
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden">
                      <Image src={parish.heroImageUrl} alt={parish.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[17px] italic font-normal text-ink leading-tight">{parish.name}</p>
                      <p className="font-body text-[11px] text-warm-gray mt-0.5">
                        {parish.city}, {parish.state} · {parish.productCount} items
                      </p>
                    </div>
                    <ChevronRight size={15} className="flex-shrink-0 text-warm-gray/40" />
                  </Link>
                ))}
              </div>
            </div>

            {/* ── CTA Cards ─────────────────── */}
            <div className="px-4 pb-4">
              <div className="mb-4">
                <h3 className="font-display text-display-sm italic font-normal text-ink">Join ParishMart</h3>
                <div className="gold-hairline mt-1.5 w-10" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {CTA_CARDS.map(({ href, label, sublabel, Icon, accent }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex flex-col rounded-2xl p-4 border active:opacity-80 transition-opacity"
                    style={{
                      borderColor: accent + '30',
                      backgroundColor: accent + '08',
                    }}
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl mb-3"
                      style={{ backgroundColor: accent + '18', color: accent }}
                    >
                      <Icon size={17} />
                    </span>
                    <p className="font-display text-[18px] italic font-normal leading-tight" style={{ color: accent }}>
                      {label}
                    </p>
                    <p className="font-body text-[11px] text-warm-gray mt-1 leading-snug">{sublabel}</p>
                    <p className="font-body text-[10px] mt-3 tracking-widest uppercase" style={{ color: accent, opacity: 0.6 }}>
                      Learn more →
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Footer links ──────────────── */}
            <div className="px-4 pb-10 pt-2">
              <div className="gold-hairline mb-5" />
              <div className="flex flex-col gap-0">
                {FOOTER_LINKS.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 py-3.5 border-b border-mist active:bg-parchment transition-colors"
                  >
                    <span
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: 'rgba(27,79,114,0.07)', color: 'var(--parish-primary)' }}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="flex-1 font-body text-[14px] font-medium text-ink">{label}</span>
                    <ChevronRight size={14} className="text-warm-gray/40" />
                  </Link>
                ))}
              </div>

              {/* Copyright */}
              <div className="mt-6 flex flex-col items-center gap-1.5">
                <div className="ornament" style={{ color: 'var(--gold)' }}>
                  <span className="text-[13px]" style={{ fontFamily: 'Georgia,serif' }}>✛</span>
                </div>
                <p className="font-body text-[11px] text-warm-gray text-center">
                  © {new Date().getFullYear()} ParishMart · Faith-based marketplace
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
