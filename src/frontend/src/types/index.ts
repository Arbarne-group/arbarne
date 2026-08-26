export type ScreenId =
  | 'screen-dashboard'
  | 'screen-journey'
  | 'screen-assessment-choice'
  | 'screen-question'
  | 'screen-result'
  | 'screen-history'
  | 'screen-services'
  | 'screen-learning'
  | 'screen-profile'
  | 'screen-simulator'
  | 'screen-auth';

export interface AppNotification {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  durationMs?: number;
}

export interface User {
  id?: string | number;
  name: string;
  phone?: string;
  email: string;
  role?: string;
  farm_id?: string | number;
  farm_name: string;
  farm_region: string;
  farm_crop_type: string;
  farm_size_acres: number;
  tier?: number;
  tier_name?: string;
  ffmi_score?: number;
}

export interface Pillar {
  id: number;
  code: string;
  name: string;
  description: string;
  icon?: string;
}

export interface Capability {
  id: number;
  pillar_id: number;
  code: string;
  name: string;
  description: string;
}

export interface Question {
  id: number;
  question_number: number;
  capability_id: number;
  pillar_id: number;
  pillar_code?: string;
  capability_code?: string;
  question_text: string;
  why_it_matters?: string;
  quick_win?: string;
  priority?: string;
  ffv_evidence_required?: string;
}

export interface Recommendation {
  id?: number;
  pillar_id: number;
  pillar_name: string;
  capability_name: string;
  action_text: string;
  why_it_matters?: string;
  quick_win?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  support_available?: string;
}

export interface AssessmentResult {
  assessment_id: number;
  ffmi_score: number;
  tier: number;
  tier_name: string;
  pillar_scores: Record<number, number>;
  recommendations: Recommendation[];
  strongest_pillar?: { id: number; name: string; score: number };
  priority_gap_pillar?: { id: number; name: string; score: number };
  completed_at?: string;
  economic_dividend?: {
    current_yield_bags: number;
    projected_yield_bags: number;
    current_revenue_kes: number;
    projected_revenue_kes: number;
    dividend_gain_kes: number;
  };
}

export interface GamificationState {
  total_xp: number;
  level: number;
  level_name: string;
  current_level_min_xp: number;
  next_level_xp: number;
  streak_days: number;
  unlocked_badge_keys: string[];
  completed_quest_ids: string[];
  claimed_quest_ids: string[];
}

export interface Badge {
  key: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  is_unlocked: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  is_completed: boolean;
  is_claimed: boolean;
  action_label?: string;
  target_screen?: ScreenId;
}

export interface LeaderboardEntry {
  rank: number;
  farmer_name: string;
  farm_name: string;
  region: string;
  tier: number;
  tier_name: string;
  ffmi_score: number;
  level: number;
  total_xp: number;
  weekly_xp_delta: number;
  is_current_user?: boolean;
}

export interface ServiceProvider {
  id: number;
  name: string;
  category: string;
  service_title: string;
  description: string;
  pricing_kes: number;
  pricing_unit: string;
  region_served: string;
  verified: boolean;
  rating: number;
  pillar_id?: number;
}

export interface Course {
  id: number;
  title: string;
  pillar_id: number;
  pillar_name?: string;
  duration_mins: number;
  level: string;
  description: string;
  completed?: boolean;
}

// ─── FFF Official Branding Guidelines Constants ─────────────────────────
export interface PillarBrand {
  id: number;
  name: string;
  theme: string;
  colorName: string;
  hex: string;
  bgLight: string;
  borderLight: string;
  textClass: string;
}

export const PILLAR_BRAND_COLORS: Record<number, PillarBrand> = {
  1: {
    id: 1,
    name: 'Smart Farming & Digital Transformation',
    theme: 'Blue',
    colorName: 'Blue',
    hex: '#1E88E5',
    bgLight: 'bg-[#1E88E5]/10',
    borderLight: 'border-[#1E88E5]/30',
    textClass: 'text-[#1E88E5]',
  },
  2: {
    id: 2,
    name: 'Productive Use of Renewable Energy (P.U.R.E)',
    theme: 'Yellow/Amber',
    colorName: 'Yellow/Amber',
    hex: '#FDD835',
    bgLight: 'bg-[#FDD835]/15',
    borderLight: 'border-[#FDD835]/40',
    textClass: 'text-[#b28900]',
  },
  3: {
    id: 3,
    name: 'Food Safety, Quality & Compliance',
    theme: 'Green',
    colorName: 'Green',
    hex: '#43A047',
    bgLight: 'bg-[#43A047]/10',
    borderLight: 'border-[#43A047]/30',
    textClass: 'text-[#43A047]',
  },
  4: {
    id: 4,
    name: 'Indigenous Knowledge & Climate Resilience',
    theme: 'Dark Green',
    colorName: 'Dark Green',
    hex: '#2E7D32',
    bgLight: 'bg-[#2E7D32]/10',
    borderLight: 'border-[#2E7D32]/30',
    textClass: 'text-[#2E7D32]',
  },
  5: {
    id: 5,
    name: 'Farm Business Performance & Growth',
    theme: 'Purple',
    colorName: 'Purple',
    hex: '#8E24AA',
    bgLight: 'bg-[#8E24AA]/10',
    borderLight: 'border-[#8E24AA]/30',
    textClass: 'text-[#8E24AA]',
  },
  6: {
    id: 6,
    name: 'Human Capital, Leadership & Farm Operations',
    theme: 'Indigo',
    colorName: 'Indigo',
    hex: '#3949AB',
    bgLight: 'bg-[#3949AB]/10',
    borderLight: 'border-[#3949AB]/30',
    textClass: 'text-[#3949AB]',
  },
  7: {
    id: 7,
    name: 'Market Access, Customer Value & Competitiveness',
    theme: 'Orange',
    colorName: 'Orange',
    hex: '#FB8C00',
    bgLight: 'bg-[#FB8C00]/10',
    borderLight: 'border-[#FB8C00]/30',
    textClass: 'text-[#FB8C00]',
  },
  8: {
    id: 8,
    name: 'Investment Readiness & Enterprise Development',
    theme: 'Brown',
    colorName: 'Brown',
    hex: '#683C21',
    bgLight: 'bg-[#683C21]/10',
    borderLight: 'border-[#683C21]/30',
    textClass: 'text-[#683C21]',
  },
};

export const MATURITY_STATUS_COLORS = {
  nonExistent: { label: 'Non-Existent', hex: '#D32F2F', colorName: 'Red' },
  emerging: { label: 'Emerging', hex: '#F57C00', colorName: 'Orange' },
  basic: { label: 'Basic', hex: '#FBC02D', colorName: 'Yellow' },
  developing: { label: 'Developing', hex: '#7CB342', colorName: 'Light Green' },
  established: { label: 'Established', hex: '#388E3C', colorName: 'Green' },
  advanced: { label: 'Advanced', hex: '#1B5E20', colorName: 'Dark Green' },
};

export const TIER_CLASSIFICATION_COLORS: Record<number, { tier: number; name: string; hex: string }> = {
  1: { tier: 1, name: 'Informal Farm', hex: '#8E99A2' },
  2: { tier: 2, name: 'Emerging Agribusiness', hex: '#FB8C00' },
  3: { tier: 3, name: 'Structured Farm', hex: '#1E88E5' },
  4: { tier: 4, name: 'Investment Ready', hex: '#045D61' },
  5: { tier: 5, name: 'Future-Ready Farm', hex: '#B88917' },
};

