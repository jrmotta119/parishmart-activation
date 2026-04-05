import { getAllParishes, getAllProducts, getAllDonations, getAllVendors } from '@/lib/mockData';
import { HomeShell } from '@/components/home/HomeShell';

export default function HomePage() {
  const parishes = getAllParishes();
  const products = getAllProducts();
  const donations = getAllDonations();
  const vendors = getAllVendors();

  return (
    <HomeShell
      parishes={parishes}
      totalProducts={products.length}
      totalDonations={donations.length}
      totalVendors={vendors.length}
    />
  );
}
