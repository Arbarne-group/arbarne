import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ProfileAreaItem } from '../../types';

interface RequiresAttentionCardProps {
  items?: ProfileAreaItem[];
}

export const RequiresAttentionCard: React.FC<RequiresAttentionCardProps> = ({ items }) => {
  const defaultItems: ProfileAreaItem[] = [
    {
      title: 'Energy & Reliability',
      description: 'High reliance on diesel generators.',
    },
    {
      title: 'Financial Documentation',
      description: 'Incomplete yield records for Q3.',
    },
  ];

  const areaList = items && items.length > 0 ? items : defaultItems;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 transition-all hover:shadow-sm">
      <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 tracking-tight">
        Requires Attention
      </h3>

      <div className="space-y-3">
        {areaList.map((item, index) => (
          <div key={index} className="flex items-start gap-2.5">
            {/* Red Alert Circle */}
            <div className="mt-0.5 flex-shrink-0 text-[#EF4444]">
              <AlertCircle className="w-4 h-4 stroke-[2.2]" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
