"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const BAND_COUNT = 8;
const BAND_STEP = 100 / BAND_COUNT;

/**
 * Final wedge colors per pillar (P1..P8), used as the dark outermost shade.
 * Each wedge lightens toward the center from these.
 */
const PILLAR_WEDGE_COLORS = [
  "#1E88E5", // P1 - blue
  "#FDD835", // P2 - yellow/amber
  "#43A047", // P3 - green
  "#2E7D32", // P4 - dark green
  "#8E24AA", // P5 - purple
  "#3949AB", // P6 - indigo
  "#FB8C00", // P7 - orange
  "#683c21", // P8 - brown
];

/** Converts hex to HSL (h: 0-360, s/l: 0-100). */
/** https://www.jameslmilner.com/posts/converting-rgb-hex-hsl-colors */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const h0 = hex.replace("#", "");
  const full =
    h0.length === 3 ? h0.split("").map((c) => c + c).join("") : h0;
  const num = parseInt(full, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: h * 60, s: s * 100, l: l * 100 };
}

/**
 * Shade for a band block: block 0 (center) is pure white; blocks 1..7 step
 * LIGHTNESS down in equal perceptual jumps from near-white to the pure
 * accent color, keeping the pillar hue and saturation throughout.
 */
function pillarShade(hex: string, block: number): string {
  if (block === 0) return "#ffffff";
  const { h, s, l } = hexToHsl(hex);
  const TOP_LIGHTNESS = 93;
  const steps = BAND_COUNT - 1;
  const light = TOP_LIGHTNESS - (TOP_LIGHTNESS - l) * (block / steps);
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(light)}%)`;
}

/**
 * Paints the radar background as one wedge ("pie") per pillar
 */
const pillarBandPlugin = {
  id: "pillarBands",
  beforeDatasetsDraw(chart: any) {
    const scale = chart?.scales?.r;
    if (!scale) return;
    const count: number = chart.data?.labels?.length || 8;
    const area = chart.chartArea;
    if (!area) return;
    // The radial scale's own center, NOT the chart-area center
    const cx = scale.xCenter ?? (area.left + area.right) / 2;
    const cy = scale.yCenter ?? (area.top + area.bottom) / 2;
    const stepAngle = (Math.PI * 2) / count;
    const { ctx } = chart;
    ctx.save();
    for (let i = 0; i < count; i++) {
      let baseAngle: number;
      try {
        const edge = scale.getPointPosition(i, 10);
        baseAngle = Math.atan2(edge.y - cy, edge.x - cx);
      } catch {
        continue;
      }
      const accent = PILLAR_WEDGE_COLORS[i] ?? "#006b16";
      for (let b = 0; b < BAND_COUNT; b++) {
        let inner = 0;
        let outer = 0;
        try {
          inner = scale.getDistanceFromCenterForValue(b * BAND_STEP);
          outer = scale.getDistanceFromCenterForValue((b + 1) * BAND_STEP);
        } catch {
          continue;
        }
        if (!isFinite(inner) || !isFinite(outer) || outer <= 0) continue;
        // Equal lightness steps: block 0 white, blocks 1..7 from
        // near-white down to the pure pillar accent at the rim.
        const fill = pillarShade(accent, b);
        ctx.beginPath();
        ctx.arc(cx, cy, outer, baseAngle - stepAngle / 2, baseAngle + stepAngle / 2);
        ctx.arc(
          cx,
          cy,
          Math.max(inner, 0.1),
          baseAngle + stepAngle / 2,
          baseAngle - stepAngle / 2,
          true
        );
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};

interface RadarChartProps {
  labels?: (string | string[])[];
  scores?: number[];
  benchmarkScores?: number[];
  showLegend?: boolean;
}

export default function RadarChart({
  labels = [
    ["P1 Smart Farming", "& Digital Transformation"],
    "P2 Renewable Energy",
    ["P3 Food Safety,", "Quality & Compliance"],
    ["P4 Indigenous Knowledge", "& Climate Resilience"],
    ["P5 Business", "Performance & Growth"],
    ["P6 Human Capital,", "Leadership & Operations"],
    ["P7 Market Access,", "Customer Value"],
    ["P8 Investment", "Readiness"],
  ],
  scores = [78, 62, 70, 84, 65, 75, 72, 58],
  benchmarkScores = [65, 55, 62, 60, 68, 60, 70, 55],
  showLegend = false,
}: RadarChartProps) {
  // Color the points against the benchmark for that pillar
  const BELOW_COLOR = "#d97706";
  const ABOVE_COLOR = "#006b16";
  const EMPTY_COLOR = "#b6c2b1";

  const benchmarkAt = (index: number) =>
    index < benchmarkScores.length ? benchmarkScores[index] : undefined;

  const isBelowBenchmark = (score: number, index: number) => {
    const bench = benchmarkAt(index);
    return score > 0 && bench !== undefined && score < bench;
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Your Score",
        data: scores,
        backgroundColor: "rgba(0, 107, 22, 0.2)",
        borderColor: "#006b16",
        pointBackgroundColor: scores.map((s, i) =>
          s <= 0 ? EMPTY_COLOR : isBelowBenchmark(s, i) ? BELOW_COLOR : ABOVE_COLOR
        ),
        pointBorderColor: "#ffffff",
        pointHoverBackgroundColor: "#ffffff",
        pointHoverBorderColor: scores.map((s, i) =>
          s <= 0 ? EMPTY_COLOR : isBelowBenchmark(s, i) ? BELOW_COLOR : ABOVE_COLOR
        ),
        pointRadius: scores.map((s, i) => (isBelowBenchmark(s, i) ? 5.5 : 4)),
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: "Average Future Farm",
        data: benchmarkScores,
        backgroundColor: "transparent",
        borderColor: "#bdcab6",
        borderDash: [5, 5],
        pointBackgroundColor: "#bdcab6",
        pointBorderColor: "#ffffff",
        pointHoverBackgroundColor: "#ffffff",
        pointHoverBorderColor: "#bdcab6",
        pointRadius: 3,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: "#e1e3e4",
        },
        grid: {
          color: "#e1e3e4",
          circular: true,
        },
        pointLabels: {
          font: {
            family: "'Outfit', sans-serif",
            size: 13,
            weight: 500,
          },
          color: "#3e4a3b",
          padding: 12,
        },
        ticks: {
          display: false,
          min: 0,
          max: 100,
          stepSize: BAND_STEP,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: showLegend,
        position: "bottom" as const,
        labels: {
          font: {
            family: "'Outfit', sans-serif",
            size: 12,
          },
          color: "#3e4a3b",
        },
      },
      tooltip: {
        backgroundColor: "rgba(25, 28, 29, 0.9)",
        titleFont: { size: 12, family: "'Outfit', sans-serif" },
        bodyFont: { size: 12, family: "'Outfit', sans-serif" },
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const value = context.raw as number;
            const bench =
              context.dataset.label === "Your Score"
                ? benchmarkAt(context.dataIndex)
                : undefined;
            const suffix =
              bench !== undefined &&
              (value as number) > 0 &&
              (value as number) < bench
                ? ` (below benchmark ${bench}%)`
                : "";
            return ` ${context.dataset.label}: ${value}%${suffix}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[260px] md:min-h-[290px] flex items-center justify-center">
      <Radar data={data} options={options} plugins={[pillarBandPlugin]} />
    </div>
  );
}
