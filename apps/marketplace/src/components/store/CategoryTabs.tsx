'use client';

import { useState } from 'react';
import type { ProductCategory } from '@/types/store';

interface Tab {
  key: ProductCategory;
  label: string;
  emoji: string;
}

const TABS: Tab[] = [
  { key: 'all', label: 'All', emoji: '🏠' },
  { key: 'religious', label: 'Religious', emoji: '✝️' },
  { key: 'merch', label: 'Merch', emoji: '👕' },
  { key: 'donations', label: 'Donate', emoji: '🙏' },
  { key: 'vendors', label: 'Vendors', emoji: '🏪' },
];

interface CategoryTabsProps {
  onChange: (category: ProductCategory) => void;
}

export function CategoryTabs({ onChange }: CategoryTabsProps) {
  const [active, setActive] = useState<ProductCategory>('all');

  function select(key: ProductCategory) {
    setActive(key);
    onChange(key);
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => select(tab.key)}
            className={`
              flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2
              text-sm font-medium transition-colors
              ${
                isActive
                  ? 'bg-[var(--parish-primary)] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 active:bg-gray-50'
              }
            `}
          >
            <span className="text-base leading-none">{tab.emoji}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
