'use client';

import {
  createContext, useContext, useEffect, useReducer, useCallback,
  type ReactNode,
} from 'react';
import Image from 'next/image';
import { X, Trash2, ShoppingCart, Minus, Plus } from 'lucide-react';
import type { CartItem, AddToCartContext, StoreProduct, VendorService } from '@/types/store';
import { computeSellerLabel } from '@/types/store';

// ── Types ────────────────────────────────────────────────────────────────────

interface AddItemPayload {
  product: StoreProduct | VendorService;
  itemType: 'product' | 'service';
  context: AddToCartContext;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  hydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (payload: AddItemPayload) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

// ── State / Reducer ───────────────────────────────────────────────────────────

interface State {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
}

type Action =
  | { type: 'HYDRATE'; items: CartItem[] }
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QTY'; id: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items, hydrated: true };
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id
              ? { ...i, quantity: Math.min(99, i.quantity + 1) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: Math.min(99, action.qty) } : i
        ),
      };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

const STORAGE_KEY = 'parishmart_cart';

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // private mode or storage full — silently ignore
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    isOpen: false,
    hydrated: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    dispatch({ type: 'HYDRATE', items: readStorage() });
  }, []);

  // Persist to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (state.hydrated) writeStorage(state.items);
  }, [state.items, state.hydrated]);

  // Lock body scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = state.isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [state.isOpen]);

  const addItem = useCallback((payload: AddItemPayload) => {
    const sellerLabel = computeSellerLabel(payload.context);
    // Composite id — same product from two contexts = separate line items
    const id = `${payload.product.id}__${sellerLabel}`;
    const item: CartItem = {
      id,
      itemType: payload.itemType,
      name: payload.product.name,
      price: payload.product.price,
      imageUrl: payload.product.imageUrl,
      quantity: 1,
      sellerLabel,
    };
    dispatch({ type: 'ADD_ITEM', item });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', id });
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    dispatch({ type: 'UPDATE_QTY', id, qty });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const openCart  = useCallback(() => dispatch({ type: 'OPEN' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE' }), []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal  = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items, itemCount, subtotal,
      isOpen: state.isOpen, hydrated: state.hydrated,
      openCart, closeCart, addItem, removeItem, updateQuantity, clearCart,
    }}>
      {children}
      <CartSheet />
    </CartContext.Provider>
  );
}

// ── Cart Sheet ────────────────────────────────────────────────────────────────

function CartSheet() {
  const { items, itemCount, subtotal, isOpen, closeCart, removeItem, updateQuantity } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Sheet panel */}
      <div
        className="fixed bottom-0 inset-x-0 z-50 flex flex-col bg-white rounded-t-3xl transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          maxHeight: '88vh',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
        aria-label="Shopping cart"
        role="dialog"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-display-sm italic font-normal text-ink">
              Your Cart
            </h2>
            {itemCount > 0 && (
              <span
                className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-body text-[11px] font-semibold text-white"
                style={{ backgroundColor: 'var(--gold)' }}
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-full active:bg-parchment transition-colors"
            aria-label="Close cart"
          >
            <X size={18} className="text-warm-gray" />
          </button>
        </div>

        {/* Gold hairline */}
        <div className="gold-hairline mx-5 flex-shrink-0" />

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 py-16 gap-3">
            <ShoppingCart size={40} strokeWidth={1.25} className="opacity-15 text-ink" />
            <p className="font-display text-display-sm italic text-warm-gray">Your cart is empty</p>
            <p className="font-body text-[12px] text-warm-gray/70 text-center max-w-[200px]">
              Browse parishes and add products or vendor services to get started
            </p>
          </div>
        )}

        {/* Items list */}
        {items.length > 0 && (
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onRemove={() => removeItem(item.id)}
                onQtyChange={(q) => updateQuantity(item.id, q)}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="flex-shrink-0 px-5 pb-8 pt-3 border-t border-mist bg-white safe-bottom">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-sm text-warm-gray">Subtotal</span>
              <span className="font-body text-base font-semibold text-ink">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <button
              disabled
              className="w-full rounded-xl py-3.5 font-body text-sm font-semibold text-white/70 cursor-not-allowed"
              style={{ backgroundColor: 'var(--parish-primary)', opacity: 0.6 }}
            >
              Proceed to Checkout — Coming Soon
            </button>
            <p className="font-body text-[10px] text-warm-gray/60 text-center mt-2">
              Checkout and payments coming in the next release
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function CartItemRow({
  item,
  onRemove,
  onQtyChange,
}: {
  item: CartItem;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      {/* Thumbnail */}
      <div className="relative h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden bg-mist">
        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="56px" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-display text-[15px] italic font-normal text-ink leading-tight line-clamp-1">
          {item.name}
        </p>
        <p className="font-body text-[10px] text-warm-gray mt-0.5 leading-tight line-clamp-1">
          {item.sellerLabel}
        </p>

        {/* Qty stepper */}
        <div className="flex items-center gap-2 mt-1.5">
          <button
            onClick={() => onQtyChange(item.quantity - 1)}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-mist active:bg-parchment transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={11} className="text-ink" />
          </button>
          <span className="font-body text-sm font-medium text-ink w-4 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onQtyChange(item.quantity + 1)}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-mist active:bg-parchment transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={11} className="text-ink" />
          </button>
        </div>
      </div>

      {/* Right: price + trash */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="font-body text-sm font-semibold text-ink">
          {item.price === 0 ? 'Free' : `$${(item.price * item.quantity).toFixed(2)}`}
        </span>
        <button
          onClick={onRemove}
          className="flex h-6 w-6 items-center justify-center rounded-full active:bg-red-50 transition-colors"
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 size={13} className="text-warm-gray" />
        </button>
      </div>
    </div>
  );
}
