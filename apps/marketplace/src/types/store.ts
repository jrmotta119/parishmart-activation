export type ProductCategory = 'all' | 'religious' | 'merch' | 'donations' | 'vendors';

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  images?: string[];   // additional images; imageUrl is always the primary
  category: 'religious' | 'merch';
  inStock: boolean;
  badge?: string;
  parishId: string;
  parishName: string;
}

export interface DonationGoal {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  imageUrl: string;
  endsAt?: string;
  parishId: string;
  parishName: string;
}

export interface VendorService {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  priceLabel?: string; // "Free", "starting at", "per month", "flat rate"
  imageUrl: string;
  available: boolean;
  badge?: string;
}

export interface StoreVendor {
  id: string;
  name: string;
  tagline: string;
  logoUrl: string;
  category: string;
  parishId: string;
  parishName: string;
  url?: string;
  // Vendor page fields
  services?: VendorService[];
  bannerUrl?: string;
  about?: string;
}

export interface ParishStore {
  id: string;
  name: string;
  tagline: string;
  heroImageUrl: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  city: string;
  state: string;
  products: StoreProduct[];
  donationGoals: DonationGoal[];
  vendors: StoreVendor[];
}

export interface ParishSummary {
  id: string;
  name: string;
  tagline: string;
  heroImageUrl: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  city: string;
  state: string;
  productCount: number;
  donationCount: number;
  vendorCount: number;
}

// ── Cart ──────────────────────────────────────────────────────────────────────

/** Determines the seller attribution label at add-to-cart time */
export type AddToCartContext =
  | { type: 'global' }
  | { type: 'parish'; parishName: string }
  | { type: 'vendor'; vendorName: string; parishName: string };

export function computeSellerLabel(ctx: AddToCartContext): string {
  switch (ctx.type) {
    case 'global':
      return 'Sold by ParishMart';
    case 'parish':
      return `Sold by ParishMart in support of ${ctx.parishName}`;
    case 'vendor':
      return `Sold by ${ctx.vendorName} in support of ${ctx.parishName}`;
  }
}

export interface CartItem {
  /** Composite key: `${productId}__${sellerLabel}` — allows same product from two contexts */
  id: string;
  itemType: 'product' | 'service';
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  sellerLabel: string;
  parishId?: string;
  vendorId?: string;
}
