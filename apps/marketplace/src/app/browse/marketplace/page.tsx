import { getAllVendors, getAllParishes, getUniqueVendorCategories } from '@/lib/mockData';
import { MarketplaceClient } from '@/components/browse/MarketplaceClient';

export const metadata = { title: 'Marketplace — ParishMart' };

export default function MarketplacePage() {
  const vendors = getAllVendors();
  const parishes = getAllParishes();
  const categories = getUniqueVendorCategories();
  return <MarketplaceClient vendors={vendors} parishes={parishes} categories={categories} />;
}
