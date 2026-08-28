import React from 'react';
import { MapPin, CheckCircle } from 'lucide-react';
import { User } from '../../types';

interface FarmHeroCardProps {
  user: User;
}

export const FarmHeroCard: React.FC<FarmHeroCardProps> = ({ user }) => {
  const farmName = user.farm_name || 'Green Valley Acres';
  const region = user.farm_region || 'Nairobi Region, Kenya';
  const totalHectares = user.total_size_hectares || (user.farm_size_acres ? Math.round(user.farm_size_acres / 2.471) : 120);
  const primaryCrops = user.farm_crop_type || 'Maize, Soybeans, Avocados';
  const isVerified = user.verified ?? true;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row gap-5 lg:gap-7 items-stretch">
        {/* Farm Aerial / Hero Photo */}
        <div className="relative w-full md:w-[260px] lg:w-[290px] h-[190px] sm:h-[210px] rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/60 shadow-inner group">
          <img
            src="/assets/green-valley-farm.jpg"
            alt={farmName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Farm Header Info */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            {/* Top row: Name & Verified Pill Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {farmName}
              </h2>

              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#22C55E] text-white text-[11px] font-bold shadow-xs">
                  <CheckCircle className="w-3 h-3 stroke-[2.5]" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            {/* Location with Pin */}
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{region}</span>
            </div>
          </div>

          {/* Bottom Row: Total Size & Primary Crops */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-3 border-t border-slate-100">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                TOTAL SIZE
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {totalHectares}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Hectares
                </span>
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                PRIMARY CROPS
              </span>
              <div className="text-xs sm:text-sm font-bold text-[#045D61] leading-snug">
                {primaryCrops}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
