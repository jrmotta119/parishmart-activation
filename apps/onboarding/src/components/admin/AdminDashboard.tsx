import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import { apiUrl } from '@/lib/api';

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
  current_subscription_end_date: string | null;
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
  current_subscription_end_date: string | null;
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
  processed_results: { merchandise?: Record<string, string>; parish_cards?: string[] } | null;
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

function freeTrialStatus(endDate: string | null): { expiryDate: string; daysLeft: number } {
  if (!endDate) return { expiryDate: '—', daysLeft: 0 };
  const expiry = new Date(endDate);
  const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return { expiryDate: fmtDate(expiry.toISOString()), daysLeft };
}

function FreeTrialBadge({ endDate }: { endDate: string | null }) {
  if (!endDate) return null;
  const { expiryDate, daysLeft } = freeTrialStatus(endDate);
  const color =
    daysLeft <= 0  ? 'bg-red-100 text-red-700' :
    daysLeft <= 7  ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-600';
  const label =
    daysLeft <= 0  ? `Expired ${fmtDate(new Date(Date.now() - daysLeft * -86400000).toISOString())}` :
    daysLeft === 1 ? 'Expires tomorrow' :
                    `Expires ${expiryDate}`;
  return (
    <span className={`ml-1 inline-block text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${color}`}>
      {label}
    </span>
  );
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

function MediaThumb({ url, label }: { url: string; label: string }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-1">
      <div className="w-full aspect-square rounded overflow-hidden border border-gray-200 bg-gray-100">
        <img
          src={url}
          alt={label}
          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <span className="text-xs text-gray-500 text-center leading-tight truncate w-full">{label}</span>
    </a>
  );
}

function MediaSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-bold text-gray-400 uppercase mb-2">{title}</p>
      {children}
    </div>
  );
}

function VendorDetail({ vendor }: { vendor: VendorEntry }) {
  const merchEntries = vendor.processed_results?.merchandise
    ? Object.entries(vendor.processed_results.merchandise)
    : [];

  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <p className="text-sm font-semibold text-gray-700 mb-3">
        {vendor.first_name} {vendor.last_name}{vendor.business_name ? ` — ${vendor.business_name}` : ''}
      </p>

      {/* Text fields — 2-col grid */}
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
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Subscription</p>
          <DetailRow label="Plan" value={vendor.current_subscription_type} />
          <DetailRow label="Amount" value={fmtAmount(vendor.subscription_amount, vendor.billing_cycle)} />
          {vendor.current_subscription_type === 'free' && vendor.current_subscription_end_date && (() => {
            const { expiryDate, daysLeft } = freeTrialStatus(vendor.current_subscription_end_date);
            const color = daysLeft <= 0 ? 'text-red-600' : daysLeft <= 7 ? 'text-orange-600' : 'text-gray-700';
            return (
              <DetailRow
                label="Trial Expires"
                value={<span className={`font-medium ${color}`}>{expiryDate}{daysLeft <= 0 ? ' (expired)' : daysLeft === 1 ? ' (tomorrow)' : ` (${daysLeft} days)`}</span>}
              />
            );
          })()}
        </div>
      </div>

      {/* Media — full width below */}
      <div className="mt-5 border-t border-gray-200 pt-4">
        <p className="text-xs font-bold text-gray-400 uppercase mb-3">Media</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {vendor.logo_processed_url && (
            <MediaThumb url={vendor.logo_processed_url} label="Logo (Processed)" />
          )}
          {vendor.logo_raw_url && (
            <MediaThumb url={vendor.logo_raw_url} label="Logo (Raw)" />
          )}
          {vendor.banner_processed_url && (
            <MediaThumb url={vendor.banner_processed_url} label="Banner (Processed)" />
          )}
          {vendor.banner_images?.map((url, i) => (
            <MediaThumb key={i} url={url} label={`Banner Source ${i + 1}`} />
          ))}
        </div>

        {merchEntries.length > 0 && (
          <MediaSection title="Merch Images">
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
              {merchEntries.map(([item, url]) => (
                <MediaThumb key={item} url={url} label={item.replace(/_/g, ' ')} />
              ))}
            </div>
          </MediaSection>
        )}
      </div>
    </div>
  );
}

function StoreDetail({ store }: { store: StoreEntry }) {
  const merchEntries = store.processed_results?.merchandise
    ? Object.entries(store.processed_results.merchandise)
    : [];
  const parishCards = store.processed_results?.parish_cards ?? [];

  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <p className="text-sm font-semibold text-gray-700 mb-3">
        {store.first_name} {store.last_name}{store.organization_name ? ` — ${store.organization_name}` : ''}
      </p>

      {/* Text fields — 2-col grid */}
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
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Subscription</p>
          <DetailRow label="Plan" value={store.current_subscription_type} />
          <DetailRow label="Amount" value={fmtAmount(store.subscription_amount, store.billing_cycle)} />
          <DetailRow label="Parishes" value={store.parish_count ?? undefined} />
          {store.current_subscription_type === 'free' && store.current_subscription_end_date && (() => {
            const { expiryDate, daysLeft } = freeTrialStatus(store.current_subscription_end_date);
            const color = daysLeft <= 0 ? 'text-red-600' : daysLeft <= 7 ? 'text-orange-600' : 'text-gray-700';
            return (
              <DetailRow
                label="Trial Expires"
                value={<span className={`font-medium ${color}`}>{expiryDate}{daysLeft <= 0 ? ' (expired)' : daysLeft === 1 ? ' (tomorrow)' : ` (${daysLeft} days)`}</span>}
              />
            );
          })()}
        </div>
      </div>

      {/* Media — full width below */}
      <div className="mt-5 border-t border-gray-200 pt-4">
        <p className="text-xs font-bold text-gray-400 uppercase mb-3">Media</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {store.logo_processed_url && (
            <MediaThumb url={store.logo_processed_url} label="Logo (Processed)" />
          )}
          {store.logo_raw_url && (
            <MediaThumb url={store.logo_raw_url} label="Logo (Raw)" />
          )}
          {store.banner_processed_url && (
            <MediaThumb url={store.banner_processed_url} label="Banner (Processed)" />
          )}
          {store.banner_images?.map((url, i) => (
            <MediaThumb key={i} url={url} label={`Banner Source ${i + 1}`} />
          ))}
        </div>

        {parishCards.length > 0 && (
          <MediaSection title="Parish Donation Cards">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {parishCards.map((url, i) => (
                <MediaThumb key={i} url={url} label={`Card ${i + 1}`} />
              ))}
            </div>
          </MediaSection>
        )}

        {merchEntries.length > 0 && (
          <MediaSection title="Merch Images">
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
              {merchEntries.map(([item, url]) => (
                <MediaThumb key={item} url={url} label={item.replace(/_/g, ' ')} />
              ))}
            </div>
          </MediaSection>
        )}
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
                <td className="px-3 py-2 text-gray-600">
                  <span>{v.current_subscription_type || '—'}</span>
                  {v.current_subscription_type === 'free' && <FreeTrialBadge endDate={v.current_subscription_end_date} />}
                </td>
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
                <td className="px-3 py-2 text-gray-600">
                  <span>{s.current_subscription_type || '—'}</span>
                  {s.current_subscription_type === 'free' && <FreeTrialBadge endDate={s.current_subscription_end_date} />}
                </td>
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

// ─── Admins Panel ─────────────────────────────────────────────────────────────

interface AdminAccount {
  super_admin_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  created_by_name: string | null;
}

function AdminsPanel({ token }: { token: string }) {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formError, setFormError] = useState('');

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl('/api/auth/admin/list'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load admins');
      setAdmins(data.admins);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAdmins(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');
    if (form.password.length < 12) {
      setFormError('Password must be at least 12 characters.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl('/api/auth/admin/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create admin');
      setSuccessMsg(`Account created for ${data.admin.email}`);
      setForm({ email: '', firstName: '', lastName: '', password: '' });
      loadAdmins();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing admins */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Admin Accounts</h2>
        </div>
        {loading ? (
          <div className="py-8 text-center text-sm text-gray-400">Loading…</div>
        ) : error ? (
          <div className="p-4 text-sm text-red-600">{error}</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Last Login</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Created By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map(a => (
                <tr key={a.super_admin_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-800">{a.first_name} {a.last_name}</td>
                  <td className="px-4 py-2 text-gray-600">{a.email}</td>
                  <td className="px-4 py-2 capitalize text-gray-600">{a.role.replace('_', ' ')}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {a.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-500">{a.last_login ? new Date(a.last_login).toLocaleString() : '—'}</td>
                  <td className="px-4 py-2 text-gray-500">{new Date(a.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-gray-500">{a.created_by_name ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create new admin */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Add New Admin</h2>
        </div>
        <form onSubmit={handleCreate} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password <span className="text-gray-400 font-normal">(min. 12 characters)</span></label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {form.password.length > 0 && (
              <p className={`text-xs mt-1 ${form.password.length >= 12 ? 'text-green-600' : 'text-red-500'}`}>
                {form.password.length}/12 characters
              </p>
            )}
          </div>
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {submitting ? 'Creating…' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = 'vendors' | 'stores' | 'team';

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
      const res = await fetch(apiUrl(`/api/admin/dashboard/${tab}`), {
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
          {(['vendors', 'stores', 'team'] as Tab[]).map(tab => {
            const count = tab === 'vendors' ? newVendorCount : tab === 'stores' ? newStoreCount : 0;
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
        {activeTab === 'team' ? (
          <AdminsPanel token={token || ''} />
        ) : (
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
        )}

        {activeTab !== 'team' && (
          <p className="mt-4 text-xs text-gray-400 text-center">
            Click any row to expand full onboarding details. Blue dot = registered since your last visit.
          </p>
        )}
      </main>
    </div>
  );
}
