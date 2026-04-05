import { getAllProducts, getAllParishes } from '@/lib/mockData';
import { ProductsClient } from '@/components/browse/ProductsClient';

export const metadata = { title: 'All Products — ParishMart' };

export default function ProductsPage() {
  const products = getAllProducts();
  const parishes = getAllParishes();
  return <ProductsClient products={products} parishes={parishes} />;
}
