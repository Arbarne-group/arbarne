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
  2: 'P2 Clean Energy',
  3: 'P3 Food Safety',
  4: 'P4 Resilience',
  5: 'P5 Performance',
  6: 'P6 Human Capital',
  7: 'P7 Market Access',
  8: 'P8 Invest Ready',
};

const DEFAULT_SCORES: Record<number, number> = {
  1: 0.72,
  2: 0.45,
  3: 0.85,
  4: 0.60,
  5: 0.78,
  6: 0.50,
  7: 0.68,
  8: 0.40,
};

const DEFAULT_BENCHMARKS: Record<number, number> = {
  1: 0.55,
  2: 0.48,
  3: 0.52,
  4: 0.60,
  5: 0.45,
  6: 0.58,
  7: 0.50,
  8: 0.46,
};

export const RadarChart: React.FC<RadarChartProps> = ({
  pillarScores = DEFAULT_SCORES,
  benchmarkScores = DEFAULT_BENCHMARKS,
}) => {
  const data = Object.keys(PILLAR_LABELS).map((key) => {
    const pId = Number(key);
    return {
      pillar: PILLAR_LABELS[pId],
      farm: Math.round((pillarScores[pId] ?? 0.5) * 100),
      benchmark: Math.round((benchmarkScores[pId] ?? 0.5) * 100),
    };
  });

  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar data={data}>
          <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="pillar"
            tick={{ fill: '#022c24', fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Radar
            name="Your Farm Enterprise"
            dataKey="farm"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.35}
            strokeWidth={2}
          />
          <Radar
            name="Regional Peer Benchmark"
            dataKey="benchmark"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.15}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#022c24',
              borderColor: '#10b981',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '12px',
            }}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
};
