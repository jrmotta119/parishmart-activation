import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { StoreVendor } from '@/types/store';

interface VendorCardProps {
  vendor: StoreVendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link href={`/vendor/${vendor.id}`} className="card-tap flex items-center gap-3.5 rounded-2xl bg-white border border-mist shadow-warm-sm p-3.5 active:bg-parchment transition-colors">
      {/* Logo */}
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-mist">
        <Image
          src={vendor.logoUrl}
          alt={vendor.name}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-[17px] italic font-normal text-ink leading-snug">
            {vendor.name}
          </p>
          <ExternalLink size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
        </div>
        <p className="font-body text-[12px] text-warm-gray mt-0.5 line-clamp-1">
          {vendor.tagline}
        </p>
        <span
          className="inline-block mt-1.5 font-body text-[10px] font-medium uppercase tracking-wider rounded-full px-2 py-0.5"
          style={{
            backgroundColor: 'rgba(0,102,153,0.08)',
            color: 'var(--gold-muted, #004D73)',
            border: '1px solid rgba(0,102,153,0.2)',
          }}
        >
          {vendor.category}
        </span>
      </div>
    </Link>
  );
}
