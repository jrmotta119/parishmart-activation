import type { StoreProduct, AddToCartContext } from '@/types/store';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: StoreProduct[];
  title?: string;
  context?: AddToCartContext;
}

export function ProductGrid({ products, title, context }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <section className="px-4 pb-5">
      {title && (
        <div className="mb-4">
          <h2 className="font-display text-display-sm italic font-normal text-ink">{title}</h2>
          <div className="gold-hairline mt-1.5 w-10" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} context={context} />
        ))}
      </div>
    </section>
  );
}
