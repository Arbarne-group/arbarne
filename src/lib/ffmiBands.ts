/**
 * Canonical FFMI 0–24 farm business classification bands.
 * Single source of truth for the dashboard FFMI card and the
 * Transformation Report PDF.
 */
export interface FfmiBand {
  range: string;
  name: string;
  tagline: string;
  body: string;
  min: number;
  max: number;
}

export const FFMI_BANDS: FfmiBand[] = [
  {
    range: "0–4",
    name: "Informal - Farm Business",
    tagline: "Building the Foundation",
    body: "Formal business systems, records, planning, and management practices are still limited. The priority is to establish the basic foundations of a farm business.",
    min: 0,
    max: 4,
  },
  {
    range: "5–9",
    name: "Emerging - Farm business",
    tagline: "Building the Business",
    body: "The farm is beginning to operate as a business, with some systems and commercial practices in place. The next step is to strengthen consistency, financial management, productivity, and market orientation.",
    min: 5,
    max: 9,
  },
  {
    range: "10–15",
    name: "Structured - Farm Business",
    tagline: "Strengthening for Growth",
    body: "The farm has established business and operational systems and demonstrates a more consistent approach to managing production and performance. The focus is now on closing capability gaps and preparing for sustainable growth and investment.",
    min: 10,
    max: 15,
  },
  {
    range: "16–20",
    name: "Investment-Ready - Farm Business",
    tagline: "Prepared for Investment",
    body: "The farm demonstrates the business, financial, governance, operational, and market capabilities needed to prepare for external investment or strategic partnerships. The focus is on evidence, scalability, risk management, and effective capital deployment.",
    min: 16,
    max: 20,
  },
  {
    range: "21–24",
    name: "Future-Ready Farm Business",
    tagline: "Leading for the Future",
    body: "The farm demonstrates advanced and integrated capabilities across its farm system, with strong foundations for resilience, innovation, competitiveness, sustainable growth, and continued improvement.",
    min: 21,
    max: 24,
  },
];

export function classifyFfmiBand(score24: number): FfmiBand {
  const s = Math.max(0, Math.min(24, score24));
  return FFMI_BANDS.find((b) => s <= b.max) ?? FFMI_BANDS[FFMI_BANDS.length - 1];
}
