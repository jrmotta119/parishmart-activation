import { getAllDonations, getAllParishes } from '@/lib/mockData';
import { DonationsClient } from '@/components/browse/DonationsClient';

export const metadata = { title: 'All Donations — ParishMart' };

export default function DonationsPage() {
  const goals = getAllDonations();
  const parishes = getAllParishes();
  return <DonationsClient goals={goals} parishes={parishes} />;
}
