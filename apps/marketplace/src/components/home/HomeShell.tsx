'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, ChevronRight, UserPlus, PlusSquare, Mail, Info, HelpCircle, Plus, Check } from 'lucide-react';
import { HamburgerMenu } from '@/components/store/HamburgerMenu';
import { BottomNav } from '@/components/store/BottomNav';
import type { BottomNavTab } from '@/components/store/BottomNav';
import { GlobalSearch } from './GlobalSearch';
import { AccountPanel } from '@/components/account/AccountPanel';
import { useCart } from '@/context/CartContext';
import type { ParishSummary, StoreProduct, DonationGoal, StoreVendor } from '@/types/store';

// ── Static data ───────────────────────────────────────────────────────────────

const BROWSE_CARDS = [
  { href: '/browse/parishes',    label: 'Parishes & Causes',  sublabel: 'Browse all parish stores',         imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=600&q=80' },
  { href: '/browse/products',    label: 'All Products',       sublabel: 'Religious articles & merch',       imageUrl: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=600&q=80' },
  { href: '/browse/donations',   label: 'All Donations',      sublabel: 'Active campaigns across parishes', imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80' },
  { href: '/browse/marketplace', label: 'Marketplace',        sublabel: 'Local businesses that give back',  imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80' },
];

const CTA_CARDS = [
  { href: 'https://home.parishmart.com/sell-with-us', label: 'Sell With Us',     sublabel: 'Support a parish by becoming a vendor', Icon: UserPlus,  accent: '#1A56A0' },
  { href: 'https://home.parishmart.com/why-register',    label: 'Create Your Store', sublabel: 'Set up your parish or cause store',     Icon: PlusSquare, accent: '#1A5C38' },
];

const FOOTER_LINKS = [
  { href: 'https://home.parishmart.com/about-us',   label: 'About Us',   Icon: Info },
  { href: 'https://shop.parishmart.com/contact', label: 'Contact Us', Icon: Mail },
  { href: 'https://shop.parishmart.com/faqs',     label: 'FAQs',       Icon: HelpCircle },
];

const SPONSORS = [
  { name: 'Knights of Columbus', accent: '#003087' },
  { name: 'Catholic Charities',  accent: '#C8102E' },
  { name: 'Ave Maria Press',     accent: '#1B4F72' },
  { name: 'EWTN Global',         accent: '#7B1FA2' },
  { name: 'Paroquia Unida',      accent: '#1A5C38' },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface HomeShellProps {
  parishes:  ParishSummary[];
  products:  StoreProduct[];
  donations: DonationGoal[];
  vendors:   StoreVendor[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HomeShell({ parishes, products, donations, vendors }: HomeShellProps) {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [activeTab,    setActiveTab]    = useState<BottomNavTab>('home');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [addedId,      setAddedId]      = useState<string | null>(null);
  const { addItem } = useCart();

  function handleTabChange(tab: BottomNavTab) {
    setActiveTab(tab);
    if (tab !== 'search') setSearchQuery('');
  }

  function handleAddProduct(product: StoreProduct) {
    addItem({ product, itemType: 'product', context: { type: 'global' } });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1400);
  }

  const isSearch  = activeTab === 'search';
  const isAccount = activeTab === 'account';

  const featuredProducts  = products.filter(p => p.inStock).slice(0, 4);
  const featuredVendors   = vendors.slice(0, 4);
  const featuredDonations = donations.slice(0, 4);
  const featuredParishes  = parishes.slice(0, 3);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-parchment">
      <HamburgerMenu open={menuOpen} parishName="ParishMart" onClose={() => setMenuOpen(false)} />

      {/* ── Top bar ── */}
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

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">

        {/* SEARCH */}
        {isSearch && (
          <div className="flex flex-col pb-24" style={{ minHeight: 'calc(100vh - 60px)' }}>
            <GlobalSearch query={searchQuery} onQueryChange={setSearchQuery} />
          </div>
        )}

        {/* ACCOUNT */}
        {isAccount && <AccountPanel />}

        {/* HOME */}
        {!isSearch && !isAccount && (
          <>

            {/* ── Compact hero ── */}
            <div className="px-4 pt-5 pb-4 welcome-reveal">
              <p className="font-body text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: 'var(--gold)' }}>
                Faith · Community · Commerce
              </p>
              <h2 className="font-display text-[26px] italic font-normal text-ink leading-tight">
                Your faith community's marketplace
              </h2>
            </div>

            {/* ── Browse cards 2×2 ── */}
            <div className="grid grid-cols-2 gap-2.5 px-4 pb-5">
              {BROWSE_CARDS.map((card, i) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="card-reveal relative flex flex-col justify-end rounded-2xl overflow-hidden"
                  style={{ minHeight: '130px', animationDelay: `${0.05 + i * 0.07}s` }}
                >
                  <Image src={card.imageUrl} alt={card.label} fill className="object-cover" sizes="50vw" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 100%)' }} />
                  <div className="relative z-10 p-3">
                    <h3 className="font-display text-[17px] italic font-normal text-white leading-tight">{card.label}</h3>
                    <p className="font-body text-[10px] text-white/65 mt-0.5">{card.sublabel}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* ── Featured Products ── */}
            <section className="pb-5">
              <div className="flex items-center justify-between px-4 mb-3">
                <h3 className="font-display text-[20px] italic font-normal text-ink">Featured Products</h3>
                <Link href="/browse/products" className="font-body text-[11px] font-medium" style={{ color: 'var(--parish-primary)' }}>
                  See all
                </Link>
              </div>
              <div className="mx-4 bg-white rounded-2xl border border-mist overflow-hidden">
                {featuredProducts.map((product, i) => {
                  const added = addedId === product.id;
                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 px-3 py-3"
                      style={{ borderTop: i > 0 ? '1px solid var(--mist)' : 'none' }}
                    >
                      {/* Thumbnail — taps to detail */}
                      <Link href={`/product/${product.id}?from=${product.parishId}`} className="relative flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 64, height: 64 }}>
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="64px" />
                        {product.badge && (
                          <span
                            className="absolute top-1 left-1 font-body text-[8px] font-semibold px-1 py-0.5 rounded-md text-white leading-none"
                            style={{ backgroundColor: 'var(--parish-primary)' }}
                          >
                            {product.badge}
                          </span>
                        )}
                      </Link>
                      {/* Content — taps to detail */}
                      <Link href={`/product/${product.id}?from=${product.parishId}`} className="flex-1 min-w-0">
                        <p className="font-body text-[13px] font-semibold text-ink leading-snug line-clamp-1">{product.name}</p>
                        <p className="font-body text-[10px] text-warm-gray mt-0.5 truncate">{product.parishName}</p>
                        <p className="font-body text-[13px] font-semibold mt-1" style={{ color: 'var(--parish-primary)' }}>
                          ${product.price.toFixed(2)}
                        </p>
                      </Link>
                      {/* Add button */}
                      <button
                        onClick={() => handleAddProduct(product)}
                        className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors"
                        style={{ backgroundColor: added ? '#1A8C4E' : 'var(--parish-primary)' }}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        {added ? <Check size={13} /> : <Plus size={13} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── Parish Stores ── */}
            <section className="pb-5">
              <div className="flex items-center justify-between px-4 mb-3">
                <h3 className="font-display text-[20px] italic font-normal text-ink">Featured Parish Stores</h3>
                <Link href="/browse/parishes" className="font-body text-[11px] font-medium" style={{ color: 'var(--parish-primary)' }}>
                  See all
                </Link>
              </div>
              <div className="flex flex-col gap-2.5 px-4">
                {featuredParishes.map((parish) => (
                  <Link
                    key={parish.id}
                    href={`/store/${parish.id}`}
                    className="flex items-center gap-3 bg-white rounded-2xl border border-mist p-3 active:opacity-80 transition-opacity"
                  >
                    <div className="relative h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden">
                      <Image src={parish.heroImageUrl} alt={parish.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[17px] italic font-normal text-ink leading-tight truncate">{parish.name}</p>
                      <p className="font-body text-[11px] text-warm-gray mt-0.5">{parish.city}, {parish.state}</p>
                      <div className="flex gap-1.5 mt-1.5">
                        <span className="font-body text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,153,0.08)', color: 'var(--parish-primary)' }}>
                          {parish.productCount} items
                        </span>
                        <span className="font-body text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,153,0.08)', color: 'var(--parish-primary)' }}>
                          {parish.vendorCount} businesses
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={15} className="flex-shrink-0 text-warm-gray/40" />
                  </Link>
                ))}
              </div>
            </section>

            {/* ── Local Businesses ── */}
            <section className="pb-5">
              <div className="flex items-center justify-between px-4 mb-3">
                <h3 className="font-display text-[20px] italic font-normal text-ink">Featured Local Businesses</h3>
                <Link href="/browse/marketplace" className="font-body text-[11px] font-medium" style={{ color: 'var(--parish-primary)' }}>
                  See all
                </Link>
              </div>
              <div className="mx-4 bg-white rounded-2xl border border-mist overflow-hidden">
                {featuredVendors.map((vendor, i) => (
                  <Link
                    key={vendor.id}
                    href={`/vendor/${vendor.id}`}
                    className="flex items-center gap-3 px-3 py-3 active:bg-parchment transition-colors"
                    style={{ borderTop: i > 0 ? '1px solid var(--mist)' : 'none' }}
                  >
                    {/* Logo */}
                    <div className="relative flex-shrink-0 rounded-xl overflow-hidden bg-surface-2" style={{ width: 56, height: 56 }}>
                      <Image src={vendor.logoUrl} alt={vendor.name} fill className="object-cover" sizes="56px" />
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[16px] italic font-normal text-ink leading-tight truncate">{vendor.name}</p>
                      <p className="font-body text-[10px] text-warm-gray mt-0.5 truncate">{vendor.parishName}</p>
                      <span
                        className="inline-block font-body text-[9px] font-semibold px-2 py-0.5 rounded-full mt-1.5"
                        style={{ backgroundColor: 'rgba(0,102,153,0.08)', color: 'var(--parish-primary)' }}
                      >
                        {vendor.category}
                      </span>
                    </div>
                    <ChevronRight size={15} className="flex-shrink-0 text-warm-gray/35" />
                  </Link>
                ))}
              </div>
            </section>

            {/* ── Active Campaigns ── */}
            <section className="pb-5">
              <div className="flex items-center justify-between px-4 mb-3">
                <h3 className="font-display text-[20px] italic font-normal text-ink">Featured Active Campaigns</h3>
                <Link href="/browse/donations" className="font-body text-[11px] font-medium" style={{ color: 'var(--parish-primary)' }}>
                  See all
                </Link>
              </div>
              <div className="mx-4 bg-white rounded-2xl border border-mist overflow-hidden">
                {featuredDonations.map((donation, i) => {
                  const pct = Math.min(100, Math.round((donation.raisedAmount / donation.goalAmount) * 100));
                  return (
                    <Link
                      key={donation.id}
                      href={`/donation/${donation.id}`}
                      className="flex items-center gap-3 px-3 py-3 active:bg-parchment transition-colors"
                      style={{ borderTop: i > 0 ? '1px solid var(--mist)' : 'none' }}
                    >
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 64, height: 64 }}>
                        <Image src={donation.imageUrl} alt={donation.title} fill className="object-cover" sizes="64px" />
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[10px] text-warm-gray truncate">{donation.parishName}</p>
                        <p className="font-display text-[15px] italic font-normal text-ink leading-tight line-clamp-1 mt-0.5">{donation.title}</p>
                        {/* Progress bar */}
                        <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--mist)' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#4DB8E0' }} />
                        </div>
                        <p className="font-body text-[10px] text-warm-gray mt-1">
                          <span className="font-semibold" style={{ color: 'var(--parish-primary)' }}>{pct}%</span>
                          {' '}· ${donation.raisedAmount.toLocaleString()} raised
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* ── Sponsors ── */}
            <section className="pb-6">
              <div className="px-4 mb-3">
                <h3 className="font-display text-[20px] italic font-normal text-ink">Our Sponsors</h3>
                <p className="font-body text-[11px] text-warm-gray mt-0.5">Organizations supporting our mission</p>
              </div>
              <div className="flex gap-2.5 overflow-x-auto scrollbar-hide px-4 pb-1">
                {SPONSORS.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className="flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border"
                    style={{ borderColor: sponsor.accent + '28', backgroundColor: sponsor.accent + '09', minWidth: '158px' }}
                  >
                    <div
                      className="h-8 w-8 flex-shrink-0 rounded-xl flex items-center justify-center text-white font-semibold text-[13px]"
                      style={{ backgroundColor: sponsor.accent }}
                    >
                      {sponsor.name.charAt(0)}
                    </div>
                    <p className="font-body text-[12px] font-medium leading-snug" style={{ color: sponsor.accent }}>
                      {sponsor.name}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Divider ── */}
            <div className="gold-hairline mx-4 mb-5" />

            {/* ── Join ParishMart ── */}
            <div className="px-4 pb-4">
              <h3 className="font-display text-[20px] italic font-normal text-ink mb-3">Join ParishMart</h3>
              <div className="grid grid-cols-2 gap-3">
                {CTA_CARDS.map(({ href, label, sublabel, Icon, accent }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex flex-col rounded-2xl p-4 border active:opacity-80 transition-opacity"
                    style={{ borderColor: accent + '30', backgroundColor: accent + '08' }}
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl mb-3"
                      style={{ backgroundColor: accent + '18', color: accent }}
                    >
                      <Icon size={17} />
                    </span>
                    <p className="font-display text-[18px] italic font-normal leading-tight" style={{ color: accent }}>{label}</p>
                    <p className="font-body text-[11px] text-warm-gray mt-1 leading-snug">{sublabel}</p>
                    <p className="font-body text-[10px] mt-3 tracking-widest uppercase" style={{ color: accent, opacity: 0.6 }}>
                      Learn more →
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="px-4 pb-10 pt-2">
              <div className="gold-hairline mb-5" />
              <div className="flex flex-col">
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
