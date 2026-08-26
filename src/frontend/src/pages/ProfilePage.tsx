import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { authApi } from '../services/api';
import { User as UserIcon, Save, Check } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, setUser, token, showNotification } = useAppStore();

  const [formData, setFormData] = useState({
    name: user.name || 'Joseph Ochieng',
    phone: user.phone || '+254712345678',
    email: user.email || 'joseph@example.com',
    farm_name: user.farm_name || 'Kakamega Demonstration Farm',
    farm_region: user.farm_region || 'Western Kenya',
    farm_size_acres: user.farm_size_acres || 5.0,
    farm_crop_type: user.farm_crop_type || 'Maize, Dairy & Vegetables',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);

    if (token) {
      try {
        const updated = await authApi.updateProfile(formData);
        setUser(updated);
        showNotification('Farm enterprise profile updated successfully.', 'success');
      } catch (err: any) {
        showNotification(err.message || 'Profile saved locally (offline mode).', 'info');
      }
    } else {
      showNotification('Profile saved locally (Demo Mode).', 'info');
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <UserIcon className="w-4 h-4 text-emerald-600" />
          <span>Farm Enterprise Identity</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-pine-950">
          Farmer &amp; Farm Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Update your enterprise acreage, regional climate zone, and contact records.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-900/10 shadow-xl space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Farmer Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Phone Number (+254...)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
          />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-serif text-lg font-bold text-pine-950 mb-4">
            Farm Agronomic Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Farm Enterprise Name
              </label>
              <input
                type="text"
                value={formData.farm_name}
                onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Agro-Ecological Region
                </label>
                <select
                  value={formData.farm_region}
                  onChange={(e) => setFormData({ ...formData, farm_region: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                >
                  <option value="Western Kenya">Western Kenya</option>
                  <option value="Rift Valley">Rift Valley</option>
                  <option value="Central Kenya">Central Kenya</option>
                  <option value="Eastern Kenya">Eastern Kenya</option>
                  <option value="Coast">Coast</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Farm Size (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.farm_size_acres}
                  onChange={(e) =>
                    setFormData({ ...formData, farm_size_acres: Number(e.target.value) })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Primary Crops &amp; Livestock
              </label>
              <input
                type="text"
                value={formData.farm_crop_type}
                onChange={(e) =>
                  setFormData({ ...formData, farm_crop_type: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-pine-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Profile Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
