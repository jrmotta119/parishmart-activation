'use client';

import { Menu, ChevronLeft, ShoppingBag } from 'lucide-react';

interface TopBarProps {
  parishName: string;
  showBack?: boolean;
  viewTitle?: string;
  onMenuClick: () => void;
  onBack?: () => void;
}

export function TopBar({
  parishName,
  showBack = false,
  viewTitle,
  onMenuClick,
  onBack,
}: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center px-3 safe-top"
      style={{
        backgroundColor: 'var(--parish-primary)',
        paddingTop: '10px',
        paddingBottom: '10px',
      }}
    >
      {/* Subtle inner highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-20"
        style={{ background: 'linear-gradient(90deg, transparent, #fff, transparent)' }}
      />

      {/* Left */}
      <div className="w-10">
        {showBack ? (
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 active:bg-white/15 transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>
        ) : (
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 active:bg-white/15 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        )}
      </div>

      {/* Center */}
      <div className="flex-1 text-center px-1 min-w-0">
        <p className="text-[10px] font-body text-white/50 tracking-widest uppercase leading-none">
          {showBack ? parishName : 'ParishMart'}
        </p>
        <h1
          className="font-display text-[18px] italic font-normal text-white leading-tight truncate mt-0.5"
        >
          {viewTitle ?? parishName}
        </h1>
      </div>

      {/* Right */}
      <div className="w-10 flex justify-end">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 active:bg-white/15 transition-colors"
          aria-label="Cart"
        >
          <ShoppingBag size={19} />
        </button>
      </div>
    </header>
  );
}
