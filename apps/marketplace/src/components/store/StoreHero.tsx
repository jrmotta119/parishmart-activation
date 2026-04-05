import Image from 'next/image';
import type { ParishStore } from '@/types/store';

interface StoreHeroProps {
  store: ParishStore;
}

export function StoreHero({ store }: StoreHeroProps) {
  return (
    <div className="relative h-64 w-full overflow-hidden">
      {/* Background hero image */}
      <Image
        src={store.heroImageUrl}
        alt={store.name}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 parish-hero-overlay" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 px-4 pb-5">
        {/* Parish logo circle */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-white shadow-lg">
          <Image
            src={store.logoUrl}
            alt={`${store.name} logo`}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>

        {/* Name + location */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white leading-tight truncate">
            {store.name}
          </h1>
          <p className="text-xs text-white/80 mt-0.5">
            {store.city}, {store.state}
          </p>
          <p className="text-xs text-white/70 mt-0.5 line-clamp-1">
            {store.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
