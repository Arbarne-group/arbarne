import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import {
  Tractor,
  Factory,
  Store,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Sparkles,
  Zap,
  Droplets,
  FileText,
  Users,
  ShieldCheck,
  Award,
  Sun,
  Layers,
  Trees,
  Briefcase,
  Building2,
  TrendingUp,
  Compass,
  Activity,
  Battery,
  Flame,
  BarChart3,
  Bookmark,
  MapPin,
  Search,
  Crosshair,
  Maximize2,
  Plus,
  Minus,
  Navigation,
  Globe,
  Thermometer,
  CloudRain,
  Mountain,
  Snowflake,
  Smartphone,
  Cpu,
  Plane,
  Wifi,
  WifiOff,
  Radio,
  Sliders,
  Settings2,
} from 'lucide-react';

interface OnboardingFormState {
  // Step 1: Profile
  farm_type: string;
  farm_name: string;
  farm_region: string;
  farm_size: number | string;
  farm_size_unit: 'acres' | 'hectares';
  crops: string[];

  // Step 2: Location & Mapping
  location_search: string;
  latitude: number;
  longitude: number;
  zoom: number;
  map_type: 'k' | 'm'; // k = satellite, m = map
  climate_zone: string;
  avg_rainfall: string;
  avg_temp: string;
  soil_type: string;
  solar_irradiance: string;

  // Step 3: Technology, Infrastructure & Diagnostic
  infrastructure: string[];
  digital_tools: string[];
  connectivity: 'none' | 'low' | 'reliable';
  energy_source: 'grid' | 'solar' | 'hybrid' | 'diesel';
  recording_method: string;
  goals: string[];
  selected_package: 'pillar' | 'full';
}

const REGION_PRESETS: Record<
  string,
  {
    name: string;
    lat: number;
    lng: number;
    climate: string;
    rainfall: string;
    temp: string;
    soil: string;
    solar: string;
  }
> = {
  nakuru: {
    name: 'Nakuru County, Kenya',
    lat: -0.3031,
    lng: 36.08,
    climate: 'Tropical Savanna (Sub-Humid)',
    rainfall: '950 - 1200 mm',
    temp: '22°C - 26°C',
    soil: 'Rich Volcanic Loam',
    solar: '5.8 kWh/m²/day',
  },
  kakamega: {
    name: 'Kakamega / Western Kenya',
    lat: 0.2827,
    lng: 34.7519,
    climate: 'Tropical Rainforest / High Rainfall',
    rainfall: '1400 - 1900 mm',
    temp: '21°C - 28°C',
    soil: 'Deep Fertile Nitisols',
    solar: '5.2 kWh/m²/day',
  },
  eldoret: {
    name: 'Eldoret / Uasin Gishu',
    lat: 0.5143,
    lng: 35.2698,
    climate: 'Highland Subtropical',
    rainfall: '1100 - 1400 mm',
    temp: '18°C - 24°C',
    soil: 'Clay Loam (High Organic Matter)',
    solar: '5.6 kWh/m²/day',
  },
  nyeri: {
    name: 'Nyeri / Central Highlands',
    lat: -0.4201,
    lng: 36.9476,
    climate: 'Highland Temperate',
    rainfall: '1200 - 1600 mm',
    temp: '16°C - 23°C',
    soil: 'Andosol Volcanic Ash',
    solar: '5.4 kWh/m²/day',
  },
  meru: {
    name: 'Meru / Mt. Kenya Slopes',
    lat: 0.0463,
    lng: 37.6559,
    climate: 'Montane Humid',
    rainfall: '1300 - 1800 mm',
    temp: '19°C - 25°C',
    soil: 'Porous Volcanic Loam',
    solar: '5.5 kWh/m²/day',
  },
  machakos: {
    name: 'Machakos / Eastern Drylands',
    lat: -1.5177,
    lng: 37.2634,
    climate: 'Semi-Arid Agro-Pastoral',
    rainfall: '600 - 850 mm',
    temp: '24°C - 30°C',
    soil: 'Sandy Clay Loam',
    solar: '6.2 kWh/m²/day',
  },
};

const AVAILABLE_CROPS = [
  'Maize',
  'Coffee',
  'Dairy',
  'Poultry',
  'Wheat',
  'Soybeans',
  'Horticulture & Veg',
  'Avocado & Macadamia',
  'Tea',
  'Aquaculture',
  'Sorghum & Millet',
  'Potatoes',
];

const AVAILABLE_GOALS = [
  'GlobalG.A.P. & Export Readiness',
  '100% Transition to Renewable Energy',
  'Secure Agri-Financing & Commercial Loans',
  'Regenerative Soil Health & Biochar',
  'Direct B2B Market Contracts & Offtake',
  'Digital Telemetry & IoT Sensor Automation',
];

export const OnboardingPage: React.FC = () => {
  const {
    user,
    setUser,
    setScreen,
    showNotification,
    awardXp,
    setCheckoutItem,
  } = useAppStore();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<OnboardingFormState>({
    farm_type: 'commercial',
    farm_name: user.farm_name || 'My Agro-Enterprise',
    farm_region: user.farm_region || 'Nakuru County, Kenya',
    farm_size: user.farm_size_acres || 150,
    farm_size_unit: 'acres',
    crops: ['Maize', 'Dairy', 'Horticulture & Veg'],

    // Location & Mapping
    location_search: 'Nakuru County, Kenya',
    latitude: -0.3031,
    longitude: 36.08,
    zoom: 14,
    map_type: 'k', // Satellite view
    climate_zone: 'Tropical Savanna (Sub-Humid)',
    avg_rainfall: '950 - 1200 mm',
    avg_temp: '22°C - 26°C',
    soil_type: 'Rich Volcanic Loam',
    solar_irradiance: '5.8 kWh/m²/day',

    // Technology, Infrastructure & Diagnostic
    infrastructure: ['irrigation', 'cold_storage'],
    digital_tools: ['mobile', 'sensors'],
    connectivity: 'low',
    energy_source: 'solar',
    recording_method: 'digital',
    goals: [
      '100% Transition to Renewable Energy',
      'GlobalG.A.P. & Export Readiness',
    ],
    selected_package: 'full',
  });

  const [locating, setLocating] = useState(false);

  const handleSelectPreset = (key: string) => {
    const preset = REGION_PRESETS[key];
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        location_search: preset.name,
        farm_region: preset.name,
        latitude: preset.lat,
        longitude: preset.lng,
        climate_zone: preset.climate,
        avg_rainfall: preset.rainfall,
        avg_temp: preset.temp,
        soil_type: preset.soil,
        solar_irradiance: preset.solar,
      }));
      showNotification(`Location updated to ${preset.name}`, 'info', 2500, 'Map Panned');
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showNotification('Geolocation is not supported by your browser.', 'error', 3000, 'GPS Error');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lng = Number(pos.coords.longitude.toFixed(4));
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          location_search: `GPS: ${lat}, ${lng}`,
          farm_region: `GPS: ${lat}, ${lng}`,
        }));
        setLocating(false);
        showNotification(`Pinpointed current GPS location (${lat}, ${lng})`, 'success', 3000, 'GPS Locked');
      },
      (err) => {
        setLocating(false);
        showNotification(`Could not retrieve GPS: ${err.message}`, 'warning', 3500, 'GPS Warning');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const toggleCrop = (crop: string) => {
    setFormData((prev) => {
      const exists = prev.crops.includes(crop);
      return {
        ...prev,
        crops: exists
          ? prev.crops.filter((c) => c !== crop)
          : [...prev.crops, crop],
      };
    });
  };

  const toggleInfrastructure = (item: string) => {
    setFormData((prev) => {
      const exists = prev.infrastructure.includes(item);
      return {
        ...prev,
        infrastructure: exists
          ? prev.infrastructure.filter((i) => i !== item)
          : [...prev.infrastructure, item],
      };
    });
  };

  const toggleDigitalTool = (tool: string) => {
    setFormData((prev) => {
      const exists = prev.digital_tools.includes(tool);
      return {
        ...prev,
        digital_tools: exists
          ? prev.digital_tools.filter((t) => t !== tool)
          : [...prev.digital_tools, tool],
      };
    });
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goal);
      return {
        ...prev,
        goals: exists
          ? prev.goals.filter((g) => g !== goal)
          : [...prev.goals, goal],
      };
    });
  };

  const handleSaveAndExit = () => {
    setUser({
      ...user,
      farm_name: formData.farm_name,
      farm_region: formData.farm_region,
      farm_crop_type: formData.crops.join(', '),
      farm_size_acres:
        formData.farm_size_unit === 'hectares'
          ? Number(formData.farm_size) * 2.471
          : Number(formData.farm_size),
      energy_source: formData.energy_source,
    });
    showNotification('Onboarding progress saved to your farm profile.', 'info', 3000, 'Saved Progress');
    setScreen('screen-dashboard');
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete Onboarding Flow
      const sizeAcres =
        formData.farm_size_unit === 'hectares'
          ? Number(formData.farm_size) * 2.471
          : Number(formData.farm_size);

      setUser({
        ...user,
        farm_name: formData.farm_name,
        farm_region: formData.farm_region,
        farm_crop_type: formData.crops.join(', '),
        farm_size_acres: sizeAcres,
        energy_source: formData.energy_source,
      });

      awardXp(50, 'Completed Farm Onboarding Profile');
      showNotification(
        'Farm profile completed! Welcome to Future Farms Framework.',
        'success',
        4000,
        'Profile Verified'
      );

      if (formData.selected_package === 'pillar') {
        setCheckoutItem({
          scope: 'pillar',
          pillarId: 2,
          title: 'Single Pillar Assessment — Renewable Energy',
          description: 'Deep-dive diagnostic for Productive Use of Renewable Energy with instant gap analysis.',
          priceUsd: 1,
          priceKes: 130,
        });
        setScreen('screen-checkout');
      } else {
        setScreen('screen-assessment-choice');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const mapEmbedUrl = `https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&t=${formData.map_type}&z=${formData.zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* ─── 1. Hero / Progress Header Banner ─────────────────────────── */}
      <section className="bg-gradient-to-br from-[#023c3f] via-[#045D61] to-[#012527] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#045D61]/40 relative overflow-hidden">
        {/* Glow Ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#009924]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FFD700] text-[11px] font-extrabold uppercase tracking-wider border border-white/15">
                <Compass className="w-3.5 h-3.5 text-[#7ffd7b]" />
                <span>Farm Enterprise Setup Wizard</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                AgriTransform Setup
              </h1>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl">
                Configure your operational profile, location coordinates, and technology infrastructure.
              </p>
            </div>

            <button
              onClick={handleSaveAndExit}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save &amp; Exit to Dashboard</span>
            </button>
          </div>

          {/* 3-Step Interactive Breadcrumb Bar */}
          <div className="bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-xs space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-[#FFD700] font-bold uppercase tracking-wider text-[11px]">
                  Step {step} of 3:
                </span>
                <span className="text-white font-bold">
                  {step === 1
                    ? 'Farm Profile & Operational Scale'
                    : step === 2
                    ? 'Location, Satellite Mapping & Climate'
                    : 'Technology & Infrastructure Baseline'}
                </span>
              </div>
              <span className="text-white/70 text-[11px]">
                {step === 1 ? '33%' : step === 2 ? '66%' : '100%'} Complete
              </span>
            </div>

            {/* Segmented Progress Track */}
            <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden flex p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-[#009924] via-[#7ffd7b] to-[#FFD700] rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            {/* Quick Step Navigation Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { num: 1, title: '1. Profile' },
                { num: 2, title: '2. Location & Map' },
                { num: 3, title: '3. Technology & Infra' },
              ].map((s) => (
                <button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all text-center border cursor-pointer ${
                    step === s.num
                      ? 'bg-white text-[#004447] border-[#FFD700] shadow-xs'
                      : step > s.num
                      ? 'bg-white/10 text-[#7ffd7b] border-white/15 hover:bg-white/15'
                      : 'bg-black/20 text-white/60 border-white/10 hover:bg-black/30'
                  }`}
                >
                  {s.title} {step > s.num && '✓'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Main Form Card ────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs space-y-8">
        <AnimatePresence mode="wait">
          {/* ──── STEP 1: FARM PROFILE ───────────────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                  Step 1 • Operational Scale
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#004447] mt-0.5">
                  Tell us about your farm
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Select your operating scale and enterprise structure so we can tailor the diagnostic questions and peer benchmarks.
                </p>
              </div>

              {/* Farm Type */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  What best describes your farm?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Option 1: Smallholder */}
                  <div
                    onClick={() => setFormData({ ...formData, farm_type: 'smallholder' })}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer text-center group flex flex-col items-center justify-between ${
                      formData.farm_type === 'smallholder'
                        ? 'border-[#004447] bg-[#004447]/5 ring-2 ring-[#004447] shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-2 group-hover:border-[#004447] transition-colors shadow-2xs">
                      <Tractor className="w-6 h-6 text-[#004447]" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">Smallholder</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">&lt; 10 Acres</span>
                  </div>

                  {/* Option 2: Commercial Farmer */}
                  <div
                    onClick={() => setFormData({ ...formData, farm_type: 'commercial' })}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer text-center group flex flex-col items-center justify-between ${
                      formData.farm_type === 'commercial'
                        ? 'border-[#004447] bg-[#004447]/5 ring-2 ring-[#004447] shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-2 group-hover:border-[#004447] transition-colors shadow-2xs">
                      <Factory className="w-6 h-6 text-[#004447]" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">Commercial Farmer</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">10–500+ Acres</span>
                  </div>

                  {/* Option 3: Agri-entrepreneur */}
                  <div
                    onClick={() => setFormData({ ...formData, farm_type: 'entrepreneur' })}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer text-center group flex flex-col items-center justify-between ${
                      formData.farm_type === 'entrepreneur'
                        ? 'border-[#004447] bg-[#004447]/5 ring-2 ring-[#004447] shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-2 group-hover:border-[#004447] transition-colors shadow-2xs">
                      <Store className="w-6 h-6 text-[#004447]" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">Agri-entrepreneur</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Value-Add &amp; Processing</span>
                  </div>

                  {/* Option 4: Cooperative / Other */}
                  <div
                    onClick={() => setFormData({ ...formData, farm_type: 'other' })}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer text-center group flex flex-col items-center justify-between ${
                      formData.farm_type === 'other'
                        ? 'border-[#004447] bg-[#004447]/5 ring-2 ring-[#004447] shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-2 group-hover:border-[#004447] transition-colors shadow-2xs">
                      <MoreHorizontal className="w-6 h-6 text-[#004447]" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">Cooperative / Other</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Aggregators &amp; DFI</span>
                  </div>
                </div>
              </div>

              {/* Enterprise Name & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Enterprise / Farm Name
                  </label>
                  <input
                    type="text"
                    value={formData.farm_name}
                    onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
                    placeholder="e.g. Kakamega Demonstration Farm"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-900 focus:border-[#004447] focus:ring-2 focus:ring-[#004447]/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    County / Farm Region
                  </label>
                  <input
                    type="text"
                    value={formData.farm_region}
                    onChange={(e) => setFormData({ ...formData, farm_region: e.target.value })}
                    placeholder="e.g. Nakuru / Western Kenya"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-900 focus:border-[#004447] focus:ring-2 focus:ring-[#004447]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Farm Size */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Total Farm Size
                </label>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <div className="flex-grow">
                    <input
                      type="number"
                      min="1"
                      value={formData.farm_size}
                      onChange={(e) => setFormData({ ...formData, farm_size: e.target.value })}
                      placeholder="e.g. 150"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-900 focus:border-[#004447] focus:ring-2 focus:ring-[#004447]/20 outline-none transition-all"
                    />
                  </div>
                  <div className="sm:w-1/3">
                    <select
                      value={formData.farm_size_unit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          farm_size_unit: e.target.value as 'acres' | 'hectares',
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:border-[#004447] focus:ring-2 focus:ring-[#004447]/20 outline-none cursor-pointer"
                    >
                      <option value="acres">Acres</option>
                      <option value="hectares">Hectares</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Crops / Livestock */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Primary Crops &amp; Livestock
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select all that apply to your primary agricultural operations.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  {AVAILABLE_CROPS.map((crop) => {
                    const isSelected = formData.crops.includes(crop);
                    return (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => toggleCrop(crop)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#004447] text-white border-[#004447] shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {crop}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ──── STEP 2: FARM LOCATION & GOOGLE MAPS ─────────────────────── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                  Step 2 of 3 • Location &amp; Mapping
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#004447] mt-0.5">
                  Farm Location &amp; Precision Coordinates
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Specify the precise geographic location of your farm to access satellite agro-meteorology and tailored soil &amp; solar recommendations.
                </p>
              </div>

              {/* 12-Column Grid: Inputs on Left (5 cols) & Google Maps on Right (7 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Search, Coordinates & Climate Zone (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Search Location Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                      Search Location (Region / County / Town)
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.location_search}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location_search: e.target.value,
                            farm_region: e.target.value,
                          })
                        }
                        placeholder="e.g., Nakuru County, Kenya"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-[#004447] focus:ring-2 focus:ring-[#004447]/20 outline-none transition-all"
                      />
                    </div>

                    {/* Quick Regional Presets */}
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Quick Pick Region:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(REGION_PRESETS).map(([key, item]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleSelectPreset(key)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                              formData.location_search === item.name
                                ? 'bg-[#004447] text-white border-[#004447] shadow-2xs'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {item.name.split('/')[0].split(',')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Precision Coordinates Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Precision Coordinates
                      </span>
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={locating}
                        className="text-[10px] font-extrabold text-[#009924] hover:text-[#007a1c] flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                      >
                        <Crosshair className={`w-3 h-3 ${locating ? 'animate-spin' : ''}`} />
                        <span>{locating ? 'Locating...' : 'Use My GPS'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Latitude
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          value={formData.latitude}
                          onChange={(e) =>
                            setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:border-[#004447] focus:ring-2 focus:ring-[#004447]/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Longitude
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          value={formData.longitude}
                          onChange={(e) =>
                            setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:border-[#004447] focus:ring-2 focus:ring-[#004447]/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Climate Zone Info Card */}
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#009924] text-white flex items-center justify-center">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#007519] block">
                          Agro-Ecological Benchmark
                        </span>
                        <h4 className="text-xs font-bold text-[#004447]">
                          {formData.climate_zone}
                        </h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                        <span className="block text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                          <CloudRain className="w-3 h-3 text-[#004447]" /> Avg. Rainfall
                        </span>
                        <span className="font-bold text-slate-900 text-xs">{formData.avg_rainfall}</span>
                      </div>

                      <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                        <span className="block text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                          <Thermometer className="w-3 h-3 text-[#EF6C00]" /> Avg. Temp
                        </span>
                        <span className="font-bold text-slate-900 text-xs">{formData.avg_temp}</span>
                      </div>

                      <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                        <span className="block text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                          <Mountain className="w-3 h-3 text-[#683C21]" /> Soil Class
                        </span>
                        <span className="font-bold text-slate-900 text-xs truncate">{formData.soil_type}</span>
                      </div>

                      <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                        <span className="block text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                          <Sun className="w-3 h-3 text-[#FDD835]" /> Solar Yield
                        </span>
                        <span className="font-bold text-slate-900 text-xs">{formData.solar_irradiance}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Interactive Google Maps with Pinpoint (7 cols) */}
                <div className="lg:col-span-7 h-[420px] lg:h-[500px] flex flex-col">
                  <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 relative shadow-sm bg-slate-100 flex flex-col">
                    {/* Google Maps Iframe */}
                    <iframe
                      title="Google Maps Location Pin"
                      src={mapEmbedUrl}
                      className="w-full h-full border-0"
                      loading="lazy"
                      allowFullScreen
                    />

                    {/* Overlay Pinpoint Marker in Center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
                      <div className="w-16 h-16 bg-[#004447]/20 rounded-full animate-ping absolute" />
                      <div className="w-8 h-8 rounded-full bg-[#004447] text-white flex items-center justify-center shadow-lg relative z-10 border-2 border-white">
                        <MapPin className="w-4 h-4 text-[#7ffd7b]" />
                      </div>
                      <div className="bg-[#004447] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md mt-1 whitespace-nowrap">
                        Farm Center Point
                      </div>
                    </div>

                    {/* Floating Controls Overlay (Top Right) */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            zoom: Math.min(prev.zoom + 1, 19),
                          }))
                        }
                        className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer border border-slate-200"
                        title="Zoom In"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            zoom: Math.max(prev.zoom - 1, 8),
                          }))
                        }
                        className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer border border-slate-200"
                        title="Zoom Out"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-[#009924] shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer border border-slate-200 mt-2"
                        title="My Location"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Floating Map Mode Switcher (Top Left) */}
                    <div className="absolute top-3 left-3 flex rounded-lg bg-white/95 shadow-md p-0.5 border border-slate-200 z-20 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, map_type: 'k' }))}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          formData.map_type === 'k'
                            ? 'bg-[#004447] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Satellite
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, map_type: 'm' }))}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          formData.map_type === 'm'
                            ? 'bg-[#004447] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Map
                      </button>
                    </div>

                    {/* Bottom Status Bar on Map */}
                    <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 flex justify-between items-center z-20">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#004447]" />
                        <span>Lat: {formData.latitude.toFixed(4)}, Lng: {formData.longitude.toFixed(4)}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Google Maps Live Telemetry
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ──── STEP 3: TECHNOLOGY & INFRASTRUCTURE ─────────────────────── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                  Step 3 of 3 • Technology &amp; Infrastructure
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#004447] mt-0.5">
                  Farm Infrastructure &amp; Digital Readiness
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Select your physical equipment, digital tools, and connectivity to calibrate the 40-capability assessment baseline.
                </p>
              </div>

              {/* Section 1: Current Infrastructure (Multi-select) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-[#1E88E5]" />
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Current Physical Infrastructure (Select All That Apply)
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { id: 'irrigation', label: 'Irrigation System', icon: <Droplets className="w-5 h-5 text-[#009924]" />, desc: 'Drip, sprinkler, or solar borehole lines' },
                    { id: 'greenhouses', label: 'Greenhouses & Tunnels', icon: <Trees className="w-5 h-5 text-[#2E7D32]" />, desc: 'Polytunnels & controlled environment shading' },
                    { id: 'cold_storage', label: 'Cold Storage / Hub', icon: <Snowflake className="w-5 h-5 text-[#045D61]" />, desc: 'Phase-change or solar cold room cooling' },
                    { id: 'processing', label: 'Processing & Packhouse', icon: <Factory className="w-5 h-5 text-[#8E24AA]" />, desc: 'Washing lines, sorting crates & packaging units' },
                  ].map((item) => {
                    const isSelected = formData.infrastructure.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleInfrastructure(item.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? 'border-[#004447] bg-[#004447]/5 ring-2 ring-[#004447] shadow-2xs'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                            {item.icon}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                            <span className="text-[11px] text-slate-500">{item.desc}</span>
                          </div>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#004447] text-white'
                              : 'border-2 border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Section 2: Digital Tools Used (Multi-select) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#1E88E5]" />
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Digital Tools &amp; Telemetry Used
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {[
                    { id: 'mobile', label: 'Mobile Apps', icon: <Smartphone className="w-6 h-6 text-[#1E88E5]" />, desc: 'Smartphone crop logs & records' },
                    { id: 'sensors', label: 'Field Sensors & IoT', icon: <Cpu className="w-6 h-6 text-[#009924]" />, desc: 'Soil moisture & weather probes' },
                    { id: 'drones', label: 'Drones / UAVs', icon: <Plane className="w-6 h-6 text-[#FB8C00]" />, desc: 'Aerial multispectral crop mapping' },
                  ].map((tool) => {
                    const isSelected = formData.digital_tools.includes(tool.id);
                    return (
                      <div
                        key={tool.id}
                        onClick={() => toggleDigitalTool(tool.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center relative group h-32 ${
                          isSelected
                            ? 'border-[#004447] bg-[#004447]/5 ring-2 ring-[#004447] shadow-2xs'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full absolute top-3 right-3 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#004447] text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>

                        <div className="mb-1.5">{tool.icon}</div>
                        <span className="text-xs font-bold text-slate-900">{tool.label}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">{tool.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Section 3 & 4: Connectivity & Primary Energy Source (2 Cols) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Connectivity */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-[#3949AB]" />
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Connectivity Status
                    </label>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { id: 'none', label: 'None / Sporadic', desc: 'Offline ledger sync only' },
                      { id: 'low', label: 'Low Bandwidth (2G / 3G)', desc: 'Basic SMS and mobile data' },
                      { id: 'reliable', label: 'Reliable Broadband (4G / 5G / Fiber)', desc: 'High-speed real-time telemetry' },
                    ].map((c) => (
                      <div
                        key={c.id}
                        onClick={() =>
                          setFormData({ ...formData, connectivity: c.id as 'none' | 'low' | 'reliable' })
                        }
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          formData.connectivity === c.id
                            ? 'border-[#004447] bg-[#004447]/5 ring-2 ring-[#004447]'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{c.label}</span>
                          <span className="text-[10px] text-slate-500">{c.desc}</span>
                        </div>
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center">
                          {formData.connectivity === c.id && (
                            <div className="w-2 h-2 rounded-full bg-[#004447]" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Energy Source */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FDD835]" />
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Primary Energy Source
                    </label>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { id: 'solar', label: 'Solar Power & Battery Inverters', icon: <Sun className="w-4 h-4 text-[#FDD835]" /> },
                      { id: 'grid', label: 'National Grid Commercial Tariff', icon: <Zap className="w-4 h-4 text-[#1E88E5]" /> },
                      { id: 'hybrid', label: 'Hybrid Microgrid / Biogas', icon: <Flame className="w-4 h-4 text-[#009924]" /> },
                      { id: 'diesel', label: 'Diesel Generator Primary', icon: <Battery className="w-4 h-4 text-[#ba1a1a]" /> },
                    ].map((e) => (
                      <div
                        key={e.id}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            energy_source: e.id as 'grid' | 'solar' | 'hybrid' | 'diesel',
                          })
                        }
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          formData.energy_source === e.id
                            ? 'border-[#004447] bg-[#004447]/5 ring-2 ring-[#004447]'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {e.icon}
                          <span className="text-xs font-bold text-slate-900">{e.label}</span>
                        </div>
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center">
                          {formData.energy_source === e.id && (
                            <div className="w-2 h-2 rounded-full bg-[#004447]" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Section 5: Strategic Transformation Goals */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Strategic Goals (Select All That Apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_GOALS.map((goal) => {
                    const isSelected = formData.goals.includes(goal);
                    return (
                      <div
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? 'border-[#009924] bg-emerald-50/60 ring-1 ring-[#009924]'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                            isSelected ? 'bg-[#009924] text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-semibold text-slate-900 leading-snug">
                          {goal}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Section 6: Starting Diagnostic Package Picker */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Select Starting Diagnostic Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option A: $1 Single Pillar */}
                  <div
                    onClick={() => setFormData({ ...formData, selected_package: 'pillar' })}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      formData.selected_package === 'pillar'
                        ? 'border-[#004447] bg-[#004447]/5 ring-2 ring-[#004447] shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EF6C00] bg-[#EF6C00]/10 px-2 py-0.5 rounded-md">
                          Quick Sprint
                        </span>
                        <span className="text-base font-bold text-slate-900">$1.00</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        Single-Pillar Capability Deep Dive
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Audit a single priority area (e.g. Renewable Energy) in under 4 minutes with 25 targeted questions.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#004447]">
                      <span>Instant Priority Action Plan</span>
                      <span>➔</span>
                    </div>
                  </div>

                  {/* Option B: $10 Full Baseline */}
                  <div
                    onClick={() => setFormData({ ...formData, selected_package: 'full' })}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      formData.selected_package === 'full'
                        ? 'border-[#009924] bg-emerald-50/50 ring-2 ring-[#009924] shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="absolute top-0 right-0 px-3 py-0.5 bg-[#FFD700] text-[#004447] text-[9px] font-extrabold uppercase tracking-wider rounded-bl-lg">
                      Recommended
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#009924] bg-[#009924]/10 px-2 py-0.5 rounded-md">
                          Full Baseline
                        </span>
                        <span className="text-base font-bold text-slate-900">$10.00</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        Comprehensive 8-Pillar FFV Audit
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Full 40-capability diagnostic across all 8 pillars. Calculates your definitive FFMI maturity score &amp; official certificate.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#009924]">
                      <span>Full Verified PDF Certificate</span>
                      <span>➔</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Bottom Action Bar Inside Page ─────────────────────────── */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              step === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200'
                : 'text-slate-700 border-slate-300 hover:bg-slate-100 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAndExit}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Save Progress
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#004447] hover:bg-[#023c3f] transition-all shadow-md cursor-pointer"
            >
              <span>{step === 3 ? 'Complete Setup & Launch Diagnostic' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
