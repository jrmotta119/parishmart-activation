import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getStore } from '@/lib/mockData';
import { StoreShell } from '@/components/store/StoreShell';

interface Props {
  params: { storeId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = getStore(params.storeId);
  if (!store) return { title: 'Store not found' };

  return {
    title: `${store.name} — ParishMart`,
    description: store.tagline,
    themeColor: store.primaryColor,
  };
}

export default function StorePage({ params }: Props) {
  const store = getStore(params.storeId);
  if (!store) notFound();

  return <StoreShell store={store} />;
}
