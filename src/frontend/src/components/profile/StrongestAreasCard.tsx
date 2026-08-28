import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ProfileAreaItem } from '../../types';

interface StrongestAreasCardProps {
  items?: ProfileAreaItem[];
}

export const StrongestAreasCard: React.FC<StrongestAreasCardProps> = ({ items }) => {
  const defaultItems: ProfileAreaItem[] = [
    {
      title: 'Smart Farming & Tech',
      description: 'Advanced irrigation deployment.',
    },
    {
      title: 'Food Safety',
      description: 'Consistent compliance records.',
    },
  ];

  const areaList = items && items.length > 0 ? items : defaultItems;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 transition-all hover:shadow-sm">
      <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 tracking-tight">
        Strongest Areas
      </h3>

      <div className="space-y-3">
        {areaList.map((item, index) => (
          <div key={index} className="flex items-start gap-2.5">
            {/* Green Check Circle */}
            <div className="mt-0.5 flex-shrink-0 text-[#16A34A]">
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
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
