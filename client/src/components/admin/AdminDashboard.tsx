import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VendorEntry {
  vendor_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  approval_status: string;
  created_at: string;
  is_new: boolean;
  business_name: string;
  business_type: string;
  business_description: string;
  business_policy: string;
  business_address: string;
  business_city: string;
  business_state: string;
  business_zip_code: string;
  business_country: string;
  business_reach: string;
  website_links: string;
  contact_email: string;
  contact_phone: string;
  current_subscription_type: string;
  subscription_amount: number | null;
  billing_cycle: string | null;
  about_you: string | null;
  community_contribution: string | null;
  mission_affiliation: string | null;
  logo_processed_url: string | null;
  logo_raw_url: string | null;
  banner_processed_url: string | null;
  banner_images: string[] | null;
  processed_results: { merchandise?: Record<string, string> } | null;
}

interface StoreEntry {
  admin_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  street_address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  approval_status: string;
  created_at: string;
  is_new: boolean;
  organization_name: string;
  organization_type: string;
  description: string;
  impact: string;
  since_year: string;
  slogan: string;
  is_tax_exempt: boolean;
  collect_donations: boolean;
  donations_platform: string;
  current_subscription_type: string;
  subscription_amount: number | null;
  billing_cycle: string | null;
  parish_count: number | null;
  role: string | null;
  referred_by: string | null;
  referral_associate_name: string | null;
  social_media_platform: string | null;
  logo_processed_url: string | null;
  logo_raw_url: string | null;
  banner_processed_url: string | null;
  banner_images: string[] | null;
  processed_results: { merchandise?: Record<string, string> } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function NewDot() {
  return (
    <span
      title="New entry"
      className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"
    />
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending:  'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtAmount(amount: number | null, cycle: string | null) {
  if (amount == null) return '—';
  return `$${amount.toLocaleString()}/${cycle === 'annual' ? 'yr' : 'mo'}`;
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col sm:flex-row gap-1 py-1.5 border-b border-gray-100 last:border-0">
      <span className="sm:w-48 text-xs font-semibold text-gray-500 uppercase tracking-wide shrink-0">{label}</span>
      <span className="text-sm text-gray-800 break-all">{value}</span>
    </div>
  );
}

function MediaLink({ href, label }: { href: string; label: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className="text-blue-600 underline">{label}</a>;
}

function VendorDetail({ vendor }: { vendor: VendorEntry }) {
  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <p className="text-sm font-semibold text-gray-700 mb-3">
        {vendor.first_name} {vendor.last_name}{vendor.business_name ? ` — ${vendor.business_name}` : ''}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Contact</p>
          <DetailRow label="Phone" value={vendor.phone} />
          <DetailRow label="Business Email" value={vendor.contact_email} />
          <DetailRow label="Contact Phone" value={vendor.contact_phone} />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Business Address</p>
          <DetailRow label="Street" value={vendor.business_address} />
          <DetailRow label="City" value={vendor.business_city} />
          <DetailRow label="State" value={vendor.business_state} />
          <DetailRow label="Zip" value={vendor.business_zip_code} />
          <DetailRow label="Country" value={vendor.business_country} />
        </div>
        <div className="mt-3">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Business Details</p>
          <DetailRow label="Business Type" value={vendor.business_type} />
          <DetailRow label="Reach" value={vendor.business_reach} />
          <DetailRow label="Website" value={vendor.website_links} />
          <DetailRow label="Description" value={vendor.business_description} />
          <DetailRow label="Policy" value={vendor.business_policy} />
          <DetailRow label="About Owner" value={vendor.about_you} />
          <DetailRow label="Community Efforts" value={vendor.community_contribution} />
          <DetailRow label="Mission They Support" value={vendor.mission_affiliation} />
        </div>
        <div className="mt-3">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Subscription & Media</p>
          <DetailRow label="Plan" value={vendor.current_subscription_type} />
          <DetailRow label="Amount" value={fmtAmount(vendor.subscription_amount, vendor.billing_cycle)} />
          <DetailRow label="Logo (Processed)" value={vendor.logo_processed_url ? <MediaLink href={vendor.logo_processed_url} label="View" /> : null} />
          <DetailRow label="Logo (Raw)" value={vendor.logo_raw_url ? <MediaLink href={vendor.logo_raw_url} label="View" /> : null} />
          <DetailRow label="Banner (Processed)" value={vendor.banner_processed_url ? <MediaLink href={vendor.banner_processed_url} label="View" /> : null} />
          {vendor.banner_images?.map((url, i) => (
            <DetailRow key={i} label={`Banner Image ${i + 1}`} value={<MediaLink href={url} label="View" />} />
          ))}
          {vendor.processed_results?.merchandise && Object.keys(vendor.processed_results.merchandise).length > 0 && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase mt-3 mb-2">Merch Images</p>
              {Object.entries(vendor.processed_results.merchandise).map(([item, url]) => (
                <DetailRow key={item} label={item.charAt(0).toUpperCase() + item.slice(1)} value={<MediaLink href={url} label="View" />} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StoreDetail({ store }: { store: StoreEntry }) {
  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <p className="text-sm font-semibold text-gray-700 mb-3">
        {store.first_name} {store.last_name}{store.organization_name ? ` — ${store.organization_name}` : ''}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Contact</p>
          <DetailRow label="Phone" value={store.phone_number} />
          <DetailRow label="Role / Title" value={store.role} />
          <DetailRow label="Street" value={store.street_address} />
          <DetailRow label="City" value={store.city} />
          <DetailRow label="State" value={store.state} />
          <DetailRow label="Zip" value={store.zip_code} />
          <DetailRow label="Country" value={store.country} />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Organization</p>
          <DetailRow label="Type" value={store.organization_type} />
          <DetailRow label="Founded" value={store.since_year} />
          <DetailRow label="Slogan" value={store.slogan} />
          <DetailRow label="Impact" value={store.impact} />
          <DetailRow label="Description" value={store.description} />
          <DetailRow label="Tax Exempt" value={store.is_tax_exempt ? 'Yes' : 'No'} />
          <DetailRow label="Collects Donations" value={store.collect_donations ? 'Yes' : 'No'} />
          <DetailRow label="Donations Platform" value={store.donations_platform} />
        </div>
        <div className="mt-3">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Referral</p>
          <DetailRow label="Heard About Us" value={store.referred_by} />
          <DetailRow label="Social Media Platform" value={store.social_media_platform} />
          <DetailRow label="Referrer" value={store.referral_associate_name} />
        </div>
        <div className="mt-3">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Subscription & Media</p>
          <DetailRow label="Plan" value={store.current_subscription_type} />
          <DetailRow label="Amount" value={fmtAmount(store.subscription_amount, store.billing_cycle)} />
          <DetailRow label="Parishes" value={store.parish_count ?? undefined} />
          <DetailRow label="Logo (Processed)" value={store.logo_processed_url ? <MediaLink href={store.logo_processed_url} label="View" /> : null} />
          <DetailRow label="Logo (Raw)" value={store.logo_raw_url ? <MediaLink href={store.logo_raw_url} label="View" /> : null} />
          <DetailRow label="Banner (Processed)" value={store.banner_processed_url ? <MediaLink href={store.banner_processed_url} label="View" /> : null} />
          {store.banner_images?.map((url, i) => (
            <DetailRow key={i} label={`Banner Image ${i + 1}`} value={<MediaLink href={url} label="View" />} />
          ))}
          {store.processed_results?.merchandise && Object.keys(store.processed_results.merchandise).length > 0 && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase mt-3 mb-2">Merch Images</p>
              {Object.entries(store.processed_results.merchandise).map(([item, url]) => (
                <DetailRow key={item} label={item.charAt(0).toUpperCase() + item.slice(1)} value={<MediaLink href={url} label="View" />} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Vendors Table ────────────────────────────────────────────────────────────

function VendorsTable({ vendors, newIds, dismissedIds, onDismiss }: { vendors: VendorEntry[]; newIds: Set<number>; dismissedIds: Set<number>; onDismiss: (id: number) => void }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function toggleRow(id: number) {
    const isExpanding = expandedId !== id;
    setExpandedId(isExpanding ? id : null);
    if (isExpanding) onDismiss(id);
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
            <th className="px-3 py-2 text-center w-8"></th>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Phone</th>
            <th className="px-3 py-2 text-left">Business Name</th>
            <th className="px-3 py-2 text-left">Type</th>
            <th className="px-3 py-2 text-left">City</th>
            <th className="px-3 py-2 text-left">State</th>
            <th className="px-3 py-2 text-left">Plan</th>
            <th className="px-3 py-2 text-left">Billing</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Registered</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {vendors.map(v => (
            <React.Fragment key={v.vendor_id}>
              <tr
                className="hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => toggleRow(v.vendor_id)}
              >
                <td className="px-3 py-2 text-center">
                  {newIds.has(v.vendor_id) && !dismissedIds.has(v.vendor_id) && <NewDot />}
                </td>
                <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-800">
                  {v.first_name} {v.last_name}
                </td>
                <td className="px-3 py-2 text-gray-600">{v.email}</td>
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{v.phone || '—'}</td>
                <td className="px-3 py-2 text-gray-800">{v.business_name || '—'}</td>
                <td className="px-3 py-2 text-gray-600">{v.business_type || '—'}</td>
                <td className="px-3 py-2 text-gray-600">{v.business_city || '—'}</td>
                <td className="px-3 py-2 text-gray-600">{v.business_state || '—'}</td>
                <td className="px-3 py-2 text-gray-600">{v.current_subscription_type || '—'}</td>
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                  {fmtAmount(v.subscription_amount, v.billing_cycle)}
                </td>
                <td className="px-3 py-2">
                  <StatusBadge status={v.approval_status} />
                </td>
                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{fmtDate(v.created_at)}</td>
              </tr>
              {expandedId === v.vendor_id && (
                <tr>
                  <td colSpan={12} className="p-0">
                    <VendorDetail vendor={v} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {vendors.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-8">No vendors found.</p>
      )}
    </div>
  );
}

// ─── Stores Table ─────────────────────────────────────────────────────────────

function StoresTable({ stores, newIds, dismissedIds, onDismiss }: { stores: StoreEntry[]; newIds: Set<number>; dismissedIds: Set<number>; onDismiss: (id: number) => void }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function toggleRow(id: number) {
    const isExpanding = expandedId !== id;
    setExpandedId(isExpanding ? id : null);
    if (isExpanding) onDismiss(id);
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
            <th className="px-3 py-2 text-center w-8"></th>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Organization</th>
            <th className="px-3 py-2 text-left">Org Type</th>
            <th className="px-3 py-2 text-left">City</th>
            <th className="px-3 py-2 text-left">State</th>
            <th className="px-3 py-2 text-left">Plan</th>
            <th className="px-3 py-2 text-left">Billing</th>
            <th className="px-3 py-2 text-center">Parishes</th>
            <th className="px-3 py-2 text-center">Tax Exempt</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Registered</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {stores.map(s => (
            <React.Fragment key={s.admin_id}>
              <tr
                className="hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => toggleRow(s.admin_id)}
              >
                <td className="px-3 py-2 text-center">
                  {newIds.has(s.admin_id) && !dismissedIds.has(s.admin_id) && <NewDot />}
                </td>
                <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-800">
                  {s.first_name} {s.last_name}
                </td>
                <td className="px-3 py-2 text-gray-600">{s.email}</td>
                <td className="px-3 py-2 text-gray-800">{s.organization_name || '—'}</td>
                <td className="px-3 py-2 text-gray-600">{s.organization_type || '—'}</td>
                <td className="px-3 py-2 text-gray-600">{s.city || '—'}</td>
                <td className="px-3 py-2 text-gray-600">{s.state || '—'}</td>
                <td className="px-3 py-2 text-gray-600">{s.current_subscription_type || '—'}</td>
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                  {fmtAmount(s.subscription_amount, s.billing_cycle)}
                </td>
                <td className="px-3 py-2 text-center text-gray-600">{s.parish_count ?? '—'}</td>
                <td className="px-3 py-2 text-center text-gray-600">
                  {s.is_tax_exempt ? '✓' : '—'}
                </td>
                <td className="px-3 py-2">
                  <StatusBadge status={s.approval_status} />
                </td>
                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{fmtDate(s.created_at)}</td>
              </tr>
              {expandedId === s.admin_id && (
                <tr>
                  <td colSpan={13} className="p-0">
                    <StoreDetail store={s} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {stores.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-8">No stores found.</p>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = 'vendors' | 'stores';

export default function AdminDashboard() {
  const { token, adminInfo, logout } = useAdmin();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('vendors');
  const [vendors, setVendors] = useState<VendorEntry[]>([]);
  const [stores, setStores] = useState<StoreEntry[]>([]);
  const [newVendorIds, setNewVendorIds] = useState<Set<number>>(new Set());
  const [newStoreIds, setNewStoreIds] = useState<Set<number>>(new Set());
  const [dismissedVendorIds, setDismissedVendorIds] = useState<Set<number>>(() => {
    try {
      const stored = sessionStorage.getItem('dismissedVendorIds');
      return stored ? new Set<number>(JSON.parse(stored)) : new Set<number>();
    } catch { return new Set<number>(); }
  });
  const [dismissedStoreIds, setDismissedStoreIds] = useState<Set<number>>(() => {
    try {
      const stored = sessionStorage.getItem('dismissedStoreIds');
      return stored ? new Set<number>(JSON.parse(stored)) : new Set<number>();
    } catch { return new Set<number>(); }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTab = async (tab: Tab): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/dashboard/${tab}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        logout();
        navigate('/admin/login');
        return false;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch data');

      if (tab === 'vendors') {
        setVendors(data.data);
        setNewVendorIds(prev => {
          const next = new Set(prev);
          data.data.forEach((v: VendorEntry) => { if (v.is_new) next.add(v.vendor_id); });
          return next;
        });
      } else {
        setStores(data.data);
        setNewStoreIds(prev => {
          const next = new Set(prev);
          data.data.forEach((s: StoreEntry) => { if (s.is_new) next.add(s.admin_id); });
          return next;
        });
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    await Promise.all([fetchTab('vendors'), fetchTab('stores')]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const newVendorCount = [...newVendorIds].filter(id => !dismissedVendorIds.has(id)).length;
  const newStoreCount = [...newStoreIds].filter(id => !dismissedStoreIds.has(id)).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">ParishMart Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            {adminInfo?.firstName} {adminInfo?.lastName}
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
              {adminInfo?.role}
            </span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-red-600 border border-gray-300 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex gap-1">
          {(['vendors', 'stores'] as Tab[]).map(tab => {
            const count = tab === 'vendors' ? newVendorCount : newStoreCount;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                  isActive
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {count > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <main className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-gray-500">
              {activeTab === 'vendors' ? `${vendors.length} vendors` : `${stores.length} stores`}
              {activeTab === 'vendors' && newVendorCount > 0 && (
                <span className="ml-2 text-blue-600 font-medium">• {newVendorCount} new</span>
              )}
              {activeTab === 'stores' && newStoreCount > 0 && (
                <span className="ml-2 text-blue-600 font-medium">• {newStoreCount} new</span>
              )}
            </p>
            <button
              onClick={() => fetchAll()}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>

          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 border-b border-red-100">{error}</div>
          )}

          {loading && vendors.length === 0 && stores.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">Loading…</div>
          ) : activeTab === 'vendors' ? (
            <VendorsTable vendors={vendors} newIds={newVendorIds} dismissedIds={dismissedVendorIds} onDismiss={id => setDismissedVendorIds(prev => {
              const next = new Set(prev).add(id);
              sessionStorage.setItem('dismissedVendorIds', JSON.stringify([...next]));
              return next;
            })} />
          ) : (
            <StoresTable stores={stores} newIds={newStoreIds} dismissedIds={dismissedStoreIds} onDismiss={id => setDismissedStoreIds(prev => {
              const next = new Set(prev).add(id);
              sessionStorage.setItem('dismissedStoreIds', JSON.stringify([...next]));
              return next;
            })} />
          )}
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Click any row to expand full onboarding details. Blue dot = registered since your last visit.
        </p>
      </main>
    </div>
  );
}
