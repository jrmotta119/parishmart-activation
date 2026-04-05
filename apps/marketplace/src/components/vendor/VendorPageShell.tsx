'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Check, ChevronRight, MapPin } from 'lucide-react';
import { BrowseLayout } from '@/components/browse/BrowseLayout';
import { useCart } from '@/context/CartContext';
import type { StoreVendor, VendorService } from '@/types/store';

interface VendorPageShellProps {
  vendor: StoreVendor;
}

export function VendorPageShell({ vendor }: VendorPageShellProps) {
  return (
    <BrowseLayout title={vendor.name}>
      <div className="pb-24">
        {/* Hero banner */}
        <div className="relative h-44 w-full bg-mist overflow-hidden">
          {vendor.bannerUrl ? (
            <Image
              src={vendor.bannerUrl}
              alt={vendor.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(140deg,#0D2540,#1B4472)' }} />
          )}
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>

        {/* Logo + name row */}
        <div className="relative px-4 -mt-10 flex items-end gap-4 mb-5">
          <div
            className="relative h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-white"
          >
            <Image
              src={vendor.logoUrl}
              alt={vendor.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="pb-1 min-w-0">
            <h2 className="font-display text-[22px] italic font-normal text-ink leading-tight line-clamp-1">
              {vendor.name}
            </h2>
            <p className="font-body text-[12px] text-warm-gray mt-0.5 line-clamp-1">{vendor.tagline}</p>
          </div>
        </div>

        {/* Category + parish chips */}
        <div className="flex items-center gap-2 px-4 mb-4 flex-wrap">
          <span
            className="font-body text-[10px] font-semibold uppercase tracking-wider rounded-full px-3 py-1"
            style={{ backgroundColor: 'rgba(0,102,153,0.08)', color: 'var(--gold-muted,#004D73)', border: '1px solid rgba(0,102,153,0.2)' }}
          >
            {vendor.category}
          </span>
          <Link
            href={`/store/${vendor.parishId}`}
            className="flex items-center gap-1 font-body text-[10px] font-semibold uppercase tracking-wider rounded-full px-3 py-1 active:opacity-70 transition-opacity"
            style={{ backgroundColor: 'rgba(27,79,114,0.08)', color: 'var(--parish-primary,#1A56A0)' }}
          >
            <MapPin size={9} />
            {vendor.parishName.replace(' Parish', '')}
          </Link>
        </div>

        {/* About */}
        {vendor.about && (
          <div className="px-4 mb-5">
            <p className="font-body text-[13px] text-warm-gray leading-relaxed">{vendor.about}</p>
          </div>
        )}

        {/* Gold hairline */}
        <div className="gold-hairline mx-4 mb-5" />

        {/* Services */}
        {vendor.services && vendor.services.length > 0 ? (
          <div className="px-4">
            <div className="mb-4">
              <h3 className="font-display text-display-sm italic font-normal text-ink">Services & Products</h3>
              <div className="gold-hairline mt-1.5 w-10" />
            </div>
            <div className="flex flex-col gap-3">
              {vendor.services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  vendorName={vendor.name}
                  parishName={vendor.parishName}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="text-[32px] opacity-20" style={{ fontFamily: 'Georgia,serif', color: 'var(--gold)' }}>✛</span>
            <p className="font-display text-display-sm italic text-warm-gray">No services listed yet</p>
          </div>
        )}

        {/* Supporting parish link */}
        <div className="mx-4 mt-8 rounded-2xl border border-mist bg-white p-4">
          <p className="font-body text-[11px] text-warm-gray uppercase tracking-wider mb-2">Supporting</p>
          <Link
            href={`/store/${vendor.parishId}`}
            className="flex items-center gap-2 active:opacity-70 transition-opacity"
          >
            <span className="font-display text-[17px] italic font-normal text-ink">{vendor.parishName}</span>
            <ChevronRight size={14} className="text-warm-gray/40 ml-auto" />
          </Link>
          <p className="font-body text-[11px] text-warm-gray mt-1">
            A portion of every purchase supports this parish.
          </p>
        </div>
      </div>
    </BrowseLayout>
  );
}

function ServiceCard({
  service,
  vendorName,
  parishName,
}: {
  service: VendorService;
  vendorName: string;
  parishName: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      product: service,
      itemType: 'service',
      context: { type: 'vendor', vendorName, parishName },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="flex gap-3.5 rounded-2xl bg-white border border-mist shadow-warm-sm p-3.5 items-start">
      {/* Image */}
      <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-mist">
        <Image src={service.imageUrl} alt={service.name} fill className="object-cover" sizes="80px" />
        {!service.available && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-warm-gray">Unavailable</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {service.badge && (
          <span
            className="self-start font-body text-[9px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
            style={{ backgroundColor: 'var(--gold)', color: '#fff' }}
          >
            {service.badge}
          </span>
        )}
        <p className="font-display text-[16px] italic font-normal text-ink leading-snug line-clamp-2">
          {service.name}
        </p>
        <p className="font-body text-[11px] text-warm-gray leading-snug line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="font-body text-sm font-semibold" style={{ color: 'var(--parish-primary,#1A56A0)' }}>
            {service.price === 0
              ? (service.priceLabel ?? 'Free')
              : service.priceLabel
                ? `${service.priceLabel} $${service.price.toFixed(2)}`
                : `$${service.price.toFixed(2)}`}
          </span>
          <button
            onClick={handleAdd}
            disabled={!service.available}
            className="flex h-8 w-8 items-center justify-center rounded-full shadow-sm disabled:opacity-40 transition-all duration-200"
            style={{ backgroundColor: added ? '#16a34a' : 'var(--parish-primary,#1A56A0)' }}
            aria-label={`Add ${service.name} to cart`}
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
