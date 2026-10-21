import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sparkles,
  Save,
  Check,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  ExternalLink,
  RotateCcw,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { HomepageConfig } from '../../../types';
import { cmsApi } from '../ownerApi';

export const HomepageBuilder: React.FC = () => {
  const { homepageConfig: storeConfig, refreshCMSData, showNotification, setCurrentView } = useStore();
  const [config, setConfig] = useState<HomepageConfig | null>(storeConfig || null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const formatConfig = (cfg: any): HomepageConfig => ({
    ...cfg,
    hero: {
      title: cfg.heroHeadline || cfg.hero?.title || 'Cold Process Artisan Soaps',
      subtitle: cfg.heroSubtitle || cfg.hero?.subtitle || '',
      ctaText: cfg.heroCtaText || cfg.hero?.ctaText || 'Shop Collection',
      ctaLink: cfg.heroCtaLink || cfg.hero?.ctaLink || '/shop',
      backgroundImage: cfg.heroImageUrl || cfg.hero?.backgroundImage || '',
      ...cfg.hero,
    },
    announcementBar: {
      enabled: cfg.announcementActive ?? cfg.announcementBar?.enabled ?? true,
      text: cfg.announcementText || cfg.announcementBar?.text || '',
      link: cfg.announcementLink || cfg.announcementBar?.link || '',
      ...cfg.announcementBar,
    },
  });

  const loadConfig = async () => {
    try {
      setLoading(true);
      const res = await cmsApi.getHomepageConfig();
      const cfg = (res as any)?.data || res;
      if (cfg) {
        setConfig(formatConfig(cfg));
      }
    } catch (err) {
      console.error('Failed to load homepage config', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeConfig) {
      setConfig(formatConfig(storeConfig));
    } else {
      loadConfig();
    }
  }, [storeConfig]);

  const handleSave = async (publish: boolean = true) => {
    if (!config) return;
    setSaving(true);
    try {
      const toSave: HomepageConfig = {
        ...config,
        heroHeadline: config.hero?.title || config.heroHeadline,
        heroSubtitle: config.hero?.subtitle || config.heroSubtitle,
        heroImageUrl: config.hero?.backgroundImage || config.heroImageUrl,
        heroCtaText: config.hero?.ctaText || config.heroCtaText,
        heroCtaLink: config.hero?.ctaLink || config.heroCtaLink,
        announcementActive: config.announcementBar?.enabled ?? config.announcementActive,
        announcementText: config.announcementBar?.text || config.announcementText,
        announcementLink: config.announcementBar?.link || config.announcementLink,
      };
      await cmsApi.updateHomepageConfig(toSave);
      await refreshCMSData();
      showNotification(
        publish ? 'Homepage changes published live!' : 'Homepage draft saved.',
        'success'
      );
    } catch (err: any) {
      showNotification(err.message || 'Failed to save homepage settings', 'alert');
    } finally {
      setSaving(false);
    }
  };

  if (!config) {
    return <div className="p-8 text-center text-xs text-stone-500">Loading Homepage Builder...</div>;
  }

  const hero = config.hero || {
    title: config.heroHeadline,
    subtitle: config.heroSubtitle,
    ctaText: config.heroCtaText,
    ctaLink: config.heroCtaLink,
    backgroundImage: config.heroImageUrl,
  };

  const annBar = config.announcementBar || {
    enabled: config.announcementActive,
    text: config.announcementText,
    link: config.announcementLink,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              CMS • Visual Layout
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Homepage Builder</h1>
          <p className="text-xs text-stone-500">
            Customize hero headline, seasonal banners, brand pillars, and featured sections without touching code.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{previewMode ? 'Exit Preview' : 'Interactive Preview'}</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Publish to Storefront'}</span>
          </button>
        </div>
      </div>

      {/* Main Section Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Hero Banner */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#244635]" />
                <h3 className="font-serif font-bold text-stone-900 text-sm">Hero Banner & Call to Action</h3>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Live Storefront
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Hero Heading *</label>
                <input
                  type="text"
                  value={hero.title || ''}
                  onChange={(e) =>
                    setConfig({ ...config, hero: { ...hero, title: e.target.value } })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Hero Subtitle / Story Excerpt</label>
                <textarea
                  rows={2}
                  value={hero.subtitle || ''}
                  onChange={(e) =>
                    setConfig({ ...config, hero: { ...hero, subtitle: e.target.value } })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={hero.ctaText || ''}
                    onChange={(e) =>
                      setConfig({ ...config, hero: { ...hero, ctaText: e.target.value } })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Button Destination URL</label>
                  <input
                    type="text"
                    value={hero.ctaLink || ''}
                    onChange={(e) =>
                      setConfig({ ...config, hero: { ...hero, ctaLink: e.target.value } })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Hero Background Image URL</label>
                  <input
                    type="url"
                    value={hero.backgroundImage || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero: { ...hero, backgroundImage: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Top Announcement Bar */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-sm">Announcement Topbar</h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="annBarEnable"
                  checked={Boolean(annBar.enabled)}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      announcementBar: { ...annBar, enabled: e.target.checked },
                    })
                  }
                  className="rounded text-[#244635] focus:ring-[#244635]"
                />
                <label htmlFor="annBarEnable" className="text-xs font-semibold text-stone-700">
                  Enable Bar
                </label>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Announcement Text</label>
                <input
                  type="text"
                  value={annBar.text || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      announcementBar: { ...annBar, text: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Optional Click URL</label>
                <input
                  type="text"
                  value={annBar.link || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      announcementBar: { ...annBar, link: e.target.value },
                    })
                  }
                  placeholder="/shop or coupon code"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Artisan Brand Pillars */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-sm">Artisan Brand Pillars</h3>
              <span className="text-xs text-stone-400">Displayed on homepage trust badge strip</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {config.brandPillars.map((pillar, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-2">
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <span>Pillar #{idx + 1}</span>
                    <span className="text-[10px] text-stone-400 uppercase font-mono">{pillar.icon}</span>
                  </div>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => {
                      const newPillars = [...config.brandPillars];
                      newPillars[idx] = { ...newPillars[idx], title: e.target.value };
                      setConfig({ ...config, brandPillars: newPillars });
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg font-semibold text-stone-800"
                  />
                  <input
                    type="text"
                    value={pillar.description}
                    onChange={(e) => {
                      const newPillars = [...config.brandPillars];
                      newPillars[idx] = { ...newPillars[idx], description: e.target.value };
                      setConfig({ ...config, brandPillars: newPillars });
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-600 text-[11px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile Preview Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs sticky top-20">
            <h3 className="font-serif font-bold text-stone-900 text-sm pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Homepage Visual Preview</span>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-mono">
                Storefront Simulation
              </span>
            </h3>

            {/* Announcement Bar Preview */}
            {annBar.enabled && (
              <div className="mt-4 bg-[#244635] text-[#F4F0E5] text-[10px] py-1 px-3 text-center rounded-lg font-medium">
                {annBar.text}
              </div>
            )}

            {/* Hero Simulation Card */}
            <div className="mt-3 relative rounded-2xl overflow-hidden border border-stone-200 h-64 bg-stone-900 text-white flex flex-col justify-end p-4">
              <img
                src={hero.backgroundImage || config.heroImageUrl}
                alt="Hero"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="relative z-10 space-y-2">
                <span className="text-[9px] bg-[#D9B98B] text-[#244635] font-bold px-2 py-0.5 rounded-full uppercase">
                  Lumina Homemade Soaps
                </span>
                <h4 className="font-serif font-bold text-base leading-tight text-[#F4F0E5]">
                  {hero.title || config.heroHeadline}
                </h4>
                <p className="text-[10px] text-stone-200 line-clamp-2">{hero.subtitle || config.heroSubtitle}</p>
                <div className="pt-1">
                  <span className="inline-block px-3 py-1 bg-[#244635] text-[#F4F0E5] text-[10px] font-bold rounded-lg shadow">
                    {hero.ctaText || config.heroCtaText} &rarr;
                  </span>
                </div>
              </div>
            </div>

            {/* Brand Pillars Simulation */}
            <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Active Brand Pillars
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {config.brandPillars.slice(0, 4).map((p, i) => (
                  <div key={i} className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                    <div className="font-bold text-stone-800 truncate">{p.title}</div>
                    <div className="text-[9px] text-stone-500 truncate">{p.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100">
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="w-full py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>{saving ? 'Publishing...' : 'Publish to Storefront'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
