import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import {
  Save,
  Check,
  Lock,
  ShieldCheck,
  LogOut,
  Globe,
  User as UserIcon,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, setUser, showNotification, setScreen, logout } = useAppStore();

  const [formData, setFormData] = useState({
    name: user.name || 'Grace Wanjiru',
    phone: user.phone || '+254 700 123 456',
    email: user.email || 'farmer@arbarne.org',
  });

  const [saved, setSaved] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const [language, setLanguage] = useState('en');

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);
    setSaved(true);
    showNotification('Your account details have been saved.', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('The new passwords do not match.', 'error');
      return;
    }
    setPasswordSaved(true);
    showNotification('Your password has been updated.', 'success');
    setTimeout(() => setPasswordSaved(false), 3000);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* ─── 1. Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30 text-xs font-bold uppercase tracking-wider mb-2">
            <UserIcon className="w-4 h-4 text-[#009924]" />
            <span>Account</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Update your name, phone number, password and language.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('screen-profile')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#045D61] border border-slate-200 font-bold text-xs shadow-xs transition-all"
          >
            My Farm
          </button>
          <button
            onClick={() => setScreen('screen-dashboard')}
            className="px-4 py-2.5 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs shadow-md transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* ─── 2. Your Details ───────────────────────────────────────────── */}
      <form
        onSubmit={handleSaveDetails}
        className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#045D61]">Your Details</h3>
            <p className="text-xs text-slate-500">
              Update your name and phone number.
            </p>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

          <div className="md:col-span-2">
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
        </div>
      </form>

      {/* ─── 3. Language ───────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#045D61]/10 text-[#045D61] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Language</h4>
            <p className="text-xs text-slate-500">Choose the language you want to use.</p>
          </div>
        </div>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            showNotification('Language updated.', 'info');
          }}
          className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none bg-white font-medium"
        >
          <option value="en">English</option>
          <option value="sw">Kiswahili</option>
        </select>
      </div>

      {/* ─── 4. Change Password ────────────────────────────────────────── */}
      <form
        onSubmit={handlePasswordChange}
        className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6"
      >
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-serif text-xl font-bold text-[#045D61]">Change Password</h3>
          <p className="text-xs text-slate-500">
            Choose a new password for your account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none bg-white font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none bg-white font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none bg-white font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {passwordSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Password Updated!</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ─── 5. Extra Login Security (2FA) ────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#009924]/10 text-[#009924] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Extra Login Security</h4>
              <p className="text-xs text-slate-500">
                Ask for a code on your phone each time you sign in.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              showNotification(
                `Extra login security ${!twoFactorEnabled ? 'turned on' : 'turned off'}.`,
                'info'
              );
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              twoFactorEnabled ? 'bg-[#009924]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* ─── 6. Sign Out ──────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs shadow-xs transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};
