import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/useStore';
import { EAST_AFRICA_REGIONS } from '../constants/regions';
import { authApi } from '../services/api';
import { FARMER_PROFILE_SECTIONS, formatFpAnswer, type FPQuestion } from '../data/farmerProfile';
import type { FarmerProfile } from '../types';
import {
  Save,
  Check,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Layers,
  Droplets,
  Users,
  Sun,
  ArrowRight,
  UserCircle2,
  Pencil,
  Leaf,
  Camera,
} from 'lucide-react';

/** Resize + compress an image file to a small JPEG data URL for storage. */
const compressImageToDataUrl = (
  file: File,
  maxSize = 512,
  quality = 0.72
): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read_error'));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('no_canvas'));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('img_error'));
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

export const ProfilePage: React.FC = () => {
  const { user, setUser, token, showNotification, assessment, setScreen } = useAppStore();

  const latest = assessment.latestResult;
  const farmScore = latest?.ffmi_score ?? user.ffmi_score ?? 13.8;
  const stage = latest?.tier ?? user.tier ?? 3;
  const stageName = latest?.tier_classification ?? user.tier_name ?? 'Structured Farm';

  const [formData, setFormData] = useState({
    name: user.name || 'Joseph Ochieng',
    phone: user.phone || '+254712345678',
    email: user.email || 'joseph@example.com',
    farm_name: user.farm_name || 'Green Valley Demonstration Farm',
    farm_region: user.farm_region || 'Western Kenya',
    farm_size_acres: user.farm_size_acres || 5.0,
    farm_crop_type: user.farm_crop_type || 'Maize, Dairy & Vegetables',
    farm_reg_number: user.farm_reg_number || 'REG-2023-8849',
    year_established: user.year_established || '2018',
    farm_description:
      user.farm_description ||
      'Green Valley is a family farm focused on healthy soil, drip irrigation, and clean energy to grow better crops and cope with changing weather.',
    soil_type: user.soil_type || 'Clay Loam',
    water_source: user.water_source || 'Solar Borehole & Rainwater',
    workforce_count: user.workforce_count || 12,
    energy_source: user.energy_source || 'Solar Panel & Biogas',
    is_verified: user.is_verified ?? true,
    farm_image: user.farm_image || '',
  });

  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const farmImage = user.farm_image || formData.farm_image;

  // Load the latest profile (including the farm photo) from the backend on mount.
  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const p = await authApi.getProfile();
        if (!active) return;
        setUser({ ...user, ...p });
        setFormData((f) => ({
          ...f,
          name: p.name ?? f.name,
          phone: p.phone ?? f.phone,
          email: p.email ?? f.email,
          farm_name: p.farm_name ?? f.farm_name,
          farm_region: p.farm_region ?? f.farm_region,
          farm_size_acres: p.farm_size_acres ?? f.farm_size_acres,
          farm_crop_type: p.farm_crop_type ?? f.farm_crop_type,
          farm_image: p.farm_image || f.farm_image,
        }));
      } catch {
        /* keep locally cached data */
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file, 512, 0.72);
      setFormData((f) => ({ ...f, farm_image: dataUrl }));
      if (token) {
        const updated = await authApi.updateProfile({ ...formData, farm_image: dataUrl });
        setUser(updated);
      } else {
        setUser({ ...formData, farm_image: dataUrl });
      }
      showNotification('Farm photo updated.', 'success');
    } catch {
      showNotification('Could not upload the image. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);

    if (token) {
      try {
        const updated = await authApi.updateProfile(formData);
        setUser({ ...formData, ...updated });
        showNotification('Your farm details have been saved.', 'success');
      } catch (err: any) {
        showNotification(err.message || 'Saved on this device (offline mode).', 'info');
      }
    } else {
      showNotification('Saved on this device (Demo Mode).', 'info');
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const scorePercent = Math.min(100, Math.round((farmScore / 24) * 100));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ─── 1. Header & Breadcrumb ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-4 h-4 text-[#009924]" />
            <span>My Farm</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Your Farm Details
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Update your farm information and see how your farm is doing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('screen-dashboard')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-xs transition-all"
          >
            <span>Back to Home</span>
          </button>
          <button
            onClick={() => setScreen('screen-assessment-choice')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs shadow-md shadow-[#009924]/20 transition-all hover:scale-105"
          >
            <span>Start a New Check</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── 2. Farm Summary + Score ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Farm Summary Card (Spans 8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
          <div className="w-full md:w-5/12 h-52 md:h-auto rounded-2xl overflow-hidden relative flex-shrink-0 shadow-inner bg-gradient-to-br from-[#023c3f] via-[#045D61] to-[#012527] flex items-center justify-center">
            {farmImage ? (
              <img
                src={farmImage}
                alt={formData.farm_name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Leaf className="w-16 h-16 text-[#009924]/70" />
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 hover:bg-black/65 text-white text-[11px] font-bold backdrop-blur-md transition-all disabled:opacity-60"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading…' : farmImage ? 'Change' : 'Add Photo'}</span>
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#009924] backdrop-blur-md inline-block mb-1">
                Family Farm
              </span>
              <p className="text-xs font-semibold text-white/90 truncate">
                {formData.farm_reg_number}
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#045D61]">
                    {formData.farm_name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#009924]" />
                    <span>{formData.farm_region}, Kenya</span>
                  </p>
                </div>

                {formData.is_verified && (
                  <span className="bg-[#009924]/10 text-[#009924] border border-[#009924]/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Farm</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {formData.farm_description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Farm Size
                </span>
                <p className="text-base font-bold text-slate-900">
                  {formData.farm_size_acres}{' '}
                  <span className="text-xs font-normal text-slate-500">Acres</span>
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Main Crops
                </span>
                <p className="text-xs font-bold text-[#045D61] truncate mt-0.5" title={formData.farm_crop_type}>
                  {formData.farm_crop_type}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Farm Score Card (Spans 4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#023c3f] via-[#045D61] to-[#012527] text-white rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-xl border border-[#045D61]/40">
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <TrendingUp className="w-48 h-48 text-[#FFD700]" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFD700]">
                Farm Score
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold border border-white/15">
                Future Farms
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl sm:text-5xl font-extrabold text-white">
                {farmScore.toFixed(1)}
              </span>
              <span className="text-sm text-white/70">/ 24.00</span>
            </div>

            <div className="mt-3">
              <span className="px-3 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/35 text-xs font-extrabold inline-flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Stage {stage}: {stageName}</span>
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
            <div className="flex justify-between text-xs text-white/80 font-medium">
              <span>Progress to Next Stage</span>
              <span className="text-[#FFD700] font-bold">{scorePercent}%</span>
            </div>
            <div className="w-full bg-white/15 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#009924] to-[#FFD700] h-2 rounded-full transition-all duration-700"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
            <p className="text-[11px] text-white/70 text-right">
              Doing well compared to other farms in {formData.farm_region}
            </p>
          </div>
        </div>
      </div>

      {/* ─── 3. Farm Facts Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#045D61]/15 space-y-2">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Soil Type</span>
            <p className="text-sm font-bold text-slate-900">{formData.soil_type}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#045D61]/15 space-y-2">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-[#1E88E5]/10 text-[#1E88E5] flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Water Source</span>
            <p className="text-sm font-bold text-slate-900 truncate" title={formData.water_source}>
              {formData.water_source}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#045D61]/15 space-y-2">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-[#3949AB]/10 text-[#3949AB] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Workers</span>
            <p className="text-sm font-bold text-slate-900">
              {formData.workforce_count} People
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#045D61]/15 space-y-2">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-[#FDD835]/20 text-[#B78103] flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Power Source</span>
            <p className="text-sm font-bold text-slate-900 truncate" title={formData.energy_source}>
              {formData.energy_source}
            </p>
          </div>
        </div>
      </div>

      {/* ─── 3b. Farmer Profile (from onboarding) ──────────────────────── */}
      {user.farmer_profile && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#045D61] flex items-center gap-2">
                <UserCircle2 className="w-5 h-5 text-[#009924]" />
                Farmer Profile
              </h3>
              <p className="text-xs text-slate-500">
                About you and how you work — captured during onboarding and used to tailor your plan.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setScreen('screen-onboarding')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {FARMER_PROFILE_SECTIONS.map((section) => (
            <div
              key={section.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-[#045D61]/15 shadow-sm space-y-4"
            >
              <div>
                <h4 className="text-sm font-bold text-[#004447]">{section.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{section.subtitle}</p>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {section.questions.map((q) => {
                  const display = formatFpAnswer(q, user.farmer_profile);
                  return (
                    <div key={q.id} className="space-y-1">
                      <dt className="text-[11px] font-semibold text-slate-500 leading-snug">
                        <span className="text-[#009924] font-bold mr-1">{q.no}.</span>
                        {q.text}
                      </dt>
                      <dd className="text-xs font-semibold text-slate-900 leading-relaxed">
                        {display ? display : <span className="text-slate-300 font-medium">Not answered</span>}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>
      )}

      {/* ─── 4. Edit Farm Form ─────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl bg-white border border-[#045D61]/15 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#045D61]">
              Edit Your Farm Details
            </h3>
            <p className="text-xs text-slate-500">
              Update your farm's basic information and contact details.
            </p>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {saved ? <><Check className="w-4 h-4" /><span>Saved!</span></> : <><Save className="w-4 h-4" /><span>Save</span></>}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Farm Name
            </label>
            <input
              type="text"
              value={formData.farm_name}
              onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Registration No. (optional)
            </label>
            <input
              type="text"
              value={formData.farm_reg_number}
              onChange={(e) => setFormData({ ...formData, farm_reg_number: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none bg-slate-50 text-slate-700 font-mono font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Crops &amp; Animals You Raise
            </label>
            <input
              type="text"
              value={formData.farm_crop_type}
              onChange={(e) => setFormData({ ...formData, farm_crop_type: e.target.value })}
              placeholder="e.g. Maize, Dairy, Vegetables"
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Your Region
            </label>
            <input
              type="text"
              list="ea-regions-profile"
              value={formData.farm_region}
              onChange={(e) => setFormData({ ...formData, farm_region: e.target.value })}
              placeholder="e.g. Western Kenya, Kampala Uganda"
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none bg-white font-medium"
            />
            <datalist id="ea-regions-profile">
              {EAST_AFRICA_REGIONS.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Farm Size (Acres)
            </label>
            <input
              type="number"
              value={formData.farm_size_acres}
              onChange={(e) => setFormData({ ...formData, farm_size_acres: Number(e.target.value) })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none bg-white font-medium"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
