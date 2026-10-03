"use client";

/** FFMI 0–24 classification bands. */
export const FFMI_BANDS = [
  { label: "Informal", min: 0, max: 4, color: "#e53935" },
  { label: "Emerging", min: 5, max: 9, color: "#f19c30" },
  { label: "Structured", min: 10, max: 15, color: "#fdd835" },
  { label: "Investment Ready", min: 16, max: 20, color: "#43a047" },
  { label: "Future Ready", min: 21, max: 24, color: "#045d61" },
];

export const FFMI_MAX = 24;

export function classifyFfmi(score: number): (typeof FFMI_BANDS)[number] {
  const s = Math.max(0, Math.min(FFMI_MAX, score));
  return FFMI_BANDS.find((b) => s <= b.max) ?? FFMI_BANDS[FFMI_BANDS.length - 1];
}

/** Solid color of a single FFMI point (1–24). */
export function ffmiPointColor(point: number): string {
  const p = Math.max(1, Math.min(FFMI_MAX, Math.round(point)));
  return classifyFfmi(p).color;
}

const CX = 200;
const CY = 200;
const R_OUT = 170;
const R_IN = 118;
const STEP = 360 / FFMI_MAX;
const GAP = 0.75; // hairline breathing room between divisions

function polar(r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

/** One annular division, counting clockwise from the top (point 1 at 12 o'clock). */
function divisionPath(point: number): string {
  const a0 = (point - 1) * STEP + GAP / 2;
  const a1 = point * STEP - GAP / 2;
  const [sx, sy] = polar(R_OUT, a0);
  const [ex, ey] = polar(R_OUT, a1);
  const [ix, iy] = polar(R_IN, a1);
  const [jx, jy] = polar(R_IN, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return (
    `M ${sx.toFixed(2)} ${sy.toFixed(2)} ` +
    `A ${R_OUT} ${R_OUT} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)} ` +
    `L ${ix.toFixed(2)} ${iy.toFixed(2)} ` +
    `A ${R_IN} ${R_IN} 0 ${large} 0 ${jx.toFixed(2)} ${jy.toFixed(2)} Z`
  );
}

interface FfmiGaugeProps {
  /** FFMI score on the 0–24 scale. */
  score: number;
  /** False before any assessment exists: renders a neutral track. */
  active?: boolean;
}

export default function FfmiGauge({ score, active = true }: FfmiGaugeProps) {
  const clamped = Math.max(0, Math.min(FFMI_MAX, score));
  const filled = active ? Math.round(clamped) : 0;
  const band = classifyFfmi(clamped);

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-center items-center gap-4">
      <div className="relative w-full max-w-[420px]">
      <svg
        viewBox="0 0 400 400"
        className="w-full"
        role="img"
        aria-label={`FFMI score ${clamped} out of 24, ${band.label}`}
      >
        {Array.from({ length: FFMI_MAX }).map((_, k) => {
          const point = k + 1;
          // Every division always carries its band color; unreached points
          // sit muted in the background instead of gray.
          const on = active && point <= filled;
          return (
            <path
              key={point}
              d={divisionPath(point)}
              fill={ffmiPointColor(point)}
              fillOpacity={on ? 1 : 0.22}
              stroke="#ffffff"
              strokeWidth={1}
            >
              <title>{`Point ${point}: ${FFMI_BANDS.find((b) => point <= b.max)?.label}`}</title>
            </path>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-black text-on-surface">
          {active ? clamped.toFixed(clamped % 1 === 0 ? 0 : 1) : "–"}
          <span className="text-xl font-bold text-on-surface-variant">/24</span>
        </span>
        <span
          className="text-xs font-bold uppercase tracking-widest mt-1 px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: active ? band.color : "#9ca3af" }}
        >
          {active ? band.label : "Not assessed"}
        </span>
      </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {FFMI_BANDS.map((b) => (
          <span
            key={b.label}
            className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant font-medium"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: b.color }}
            />
            {b.label}
            <span className="font-bold text-on-surface tabular-nums">
              {b.min}–{b.max}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
