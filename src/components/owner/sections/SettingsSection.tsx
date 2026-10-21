import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building,
  User,
  Mail,
  MapPin,
  Phone,
  Truck,
  CheckCircle,
  AlertCircle,
  Save,
  Shield,
  Sparkles,
} from 'lucide-react';
import { StoreSettings } from '../../../types';

interface SettingsSectionProps {
  settings: StoreSettings;
  onUpdateSettings: (updates: Partial<StoreSettings>) => Promise<void>;
  onRefresh: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  settings,
  onUpdateSettings,
  onRefresh,
}) => {
  const [companyName, setCompanyName] = useState(settings.companyName || 'Lumina Soaps');
  const [tagline, setTagline] = useState(settings.tagline || 'Nature in Every Lather.');
  const [ownerName, setOwnerName] = useState(settings.ownerName || 'R. Niranjana');
  const [email, setEmail] = useState(settings.email || 'niranjana@luminasoaps.com');
  const [phone, setPhone] = useState(settings.phone || '+91 98765 43210');
  const [studioAddress, setStudioAddress] = useState(settings.studioAddress || 'Lumina Soaps Studio, Coimbatore, Tamil Nadu, India');
  const [businessHours, setBusinessHours] = useState(settings.businessHours || 'Mon – Sat: 9:00 AM – 6:00 PM IST');
  const [standardShippingFee, setStandardShippingFee] = useState<number>(settings.standardShippingFee || 70);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(settings.freeShippingThreshold || 999);
  const [codAvailable, setCodAvailable] = useState<boolean>(settings.codAvailable !== false);
  const [aboutText, setAboutText] = useState(settings.aboutText || '');
  const [shippingPolicy, setShippingPolicy] = useState(settings.shippingPolicy || '');

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync state if settings prop changes
  useEffect(() => {
    setCompanyName(settings.companyName || 'Lumina Soaps');
    setTagline(settings.tagline || 'Nature in Every Lather.');
    setOwnerName(settings.ownerName || 'R. Niranjana');
    setEmail(settings.email || 'niranjana@luminasoaps.com');
    setPhone(settings.phone || '+91 98765 43210');
    setStudioAddress(settings.studioAddress || 'Lumina Soaps Studio, Coimbatore, Tamil Nadu, India');
    setBusinessHours(settings.businessHours || 'Mon – Sat: 9:00 AM – 6:00 PM IST');
    setStandardShippingFee(settings.standardShippingFee || 70);
    setFreeShippingThreshold(settings.freeShippingThreshold || 999);
    setCodAvailable(settings.codAvailable !== false);
    setAboutText(settings.aboutText || '');
    setShippingPolicy(settings.shippingPolicy || '');
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await onUpdateSettings({
        companyName: companyName.trim(),
        tagline: tagline.trim(),
        ownerName: ownerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        studioAddress: studioAddress.trim(),
        businessHours: businessHours.trim(),
        standardShippingFee: Number(standardShippingFee),
        freeShippingThreshold: Number(freeShippingThreshold),
        codAvailable,
        aboutText: aboutText.trim(),
        shippingPolicy: shippingPolicy.trim(),
      });
      setMessage({ type: 'success', text: 'Store settings saved successfully and live on storefront!' });
      onRefresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Store &amp; Maker Settings
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Configure sole proprietorship business identity, contact email, workshop studio address, and shipping fees.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : 'bg-rose-50 text-rose-900 border border-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Business Identity */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Building className="w-4 h-4 text-[#244635]" />
            <h3 className="font-bold text-sm text-stone-900">Company &amp; Brand Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Company / Store Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#244635]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Brand Tagline *</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#244635]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Owner / Maker Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full pl-9 pr-3 p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#244635]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Contact Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#244635]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 p-2.5 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Studio Business Hours</label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Studio Workshop Address *</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                required
                value={studioAddress}
                onChange={(e) => setStudioAddress(e.target.value)}
                className="w-full pl-9 pr-3 p-2.5 border border-stone-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Shipping & Checkout Rules */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Truck className="w-4 h-4 text-[#244635]" />
            <h3 className="font-bold text-sm text-stone-900">Shipping &amp; Fulfilment Settings</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Standard Shipping Charge (₹ INR)
              </label>
              <input
                type="number"
                min={0}
                value={standardShippingFee}
                onChange={(e) => setStandardShippingFee(Number(e.target.value))}
                className="w-full p-2.5 border border-stone-300 rounded-xl font-bold"
              />
              <p className="text-[10px] text-stone-400 mt-1">Default express delivery fee across India</p>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Free Delivery Order Threshold (₹ INR)
              </label>
              <input
                type="number"
                min={0}
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full p-2.5 border border-stone-300 rounded-xl font-bold"
              />
              <p className="text-[10px] text-stone-400 mt-1">Orders above this amount qualify for free shipping</p>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={codAvailable}
                onChange={(e) => setCodAvailable(e.target.checked)}
                className="rounded text-[#244635] focus:ring-[#244635] w-4 h-4"
              />
              <div>
                <span className="font-semibold text-stone-900 block">Cash on Delivery (COD) Available</span>
                <span className="text-[11px] text-stone-500">
                  Allow customers in India to pay upon package receipt
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 3: Brand Story & Shipping Policy */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Sparkles className="w-4 h-4 text-[#244635]" />
            <h3 className="font-bold text-sm text-stone-900">About &amp; Public Policy Disclosures</h3>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Brand Story / About the Maker</label>
            <textarea
              rows={3}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full p-2.5 border border-stone-300 rounded-xl"
              placeholder="About R. Niranjana and the artisan cold-process soapmaking philosophy..."
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Shipping &amp; Delivery Policy</label>
            <textarea
              rows={2}
              value={shippingPolicy}
              onChange={(e) => setShippingPolicy(e.target.value)}
              className="w-full p-2.5 border border-stone-300 rounded-xl"
              placeholder="Delivery dispatch timeline and carrier information..."
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#244635] hover:bg-[#1b3427] text-white px-6 py-2.5 rounded-xl font-semibold shadow-xs transition-colors text-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
