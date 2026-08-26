import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { authApi } from '../services/api';
import { LogIn, UserPlus, Shield, Loader2, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { setToken, setUser, setScreen, showNotification } = useAppStore();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [farmName, setFarmName] = useState('');
  const [region, setRegion] = useState('Western Kenya');
  const [sizeAcres, setSizeAcres] = useState(5.0);
  const [crops, setCrops] = useState('Maize, Dairy & Vegetables');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(email, password);
      setToken(res.access_token);
      setUser(res.user);
      showNotification(`Karibu, ${res.user.name.split(' ')[0]}! You are logged in.`, 'success');
      setScreen('screen-dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
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
        name,
        email,
        phone,
        farm_name: farmName,
        farm_region: region,
        farm_size_acres: sizeAcres,
        farm_crop_type: crops,
        password,
      });
      setToken(res.access_token);
      setUser(res.user);
      showNotification('Account registered successfully! Welcome to Future Farms.', 'success');
      setScreen('screen-dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillDemo = () => {
    setTab('login');
    setEmail('farmer@example.com');
    setPassword('demo1234');
    showNotification('Demo credentials loaded. Click Log In to enter.', 'info');
  };

  return (
    <div className="max-w-md mx-auto py-6 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-[#022c24] border border-emerald-400/40 mx-auto flex items-center justify-center shadow-xl backdrop-blur-md">
          <img
            src="/assets/arbarne-emblem-white.png"
            alt="Arbarne Emblem"
            className="h-10 w-auto object-contain drop-shadow"
          />
        </div>
        <h1 className="font-serif text-3xl font-bold text-white sm:text-pine-950">
          Future Farms Portal
        </h1>
        <p className="text-xs text-white/70 sm:text-slate-600">
          Arbarne Agriculture Group Smallholder Transformation Platform
        </p>
      </div>

      {/* Tabs */}
      <div className="p-1 rounded-2xl bg-slate-200/80 grid grid-cols-2 gap-1 text-xs font-bold">
        <button
          onClick={() => {
            setTab('login');
            setError(null);
          }}
          className={`py-2 rounded-xl transition-all ${
            tab === 'login'
              ? 'bg-white text-pine-950 shadow-sm'
              : 'text-slate-600 hover:text-pine-950'
          }`}
        >
          Log In
        </button>
        <button
          onClick={() => {
            setTab('register');
            setError(null);
          }}
          className={`py-2 rounded-xl transition-all ${
            tab === 'register'
              ? 'bg-white text-pine-950 shadow-sm'
              : 'text-slate-600 hover:text-pine-950'
          }`}
        >
          Register New Farm
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Form Container */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-900/10 shadow-xl">
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="e.g. farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium text-xs"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-pine-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In to Platform</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Farmer Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Joseph Ochieng"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium text-xs"
                />
              </div>
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="min. 8 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Farm Enterprise Name
              </label>
              <input
                type="text"
                placeholder="e.g. Kakamega Demofarm"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium text-xs"
                >
                  <option value="Western Kenya">Western Kenya</option>
                  <option value="Rift Valley">Rift Valley</option>
                  <option value="Central Kenya">Central Kenya</option>
                  <option value="Eastern Kenya">Eastern Kenya</option>
                  <option value="Coast">Coast</option>
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Size (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={sizeAcres}
                  onChange={(e) => setSizeAcres(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-pine-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account &amp; Enter Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleQuickFillDemo}
          className="text-xs text-sprout-400 sm:text-emerald-800 hover:underline font-bold inline-flex items-center gap-1"
        >
          <span>Use Quick Demo Credentials (farmer@example.com)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
