import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarChartProps {
  pillarScores?: Record<number, number>;
  benchmarkScores?: Record<number, number>;
}

const PILLAR_LABELS: Record<number, string> = {
  1: 'P1 Smart Farming',
  2: 'P2 P.U.R.E Clean Energy',
  3: 'P3 Food Safety',
  4: 'P4 Climate Resilience',
  5: 'P5 Performance',
  6: 'P6 Human Capital',
  7: 'P7 Market Access',
  8: 'P8 Invest Readiness',
};

export const RadarChart: React.FC<RadarChartProps> = ({
  pillarScores,
  benchmarkScores,
}) => {
  const hasScores =
    !!pillarScores && Object.keys(pillarScores).length > 0;
  const hasBenchmarks =
    !!benchmarkScores && Object.keys(benchmarkScores).length > 0;

  if (!hasScores) {
    return (
      <div className="w-full h-72 sm:h-80 flex items-center justify-center">
        <div className="text-center px-6 py-10 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm max-w-sm">
          <div className="w-14 h-14 rounded-3xl bg-[#045D61]/10 text-[#045D61] flex items-center justify-center mx-auto text-2xl mb-3">
            🌱
          </div>
          <h4 className="font-serif text-lg font-bold text-slate-900">
            No farm profile yet
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Complete a Farm Check to see your farm profile.
          </p>
        </div>
      </div>
    );
  }

  const data = Object.keys(PILLAR_LABELS).map((key) => {
    const pId = Number(key);
    return {
      pillar: PILLAR_LABELS[pId],
      farm: Math.round((pillarScores[pId] ?? 0) * 100),
      benchmark: hasBenchmarks
        ? Math.round((benchmarkScores[pId] ?? 0) * 100)
        : 0,
    };
  });

  return (
    <div className="w-full">
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar data={data}>
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="pillar"
              tick={{ fill: '#045D61', fontSize: 11, fontWeight: 700 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <Radar
              name="Your Farm"
              dataKey="farm"
              stroke="#009924"
              fill="#045D61"
              fillOpacity={0.42}
              strokeWidth={2.5}
            />
            {hasBenchmarks && (
              <Radar
                name="Regional Peer Benchmark"
                dataKey="benchmark"
                stroke="#1E88E5"
                fill="#1E88E5"
                fillOpacity={0.15}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: '#045D61',
                borderColor: '#009924',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '12px',
                boxShadow: '0 8px 24px rgba(4, 93, 97, 0.35)',
              }}
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3.5 h-3.5 rounded-sm"
            style={{ backgroundColor: '#045D61', opacity: 0.42, border: '2px solid #009924' }}
          />
          <span className="text-xs font-semibold text-slate-600">Your Farm</span>
        </div>
        {hasBenchmarks && (
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3.5 h-3.5 rounded-sm"
              style={{ backgroundColor: '#1E88E5', opacity: 0.15, border: '1.5px dashed #1E88E5' }}
            />
            <span className="text-xs font-semibold text-slate-600">
              Regional Peer Benchmark
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
