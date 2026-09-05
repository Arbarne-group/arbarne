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
  const data = {
    labels,
    datasets: [
      {
        label: "Your Score",
        data: scores,
        backgroundColor: "rgba(0, 107, 22, 0.2)",
        borderColor: "#006b16",
        pointBackgroundColor: "#006b16",
        pointBorderColor: "#ffffff",
        pointHoverBackgroundColor: "#ffffff",
        pointHoverBorderColor: "#006b16",
        pointRadius: 4,
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
            size: 10,
            weight: 500,
          },
          color: "#3e4a3b",
          padding: 12,
        },
        ticks: {
          display: false,
          min: 0,
          max: 100,
          stepSize: 25,
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
            return ` ${context.dataset.label}: ${context.raw}%`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[260px] md:min-h-[290px] flex items-center justify-center">
      <Radar data={data} options={options} />
    </div>
  );
}
