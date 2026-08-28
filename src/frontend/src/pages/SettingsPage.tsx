import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { authApi, assessmentApi } from '../services/api';
import {
  Settings,
  Shield,
  ShieldCheck,
  Lock,
  Bell,
  CreditCard,
  Users,
  Building,
  Save,
  Check,
  Plus,
  ArrowRight,
  Sparkles,
  Key,
  Download,
  Mail,
  Phone,
  Clock,
  Trash2,
  Edit2,
  Smartphone,
  CheckCircle2,
  X,
  ExternalLink,
  Zap,
  Layers,
  BarChart2,
  Calendar,
  AlertCircle,
  FileText,
  Lightbulb,
  MessageSquare,
  BarChart3,
  Target,
  Cpu,
  Sun,
  Trees,
  TrendingUp,
  Store,
  Briefcase,
  Info,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    user,
    setUser,
    token,
    showNotification,
    setScreen,
    assessment,
    startAssessment,
    awardXp,
    setCheckoutItem,
  } = useAppStore();

  const latest = assessment.latestResult;
  const tier = latest ? latest.tier : user.tier || 3;
  const tierName = latest ? latest.tier_classification : user.tier_name || 'Structured Farm';

  const [activeTab, setActiveTab] = useState<'security' | 'notifications' | 'billing' | 'team' | 'profile'>('security');

  // Security States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification Preferences States
  const [emailDigest, setEmailDigest] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);

  // Billing & Subscription States
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'mpesa' | 'card'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('+254 712 345 678');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'mpesa',
      title: 'Safaricom M-Pesa Express',
      identifier: '+254 712 345 678',
      isDefault: true,
      expiry: 'Instant STK Push',
    },
    {
      id: 2,
      type: 'card',
      title: 'Equity Corporate Visa Debit',
      identifier: '•••• •••• •••• 4242',
      isDefault: false,
      expiry: 'Exp 12/28',
    },
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2026-08',
      date: 'Aug 01, 2026',
      description: 'FFF Pro Enterprise (Annual Subscription)',
      amount: 'KES 45,000',
      status: 'Paid',
      method: 'M-Pesa Express',
    },
    {
      id: 'INV-2025-08',
      date: 'Aug 01, 2025',
      description: 'FFF Pro Enterprise (Annual Subscription)',
      amount: 'KES 45,000',
      status: 'Paid',
      method: 'M-Pesa Express',
    },
    {
      id: 'INV-2024-08',
      date: 'Aug 01, 2024',
      description: 'FFF Pro Diagnostic Setup & Verification',
      amount: 'KES 25,000',
      status: 'Paid',
      method: 'Visa Card •••• 4242',
    },
  ]);

  // Team Access States
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: user.name || 'Joseph Ochieng',
      email: user.email || 'joseph@example.com',
      role: 'Farm Owner & Administrator',
      initials: 'JO',
      badgeColor: 'bg-[#045D61]/10 text-[#045D61]',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Mary Wambui',
      email: 'mary.agronomist@valleyview.agri',
      role: 'Lead Agronomist',
      initials: 'MW',
      badgeColor: 'bg-[#1E88E5]/10 text-[#1E88E5]',
      status: 'Active',
    },
    {
      id: 3,
      name: 'David Kiprono',
      email: 'david.irrigation@valleyview.agri',
      role: 'Operations & Irrigation Lead',
      initials: 'DK',
      badgeColor: 'bg-[#FB8C00]/10 text-[#FB8C00]',
      status: 'Active',
    },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Field Agronomist' });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('New passwords do not match.', 'error');
      return;
    }
    setPasswordSaved(true);
    showNotification('Password updated successfully.', 'success');
    setTimeout(() => setPasswordSaved(false), 3000);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    const initials = newMember.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    setTeamMembers([
      ...teamMembers,
      {
        id: Date.now(),
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        initials: initials || 'OP',
        badgeColor: 'bg-[#009924]/10 text-[#009924]',
        status: 'Invited',
      },
    ]);

    setShowInviteModal(false);
    setNewMember({ name: '', email: '', role: 'Field Agronomist' });
    showNotification(`Invitation sent to ${newMember.email}.`, 'success');
  };

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentType === 'mpesa') {
      if (!mpesaPhone) return;
      setPaymentMethods([
        ...paymentMethods,
        {
          id: Date.now(),
          type: 'mpesa',
          title: 'Safaricom M-Pesa',
          identifier: mpesaPhone,
          isDefault: false,
          expiry: 'Instant STK Push',
        },
      ]);
      showNotification(`M-Pesa number ${mpesaPhone} linked successfully.`, 'success', 3500, 'Payment Method Added');
    } else {
      if (!cardNumber) return;
      setPaymentMethods([
        ...paymentMethods,
        {
          id: Date.now(),
          type: 'card',
          title: 'Credit / Debit Card',
          identifier: `•••• •••• •••• ${cardNumber.slice(-4) || '8888'}`,
          isDefault: false,
          expiry: `Exp ${cardExpiry || '12/29'}`,
        },
      ]);
      showNotification(`Card ending in ${cardNumber.slice(-4) || '8888'} linked successfully.`, 'success', 3500, 'Payment Method Added');
    }
    setShowAddPaymentModal(false);
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
  };

  const handleSetDefaultPayment = (id: number) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
    showNotification('Primary billing payment method updated.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ─── 1. Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Settings className="w-4 h-4 text-[#009924]" />
            <span>Platform Governance &amp; Security</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Settings &amp; Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Configure access controls, security policies, notification channels, billing subscription, and team delegates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('screen-profile')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#045D61] border border-slate-200 font-bold text-xs shadow-xs transition-all"
          >
            <Building className="w-4 h-4 text-[#009924]" />
            <span>Farm Profile</span>
          </button>
          <button
            onClick={() => setScreen('screen-dashboard')}
            className="px-4 py-2.5 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs shadow-md transition-all"
          >
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Settings Layout ────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl whitespace-nowrap lg:whitespace-normal transition-all text-left ${
                activeTab === 'security'
                  ? 'bg-[#045D61] text-white shadow-md border-l-4 border-l-[#009924]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Account Security</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl whitespace-nowrap lg:whitespace-normal transition-all text-left ${
                activeTab === 'billing'
                  ? 'bg-[#045D61] text-white shadow-md border-l-4 border-l-[#009924]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Billing &amp; Subscription</span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl whitespace-nowrap lg:whitespace-normal transition-all text-left ${
                activeTab === 'team'
                  ? 'bg-[#045D61] text-white shadow-md border-l-4 border-l-[#009924]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team Access</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl whitespace-nowrap lg:whitespace-normal transition-all text-left ${
                activeTab === 'notifications'
                  ? 'bg-[#045D61] text-white shadow-md border-l-4 border-l-[#009924]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notification Preferences</span>
            </button>

            <button
              onClick={() => setScreen('screen-profile')}
              className="flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl whitespace-nowrap lg:whitespace-normal text-left bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 transition-all"
            >
              <Building className="w-4 h-4 text-[#009924]" />
              <span>Edit Farm Identity ➔</span>
            </button>
          </nav>
        </aside>

        {/* Tab Content Canvas */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* ═════════════ TAB: ACCOUNT SECURITY ═════════════ */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-900">
                      Account Security &amp; Authentication
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage cryptographic keys, session activity, and two-factor verification.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[#009924]/10 text-[#009924] border border-[#009924]/20 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Protected</span>
                  </span>
                </div>

                {/* 2FA Toggle Box */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-2xl border border-slate-200/90 gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#009924]/10 text-[#009924] flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Two-Factor Authentication (2FA)
                      </h4>
                      <p className="text-xs text-slate-500">
                        Require an SMS or authenticator passcode on mobile logins.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      showNotification(
                        `Two-Factor Authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}.`,
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

                {/* Change Password Form */}
                <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Update Password
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
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
                        required
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
                        required
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
                          <Check className="w-4 h-4 text-[#009924]" />
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
              </div>
            </div>
          )}

          {/* ═════════════ TAB: BILLING & SUBSCRIPTION ═════════════ */}
          {activeTab === 'billing' && (
            <div className="space-y-8">
              {/* 1. Active Plan Hero Banner */}
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
                    <h3 className="font-serif text-3xl sm:text-4xl font-bold mb-2 tracking-tight">FFF Pro</h3>
                    <p className="text-xs sm:text-sm text-white/80 max-w-md leading-relaxed">
                      You are currently on the professional tier. Next billing date is Oct 15, 2024.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddPaymentModal(true)}
                      className="px-6 py-3 bg-white text-[#045D61] font-bold text-xs rounded-xl hover:bg-slate-100 transition-all shadow-md whitespace-nowrap"
                    >
                      Manage Plan
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Canonical Assessment Pricing & Subscription Packages */}
              <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-8">
                {/* Header & Trust Banner */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-6">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-[#004447]">
                      Assessment Pricing &amp; Packages
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Choose how you want to assess and grow your farm across the 8 Pillars &amp; 40 Capabilities.
                    </p>
                  </div>

                  {/* Trust Badge */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3 max-w-sm shadow-xs shrink-0">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 text-[#009924]">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#004447] flex items-center gap-1.5">
                        <span>Secure</span>
                        <span className="text-slate-300">•</span>
                        <span>Private</span>
                        <span className="text-slate-300">•</span>
                        <span>Your data is safe</span>
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                        Your information is used only to generate assessment results and recommendations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 text-[#009924]">
                    <Info className="w-4 h-4" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">
                    Assess your farm across the Future Farms Framework (8 Pillars, 40 Capabilities) and get instant insights to improve, grow and thrive.
                  </p>
                </div>

                {/* 2 Main Assessment Packages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                  {/* Option 1: Individual Pillar */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#009924] transition-all shadow-xs">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 text-[#004447]">
                          <FileText className="w-7 h-7" />
                        </div>
                        <div>
                          <h5 className="font-serif text-xl font-bold text-[#004447]">
                            Individual Pillar Assessment
                          </h5>
                          <p className="text-xs text-slate-500 mt-1">
                            Assess any <strong>single pillar</strong> to understand your current capability level.
                          </p>
                        </div>
                      </div>

                      <div className="mb-6 pb-6 border-b border-slate-100">
                        <div className="font-serif text-4xl font-bold text-[#004447] flex items-baseline gap-1">
                          <span>$1</span>
                        </div>
                        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mt-1">
                          Per Pillar
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-[#004447] mb-3 uppercase tracking-wider">
                          Includes:
                        </p>
                        <ul className="space-y-3 pl-1 text-xs sm:text-sm text-slate-700">
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#009924] shrink-0 mt-0.5" />
                            <span>Assessment of <strong>1 Pillar</strong></span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#009924] shrink-0 mt-0.5" />
                            <span>Instant recommendations for 'No' answers</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#009924] shrink-0 mt-0.5" />
                            <span>Capability status feedback</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#009924] shrink-0 mt-0.5" />
                            <span>Pillar score</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCheckoutItem({
                          scope: 'pillar',
                          pillarId: 1,
                          title: 'Pillar 1: Smart Farming & Digital Transformation',
                          description: 'Targeted single-pillar capability assessment with instant feedback & recommendations.',
                          priceUsd: 1,
                          priceKes: 130,
                        });
                        setScreen('screen-checkout');
                      }}
                      className="mt-8 w-full bg-white text-[#009924] hover:bg-[#009924] hover:text-white font-bold text-xs sm:text-sm py-3.5 rounded-2xl border-2 border-[#009924] transition-all shadow-xs flex justify-center items-center cursor-pointer"
                    >
                      Assess One Pillar – $1
                    </button>
                  </div>

                  {/* Option 2: Full Assessment */}
                  <div className="bg-white border-2 border-[#009924] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-xl shadow-[#004447]/10">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#009924] text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full whitespace-nowrap shadow-sm">
                      Best Value
                    </div>

                    <div>
                      <div className="flex items-center gap-4 mb-6 mt-2">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200 text-[#009924]">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                          <h5 className="font-serif text-xl font-bold text-[#004447]">
                            Full Future Farm Assessment
                          </h5>
                          <p className="text-xs text-slate-500 mt-1">
                            Complete all 8 pillars and get your full farm transformation plan.
                          </p>
                        </div>
                      </div>

                      <div className="mb-6 pb-6 border-b border-slate-100">
                        <div className="font-serif text-4xl font-bold text-[#004447] flex items-baseline gap-1">
                          <span>$10</span>
                        </div>
                        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mt-1">
                          One-time Payment
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-[#004447] mb-3 uppercase tracking-wider">
                          Includes Everything in Individual Pillar +
                        </p>
                        <ul className="space-y-3 pl-1 text-xs sm:text-sm text-slate-700">
                          <li className="flex items-start gap-2.5 font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-[#009924] shrink-0 mt-0.5" />
                            <span>All 8 Pillars Assessment (40 Capabilities)</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#009924] shrink-0 mt-0.5" />
                            <span>Full downloadable Farm Transformation Plan (PDF)</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#009924] shrink-0 mt-0.5" />
                            <span>Farm classification</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#009924] shrink-0 mt-0.5" />
                            <span>Priority development areas (Top 3-5 capabilities)</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#009924] shrink-0 mt-0.5" />
                            <span>Pillar scores (for all 8 pillars)</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#009924] shrink-0 mt-0.5" />
                            <span>Personalised recommendations</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCheckoutItem({
                          scope: 'full',
                          pillarId: null,
                          title: 'Full Future Farm Assessment',
                          description: 'Comprehensive data analysis & yield prediction report across 8 Pillars & 40 Capabilities.',
                          priceUsd: 10,
                          priceKes: 1300,
                        });
                        setScreen('screen-checkout');
                      }}
                      className="mt-8 w-full bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs sm:text-sm py-3.5 rounded-2xl transition-all shadow-md flex justify-center items-center gap-2 cursor-pointer"
                    >
                      <span>Unlock Full Assessment – $10</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* What You Get with Full Assessment Section */}
                <div className="pt-6">
                  <h4 className="font-serif text-xl font-bold text-[#004447] mb-6 text-center">
                    What You Get with Full Assessment
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF8E1] flex items-center justify-center shrink-0 border border-[#FFE082] text-[#F57F17]">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <div>
                        <h6 className="font-serif text-xs font-bold text-[#004447] mb-1">
                          Recommendations for 'No' Answers
                        </h6>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Instant, practical recommendations to help you address gaps immediately.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-[#E0F2F1] flex items-center justify-center shrink-0 border border-[#80CBC4] text-[#00695C]">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h6 className="font-serif text-xs font-bold text-[#004447] mb-1">
                          Capability Status Feedback
                        </h6>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Detailed feedback after every capability to show where you stand.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-[#E3F2FD] flex items-center justify-center shrink-0 border border-[#90CAF9] text-[#1565C0]">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h6 className="font-serif text-xs font-bold text-[#004447] mb-1">
                          Pillar Scores
                        </h6>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Clear scores for all 8 pillars to help you see your strengths and gaps.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-[#F3E5F5] flex items-center justify-center shrink-0 border border-[#CE93D8] text-[#6A1B9A]">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h6 className="font-serif text-xs font-bold text-[#004447] mb-1">
                          Personalised Recommendations
                        </h6>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Actionable recommendations tailored to your farm's specific results.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-[#045d61]/10 flex items-center justify-center shrink-0 border border-[#045d61]/30 text-[#045d61]">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h6 className="font-serif text-xs font-bold text-[#004447] mb-1">
                          Priority Development Areas
                        </h6>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Focus on the top 3-5 capabilities that will drive the most impact.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-300 text-slate-700">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h6 className="font-serif text-xs font-bold text-[#004447] mb-1">
                          Farm Classification
                        </h6>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Discover your farm's classification and transformation stage.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 shadow-xs lg:col-span-2">
                      <div className="w-10 h-10 rounded-xl bg-[#7ffd7b]/20 flex items-center justify-center shrink-0 border border-[#009924]/30 text-[#007519]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h6 className="font-serif text-xs font-bold text-[#004447] mb-1">
                          Full Transformation Plan (PDF)
                        </h6>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          A comprehensive, downloadable PDF guide for your farm's future roadmap.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pillar Grid: Assess Any Pillar - $1 Each */}
                <div className="pt-6 border-t border-slate-200">
                  <div className="mb-4">
                    <h4 className="font-serif text-xl font-bold text-[#004447]">
                      Assess Any Pillar – $1 Each
                    </h4>
                    <p className="text-xs text-slate-500">
                      Choose the pillar you want to assess. You can assess others later.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Pillar 1 */}
                    <div
                      onClick={() => {
                        setCheckoutItem({
                          scope: 'pillar',
                          pillarId: 1,
                          title: 'Pillar 1: Smart Farming & Digital Transformation',
                          description: 'Targeted single-pillar capability assessment with instant feedback & recommendations.',
                          priceUsd: 1,
                          priceKes: 130,
                        });
                        setScreen('screen-checkout');
                      }}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-slate-50 hover:border-[#009924] transition-all cursor-pointer group"
                    >
                      <Cpu className="w-7 h-7 text-[#009924] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-[#004447] mb-0.5">1</span>
                      <span className="text-[11px] text-slate-600 h-9 flex items-center justify-center leading-tight">
                        Smart Farming &amp; Digital Transformation
                      </span>
                      <span className="text-xs font-bold text-[#009924] mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                        $1
                      </span>
                    </div>

                    {/* Pillar 2 */}
                    <div
                      onClick={() => {
                        setCheckoutItem({
                          scope: 'pillar',
                          pillarId: 2,
                          title: 'Pillar 2: Productive Use of Renewable Energy',
                          description: 'Targeted single-pillar capability assessment with instant feedback & recommendations.',
                          priceUsd: 1,
                          priceKes: 130,
                        });
                        setScreen('screen-checkout');
                      }}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-slate-50 hover:border-[#009924] transition-all cursor-pointer group"
                    >
                      <Sun className="w-7 h-7 text-[#FDD835] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-[#004447] mb-0.5">2</span>
                      <span className="text-[11px] text-slate-600 h-9 flex items-center justify-center leading-tight">
                        Productive Use of Renewable Energy
                      </span>
                      <span className="text-xs font-bold text-[#009924] mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                        $1
                      </span>
                    </div>

                    {/* Pillar 3 */}
                    <div
                      onClick={() => {
                        setCheckoutItem({
                          scope: 'pillar',
                          pillarId: 3,
                          title: 'Pillar 3: Food Safety, Quality & Compliance',
                          description: 'Targeted single-pillar capability assessment with instant feedback & recommendations.',
                          priceUsd: 1,
                          priceKes: 130,
                        });
                        setScreen('screen-checkout');
                      }}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-slate-50 hover:border-[#009924] transition-all cursor-pointer group"
                    >
                      <ShieldCheck className="w-7 h-7 text-[#43A047] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-[#004447] mb-0.5">3</span>
                      <span className="text-[11px] text-slate-600 h-9 flex items-center justify-center leading-tight">
                        Food Safety, Quality &amp; Compliance
                      </span>
                      <span className="text-xs font-bold text-[#009924] mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                        $1
                      </span>
                    </div>

                    {/* Pillar 4 */}
                    <div
                      onClick={() => {
                        setCheckoutItem({
                          scope: 'pillar',
                          pillarId: 4,
                          title: 'Pillar 4: Indigenous Knowledge & Climate Resilience',
                          description: 'Targeted single-pillar capability assessment with instant feedback & recommendations.',
                          priceUsd: 1,
                          priceKes: 130,
                        });
                        setScreen('screen-checkout');
                      }}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-slate-50 hover:border-[#009924] transition-all cursor-pointer group"
                    >
                      <Trees className="w-7 h-7 text-[#2E7D32] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-[#004447] mb-0.5">4</span>
                      <span className="text-[11px] text-slate-600 h-9 flex items-center justify-center leading-tight">
                        Indigenous Knowledge &amp; Climate Resilience
                      </span>
                      <span className="text-xs font-bold text-[#009924] mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                        $1
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Footer */}
                <div className="text-center pt-4 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4 text-[#009924]" />
                    <span>Payments are secure and encrypted.</span>
                  </p>
                </div>
              </div>

              {/* 3. Monthly Usage & Quotas Dashboard */}
              <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="font-serif text-base font-bold text-slate-900">
                      Current Quotas &amp; Capability Consumption
                    </h4>
                    <p className="text-xs text-slate-500">
                      Usage resets on the 1st of every month (Next reset: Oct 01, 2026).
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-[#009924] rounded-full text-xs font-bold border border-emerald-200">
                    Healthy Quotas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Satellite NDVI Scans</span>
                      <span className="text-[#045D61]">18 / 30</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#045D61] h-full rounded-full w-[60%]" />
                    </div>
                    <p className="text-[10px] text-slate-400">60% consumed this billing cycle</p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Soil Lab Submissions</span>
                      <span className="text-[#009924]">4 / 10</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#009924] h-full rounded-full w-[40%]" />
                    </div>
                    <p className="text-[10px] text-slate-400">40% consumed this billing cycle</p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Audit Certificates</span>
                      <span className="text-[#1E88E5]">2 / 5</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1E88E5] h-full rounded-full w-[40%]" />
                    </div>
                    <p className="text-[10px] text-slate-400">40% consumed this billing cycle</p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Team Operator Seats</span>
                      <span className="text-[#FB8C00]">3 / 5</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#FB8C00] h-full rounded-full w-[60%]" />
                    </div>
                    <p className="text-[10px] text-slate-400">2 seats available to invite</p>
                  </div>
                </div>
              </div>

              {/* 4. Payment Methods Management */}
              <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="font-serif text-base font-bold text-slate-900">
                      Payment Methods &amp; Mobile Money
                    </h4>
                    <p className="text-xs text-slate-500">
                      Manage Safaricom M-Pesa phone numbers and credit/debit cards for automated renewals.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddPaymentModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Payment Method</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((pm) => (
                    <div
                      key={pm.id}
                      className="p-5 bg-white rounded-2xl border border-slate-200/90 flex items-center justify-between shadow-xs hover:border-[#045D61]/30 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                            pm.type === 'mpesa'
                              ? 'bg-[#009924]/10 text-[#009924]'
                              : 'bg-[#045D61]/10 text-[#045D61]'
                          }`}
                        >
                          {pm.type === 'mpesa' ? (
                            <Smartphone className="w-5 h-5" />
                          ) : (
                            <CreditCard className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-slate-900">{pm.title}</h5>
                            {pm.isDefault && (
                              <span className="px-2 py-0.2 bg-[#009924]/10 text-[#009924] text-[9px] font-extrabold rounded uppercase tracking-wider">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 font-mono font-medium mt-0.5">
                            {pm.identifier}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{pm.expiry}</p>
                        </div>
                      </div>

                      {!pm.isDefault && (
                        <button
                          onClick={() => handleSetDefaultPayment(pm.id)}
                          className="text-xs font-bold text-[#045D61] hover:underline"
                        >
                          Make Default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Invoices & Billing History Table */}
              <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="font-serif text-base font-bold text-slate-900">
                      Billing History &amp; Official Receipts
                    </h4>
                    <p className="text-xs text-slate-500">
                      Download tax-compliant commercial invoices with KRA eTIMS QR verification.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showNotification('Downloading all historical tax invoices as ZIP archive...', 'info')}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#045D61] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All (ZIP)</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="py-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{inv.id}</p>
                          <p className="text-slate-500">
                            {inv.date} • {inv.description} • {inv.method}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{inv.amount}</p>
                          <span className="font-bold text-[#009924] text-[11px] flex items-center gap-1 justify-end">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{inv.status}</span>
                          </span>
                        </div>
                        <button
                          onClick={() => showNotification(`Receipt for ${inv.id} downloaded.`, 'success')}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#045D61] transition-colors"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═════════════ TAB: TEAM ACCESS ═════════════ */}
          {activeTab === 'team' && (
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Farm Team &amp; Agronomist Access
                  </h3>
                  <p className="text-xs text-slate-500">
                    Delegate operational tasks, agronomic logging, and audit permissions to team members.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Invite Operator</span>
                </button>
              </div>

              {/* Team Members List */}
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90 gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-[#045D61]/15 text-[#045D61] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {member.initials}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                        <p className="text-[11px] text-slate-500">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${member.badgeColor}`}
                      >
                        {member.role}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded">
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════════ TAB: NOTIFICATION PREFERENCES ═════════════ */}
          {activeTab === 'notifications' && (
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Communication &amp; Alert Channels
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure real-time SMS weather hazards, automated audit updates, and agronomic notifications.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* SMS Hazard Alerts */}
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#009924]/10 text-[#009924] flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Critical SMS Weather &amp; Pest Alerts
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Receive instant SMS warnings on drought, locust warnings, or frost risks.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSmsAlerts(!smsAlerts);
                      showNotification(`SMS alerts ${!smsAlerts ? 'activated' : 'paused'}.`, 'info');
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      smsAlerts ? 'bg-[#009924]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        smsAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Email Digest */}
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#045D61]/10 text-[#045D61] flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Weekly Farm Maturity &amp; Yield Digest
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Email summary of your 8-pillar FFMI scorecard and upcoming audit action items.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailDigest(!emailDigest);
                      showNotification(`Weekly email digest ${!emailDigest ? 'activated' : 'paused'}.`, 'info');
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      emailDigest ? 'bg-[#009924]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        emailDigest ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Weather Alerts */}
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FB8C00]/10 text-[#FB8C00] flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Agronomic Service Recommendations
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Notifications when new verified suppliers or financing partners match your gap scorecard.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setWeatherAlerts(!weatherAlerts);
                      showNotification(`Service notifications ${!weatherAlerts ? 'activated' : 'paused'}.`, 'info');
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      weatherAlerts ? 'bg-[#009924]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        weatherAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── 3. Invite Team Member Modal ───────────────────────────────── */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Invite Farm Delegate / Agronomist
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleInviteMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grace Achieng"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="grace.agronomist@farm.agri"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Platform Role
                  </label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none"
                  >
                    <option value="Field Agronomist">Field Agronomist</option>
                    <option value="Operations Lead">Operations Lead</option>
                    <option value="Auditor & Compliance">Auditor &amp; Compliance</option>
                    <option value="Financial Officer">Financial Officer</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── 4. Add Payment Method Modal ───────────────────────────────── */}
      <AnimatePresence>
        {showAddPaymentModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Add Payment Method
                  </h3>
                  <p className="text-xs text-slate-500">
                    Link Safaricom M-Pesa or Visa/Mastercard for seamless renewals.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPaymentModal(false)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Payment Type Selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentType('mpesa')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentType === 'mpesa'
                      ? 'border-[#009924] bg-[#009924]/10 text-[#009924] font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs">Safaricom M-Pesa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentType === 'card'
                      ? 'border-[#045D61] bg-[#045D61]/10 text-[#045D61] font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Credit / Debit Card</span>
                </button>
              </div>

              <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                {paymentType === 'mpesa' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      M-Pesa Registered Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 712 345 678"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#009924]/20 focus:border-[#009924] outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      An STK Push prompt will be sent to this number to verify active wallet status.
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="4500 •••• •••• ••••"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-900 mb-1">
                          Expiry Date (MM/YY) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-900 mb-1">
                          CVC / CVV *
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="123"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPaymentModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Save Payment Method
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
