'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { BrowseLayout } from './BrowseLayout';
import { FilterSortBar } from './FilterSortBar';
import type { StoreProduct } from '@/types/store';
import type { ParishSummary } from '@/types/store';

const SORT_OPTIONS = [
  { key: 'name', label: 'Name A–Z' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
];

interface ProductsClientProps {
  products: StoreProduct[];
  parishes: ParishSummary[];
}

export function ProductsClient({ products, parishes }: ProductsClientProps) {
  const [query, setQuery] = useState('');
  const [filterParish, setFilterParish] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sort, setSort] = useState('name');

  const parishFilters = useMemo(() => [
    { key: 'all', label: 'All Parishes' },
    ...parishes.map((p) => ({ key: p.id, label: p.name.replace('Parish', '').replace('Our Lady of', 'OL').trim() })),
  ], [parishes]);

  const categoryFilters = [
    { key: 'all', label: 'All' },
    { key: 'religious', label: '✝ Religious' },
    { key: 'merch', label: '👕 Merch' },
  ];

  const results = useMemo(() => {
    let list = [...products];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.parishName.toLowerCase().includes(q));
    }
    if (filterParish !== 'all') list = list.filter((p) => p.parishId === filterParish);
    if (filterCategory !== 'all') list = list.filter((p) => p.category === filterCategory);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, query, filterParish, filterCategory, sort]);

  return (
    <BrowseLayout title="All Products">
      {/* Parish filter */}
      <FilterSortBar
        searchQuery={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search products…"
        filters={parishFilters}
        activeFilter={filterParish}
        onFilterChange={setFilterParish}
        sortOptions={SORT_OPTIONS}
        activeSort={sort}
        onSortChange={setSort}
      />

      {/* Category sub-filter */}
      <div className="flex gap-2 px-4 pt-3 pb-1">
        {categoryFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterCategory(f.key)}
            className="flex-shrink-0 rounded-full px-3 py-1 font-body text-xs font-medium transition-colors"
            style={
              f.key === filterCategory
                ? { backgroundColor: '#1A56A0', color: '#fff' }
                : { backgroundColor: '#F5F1EB', color: '#6B5E52' }
            }
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto font-body text-[11px] text-warm-gray self-center">
          {results.length} result{results.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-3 pb-24">
        {results.length === 0 && (
          <div className="col-span-2 py-20 flex flex-col items-center gap-3">
            <span className="text-[36px] opacity-20" style={{ fontFamily: 'Georgia,serif', color: 'var(--gold)' }}>✛</span>
            <p className="font-display text-display-sm italic text-warm-gray">No products found</p>
          </div>
        )}
        {results.map((product) => (
          <ProductBrowseCard key={product.id} product={product} />
        ))}
      </div>
    </BrowseLayout>
  );
}

function ProductBrowseCard({ product }: { product: StoreProduct }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ product, itemType: 'product', context: { type: 'global' } });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="flex flex-col rounded-2xl bg-white border border-mist shadow-warm-sm overflow-hidden">
      <div className="relative h-36 w-full bg-mist">
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="50vw" />
        {product.badge && (
          <div className="absolute top-2 left-2">
            <span className="rounded-full px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider text-white" style={{ backgroundColor: 'var(--gold)' }}>
              {product.badge}
            </span>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="font-body text-[11px] font-semibold uppercase tracking-widest text-warm-gray">Sold Out</span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3 gap-1">
        {/* Parish badge */}
        <span
          className="self-start font-body text-[9px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
          style={{ backgroundColor: 'rgba(27,79,114,0.08)', color: 'var(--parish-primary)' }}
        >
          {product.parishName.replace(' Parish', '').replace('Our Lady of Guadalupe', 'Our Lady')}
        </span>
        <p className="font-display text-[16px] italic font-normal text-ink leading-snug line-clamp-2 flex-1">
          {product.name}
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="font-body text-sm font-semibold" style={{ color: 'var(--parish-primary)' }}>
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="flex h-7 w-7 items-center justify-center rounded-full disabled:opacity-40 transition-all duration-200"
            style={{ backgroundColor: added ? '#16a34a' : 'var(--parish-primary)' }}
            aria-label={`Add ${product.name} to cart`}
          >
            {added
              ? <Check size={12} className="text-white" />
              : <ShoppingCart size={13} className="text-white" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}
