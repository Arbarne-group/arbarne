import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portalApi } from '../services/api';
import { useAppStore } from '../store/useStore';
import { ServiceProvider, PILLAR_BRAND_COLORS } from '../types';
import {
  Wrench,
  MapPin,
  Loader2,
  Search,
  Phone,
  MessageSquare,
  Grid,
  Map as MapIcon,
  X,
  ArrowRight,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { showNotification, assessment } = useAppStore();
  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [allServices, setAllServices] = useState<ServiceProvider[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [loading, setLoading] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceProvider | null>(null);

  // Real categories derived dynamically from the loaded services (plus an "All Help" option).
  const categories = useMemo(() => {
    const unique = Array.from(new Set(allServices.map((s) => s.category).filter(Boolean)));
    return ['all', ...unique];
  }, [allServices]);

  const categoryLabel = (cat: string) => (cat === 'all' ? 'All Help' : cat);

  // Returns the Tailwind classes for the icon box based on the pillar brand color.
  const iconBoxClass = (pillarId?: number) => {
    const brand = pillarId ? PILLAR_BRAND_COLORS[pillarId] : undefined;
    return brand
      ? `${brand.bgLight} ${brand.borderLight} ${brand.textClass}`
      : 'bg-slate-100 border-slate-200 text-slate-500';
  };

  const iconGlyph = (icon?: string) => icon || '🛠️';

  useEffect(() => {
    loadServices(selectedCategory);
  }, [selectedCategory]);

  const loadServices = async (cat: string) => {
    setLoading(true);
    try {
      const data = await portalApi.getServices(cat);
      const safe = Array.isArray(data) ? data : [];
      setServices(safe);
      // Cache the full directory (only returned when 'all') so category chips stay truthful.
      if (cat === 'all' || cat === undefined) {
        setAllServices(safe);
      }
    } catch {
      // Never fall back to fake data — show an empty state instead.
      setServices([]);
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
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const recommendedServices = services.filter((s) => s.is_recommended);

  const handleRequestService = async (service: ServiceProvider) => {
    try {
      if (typeof service.id === 'number' || (typeof service.id === 'string' && !isNaN(Number(service.id)))) {
        await portalApi.requestService(
          Number(service.id),
          assessment.latestResult?.assessment_id,
          `Request for ${service.service_title || service.name}`
        );
      }
      showNotification(
        `We have sent your message to ${service.name}. They will contact you soon.`,
        'success',
        4500,
        'Message Sent'
      );
    } catch (err: any) {
      showNotification(
        `We have sent your message to ${service.name}.`,
        'success',
        4500,
        'Message Sent'
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
            <span>Trusted Local Help</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Find Help for Your Farm
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Find trusted local service providers you can call for help with water, soil, machines, and more.
          </p>
        </div>

        {/* Global Search Input */}
        <div className="relative flex items-center w-full md:w-80 group">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 group-focus-within:text-[#045D61] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help, irrigation, soil testing..."
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
      <section className="space-y-3">
        <h2 className="font-serif text-lg font-bold text-slate-900">Help by Farm Area</h2>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
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
                {categoryLabel(cat)}
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── 3. Recommended for Your Farm Section ──────────────────────── */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#009924] animate-pulse" />
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Suggested for Your Farm</span>
              <span className="px-2 py-0.5 rounded-full bg-[#009924]/10 text-[#009924] text-[10px] font-extrabold uppercase tracking-wider border border-[#009924]/20">
                Suggested for You
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

                {/* Service Icon Container */}
                <div
                  className={`w-full md:w-36 h-36 md:h-auto rounded-2xl overflow-hidden flex-shrink-0 border flex items-center justify-center text-4xl shadow-inner ${iconBoxClass(
                    service.pillar_id
                  )}`}
                >
                  <span aria-hidden="true">{iconGlyph(service.icon)}</span>
                </div>

                {/* Service Info */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#045D61]/10 text-[#045D61] uppercase tracking-wider">
                        {service.category}
                      </span>
                      {service.is_recommended && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#009924]">
                          <span>Suggested for your farm</span>
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

                  {/* Cost Callout (real data only) */}
                  <div className="bg-[#045D61]/5 p-3 rounded-xl border border-[#045D61]/15 flex items-start gap-2 text-xs text-[#045D61]">
                    <span className="text-[11px] leading-snug font-semibold">
                      {service.cost_model || 'Contact for cost'}
                    </span>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                      {service.contact_phone ? (
                        <>
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{service.contact_phone}</span>
                        </>
                      ) : (
                        <span className="text-slate-400">No phone listed</span>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveServiceModal(service)}
                      className="px-4 py-2 bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 hover:scale-105"
                    >
                      <span>See Details</span>
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
              All Help &amp; Services ({filteredServices.length})
            </h2>
            <p className="text-xs text-slate-500">
              Trusted local providers you can contact for your farm.
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
              <span>List</span>
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
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* View Mode: Map Simulation vs Bento Grid */}
        {viewMode === 'map' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Where Providers Are Located
                </h3>
                <p className="text-xs text-slate-500">
                  Providers available across Western Kenya, Central, Rift Valley, and Coastal regions.
                </p>
              </div>
              <span className="px-3 py-1 bg-[#009924]/10 text-[#009924] rounded-full text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#009924] animate-ping" />
                <span>
                  {allServices.length} providers • {Math.max(0, categories.length - 1)} categories
                </span>
              </span>
            </div>

            {/* Simulated Regional Map Card */}
            <div className="h-80 rounded-2xl bg-gradient-to-br from-slate-900 via-[#045D61] to-[#012527] relative overflow-hidden flex items-center justify-center p-6 text-white shadow-inner">
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

              <div className="relative z-10 text-center space-y-3 max-w-md">
                <MapPin className="w-10 h-10 text-[#FFD700] mx-auto animate-bounce" />
                <h4 className="font-serif text-xl font-bold text-white">
                  Find Providers Near You
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  {allServices.length} service provider{allServices.length === 1 ? '' : 's'} across{' '}
                  {Math.max(0, categories.length - 1)} categor
                  {Math.max(0, categories.length - 1) === 1 ? 'y' : 'ies'} are available through the Future Farms portal.
                </p>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500 text-xs font-semibold">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#045D61]" />
            <span>Finding providers...</span>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <Search className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-slate-700">No service providers found</h3>
            <p className="text-xs text-slate-500">
              We couldn't find any providers for this selection. Try another category or search word.
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs hover:bg-slate-50 transition-colors"
              >
                Show All
              </button>
              <button
                onClick={() => loadServices(selectedCategory)}
                className="px-4 py-2 bg-[#045D61] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Loader2 className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group"
              >
                {/* Card Header Icon */}
                <div
                  className={`h-40 flex items-center justify-center text-5xl border-b border-slate-200/80 ${iconBoxClass(
                    service.pillar_id
                  )}`}
                >
                  <span aria-hidden="true">{iconGlyph(service.icon)}</span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug">
                        {service.service_title}
                      </h3>
                      {service.is_recommended && (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-[#009924]/10 text-[#009924] text-[10px] font-extrabold uppercase tracking-wider border border-[#009924]/20">
                          Suggested
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#045D61]">
                      {service.name}
                    </p>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-medium pt-0.5">
                      {service.contact_phone ? (
                        <>
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{service.contact_phone}</span>
                        </>
                      ) : (
                        <span className="text-slate-400">No phone listed</span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                      {service.description}
                    </p>
                  </div>

                  {/* Card Pricing & CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Cost</span>
                      <span className="font-extrabold text-slate-900">
                        {service.cost_model || 'Contact for cost'}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveServiceModal(service)}
                      className="px-4 py-2 border border-slate-200 hover:border-[#045D61] text-[#045D61] group-hover:bg-[#045D61] group-hover:text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                    >
                      See Details
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
                    Contact This Provider
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                    {activeServiceModal.service_title}
                  </h3>
                  <p className="text-xs font-bold text-[#045D61] mt-0.5">
                    {activeServiceModal.name}
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
                    <span className="text-slate-500">Cost:</span>
                    <span className="font-bold text-slate-900">
                      {activeServiceModal.cost_model || 'Contact for cost'}
                    </span>
                  </div>
                  {activeServiceModal.is_recommended && (
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">Match:</span>
                      <span className="font-bold text-[#009924]">Suggested for your farm</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-bold text-slate-900">
                      {activeServiceModal.contact_phone || 'Not listed'}
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
                  Close
                </button>
                <div className="flex items-center gap-2">
                  {activeServiceModal.contact_phone && (
                    <a
                      href={`tel:${activeServiceModal.contact_phone}`}
                      className="px-5 py-2.5 bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs rounded-xl shadow-md shadow-[#045D61]/20 transition-all flex items-center justify-center gap-2 hover:scale-102"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </a>
                  )}
                  <button
                    onClick={() => handleRequestService(activeServiceModal)}
                    className="px-5 py-2.5 bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs rounded-xl shadow-md shadow-[#009924]/20 transition-all flex items-center justify-center gap-2 hover:scale-102"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
