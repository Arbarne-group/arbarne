import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { authApi } from '../services/api';
import {
  User as UserIcon,
  Save,
  Check,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Droplets,
  Users,
  Sun,
  Calendar,
  FileText,
  Sparkles,
  ArrowRight,
  Edit3,
  ShieldCheck,
  TrendingUp,
  Zap,
  Shield,
  Lock,
  Bell,
  CreditCard,
  Key,
  Download,
  Plus,
  Mail,
  Phone,
  Building,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, setUser, token, showNotification, assessment, setScreen } = useAppStore();

  const latest = assessment.latestResult;
  const ffmiScore = latest ? latest.ffmi_score : user.ffmi_score || 13.8;
  const tier = latest ? latest.tier : user.tier || 3;
  const tierName = latest ? latest.tier_classification : user.tier_name || 'Structured Farm';

  const [activeSettingsTab, setActiveSettingsTab] = useState<
    'profile' | 'security' | 'notifications' | 'billing' | 'team'
  >('profile');

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
      'Green Valley Demonstration Farm is a forward-looking commercial agribusiness focused on regenerative agriculture, precision drip irrigation, and renewable energy adoption to build climate resilience and maximize enterprise margins.',
    soil_type: user.soil_type || 'Clay Loam (Volcanic)',
    water_source: user.water_source || 'Solar Borehole & Rainwater Harvesting',
    workforce_count: user.workforce_count || 12,
    energy_source: user.energy_source || 'Solar PV Grid & Biogas Unit',
    is_verified: user.is_verified ?? true,
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);

    if (token) {
      try {
        const updated = await authApi.updateProfile(formData);
        setUser({ ...formData, ...updated });
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

  const scorePercent = Math.min(100, Math.round((ffmiScore / 24) * 100));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ─── 1. Header & Breadcrumb ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30 text-xs font-bold uppercase tracking-wider mb-2">
            <UserIcon className="w-4 h-4 text-[#009924]" />
            <span>Enterprise Settings &amp; Governance</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Settings &amp; Farm Identity
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage your farm's public identity, agronomic infrastructure, security controls, and enterprise plan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('screen-dashboard')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-xs transition-all"
          >
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={() => setScreen('screen-assessment-choice')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs shadow-md shadow-[#009924]/20 transition-all hover:scale-105"
          >
            <span>Run New Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── 2. Settings Multi-Tab Layout ──────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <button
              onClick={() => setActiveSettingsTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl whitespace-nowrap lg:whitespace-normal transition-all text-left ${
                activeSettingsTab === 'profile'
                  ? 'bg-[#045D61] text-white shadow-md border-l-4 border-l-[#009924]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Farm Profile</span>
            </button>

            <button
              onClick={() => setActiveSettingsTab('security')}
              className={`flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl whitespace-nowrap lg:whitespace-normal transition-all text-left ${
                activeSettingsTab === 'security'
                  ? 'bg-[#045D61] text-white shadow-md border-l-4 border-l-[#009924]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Account Security</span>
            </button>

            <button
              onClick={() => setActiveSettingsTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl whitespace-nowrap lg:whitespace-normal transition-all text-left ${
                activeSettingsTab === 'notifications'
                  ? 'bg-[#045D61] text-white shadow-md border-l-4 border-l-[#009924]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notification Preferences</span>
            </button>

            <button
              onClick={() => setActiveSettingsTab('billing')}
              className={`flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl whitespace-nowrap lg:whitespace-normal transition-all text-left ${
                activeSettingsTab === 'billing'
                  ? 'bg-[#045D61] text-white shadow-md border-l-4 border-l-[#009924]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Billing &amp; Subscription</span>
            </button>

            <button
              onClick={() => setActiveSettingsTab('team')}
              className={`flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl whitespace-nowrap lg:whitespace-normal transition-all text-left ${
                activeSettingsTab === 'team'
                  ? 'bg-[#045D61] text-white shadow-md border-l-4 border-l-[#009924]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team Access</span>
            </button>
          </nav>
        </aside>

        {/* Tab Content Container */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* ═════════════ TAB 1: FARM PROFILE ═════════════ */}
          {activeSettingsTab === 'profile' && (
            <div className="space-y-6">
              {/* Bento Grid: Farm Summary Card + Overall Status */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Farm Summary Card (Spans 8 cols) */}
                <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                  <div className="w-full md:w-5/12 h-52 md:h-auto rounded-2xl bg-slate-100 overflow-hidden relative flex-shrink-0 shadow-inner">
                    <img
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt="Farm aerial view"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWNbXSFb_h1SuvRrxxKfA9-jytp1BkCBTE8d4KJJqY1rDF0sAOB8Sbvq-giWGxbKzgpIjYQE4nJn3NMxUhhNXtA20HqjB2kxdE_6rRKoxjLBC1OL4pqrtSypksKzXxN4VQb6FBCAQ5ltRlTxb3GeWJiI1u9SlWdg3jKsZjllMnRvSfnzYwuSL5-XHyozjVkxdNhXxx6CQdBRRql2mW6OGYkAZmwFNK4OOyahNAHov9p7RqeGbhl5k"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#009924] backdrop-blur-md inline-block mb-1">
                        Precision Agriculture
                      </span>
                      <p className="text-xs font-semibold text-white/90 truncate">
                        {formData.farm_reg_number}
                      </p>
                    </div>
                  </div>

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

                        <span className="bg-[#009924]/10 text-[#009924] border border-[#009924]/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
                          <ShieldCheck className="w-4 h-4" />
                          <span>FFF Verified Status</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {formData.farm_description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Total Farm Size
                        </span>
                        <p className="text-base font-bold text-slate-900">
                          {formData.farm_size_acres}{' '}
                          <span className="text-xs font-normal text-slate-500">Acres</span>
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Primary Enterprise
                        </span>
                        <p className="text-xs font-bold text-[#045D61] truncate mt-0.5" title={formData.farm_crop_type}>
                          {formData.farm_crop_type}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overall Status Card (Spans 4 cols) */}
                <div className="lg:col-span-4 bg-gradient-to-br from-[#023c3f] via-[#045D61] to-[#012527] text-white rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-xl border border-[#045D61]/40">
                  <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                    <Sparkles className="w-48 h-48 text-[#FFD700]" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFD700]">
                        Maturity Index
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold border border-white/15">
                        FFMI 2026
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white">
                        {ffmiScore.toFixed(1)}
                      </span>
                      <span className="text-sm text-white/70">/ 24.00 pts</span>
                    </div>

                    <div className="mt-3">
                      <span className="px-3 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/35 text-xs font-extrabold inline-flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Tier {tier}: {tierName}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                    <div className="flex justify-between text-xs text-white/80 font-medium">
                      <span>Maturity Progression</span>
                      <span className="text-[#FFD700] font-bold">{scorePercent}%</span>
                    </div>
                    <div className="w-full bg-white/15 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#009924] to-[#FFD700] h-2 rounded-full transition-all duration-700"
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-white/70 text-right">
                      Top 15% benchmark in {formData.farm_region}
                    </p>
                  </div>
                </div>
              </div>

              {/* Operational 4-Card Infrastructure Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl glass-panel border border-[#045D61]/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Pillar 4</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Soil Type</span>
                    <p className="text-sm font-bold text-slate-900">{formData.soil_type}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass-panel border border-[#045D61]/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-[#1E88E5]/10 text-[#1E88E5] flex items-center justify-center">
                      <Droplets className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Pillar 1</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Water Source</span>
                    <p className="text-sm font-bold text-slate-900 truncate" title={formData.water_source}>
                      {formData.water_source}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass-panel border border-[#045D61]/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-[#3949AB]/10 text-[#3949AB] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Pillar 6</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Workforce</span>
                    <p className="text-sm font-bold text-slate-900">
                      {formData.workforce_count} Team Members
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass-panel border border-[#045D61]/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-[#FDD835]/20 text-[#B78103] flex items-center justify-center">
                      <Sun className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Pillar 2</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Energy Grid</span>
                    <p className="text-sm font-bold text-slate-900 truncate" title={formData.energy_source}>
                      {formData.energy_source}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Component */}
              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#045D61]">
                      Enterprise Profile Details
                    </h3>
                    <p className="text-xs text-slate-500">
                      Update your farm's public identity, land registry, and contact credentials.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
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
                      Registration Number
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
                      Primary Crop Types &amp; Livestock
                    </label>
                    <input
                      type="text"
                      value={formData.farm_crop_type}
                      onChange={(e) => setFormData({ ...formData, farm_crop_type: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Contact Email
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
          )}

          {/* ═════════════ TAB 2: ACCOUNT SECURITY ═════════════ */}
          {activeSettingsTab === 'security' && (
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
              <div className="mb-4 pb-4 border-b border-slate-100">
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Account Security &amp; Credentials
                </h3>
                <p className="text-xs text-slate-500">
                  Manage your encryption keys, passwords, and multi-factor authentication.
                </p>
              </div>

              <div className="space-y-4">
                {/* Password Management */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90 gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#045D61]/10 text-[#045D61] flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Platform Password</h4>
                      <p className="text-xs text-slate-500">Last changed 45 days ago</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showNotification('Password update link sent to your email.', 'info')}
                    className="px-4 py-2 border border-slate-200 hover:border-[#045D61] text-[#045D61] font-bold text-xs rounded-xl bg-slate-50 transition-colors"
                  >
                    Change Password
                  </button>
                </div>

                {/* Two-Factor Authentication Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90 gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#009924]/10 text-[#009924] flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Two-Factor Authentication (2FA)
                      </h4>
                      <p className="text-xs text-slate-500">
                        Protect your agronomic records with SMS / Authenticator verification codes.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={(e) => {
                        setTwoFactorEnabled(e.target.checked);
                        showNotification(
                          e.target.checked ? '2FA enabled.' : '2FA disabled.',
                          'info'
                        );
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#009924]" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════ TAB 3: NOTIFICATIONS ═════════════ */}
          {activeSettingsTab === 'notifications' && (
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
              <div className="mb-4 pb-4 border-b border-slate-100">
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Notification Preferences
                </h3>
                <p className="text-xs text-slate-500">
                  Configure real-time SMS and email alerts for farm audits, pest warnings, and reports.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Email Digest &amp; Audit Reports</h4>
                    <p className="text-xs text-slate-500">Receive weekly FFMI trajectory and recommendations summary.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#045D61] rounded focus:ring-[#045D61]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">SMS Agronomic Alerts (+254)</h4>
                    <p className="text-xs text-slate-500">Direct weather hazard alerts and pest infestation warnings.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#045D61] rounded focus:ring-[#045D61]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Weather &amp; Agro-Ecological Satellite Updates</h4>
                    <p className="text-xs text-slate-500">Soil moisture forecasts and rainfall timing predictions.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={weatherAlerts}
                    onChange={(e) => setWeatherAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#045D61] rounded focus:ring-[#045D61]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═════════════ TAB 4: BILLING & SUBSCRIPTION ═════════════ */}
          {activeSettingsTab === 'billing' && (
            <div className="space-y-6">
              {/* Subscription Hero Card */}
              <div className="bg-gradient-to-br from-[#004447] via-[#045D61] to-[#022c24] text-white rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-xl border border-[#045D61]/50">
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, transparent, transparent 10px, #ffffff 10px, #ffffff 20px)',
                  }}
                />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold text-[#FFD700] mb-3 inline-block">
                      Active Subscription
                    </span>
                    <h3 className="font-serif text-3xl font-bold mb-2">FFF Pro Enterprise</h3>
                    <p className="text-xs sm:text-sm text-white/80 max-w-md leading-relaxed">
                      You are currently on the professional tier. Next billing date is Oct 15, 2026. Includes continuous satellite vegetation monitoring and verified auditor certificates.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showNotification('Billing portal redirect...', 'info')}
                    className="px-6 py-3 bg-white text-[#045D61] font-bold text-xs rounded-xl hover:bg-slate-100 transition-all shadow-md whitespace-nowrap"
                  >
                    Manage Plan &amp; Invoices
                  </button>
                </div>
              </div>

              {/* Invoices List */}
              <div className="p-6 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-4">
                <h4 className="font-serif text-base font-bold text-slate-900">
                  Recent Billing Invoices
                </h4>
                <div className="divide-y divide-slate-100">
                  <div className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">Invoice #FFF-2026-08</p>
                      <p className="text-slate-500">Aug 01, 2026 • Pro Annual Enterprise</p>
                    </div>
                    <span className="font-bold text-[#009924]">Paid</span>
                  </div>
                  <div className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">Invoice #FFF-2025-08</p>
                      <p className="text-slate-500">Aug 01, 2025 • Pro Annual Enterprise</p>
                    </div>
                    <span className="font-bold text-[#009924]">Paid</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════ TAB 5: TEAM ACCESS ═════════════ */}
          {activeSettingsTab === 'team' && (
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Farm Team &amp; Agronomist Access
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage permissions for field agronomists, farm operators, and auditors.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showNotification('Invite team member modal triggered.', 'info')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Invite Operator</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#045D61]/15 text-[#045D61] flex items-center justify-center font-bold text-xs">
                      JO
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{formData.name} (You)</h4>
                      <p className="text-[11px] text-slate-500">{formData.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#045D61]/10 text-[#045D61]">
                    Farm Owner / Primary Admin
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E88E5]/15 text-[#1E88E5] flex items-center justify-center font-bold text-xs">
                      MW
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Mary Wambui</h4>
                      <p className="text-[11px] text-slate-500">mary.agronomist@valleyview.agri</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#1E88E5]/10 text-[#1E88E5]">
                    Lead Field Agronomist
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FB8C00]/15 text-[#FB8C00] flex items-center justify-center font-bold text-xs">
                      DK
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">David Kiprono</h4>
                      <p className="text-[11px] text-slate-500">david.irrigation@valleyview.agri</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FB8C00]/10 text-[#FB8C00]">
                    Operations &amp; Irrigation Lead
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
