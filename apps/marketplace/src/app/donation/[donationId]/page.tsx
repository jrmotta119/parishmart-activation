import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDonation, getStore } from '@/lib/mockData';
import { DonationPageShell } from '@/components/donation/DonationPageShell';

interface Props {
  params: { donationId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const donation = getDonation(params.donationId);
  if (!donation) return { title: 'Campaign not found' };
  return {
    title: `${donation.title} — ParishMart`,
    description: donation.description,
  };
}

export default function DonationPage({ params }: Props) {
  const donation = getDonation(params.donationId);
  if (!donation) notFound();

  const parish = getStore(donation.parishId);

  return <DonationPageShell donation={donation} parish={parish} />;
}
