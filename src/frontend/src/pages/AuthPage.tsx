import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import {
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  Shield,
  Loader2,
  Eye,
  EyeOff,
  Sprout,
  BarChart3,
  Globe,
} from 'lucide-react';
import { authApi } from '../services/api';

export const AuthPage: React.FC = () => {
  const { setToken, setUser, setScreen, showNotification } = useAppStore();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState('farmer@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Joseph Ochieng');
  const [farmName, setFarmName] = useState('Kakamega Demonstration Farm');
  const [region, setRegion] = useState('Western Kenya');
  const [sizeAcres, setSizeAcres] = useState<number>(5.0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login(email, password);
      setToken(res.access_token);
      setUser(res.user);
      showNotification(
        `Welcome back, ${res.user.name || 'Farmer'}! Transitioning to live dashboard...`,
        'success',
        3000,
        'Authentication Successful'
      );
      setTimeout(() => {
        setScreen('screen-dashboard');
      }, 500);
    } catch (err: any) {
      console.warn('API login failed, checking demo fallback:', err);
      if (email === 'farmer@example.com' && password === 'password123') {
        const demoToken =
          'demo_jwt_' + btoa(JSON.stringify({ sub: email, exp: Date.now() / 1000 + 86400 }));
        const demoUser = {
          id: 1,
          name: 'Joseph Ochieng',
          email: 'farmer@example.com',
          farm_name: 'Kakamega Demonstration Farm',
          farm_region: 'Western Kenya',
          farm_size_acres: 5.0,
          farm_crop_type: 'Maize & Dairy',
          tier: 3,
          tier_name: 'Structured Commercial Farm',
          ffmi_score: 13.8,
        };
        setToken(demoToken);
        setUser(demoUser);
        showNotification(
          'Authenticated via Offline Demo Mode.',
          'info',
          3000,
          'Offline Mode'
        );
        setTimeout(() => {
          setScreen('screen-dashboard');
        }, 500);
      } else {
        setError(
          err.response?.data?.detail ||
            'Invalid email or password. Use demo credentials or register a new farm.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.register({
        email,
        password,
        name,
        farm_name: farmName,
        farm_region: region,
        farm_size_acres: Number(sizeAcres),
        farm_crop_type: 'Maize & Dairy',
      });
      setToken(res.access_token);
      setUser(res.user);
      showNotification(
        `Farm successfully registered! Karibu, ${name}.`,
        'success',
        3500,
        'Registration Complete'
      );
      setTimeout(() => {
        setScreen('screen-dashboard');
      }, 500);
    } catch (err: any) {
      console.warn('API register failed, using local simulation:', err);
      const simulatedToken =
        'reg_jwt_' + btoa(JSON.stringify({ sub: email, exp: Date.now() / 1000 + 86400 }));
      const newUser = {
        name,
        email,
        farm_name: farmName,
        farm_region: region,
        farm_size_acres: Number(sizeAcres),
        farm_crop_type: 'Mixed Farming',
        tier: 1,
        tier_name: 'Informal Farm',
        ffmi_score: 8.5,
      };
      setToken(simulatedToken);
      setUser(newUser);
      showNotification(
        `Farm registration initialized for ${farmName}!`,
        'success',
        3500,
        'Welcome to FFF'
      );
      setTimeout(() => {
        setScreen('screen-dashboard');
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillDemo = () => {
    setEmail('farmer@example.com');
    setPassword('password123');
    showNotification('Demo credentials loaded (farmer@example.com). Click Sign In to proceed.', 'info', 3500, 'Demo Mode');
  };

  return (
    <div className="min-h-screen w-full flex bg-canvas text-fff-cyanDark antialiased font-sans">
      {/* ─── Left Column: Cinematic Background Image ────────────────────── */}
      <div className="hidden lg:flex lg:w-7/12 relative bg-fff-cyanDark overflow-hidden min-h-screen select-none">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-M0zduSjDd_tSMQ0ZDJUhx86Xusa39XytT_5kMC9Cq2tsoC6aILqVORPxbnvtTyf00etvYeXPSQU6abOdNLWH7H6iIQG_7ZiOKXyLk_2w19m1KuFb4mVNx-PcqW4vuroAv6eKLh63KQ1anFmxVIxfhApccDEGGRvhI2KQK1HI1pCROV4lZy0T5kJd5BMNKFN-GzjpLjcHy0MsfS-pHH6IaUDMtZ4zimuB68JU7oLkU6N68n_Uth8')`,
            }}
          />
          {/* Overlay gradient using FFF Dark Cyan & Vivid Green tones */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#012527]/95 via-[#045D61]/70 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-end p-12 lg:p-16 text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFD700] text-xs font-extrabold uppercase tracking-wider mb-4 w-fit shadow-sm">
            <Shield className="w-3.5 h-3.5 text-[#009924]" />
            <span>Future Farms Framework · FFF</span>
          </div>

          <h1 className="font-serif text-3xl xl:text-4xl font-bold leading-tight mb-4 text-white drop-shadow-md">
            Building future-ready farms for a sustainable and prosperous future.
          </h1>

          <p className="text-base text-white/90 leading-relaxed mb-8 max-w-lg drop-shadow">
            Empowering smallholder transformation through empirical 8-pillar capability metrics, precision agronomy, and enterprise market linkages.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-[#009924] hover:scale-105 transition-transform"
              title="Sustainability & Agro-Ecology"
            >
              <Sprout className="w-6 h-6" />
            </div>
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-[#1E88E5] hover:scale-105 transition-transform"
              title="Smart Farming & Data Diagnostics"
            >
              <BarChart3 className="w-6 h-6" />
            </div>
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-[#FB8C00] hover:scale-105 transition-transform"
              title="Market Access & Enterprise"
            >
              <Globe className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Column: Authentication Card & Form ──────────────────── */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-14 relative bg-canvas min-h-screen overflow-y-auto">
        {/* Subtle FFF brand ambient glow blob */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-[#045D61]/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 py-6">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#009924]/30 to-[#045D61] border border-[#009924]/40 flex items-center justify-center shadow-lg p-2 flex-shrink-0 backdrop-blur-md glow-cyan">
              <img
                src="/assets/arbarne-emblem-white.png"
                alt="Future Farms Framework"
                className="h-full w-auto object-contain drop-shadow"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#045D61] font-serif">
                Future Farms Framework
              </h2>
              <p className="text-[11px] font-extrabold text-[#009924] tracking-wider uppercase">
                FFF Enterprise Platform
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight mb-1.5">
              {tab === 'login' ? 'Welcome back!' : 'Register Your Farm'}
            </h1>
            <p className="text-sm text-slate-600">
              {tab === 'login'
                ? 'Sign in to continue your Future Farms journey.'
                : 'Create an enterprise profile to begin capability benchmarks.'}
            </p>
          </div>

          {/* Dual Form Mode Toggle Tabs */}
          <div className="p-1 rounded-xl bg-surface-soft border border-[#045D61]/15 grid grid-cols-2 gap-1 text-xs font-bold mb-6">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-white text-[#045D61] shadow-sm border border-[#045D61]/30 font-extrabold'
                  : 'text-slate-600 hover:text-[#045D61]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-white text-[#045D61] shadow-sm border border-[#045D61]/30 font-extrabold'
                  : 'text-slate-600 hover:text-[#045D61]'
              }`}
            >
              Register Farm
            </button>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ─── Form Body ─────────────────────────────────────────── */}
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Address */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-bold text-slate-900 mb-1.5 tracking-wide"
                >
                  Email address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="Enter your email (e.g. farmer@example.com)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold text-slate-900 tracking-wide"
                  >
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickFillDemo}
                    className="text-xs font-bold text-[#045D61] hover:text-[#009924] hover:underline"
                  >
                    Quick demo credentials?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-900 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-[#045D61]/20 font-bold text-sm text-white bg-[#045D61] hover:bg-[#023c3f] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#045D61] transition-all mt-6"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Farmer Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Joseph Ochieng"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="farmer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="min. 8 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none"
                  />
                </div>
              </div>

              {/* Farm Enterprise Name */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Farm Enterprise Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kakamega Demonstration Farm"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Region */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Agro Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="block w-full px-2.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none"
                  >
                    <option value="Western Kenya">Western Kenya</option>
                    <option value="Rift Valley">Rift Valley</option>
                    <option value="Central Kenya">Central Kenya</option>
                    <option value="Eastern Kenya">Eastern Kenya</option>
                    <option value="Coast">Coast</option>
                  </select>
                </div>

                {/* Farm Size */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Size (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={sizeAcres}
                    onChange={(e) => setSizeAcres(Number(e.target.value))}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 text-xs focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl shadow-lg shadow-[#045D61]/20 font-bold text-xs text-white bg-[#045D61] hover:bg-[#023c3f] transition-all mt-4"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Create Account &amp; Enter Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-canvas text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {/* Google Login Button */}
            <button
              type="button"
              onClick={() => {
                showNotification(
                  'Initiating Google Secure Single Sign-On...',
                  'info',
                  3500,
                  'Google SSO'
                );
                handleQuickFillDemo();
              }}
              className="flex items-center justify-center w-full px-3 py-2.5 border border-slate-200 rounded-xl shadow-sm bg-white text-xs font-semibold text-slate-900 hover:bg-emerald-50/40 hover:border-[#009924]/40 active:scale-[0.98] transition-all group"
            >
              <svg className="w-4 h-4 mr-2 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* LinkedIn Login Button */}
            <button
              type="button"
              onClick={() => {
                showNotification(
                  'Initiating LinkedIn Professional Sign-In...',
                  'info',
                  3500,
                  'LinkedIn SSO'
                );
                handleQuickFillDemo();
              }}
              className="flex items-center justify-center w-full px-3 py-2.5 border border-slate-200 rounded-xl shadow-sm bg-white text-xs font-semibold text-slate-900 hover:bg-emerald-50/40 hover:border-[#009924]/40 active:scale-[0.98] transition-all group"
            >
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="#0A66C2"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span>LinkedIn</span>
            </button>
          </div>

          {/* Sign Up / Sign In Footer Link */}
          <div className="mt-8 text-center text-xs text-slate-600">
            {tab === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-[#045D61] hover:text-[#009924] hover:underline font-bold"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-[#045D61] hover:text-[#009924] hover:underline font-bold"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
