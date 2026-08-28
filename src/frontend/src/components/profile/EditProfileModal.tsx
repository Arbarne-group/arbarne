import React, { useState } from 'react';
import { X, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { User } from '../../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedData: Partial<User>) => Promise<void> | void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    farm_name: user.farm_name || 'Green Valley Acres',
    farm_region: user.farm_region || 'Nairobi Region, Kenya',
    total_size_hectares: user.total_size_hectares || 120,
    farm_crop_type: user.farm_crop_type || 'Maize, Soybeans, Avocados',
    soil_type: user.soil_type || 'Clay Loam',
    water_source: user.water_source || 'Borehole & Rain',
    workforce: user.workforce || '15 Permanent',
    energy: user.energy || 'Solar Grid',
    farm_registration_number: user.farm_registration_number || 'REG-2023-8849',
    year_established: user.year_established || '2015',
    farm_description:
      user.farm_description ||
      'Green Valley Acres is a medium-scale commercial farm focused on sustainable agriculture practices, utilizing precision irrigation and integrating renewable energy sources to maximize yield while minimizing environmental impact.',
    overall_score: user.overall_score || 72,
    tier_name: user.tier_name || 'Emerging Agribusiness',
    verified: user.verified ?? true,
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...formData,
        farm_size_acres: formData.total_size_hectares * 2.471,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Edit Farm Profile</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your farm attributes, agronomic details, and verification status.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Farm Name
              </label>
              <input
                type="text"
                value={formData.farm_name}
                onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#045D61] focus:ring-2 focus:ring-[#045D61]/15 outline-none font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location / Region
              </label>
              <input
                type="text"
                value={formData.farm_region}
                onChange={(e) => setFormData({ ...formData, farm_region: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#045D61] focus:ring-2 focus:ring-[#045D61]/15 outline-none font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Total Size (Hectares)
              </label>
              <input
                type="number"
                value={formData.total_size_hectares}
                onChange={(e) =>
                  setFormData({ ...formData, total_size_hectares: Number(e.target.value) })
                }
                required
                min="1"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#045D61] focus:ring-2 focus:ring-[#045D61]/15 outline-none font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Crops
              </label>
              <input
                type="text"
                value={formData.farm_crop_type}
                onChange={(e) => setFormData({ ...formData, farm_crop_type: e.target.value })}
                placeholder="e.g. Maize, Soybeans, Avocados"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#045D61] focus:ring-2 focus:ring-[#045D61]/15 outline-none font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Soil Type
              </label>
              <input
                type="text"
                value={formData.soil_type}
                onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#045D61]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Water Source
              </label>
              <input
                type="text"
                value={formData.water_source}
                onChange={(e) => setFormData({ ...formData, water_source: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#045D61]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Workforce
              </label>
              <input
                type="text"
                value={formData.workforce}
                onChange={(e) => setFormData({ ...formData, workforce: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#045D61]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Energy
              </label>
              <input
                type="text"
                value={formData.energy}
                onChange={(e) => setFormData({ ...formData, energy: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#045D61]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Registration Number
              </label>
              <input
                type="text"
                value={formData.farm_registration_number}
                onChange={(e) =>
                  setFormData({ ...formData, farm_registration_number: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 outline-none focus:border-[#045D61]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Year Established
              </label>
              <input
                type="text"
                value={formData.year_established}
                onChange={(e) => setFormData({ ...formData, year_established: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 outline-none focus:border-[#045D61]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Farm Description
            </label>
            <textarea
              rows={3}
              value={formData.farm_description}
              onChange={(e) => setFormData({ ...formData, farm_description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-normal text-slate-700 outline-none focus:border-[#045D61] resize-y"
            />
          </div>

          {/* Verification toggle & Score */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="verifiedCheck"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="w-4 h-4 rounded text-[#045D61] focus:ring-[#045D61]"
              />
              <label htmlFor="verifiedCheck" className="text-sm font-bold text-slate-800 cursor-pointer">
                FFF Verified Farm Status
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Overall FFF Score:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.overall_score}
                onChange={(e) =>
                  setFormData({ ...formData, overall_score: Number(e.target.value) })
                }
                className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 text-center"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#084D45] hover:bg-[#063B35] text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
          >
            {saving ? <span>Saving...</span> : <span>Save Profile</span>}
          </button>
        </div>
      </div>
    </div>
  );
};
