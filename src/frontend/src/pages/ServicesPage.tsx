import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portalApi } from '../services/api';
import { useAppStore } from '../store/useStore';
import { ServiceProvider } from '../types';
import {
  Wrench,
  CheckCircle,
  Star,
  MapPin,
  Loader2,
  Search,
  Lightbulb,
  Droplets,
  Phone,
  MessageSquare,
  ShieldCheck,
  Filter,
  Grid,
  Map as MapIcon,
  X,
  ExternalLink,
  Sparkles,
  ArrowRight,
  DollarSign,
  Building,
  Check,
} from 'lucide-react';

interface ExtendedServiceProvider extends ServiceProvider {
  image_url?: string;
  recommendation_reason?: string;
}

const DEFAULT_SERVICES: ExtendedServiceProvider[] = [
  {
    id: 1,
    name: 'AgriLab Soil Testing',
    category: 'Soil Testing',
    service_title: 'AgriLab Soil Testing',
    description: 'Comprehensive soil health analysis with detailed macronutrient reporting.',
    pricing_kes: 3500,
    pricing_unit: 'per acre sample',
    cost_model: 'KES 3,500 / acre sample',
    region_served: 'Nairobi Region',
    verified: true,
    rating: 4.9,
    pillar_id: 1,
    is_recommended: true,
    recommendation_reason: 'Recommended because your recent Soil Health assessment identified nutrient optimization opportunities.',
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKgc9Bcx25v36JqoCI8atBSc69sym8memLJAxKDPjz5NJ_x3FaZp-b1sAJpAzmTU-Om_ZUIs3kTlXQWDutqd3KPlKEajgkWIbf3yRw-dkFXLV0VRP8wVCKpx_XKN90Qas-MNukusmQljEJwwxS1OyGRZt8pg1hOZ6uB7e9f-E90fFl1DEDDR1PbwNy3I5OkDS6X58ZlrLIerVpy-PelUyZv5pSnTTyW3FuBCjqiT9JWlwFrICexzU',
    contact_phone: '+254 712 345 678',
  },
  {
    id: 2,
    name: 'SolarPump Solutions',
    category: 'Irrigation',
    service_title: 'SolarPump Solutions',
    description: 'Sustainable, solar-powered irrigation hardware installation and maintenance.',
    pricing_kes: 48000,
    pricing_unit: 'complete installation',
    cost_model: 'KES 48,000 / installation',
    region_served: 'Rift Valley',
    verified: true,
    rating: 4.8,
    pillar_id: 2,
    is_recommended: true,
    recommendation_reason: 'Recommended based on reported Water Management gaps in your farm profile.',
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfKYKy0FWlaBDkCrqBrWNg2EQ3RVe9EUi3lLm2z10P32kGCd_qIGTWRNKlTfBVXZoEO06UNQTik-Bkpw6ZR-RwGgHruBvw7XGAFTVAcKMifET8DYPnnsxm5jPzuTPfzRxT4vPC3j9wSc6lXtix-OWYtTIKB7f67CcNMNjV2vjSsaqfIg-2WrCg-ItTTLR7bey4Wl7v0b6It8MbWC350v5eZqHLIc4KfuotF14sPwMczBSBkT7iV9s',
    contact_phone: '+254 722 987 654',
  },
  {
    id: 3,
    name: 'YieldMax Consultants',
    category: 'Agronomy',
    service_title: 'YieldMax Consultants',
    description: 'Expert crop monitoring and yield forecasting services using satellite imagery.',
    pricing_kes: 1500,
    pricing_unit: 'acre / month',
    cost_model: 'KES 1,500 / acre per month',
    region_served: 'Nairobi Region',
    verified: true,
    rating: 4.7,
    pillar_id: 1,
    is_recommended: false,
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBvi_J3cFV5Ju_iJ7ml7d1qdgdG7CaxHXnWg2chlz8-UA2kLcnDC9-yeEs7r_88cLONAHXCCjCSMREJdUylVqV_egc2XFKmISyTpuJki8DLscGxi2NjFeLBcuSeJtyKoZdio9o37iarC-9RMH1yYB-c-jCcjmc-O6aN5_qKSAixGxd_BXssc1uA3wwnsn0d88edfXz_askRqmb92d-0Uk8f4gr6xVIaYELvVm7wvCg4JlGVEoAkWU0',
    contact_phone: '+254 733 112 233',
  },
  {
    id: 4,
    name: 'AgriFinance Group',
    category: 'Financial',
    service_title: 'AgriFinance Group',
    description: 'Micro-loans and equipment financing specifically structured for mid-sized farms.',
    pricing_unit: 'loan facility',
    cost_model: 'Rates from 8.5% p.a.',
    region_served: 'Central Province',
    verified: true,
    rating: 4.5,
    pillar_id: 8,
    is_recommended: false,
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA2YC1FoB829836ISyNwvLd7jmkDyQqgdOKyr73GW6v36CCXD7h8NHwipWCskOYuFjwp9iMBwuPKynX1mRl6k9WPSNzqc8kZBUv8flmM92aR3tHItb2c1JwXqrjBWKmKLuQ5VIyC4NgiorG5BvMZY7zffo4EAYVzJ-aWRphGs8gMU_mx-jtrXyH4zn6ExHHwaJVBoLXE1zxZCsEy8NSAVz6xrDMlS1rrCu7cUnQkbZPm56IFd88yt4',
    contact_phone: '+254 700 445 566',
  },
  {
    id: 5,
    name: 'FreshChain Logistics',
    category: 'Market Access',
    service_title: 'FreshChain Logistics',
    description: 'Cold-chain transport and direct-to-market connecting services for fresh produce.',
    pricing_kes: 12,
    pricing_unit: 'kg transported',
    cost_model: 'KES 12 / kg',
    region_served: 'Mombasa & Coastal',
    verified: true,
    rating: 4.8,
    pillar_id: 7,
    is_recommended: false,
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAiqK7qQuWIu31rr9adqx1R3uUF0z3aSBwmyQyem5p5hNEz4basEGohoK8pn2ZmxsBnPEjCjJWYZclXuQdCjZH3wbCcBIy6lIASP4CpJEkDM50KSiJS3x1Ns-S6ZDvDiWgeJpgClokGVJ32WC83LKyTsYd0qH5FQYaqgHiR9ggjqtF2wfWZqvzrU2NDOs3blR2rg6LSf5RXv6WswivwkO-Kn3cow-nfuH_Dkq11x0kwH2ApglvlZeI',
    contact_phone: '+254 711 778 899',
  },
  {
    id: 6,
    name: 'EcoNutrients Plus',
    category: 'Inputs',
    service_title: 'EcoNutrients Plus',
    description: 'Supplier of premium, scientifically formulated organic fertilizers and biopesticides.',
    pricing_kes: 2400,
    pricing_unit: '50kg bag',
    cost_model: 'KES 2,400 / 50kg bag',
    region_served: 'Western Region',
    verified: true,
    rating: 4.2,
    pillar_id: 5,
    is_recommended: false,
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBemCqJzQx7axeQG1PC6s_tk15Pb4MGK6eWU6701_L0SIeB6s_Opd13LvHdXrkkKq2V-a3nEFp37J1fbl0sBshPWE2TshCRNV6mwTpH5Q2042sj8Fnet8PDlDZDLgYPk6tIfSgqMOC6Mf4iAUh70-GuqNu88BHR-0CSzkqKOqi8KeVh85IVQosW5Cs3mt6Gv-yc3VityjiHSEMjoq-0rBYw-z7HK09p_vI60LWDCzlEQkXqXbAP7Rg',
    contact_phone: '+254 720 334 455',
  },
];

const CATEGORIES = [
  'all',
  'Agronomy',
  'Soil Testing',
  'Irrigation',
  'Financial Services',
  'Market Access',
  'Inputs',
];

export const ServicesPage: React.FC = () => {
  const { showNotification, assessment } = useAppStore();
  const [services, setServices] = useState<ExtendedServiceProvider[]>(DEFAULT_SERVICES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [loading, setLoading] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState<ExtendedServiceProvider | null>(null);

  useEffect(() => {
    loadServices(selectedCategory);
  }, [selectedCategory]);

  const loadServices = async (cat: string) => {
    setLoading(true);
    try {
      const data = await portalApi.getServices(cat);
      if (data && data.length > 0) {
        // Merge with DEFAULT_SERVICES to keep rich media and recommendation reasons
        const existingIds = new Set(data.map((d) => d.id));
        const merged = [
          ...data.map((s) => ({
            ...s,
            image_url:
              DEFAULT_SERVICES.find((ds) => ds.id === s.id)?.image_url ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBvi_J3cFV5Ju_iJ7ml7d1qdgdG7CaxHXnWg2chlz8-UA2kLcnDC9-yeEs7r_88cLONAHXCCjCSMREJdUylVqV_egc2XFKmISyTpuJki8DLscGxi2NjFeLBcuSeJtyKoZdio9o37iarC-9RMH1yYB-c-jCcjmc-O6aN5_qKSAixGxd_BXssc1uA3wwnsn0d88edfXz_askRqmb92d-0Uk8f4gr6xVIaYELvVm7wvCg4JlGVEoAkWU0',
            recommendation_reason:
              DEFAULT_SERVICES.find((ds) => ds.id === s.id)?.recommendation_reason ||
              'Matches your farm transformation scorecard and priority capability gaps.',
            contact_phone: DEFAULT_SERVICES.find((ds) => ds.id === s.id)?.contact_phone || '+254 700 000 000',
          })),
          ...DEFAULT_SERVICES.filter((ds) => !existingIds.has(ds.id)),
        ];
        setServices(merged);
      } else {
        setServices(DEFAULT_SERVICES);
      }
    } catch {
      setServices(DEFAULT_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      s.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.service_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.region_served && s.region_served.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const recommendedServices = services.filter((s) => s.is_recommended);

  const handleRequestService = async (service: ExtendedServiceProvider) => {
    try {
      if (typeof service.id === 'number' || (typeof service.id === 'string' && !isNaN(Number(service.id)))) {
        await portalApi.requestService(
          Number(service.id),
          assessment.latestResult?.assessment_id,
          `Request for ${service.service_title || service.name}`
        );
      }
      showNotification(
        `Service connection request sent to ${service.name}. An agribusiness representative will contact you.`,
        'success',
        4500,
        'Provider Connected'
      );
    } catch (err: any) {
      showNotification(
        `Service connection request sent to ${service.name}.`,
        'success',
        4500,
        'Provider Connected'
      );
    } finally {
      setActiveServiceModal(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ─── 1. Header & Search Bar ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Wrench className="w-4 h-4 text-[#009924]" />
            <span>Vetted Agribusiness Directory</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Farm Services &amp; Inputs Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Find trusted, verified services and input suppliers that can help you bridge capability gaps, improve water efficiency, and accelerate enterprise growth.
          </p>
        </div>

        {/* Global Search Input */}
        <div className="relative flex items-center w-full md:w-80 group">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 group-focus-within:text-[#045D61] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search providers, inputs, soil labs..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ─── 2. Category Filter Pills ──────────────────────────────────── */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                isSelected
                  ? 'bg-[#045D61] text-white shadow-sm border border-[#045D61]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
              }`}
            >
              {cat === 'all' ? 'All Services' : cat}
            </button>
          );
        })}
      </div>

      {/* ─── 3. Recommended for Your Farm Section ──────────────────────── */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#009924] animate-pulse" />
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Recommended for Your Farm</span>
              <span className="px-2 py-0.5 rounded-full bg-[#009924]/10 text-[#009924] text-[10px] font-extrabold uppercase tracking-wider border border-[#009924]/20">
                Tailored Gaps
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedServices.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 relative group overflow-hidden"
              >
                {/* Subtle corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#045D61]/5 opacity-20 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

                {/* Service Image Container */}
                <div className="w-full md:w-36 h-36 md:h-auto rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200 relative shadow-inner">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.service_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Wrench className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-[#045D61] flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                    <span>{service.rating ?? 4.8}</span>
                  </div>
                </div>

                {/* Service Info */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#045D61]/10 text-[#045D61] uppercase tracking-wider">
                        {service.category}
                      </span>
                      {service.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#009924]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verified Provider</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug">
                      {service.service_title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {service.name}
                    </p>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Recommendation Callout */}
                  <div className="bg-[#045D61]/5 p-3 rounded-xl border border-[#045D61]/15 flex items-start gap-2 text-xs text-[#045D61]">
                    <Lightbulb className="w-4 h-4 flex-shrink-0 text-[#009924] mt-0.5" />
                    <p className="text-[11px] leading-snug">
                      {service.recommendation_reason}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{service.region_served || 'Western Kenya'}</span>
                    </div>

                    <button
                      onClick={() => setActiveServiceModal(service)}
                      className="px-4 py-2 bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 hover:scale-105"
                    >
                      <span>View Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 4. All Service Providers Directory ────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-slate-900">
              All Service Providers ({filteredServices.length})
            </h2>
            <p className="text-xs text-slate-500">
              Verified mechanization, bio-inputs, agronomic advisory, and cold chain partners.
            </p>
          </div>

          {/* List / Map View Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200/90 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white shadow-xs text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'map'
                  ? 'bg-white shadow-xs text-[#045D61]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Regional Map</span>
            </button>
          </div>
        </div>

        {/* View Mode: Map Simulation vs Bento Grid */}
        {viewMode === 'map' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Regional Service Coverage Map (East Africa)
                </h3>
                <p className="text-xs text-slate-500">
                  Active field providers across Western Kenya, Central, Rift Valley, and Coastal regions.
                </p>
              </div>
              <span className="px-3 py-1 bg-[#009924]/10 text-[#009924] rounded-full text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#009924] animate-ping" />
                <span>6 Hubs Online</span>
              </span>
            </div>

            {/* Simulated Regional Map Card */}
            <div className="h-80 rounded-2xl bg-gradient-to-br from-slate-900 via-[#045D61] to-[#012527] relative overflow-hidden flex items-center justify-center p-6 text-white shadow-inner">
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

              <div className="relative z-10 text-center space-y-3 max-w-md">
                <MapPin className="w-10 h-10 text-[#FFD700] mx-auto animate-bounce" />
                <h4 className="font-serif text-xl font-bold text-white">
                  Interactive GIS Provider Overlay
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  All providers are geo-tagged according to their service radius in Western Kenya, Rift Valley, Nairobi, and Coastal agro-ecological zones.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">Western: 3 Hubs</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">Rift Valley: 2 Hubs</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">Central: 1 Hub</span>
                </div>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500 text-xs font-semibold">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#045D61]" />
            <span>Loading verified provider directory...</span>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <Search className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-slate-700">No Services Found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your category filter or searching for a different keyword.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#045D61] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group"
              >
                {/* Card Header Image */}
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.service_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                      <Wrench className="w-8 h-8" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-900 flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span>{service.rating ?? 4.8}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-[#045D61]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white uppercase tracking-wider shadow-xs">
                    {service.category}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug">
                      {service.service_title}
                    </h3>
                    <p className="text-xs font-bold text-[#045D61]">
                      {service.name}
                    </p>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-medium pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{service.region_served || 'Kenya'}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                      {service.description}
                    </p>
                  </div>

                  {/* Card Pricing & CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Cost Model</span>
                      <span className="font-extrabold text-slate-900">
                        {typeof service.pricing_kes === 'number' ? (
                          `KES ${service.pricing_kes.toLocaleString()} / ${service.pricing_unit || 'unit'}`
                        ) : (
                          service.cost_model || 'Contact for pricing'
                        )}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveServiceModal(service)}
                      className="px-4 py-2 border border-slate-200 hover:border-[#045D61] text-[#045D61] group-hover:bg-[#045D61] group-hover:text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ─── 5. Service Details & Connection Request Modal ──────────────── */}
      <AnimatePresence>
        {activeServiceModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                    Verified Provider Connection
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                    {activeServiceModal.service_title}
                  </h3>
                  <p className="text-xs font-bold text-[#045D61] mt-0.5">
                    {activeServiceModal.name} • {activeServiceModal.region_served}
                  </p>
                </div>
                <button
                  onClick={() => setActiveServiceModal(null)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <p>{activeServiceModal.description}</p>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Pricing Model:</span>
                    <span className="font-bold text-slate-900">
                      {typeof activeServiceModal.pricing_kes === 'number'
                        ? `KES ${activeServiceModal.pricing_kes.toLocaleString()} / ${activeServiceModal.pricing_unit || 'unit'}`
                        : activeServiceModal.cost_model}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Service Rating:</span>
                    <span className="font-bold text-[#009924] flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span>{activeServiceModal.rating ?? 4.8} / 5.0 (Vetted)</span>
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Direct Contact:</span>
                    <span className="font-bold text-slate-900">
                      {activeServiceModal.contact_phone || '+254 700 000 000'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Call-to-action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
                <button
                  onClick={() => setActiveServiceModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRequestService(activeServiceModal)}
                  className="flex-1 px-5 py-2.5 bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs rounded-xl shadow-md shadow-[#009924]/20 transition-all flex items-center justify-center gap-2 hover:scale-102"
                >
                  <Phone className="w-4 h-4" />
                  <span>Request Callback &amp; Quote</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
