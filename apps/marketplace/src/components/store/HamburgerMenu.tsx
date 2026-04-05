'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import {
  X, Home, Store, ShoppingBag, Heart,
  UserPlus, PlusSquare, Mail, Info, HelpCircle, ChevronRight,
} from 'lucide-react';

const LOGO_WHITE = 'https://parishmart-files-public.s3.us-east-2.amazonaws.com/logo/Logo+WHITE+crop.png';

interface MenuItem {
  label: string;
  Icon: React.ElementType;
  href: string;
  dividerAfter?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'ParishMart Home',       Icon: Home,       href: '/' },
  { label: 'Browse Parishes & Causes', Icon: Store,   href: '/browse/parishes', dividerAfter: true },
  { label: 'Marketplace',           Icon: ShoppingBag, href: '/browse/marketplace' },
  { label: 'All Donations',         Icon: Heart,      href: '/browse/donations', dividerAfter: true },
  { label: 'Become a Seller',       Icon: UserPlus,   href: '/become-a-seller' },
  { label: 'Create Your Store',     Icon: PlusSquare, href: '/create-store', dividerAfter: true },
  { label: 'Contact Us',            Icon: Mail,       href: '/contact' },
  { label: 'About Us',              Icon: Info,       href: '/about' },
  { label: 'FAQs',                  Icon: HelpCircle, href: '/faq' },
];

interface HamburgerMenuProps {
  open: boolean;
  parishName: string;
  onClose: () => void;
}

export function HamburgerMenu({ open, parishName, onClose }: HamburgerMenuProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(26,17,10,0.55)', backdropFilter: 'blur(3px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: '#FAF7F2' }}
        aria-label="Navigation menu"
      >
        {/* Header band */}
        <div
          className="grain flex items-center justify-between px-5 py-5 flex-shrink-0"
          style={{ background: `linear-gradient(135deg, #0D2540 0%, var(--parish-primary) 100%)` }}
        >
          <div className="flex flex-col gap-1.5">
            <Image
              src={LOGO_WHITE}
              alt="ParishMart"
              width={100}
              height={32}
              className="object-contain"
            />
            <p className="font-body text-[10px] text-white/50 tracking-widest uppercase leading-none">
              {parishName === 'ParishMart' ? 'Faith-based marketplace' : `Shopping at ${parishName}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 active:bg-white/15 transition-colors flex-shrink-0 ml-2"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Gold hairline */}
        <div className="gold-hairline" />

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3">
          {MENU_ITEMS.map(({ label, Icon, href, dividerAfter }) => (
            <div key={label}>
              <a
                href={href}
                className="flex items-center gap-3.5 px-5 py-3.5 text-ink active:bg-mist transition-colors"
              >
                {/* Icon container */}
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: 'rgba(27,79,114,0.08)', color: 'var(--parish-primary)' }}
                >
                  <Icon size={15} />
                </span>

                <span className="flex-1 font-body text-[14px] font-medium text-ink">
                  {label}
                </span>
                <ChevronRight size={13} className="text-warm-gray opacity-40" />
              </a>

              {dividerAfter && (
                <div className="mx-5 my-1 h-px bg-mist" />
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-mist px-5 py-4">
          {/* Ornamental cross */}
          <div className="ornament mb-2" style={{ color: 'var(--gold)' }}>
            <span className="text-[13px]" style={{ fontFamily: 'Georgia,serif' }}>✛</span>
          </div>
          <p className="font-body text-[11px] text-warm-gray text-center">
            © {new Date().getFullYear()} ParishMart
          </p>
          <p className="font-body text-[10px] text-warm-gray/60 text-center mt-0.5">
            Faith-based marketplace
          </p>
        </div>
      </aside>
    </>
  );
}
