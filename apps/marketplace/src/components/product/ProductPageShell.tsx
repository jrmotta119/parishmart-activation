'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ShoppingCart, Check } from 'lucide-react';
import { BottomNav } from '@/components/store/BottomNav';
import type { BottomNavTab } from '@/components/store/BottomNav';
import { useCart } from '@/context/CartContext';
import type { StoreProduct, ParishStore } from '@/types/store';

interface ProductPageShellProps {
  product: StoreProduct;
  parish: ParishStore | null;
}

export function ProductPageShell({ product, parish }: ProductPageShellProps) {
  const router   = useRouter();
  const { addItem } = useCart();
  const [added, setAdded]         = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Build full image list: primary + extras
  const images = [product.imageUrl, ...(product.images ?? [])];

  const handleScroll = useCallback(() => {
    const el = galleryRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIdx(idx);
  }, []);

  function handleAdd() {
    if (!product.inStock) return;
    addItem({
      product,
      itemType: 'product',
      context: parish
        ? { type: 'parish', parishName: product.parishName }
        : { type: 'global' },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleTabChange(tab: BottomNavTab) {
    if (tab === 'home') router.push('/');
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-parchment">

      {/* ── Header ── */}
      <header
        className="flex-shrink-0 flex items-center px-3 py-3 safe-top z-30"
        style={{ backgroundColor: 'var(--parish-primary)' }}
      >
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 active:bg-white/15"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="flex-1 text-center px-2 min-w-0">
          <p className="font-body text-[10px] text-white/50 tracking-widest uppercase leading-none">
            {parish ? parish.name : 'ParishMart'}
          </p>
          <h1 className="font-display text-[17px] italic font-normal text-white leading-tight truncate mt-0.5">
            {product.name}
          </h1>
        </div>

        <div className="w-9" />
      </header>

      {/* ── Scrollable content ── */}
      <main className="flex-1 overflow-y-auto">

        {/* ── Image gallery ── */}
        <div className="relative bg-white border-b border-mist" style={{ height: 300 }}>

          {/* Scroll-snap image track */}
          <div
            ref={galleryRef}
            className="flex h-full overflow-x-auto scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
            onScroll={handleScroll}
          >
            {images.map((src, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 w-full h-full"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Image
                  src={src}
                  alt={`${product.name}${images.length > 1 ? ` — photo ${idx + 1}` : ''}`}
                  fill
                  className="object-contain"
                  style={{ padding: '20px' }}
                  sizes="100vw"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>

          {/* Image counter badge — top right */}
          {images.length > 1 && (
            <div
              className="absolute top-3 right-3 font-body text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(0,0,0,0.28)', color: '#fff', backdropFilter: 'blur(4px)' }}
            >
              {activeIdx + 1} / {images.length}
            </div>
          )}

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center pointer-events-none">
              <span
                className="font-body text-[12px] font-semibold uppercase tracking-widest px-4 py-2 rounded-full"
                style={{ backgroundColor: 'rgba(0,0,0,0.12)', color: '#64748B' }}
              >
                Sold Out
              </span>
            </div>
          )}

          {/* Dot indicators — bottom center */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className="h-1.5 rounded-full transition-all duration-200"
                  style={{
                    width: activeIdx === idx ? 18 : 6,
                    backgroundColor: activeIdx === idx
                      ? 'var(--parish-primary)'
                      : 'rgba(0,0,0,0.18)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Thumbnail strip — when 3+ images */}
          {images.length >= 3 && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-8 px-4 pointer-events-none">
              {/* handled by dots above */}
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="px-4 pt-5 pb-6">

          {/* Parish context banner */}
          {parish && (
            <Link
              href={`/store/${parish.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl border border-mist p-3 mb-5 active:opacity-75 transition-opacity"
            >
              <div className="relative h-9 w-9 flex-shrink-0 rounded-xl overflow-hidden">
                <Image src={parish.logoUrl} alt={parish.name} fill className="object-cover" sizes="36px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-[9px] uppercase tracking-[0.14em] text-warm-gray leading-none mb-0.5">
                  Sold in support of
                </p>
                <p className="font-display text-[15px] italic font-normal text-ink truncate leading-tight">
                  {parish.name}
                </p>
              </div>
              <ChevronRight size={14} className="flex-shrink-0 text-warm-gray/40" />
            </Link>
          )}

          {/* Badge */}
          {product.badge && (
            <span
              className="inline-block font-body text-[10px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-1 mb-3"
              style={{ backgroundColor: 'var(--parish-primary)', color: '#fff' }}
            >
              {product.badge}
            </span>
          )}

          {/* Name */}
          <h2 className="font-display text-[28px] italic font-normal text-ink leading-tight">
            {product.name}
          </h2>

          {/* Price + stock */}
          <div className="flex items-center gap-4 mt-3 mb-5">
            <span className="font-body text-[26px] font-bold leading-none" style={{ color: 'var(--parish-primary)' }}>
              ${product.price.toFixed(2)}
            </span>
            <span className="flex items-center gap-1.5 font-body text-[12px] font-medium">
              <span
                className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: product.inStock ? '#16a34a' : '#94a3b8' }}
              />
              <span style={{ color: product.inStock ? '#16a34a' : '#94a3b8' }}>
                {product.inStock ? 'In stock' : 'Sold out'}
              </span>
            </span>
          </div>

          <div className="gold-hairline mb-5" />

          {/* Description */}
          <div className="mb-6">
            <p className="font-body text-[10px] uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--warm-gray)' }}>
              About this product
            </p>
            <p className="font-body text-[14px] text-ink leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span
              className="font-body text-[10px] font-semibold uppercase tracking-wider rounded-full px-3 py-1"
              style={{ backgroundColor: 'rgba(0,102,153,0.08)', color: 'var(--parish-primary)', border: '1px solid rgba(0,102,153,0.18)' }}
            >
              {product.category === 'religious' ? '✝ Religious' : '👕 Merch'}
            </span>
            <Link
              href={`/store/${product.parishId}`}
              className="font-body text-[10px] font-semibold uppercase tracking-wider rounded-full px-3 py-1 active:opacity-70"
              style={{ backgroundColor: 'rgba(27,79,114,0.08)', color: 'var(--parish-primary)', border: '1px solid rgba(27,79,114,0.18)' }}
            >
              {product.parishName}
            </Link>
          </div>

        </div>
      </main>

      {/* ── Sticky add-to-cart ── */}
      <div className="flex-shrink-0 bg-white border-t border-mist px-4 py-3 flex items-center gap-4">
        <div className="flex-shrink-0">
          <p className="font-body text-[9px] uppercase tracking-widest text-warm-gray leading-none mb-1">Price</p>
          <p className="font-body text-[20px] font-bold leading-none" style={{ color: 'var(--parish-primary)' }}>
            ${product.price.toFixed(2)}
          </p>
        </div>

        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl text-white font-body font-semibold text-[15px] disabled:opacity-40 transition-colors"
          style={{ backgroundColor: added ? '#16a34a' : 'var(--parish-primary)' }}
        >
          {added ? (
            <><Check size={18} /> Added to Cart</>
          ) : (
            <><ShoppingCart size={18} /> {product.inStock ? 'Add to Cart' : 'Sold Out'}</>
          )}
        </button>
      </div>

      <BottomNav activeTab="search" onTabChange={handleTabChange} />
    </div>
  );
}
