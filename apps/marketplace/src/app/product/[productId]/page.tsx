import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProduct, getStore } from '@/lib/mockData';
import { ProductPageShell } from '@/components/product/ProductPageShell';

interface Props {
  params: { productId: string };
  searchParams: { from?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct(params.productId);
  if (!product) return { title: 'Product not found' };
  return {
    title: `${product.name} — ParishMart`,
    description: product.description,
  };
}

export default function ProductPage({ params, searchParams }: Props) {
  const product = getProduct(params.productId);
  if (!product) notFound();

  // Parish context: either from ?from= param, or always the product's own parish
  const parishId = searchParams.from ?? product.parishId;
  const parish = getStore(parishId);

  return <ProductPageShell product={product} parish={parish} />;
}
