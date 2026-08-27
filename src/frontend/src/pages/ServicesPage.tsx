import React, { useState, useEffect } from 'react';
import { portalApi } from '../services/api';
import { useAppStore } from '../store/useStore';
import { ServiceProvider } from '../types';
import { Wrench, CheckCircle, Star, MapPin, Loader2 } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { showNotification } = useAppStore();
  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices(category);
  }, [category]);

  const loadServices = async (cat: string) => {
    setLoading(true);
    try {
      const data = await portalApi.getServices(cat);
      setServices(data);
    } catch {
      // Mock Fallback
      setServices([
        {
          id: 1,
          name: 'SunCulture Kenya',
          category: 'Renewable Energy',
          service_title: 'Solar Drip Irrigation & Pumping Systems',
          description: 'High-efficiency solar pumps with pay-as-you-grow financing options.',
          pricing_kes: 45000,
          pricing_unit: 'system installation',
          region_served: 'Western & Rift Valley',
          verified: true,
          rating: 4.9,
          pillar_id: 2,
        },
        {
          id: 2,
          name: 'Cropnuts Soil Analytics',
          category: 'Smart Farming',
          service_title: 'GPS Grid Soil Chemistry & Carbon Scan',
          description: 'Laboratory spectrometry determining N-P-K, pH, micronutrients, and soil organic matter.',
          pricing_kes: 3500,
          pricing_unit: 'per acre sample',
          region_served: 'Nationwide',
          verified: true,
          rating: 4.8,
          pillar_id: 1,
        },
        {
          id: 3,
          name: 'Hello Tractor Mechanization Hub',
          category: 'Mechanization',
          service_title: 'On-Demand Disc Ploughing & Ripping',
          description: 'Smart tractor fleet aggregation with verified telemetry acre tracking.',
          pricing_kes: 2800,
          pricing_unit: 'per acre',
          region_served: 'Western Kenya',
          verified: true,
          rating: 4.7,
          pillar_id: 6,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Renewable Energy', 'Smart Farming', 'Mechanization'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30 text-xs font-bold uppercase tracking-wider mb-2">
          <Wrench className="w-4 h-4 text-[#009924]" />
          <span>Vetted Agribusiness Ecosystem</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Services Portal &amp; Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Access verified input providers, clean energy suppliers, mechanization hubs, and agronomic laboratory services tailored to your capability scorecard.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
              category === c
                ? 'bg-[#045D61] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Service Provider Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500 text-xs font-semibold">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#045D61]" />
          <span>Loading verified provider directory...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-xl transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30 uppercase">
                    {s.category}
                  </span>
                  {s.verified && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#009924]">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {s.service_title}
                </h3>
                <div className="text-xs font-semibold text-[#045D61]">{s.name}</div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-extrabold text-slate-900">
                    KES {s.pricing_kes.toLocaleString()}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">
                      / {s.pricing_unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#FB8C00] font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{s.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.region_served}</span>
                </div>

                <button
                  onClick={() =>
                    showNotification(
                      `Linkage requested from ${s.name}. An agribusiness advisor will reach you shortly.`,
                      'success',
                      4500,
                      'Service Linkage'
                    )
                  }
                  className="w-full py-2.5 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs shadow-md shadow-[#009924]/20 transition-colors"
                >
                  Request Service Linkage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
