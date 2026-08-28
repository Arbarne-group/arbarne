import React from 'react';
import { Mountain, Droplets, Users, Sun } from 'lucide-react';
import { User } from '../../types';

interface FarmAttributesGridProps {
  user: User;
}

export const FarmAttributesGrid: React.FC<FarmAttributesGridProps> = ({ user }) => {
  const attributes = [
    {
      id: 'soil',
      label: 'SOIL TYPE',
      value: user.soil_type || 'Clay Loam',
      icon: <Mountain className="w-4 h-4 text-slate-700" />,
      bgColor: 'bg-slate-100',
    },
    {
      id: 'water',
      label: 'WATER SOURCE',
      value: user.water_source || 'Borehole & Rain',
      icon: <Droplets className="w-4 h-4 text-sky-600" />,
      bgColor: 'bg-sky-50',
    },
    {
      id: 'workforce',
      label: 'WORKFORCE',
      value: user.workforce || '15 Permanent',
      icon: <Users className="w-4 h-4 text-[#045D61]" />,
      bgColor: 'bg-teal-50',
    },
    {
      id: 'energy',
      label: 'ENERGY',
      value: user.energy || 'Solar Grid',
      icon: <Sun className="w-4 h-4 text-amber-600" />,
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
      {attributes.map((attr) => (
        <div
          key={attr.id}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 sm:p-4 flex flex-col justify-between transition-all hover:shadow-sm hover:border-slate-300 group"
        >
          {/* Icon Circle */}
          <div
            className={`w-8 h-8 rounded-full ${attr.bgColor} flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform`}
          >
            {attr.icon}
          </div>

          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {attr.label}
            </span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 tracking-tight truncate">
              {attr.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
