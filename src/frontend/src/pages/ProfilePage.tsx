import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { authApi } from '../services/api';
import { Edit3 } from 'lucide-react';
import { FarmHeroCard } from '../components/profile/FarmHeroCard';
import { FarmAttributesGrid } from '../components/profile/FarmAttributesGrid';
import { ProfileDetailsForm } from '../components/profile/ProfileDetailsForm';
import { OverallScoreCard } from '../components/profile/OverallScoreCard';
import { StrongestAreasCard } from '../components/profile/StrongestAreasCard';
import { RequiresAttentionCard } from '../components/profile/RequiresAttentionCard';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { User } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, setUser, token, showNotification } = useAppStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveProfile = async (updatedData: Partial<User>) => {
    setUser(updatedData);

    if (token) {
      try {
        const updated = await authApi.updateProfile(updatedData);
        setUser(updated);
        showNotification('Farm enterprise profile updated successfully.', 'success');
      } catch (err: any) {
        showNotification(
          err.message || 'Farm profile saved locally (offline cache mode).',
          'info'
        );
      }
    } else {
      showNotification('Farm profile saved locally (Demo mode).', 'success');
    }
  };

  return (
    <div className="w-full max-w-[1340px] mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* ─── Page Header with Title, Subtitle & Edit Profile Action ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
            My Farm Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            Manage your farm&apos;s core details and overview.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#084D45] hover:bg-[#063B35] active:scale-[0.98] text-white font-semibold text-xs shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* ─── Main 2-Column Content Grid ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Main Column (Hero, 4 Attributes, Profile Details Form) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Farm Hero / Identity Card */}
          <FarmHeroCard user={user} />

          {/* 4 Attributes Grid (Soil, Water, Workforce, Energy) */}
          <FarmAttributesGrid user={user} />

          {/* Profile Details Form Card */}
          <ProfileDetailsForm user={user} onSave={handleSaveProfile} />
        </div>

        {/* Right Column (Overall FFF Score, Strongest Areas, Requires Attention) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Overall FFF Score Card */}
          <OverallScoreCard user={user} />

          {/* Strongest Areas Card */}
          <StrongestAreasCard items={user.strongest_areas} />

          {/* Requires Attention Card */}
          <RequiresAttentionCard items={user.requires_attention} />
        </div>
      </div>

      {/* Edit Profile Full Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};
