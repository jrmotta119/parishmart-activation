'use client';

import Image from 'next/image';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import type { StoreProduct, AddToCartContext } from '@/types/store';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: StoreProduct;
  context?: AddToCartContext;
}

export function ProductCard({ product, context = { type: 'global' } }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ product, itemType: 'product', context });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="card-tap flex flex-col rounded-2xl bg-white overflow-hidden shadow-warm-sm border border-mist">
      {/* Image */}
      <div className="relative h-40 w-full bg-mist overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 33vw"
        />

        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: 'var(--gold)', letterSpacing: '0.06em' }}
            >
              {product.badge}
            </span>
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--warm-gray)' }}>
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-3 pt-3 pb-3 gap-1.5">
        <p className="font-display text-[17px] italic font-normal leading-snug text-ink line-clamp-2">
          {product.name}
        </p>
        <p className="font-body text-[12px] text-warm-gray leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-1.5">
          <span className="font-body text-base font-semibold" style={{ color: 'var(--parish-primary)' }}>
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="flex h-8 w-8 items-center justify-center rounded-full shadow-sm disabled:opacity-40 transition-all duration-200"
            style={{ backgroundColor: added ? '#16a34a' : 'var(--parish-primary)' }}
            aria-label={`Add ${product.name} to cart`}
          >
            {added
              ? <Check size={14} className="text-white" />
              : <ShoppingCart size={14} className="text-white" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}
