import { customAlphabet, nanoid } from "nanoid";

export const TICKET_CATEGORIES = [
  "Pillar Support",
  "FFMI/24 Assessment",
  "Learning",
  "FFV",
  "Opportunity Desk",
  "Services Desk",
  "Pricing & Payments",
  "General Inquiry",
] as const;

export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

export const TICKET_STATUSES = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number]["value"];

export function ticketStatusLabel(status: string): string {
  return (
    TICKET_STATUSES.find((s) => s.value === status)?.label ??
    status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/** Pill classes per status (house semantic colors). */
export const TICKET_STATUS_PILL: Record<string, string> = {
  open: "bg-blue-600/10 text-blue-700 border border-blue-600/25",
  in_progress: "bg-amber-500/10 text-amber-700 border border-amber-500/30",
  resolved: "bg-primary/10 text-primary border border-primary/25",
  closed: "bg-surface-variant text-on-surface-variant border border-outline-variant",
};

export function ticketStatusPill(status: string): string {
  return (
    TICKET_STATUS_PILL[status] ??
    "bg-surface-variant text-on-surface-variant border border-outline-variant"
  );
}

/** Material-symbol icon per department. */
export const DEPARTMENT_ICONS: Record<string, string> = {
  "Pillar Support": "layers",
  "FFMI/24 Assessment": "fact_check",
  Learning: "school",
  FFV: "verified",
  "Opportunity Desk": "lightbulb",
  "Services Desk": "handyman",
  "Pricing & Payments": "payments",
  "General Inquiry": "forum",
};

export function departmentIcon(category: string): string {
  return DEPARTMENT_ICONS[category] ?? "support_agent";
}

/** One-line routing note per department, shown on the ticket form. */
export const DEPARTMENT_BLURBS: Record<string, string> = {
  "Pillar Support": "A specific pillar or capability",
  "FFMI/24 Assessment": "Answers, scoring and cooldowns",
  Learning: "Materials, access and progress",
  FFV: "Evidence uploads, reviews and badges",
  "Opportunity Desk": "Events, offers and eligibility",
  "Services Desk": "Booked services and providers",
  "Pricing & Payments": "Charges, M-Pesa, coupons and referrals",
  "General Inquiry": "Anything else — we'll route it",
};

/** Tracking slug for the emailed link — random, never the DB id. */
export function newTicketSlug(): string {
  return `tkt-${nanoid(10)}`;
}

const NUMBER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Human-readable ticket number, e.g. TKT-8F3K2A. */
export function newTicketNumber(): string {
  return `TKT-${customAlphabet(NUMBER_ALPHABET, 6)()}`;
}
