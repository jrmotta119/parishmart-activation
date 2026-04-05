import Image from 'next/image';
import type { ParishStore } from '@/types/store';

type CategoryView = 'religious' | 'merch' | 'donations' | 'vendors';

interface CardConfig {
  key: CategoryView;
  title: string;
  subtitle: (store: ParishStore) => string;
  symbol: string;   // Unicode ornamental symbol
  from: string;     // gradient start (Tailwind arbitrary)
  to: string;       // gradient end
  accentColor: string;
}

const CARDS: CardConfig[] = [
  {
    key: 'religious',
    title: 'Religious Articles',
    subtitle: (s) => {
      const n = s.products.filter((p) => p.category === 'religious').length;
      return `${n} item${n !== 1 ? 's' : ''}`;
    },
    symbol: '✛',
    from: '#0D2540',
    to: '#1B4472',
    accentColor: '#4DB8E0',
  },
  {
    key: 'merch',
    title: 'Parish Merch',
    subtitle: (s) => {
      const n = s.products.filter((p) => p.category === 'merch').length;
      return `${n} item${n !== 1 ? 's' : ''}`;
    },
    symbol: '◈',
    from: '#3A1010',
    to: '#6B2626',
    accentColor: '#4DB8E0',
  },
  {
    key: 'donations',
    title: 'Donate',
    subtitle: (s) => {
      const n = s.donationGoals.length;
      return `${n} active campaign${n !== 1 ? 's' : ''}`;
    },
    symbol: '♡',
    from: '#0C2E1B',
    to: '#185A36',
    accentColor: '#4DB8E0',
  },
  {
    key: 'vendors',
    title: 'Local Business',
    subtitle: (s) => {
      const n = s.vendors.length;
      return `${n} supporter${n !== 1 ? 's' : ''}`;
    },
    symbol: '◉',
    from: '#191929',
    to: '#2D2D50',
    accentColor: '#4DB8E0',
  },
];

interface StoreLandingProps {
  store: ParishStore;
  onNavigate: (view: CategoryView) => void;
}

export function StoreLanding({ store, onNavigate }: StoreLandingProps) {
  return (
    <div className="flex flex-col bg-parchment">
      {/* ── Hero ──────────────────────────────── */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={store.heroImageUrl}
          alt={store.name}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 parish-hero-overlay" />

        {/* Parish identity bar */}
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 px-4 pb-4">
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/80 shadow-warm-md">
            <Image
              src={store.logoUrl}
              alt={`${store.name} logo`}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="flex-1 min-w-0 pb-0.5">
            {/* Parish name in display font */}
            <h2 className="font-display text-[22px] italic font-normal text-white leading-tight">
              {store.name}
            </h2>
            <p className="text-[11px] text-white/65 font-body mt-0.5 tracking-wide">
              {store.city}, {store.state}
            </p>
          </div>
        </div>
      </div>

      {/* ── Welcome section ───────────────────── */}
      <div className="welcome-reveal px-5 pt-5 pb-4">
        <div className="ornament text-[11px] font-body tracking-widest uppercase mb-3"
             style={{ color: 'var(--gold)' }}>
          <span>Welcome</span>
        </div>
        <p
          className="font-display text-display-md italic leading-snug"
          style={{ color: 'var(--ink)' }}
        >
          {store.tagline}
        </p>
        <p className="text-sm font-body mt-2 leading-relaxed text-warm-gray">
          Browse your parish store — sacred goods, community merch, charitable giving,
          and local vendors who support {store.name}.
        </p>
      </div>

      {/* ── Gold hairline ─────────────────────── */}
      <div className="gold-hairline mx-5 mb-5" />

      {/* ── Category cards 2×2 ─────────────────── */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-8">
        {CARDS.map((card) => (
          <CategoryCard
            key={card.key}
            card={card}
            sublabel={card.subtitle(store)}
            onPress={() => onNavigate(card.key)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Devotional panel card ─────────────────────────────── */
function CategoryCard({
  card,
  sublabel,
  onPress,
}: {
  card: CardConfig;
  sublabel: string;
  onPress: () => void;
}) {
  return (
    <button
      onClick={onPress}
      className="card-reveal grain relative flex flex-col justify-between rounded-2xl p-4 text-left overflow-hidden"
      style={{
        background: `linear-gradient(140deg, ${card.from} 0%, ${card.to} 100%)`,
        minHeight: '168px',
      }}
    >
      {/* Top row: symbol + count */}
      <div className="flex items-start justify-between">
        <span
          className="text-2xl leading-none"
          style={{ color: card.accentColor, fontFamily: 'Georgia, serif' }}
        >
          {card.symbol}
        </span>
        <span
          className="text-[10px] font-body font-medium tracking-widest uppercase rounded-full px-2 py-0.5"
          style={{
            backgroundColor: 'rgba(77,184,224,0.15)',
            color: card.accentColor,
            border: `1px solid ${card.accentColor}40`,
          }}
        >
          {sublabel}
        </span>
      </div>

      {/* Bottom: title + hairline */}
      <div>
        {/* Thin gold divider */}
        <div
          className="mb-2.5 h-px opacity-25"
          style={{ background: card.accentColor }}
        />
        <h3
          className="font-display text-[22px] italic font-normal leading-tight text-white"
        >
          {card.title}
        </h3>
        <p className="font-body text-[11px] mt-1 tracking-wide uppercase opacity-50 text-white">
          Explore →
        </p>
      </div>
    </button>
  );
}
