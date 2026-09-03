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

interface RadarChartProps {
  labels?: string[];
  scores?: number[];
  benchmarkScores?: number[];
}

export default function RadarChart({
  labels = [
    "Soil & Crops",
    "Water Mgmt",
    "Technology",
    "Business",
    "Labor & Team",
    "Resilience",
    "Market Access",
    "Post-Harvest",
  ],
  scores = [82, 75, 68, 85, 79, 72, 88, 76],
  benchmarkScores = [65, 60, 50, 70, 62, 58, 72, 60],
}: RadarChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Your Farm Score",
        data: scores,
        backgroundColor: "rgba(0, 153, 36, 0.25)",
        borderColor: "#009924",
        borderWidth: 2.5,
        pointBackgroundColor: "#009924",
        pointBorderColor: "#ffffff",
        pointHoverBackgroundColor: "#ffffff",
        pointHoverBorderColor: "#009924",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Regional Benchmark",
        data: benchmarkScores,
        backgroundColor: "rgba(26, 104, 108, 0.1)",
        borderColor: "#1a686c",
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointBackgroundColor: "#1a686c",
        pointBorderColor: "#ffffff",
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: "rgba(110, 123, 105, 0.2)",
        },
        grid: {
          color: "rgba(110, 123, 105, 0.15)",
        },
        pointLabels: {
          font: {
            family: "var(--font-outfit)",
            size: 11,
            weight: 600,
          },
          color: "#191c1d",
        },
        ticks: {
          display: false,
          min: 0,
          max: 100,
          stepSize: 20,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            family: "var(--font-outfit)",
            size: 12,
            weight: 500,
          },
          color: "#3e4a3b",
          usePointStyle: true,
          padding: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return ` ${context.dataset.label}: ${context.raw} / 100`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[320px] md:h-[360px] flex items-center justify-center">
      <Radar data={data} options={options} />
    </div>
  );
}
