import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVendor } from '@/lib/mockData';
import { VendorPageShell } from '@/components/vendor/VendorPageShell';

interface Props {
  params: { vendorId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vendor = getVendor(params.vendorId);
  if (!vendor) return { title: 'Vendor not found' };
  return {
    title: `${vendor.name} — ParishMart`,
    description: vendor.tagline,
  };
}

export default function VendorPage({ params }: Props) {
  const vendor = getVendor(params.vendorId);
  if (!vendor) notFound();

  return <VendorPageShell vendor={vendor} />;
}
