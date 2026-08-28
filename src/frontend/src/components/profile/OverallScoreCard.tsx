import React from 'react';
import { Zap } from 'lucide-react';
import { User } from '../../types';

interface OverallScoreCardProps {
  user: User;
}

export const OverallScoreCard: React.FC<OverallScoreCardProps> = ({ user }) => {
  const score = user.overall_score || user.ffmi_score || 72;
  const tierName = user.tier_name || 'Emerging Agribusiness';
  const percentile = user.percentile_rank || 'Top 15% in region';
  const percentage = Math.min(100, Math.max(0, score));

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FBBF24] via-[#F59E0B] to-[#EAB308] p-5 sm:p-5.5 shadow-sm transition-all hover:shadow-md">
      {/* Background Watermark Icon */}
      <div className="absolute -top-3 -right-3 pointer-events-none opacity-20 text-amber-950">
        <Zap className="w-28 h-28 stroke-[1.2]" />
      </div>

      <div className="relative z-10">
        {/* Top Header Label */}
        <span className="block text-[10px] font-extrabold tracking-wider uppercase text-amber-950/80 mb-1.5">
          OVERALL FFF SCORE
        </span>

        {/* Big Score Display */}
        <div className="flex items-baseline">
          <span className="text-4xl sm:text-[42px] font-black text-slate-900 tracking-tight leading-none">
            {score}
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-900/80 ml-1.5">
            / 100
          </span>
        </div>

        {/* Maturity Classification Tier */}
        <div className="text-xs font-bold text-amber-950 mt-1.5 mb-3.5">
          {tierName}
        </div>

        {/* Dark Green Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-amber-900/20 overflow-hidden">
          <div
            className="h-full bg-[#064E3B] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Percentile Caption */}
        <div className="text-[11px] font-bold text-slate-900 text-right mt-1.5 tracking-tight">
          {percentile}
        </div>
      </div>
    </div>
  );
};
