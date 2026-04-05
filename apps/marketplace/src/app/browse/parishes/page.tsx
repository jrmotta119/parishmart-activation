import { getAllParishes } from '@/lib/mockData';
import { ParishesClient } from '@/components/browse/ParishesClient';

export const metadata = { title: 'Parishes & Causes — ParishMart' };

export default function ParishesPage() {
  const parishes = getAllParishes();
  return <ParishesClient parishes={parishes} />;
}
