import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { User } from '../../types';

interface ProfileDetailsFormProps {
  user: User;
  onSave: (updatedData: Partial<User>) => Promise<void> | void;
}

export const ProfileDetailsForm: React.FC<ProfileDetailsFormProps> = ({ user, onSave }) => {
  const [regNumber, setRegNumber] = useState(user.farm_registration_number || 'REG-2023-8849');
  const [yearEstablished, setYearEstablished] = useState(user.year_established || '2015');
  const [description, setDescription] = useState(
    user.farm_description ||
      'Green Valley Acres is a medium-scale commercial farm focused on sustainable agriculture practices, utilizing precision irrigation and integrating renewable energy sources to maximize yield while minimizing environmental impact.'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSave({
        farm_registration_number: regNumber,
        year_established: yearEstablished,
        farm_description: description,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
      {/* Title with Divider */}
      <div className="pb-3 border-b border-slate-200/80 mb-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Profile Details
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
        {/* 2-Column Row for Registration & Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Farm Registration Number
            </label>
            <input
              type="text"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="e.g. REG-2023-8849"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-800 text-xs font-medium focus:bg-white focus:border-[#045D61] focus:ring-2 focus:ring-[#045D61]/15 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Year Established
            </label>
            <input
              type="text"
              value={yearEstablished}
              onChange={(e) => setYearEstablished(e.target.value)}
              placeholder="e.g. 2015"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-800 text-xs font-medium focus:bg-white focus:border-[#045D61] focus:ring-2 focus:ring-[#045D61]/15 outline-none transition-all"
            />
          </div>
        </div>

        {/* Farm Description Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Farm Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your farm's enterprise focus, agronomic practices, and sustainability goals..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-700 text-xs leading-relaxed focus:bg-white focus:border-[#045D61] focus:ring-2 focus:ring-[#045D61]/15 outline-none transition-all resize-y"
          />
        </div>

        {/* Action Button Right-Aligned */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-[#084D45] hover:bg-[#063B35] active:scale-[0.98] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[2.5]" />
                <span>Changes Saved</span>
              </>
            ) : isSaving ? (
              <span>Saving...</span>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
