'use client';

import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export type BottomNavTab = 'home' | 'search' | 'cart' | 'account';

const NAV_ITEMS: { key: BottomNavTab; label: string; Icon: React.ElementType }[] = [
  { key: 'home',    label: 'Home',    Icon: Home },
  { key: 'search',  label: 'Search',  Icon: Search },
  { key: 'cart',    label: 'Cart',    Icon: ShoppingCart },
  { key: 'account', label: 'Account', Icon: User },
];

interface BottomNavProps {
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { itemCount, hydrated, openCart } = useCart();

  function handleTap(key: BottomNavTab) {
    if (key === 'cart') {
      openCart();          // opens the sheet; never changes activeTab
    } else {
      onTabChange(key);
    }
  }

  const badgeCount = hydrated ? itemCount : 0;

  return (
    <nav
      className="sticky bottom-0 z-20 safe-bottom"
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #F0ECE4',
        boxShadow: '0 -4px 20px rgba(26,17,10,0.06)',
      }}
    >
      <div className="grid grid-cols-4">
        {NAV_ITEMS.map(({ key, label, Icon }) => {
          const isActive = key === activeTab && key !== 'cart';
          return (
            <button
              key={key}
              onClick={() => handleTap(key)}
              className="relative flex flex-col items-center gap-0.5 py-3 transition-colors"
              style={isActive ? { color: 'var(--parish-primary)' } : { color: '#A8998A' }}
            >
              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                  style={{ backgroundColor: 'var(--parish-primary)' }}
                />
              )}

              {/* Icon with badge for cart */}
              <span className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.25 : 1.6} />
                {key === 'cart' && badgeCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-body text-[9px] font-bold text-white leading-none"
                    style={{ backgroundColor: 'var(--gold)' }}
                  >
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                )}
              </span>

              <span className={`font-body text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
