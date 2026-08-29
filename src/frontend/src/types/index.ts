export type ScreenId =
  | 'screen-dashboard'
  | 'screen-journey'
  | 'screen-assessment-choice'
  | 'screen-question'
  | 'screen-result'
  | 'screen-pillar-detail'
  | 'screen-history'
  | 'screen-reports'
  | 'screen-simulator'
  | 'screen-services'
  | 'screen-learning'
  | 'screen-profile'
  | 'screen-settings'
  | 'screen-pricing'
  | 'screen-checkout'
  | 'screen-onboarding'
  | 'screen-auth'
  | 'screen-notifications';

export interface AppNotification {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  durationMs?: number;
}

/** Persistent inbox item — lives in the store and is shown in the bell dropdown & full notifications page. */
export interface InboxItem {
  id: string;
  category: 'success' | 'warning' | 'info' | 'xp' | 'alert';
  title: string;
  body: string;
  createdAt: number; // epoch ms
  read: boolean;
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
  farm_reg_number?: string;
  year_established?: string | number;
  farm_description?: string;
  soil_type?: string;
  water_source?: string;
  workforce_count?: string | number;
  energy_source?: string;
  is_verified?: boolean;
  farmer_profile?: FarmerProfile;
  farm_image?: string;
}

/**
 * Structured answers from the "Farmer Profile" onboarding section.
 * Free-text and single-choice answers are strings; multi-choice answers
 * (e.g. obstacles, support reasons) are string arrays. Question ids below
 * match the keys used in `data/farmerProfile.ts`.
 */
export interface FarmerProfile {
  completed?: boolean;
  updated_at?: string;
  job_title?: string;
  value_chains?: string;
  experience_years?: string;
  business_history?: string;
  education?: string;
  management_ability?: string;
  ops_responsibility?: string;
  involvement_level?: string;
  decision_style?: string;
  plan_response?: string;
  obstacles?: string[];
  guidance_style?: string;
  review_frequency?: string;
  update_preference?: string;
  success_12m?: string;
  support_impact?: string;
  market_insight?: string;
  role_3_5y?: string;
  fm_responsibility?: string;
  approve_decisions?: string;
  vision_25y?: string;
  fm_support_reasons?: string[];
  confidence_remote?: string;
  record_keeping?: string;
  record_keeping_consent?: string;
  physical_audits?: string;
  other_notes?: string;
  [key: string]: string | string[] | boolean | undefined;
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
  id: string;
  question_number: number;
  capability_id: string;
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
  question_id?: string;
  pillar_id: number | null;
  capability_id?: string;
  capability_status?: string;
  pillar_name: string;
  capability_name: string;
  recommended_action: string;
  recommended_learning: string;
  potential_service: string;
  priority: 'quick_win' | 'medium_term' | 'strategic';
  why_it_matters?: string;
}

export interface AssessmentResult {
  assessment_id: number | string;
  ffmi_score: number;
  tier: number;
  tier_classification: string;
  pillar_scores: Record<number, number>;
  capability_status?: Record<string, string>;
  capability_feedback?: Record<string, string>;
  capability_names?: Record<string, string>;
  pillar_status?: Record<number, string>;
  strongest_pillar_id?: number | null;
  priority_gap_pillar_id?: number | null;
  recommendations: Recommendation[];
  diagnosis_report?: DiagnosisReport;
  completed_at?: string;
  economic_dividend?: {
    current_yield_bags: number;
    projected_yield_bags: number;
    current_revenue_kes: number;
    projected_revenue_kes: number;
    dividend_gain_kes: number;
  };
}

export interface DiagnosisRecommendation {
  action: string;
  priority: 'quick_win' | 'medium_term' | 'strategic';
  rationale: string;
  linked_to_profile: string;
}

export interface DiagnosisPillarReport {
  pillar_id: number;
  pillar_name: string;
  status_level: string;
  pillar_score: number;
  strengths: string[];
  key_gaps: string[];
  root_causes: string[];
  personalised_recommendations: DiagnosisRecommendation[];
  coaching_approach: string;
  aspiration_alignment: string;
}

export interface DiagnosisOverallReport {
  executive_summary: string;
  transformation_trajectory: string;
  holistic_strengths: string[];
  priority_roadmap: string[];
  key_risks: string[];
  vision_alignment: string;
}

export interface DiagnosisReport {
  overall: DiagnosisOverallReport;
  pillars: DiagnosisPillarReport[];
  is_fallback?: boolean;
  generated_at?: string | null;
}

export interface AssessmentHistoryItem {
  id: number | string;
  started_at?: string;
  submitted_at?: string;
  completed_at?: string;
  status?: string;
  scope?: 'full' | 'pillar' | string;
  target_pillar_id?: number | null;
  target_pillar_name?: string | null;
  ffmi_score?: number | null;
  score?: number | null;
  tier?: number | null;
  tier_classification?: string | null;
  tier_name?: string | null;
  pillar_scores?: Record<string | number, number>;
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
  badges?: Badge[];
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
  id: number | string;
  name: string;
  category: string;
  service_title: string;
  description: string;
  cost_model?: string;
  pillar_id?: number;
  is_recommended?: boolean;
  contact_phone?: string;
  icon?: string;
}

export interface Course {
  id: number | string;
  title: string;
  pillar_id: number;
  pillar_name?: string;
  duration_mins: number;
  level: string;
  description: string;
  completed?: boolean;
  is_recommended?: boolean;
  format_type?: string;
  key_takeaways?: string;
  icon?: string;
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
    name: 'Productive Use of Renewable Energy',
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

export interface DashboardSummary {
  farmer_name: string;
  farm_name: string;
  region: string;
  latest_assessment_id?: string | null;
  ffmi_score?: number | null;
  tier?: number | null;
  tier_name?: string | null;
  strongest_pillar?: string | null;
  priority_gap?: string | null;
  has_gaps: boolean;
  gaps_count: number;
  recommended_services_count: number;
  recommended_courses_count: number;
  completed_courses_count: number;
  delivered_services_count: number;
  total_assessments_count: number;
}

export interface AssessmentComparison {
  baseline_id: string;
  current_id: string;
  baseline_date: string;
  current_date: string;
  baseline_ffmi?: number | null;
  current_ffmi?: number | null;
  ffmi_delta: number;
  baseline_tier?: number | null;
  current_tier?: number | null;
  tier_advanced: boolean;
  pillar_deltas: Record<
    string,
    {
      baseline: number;
      current: number;
      delta: number;
      delta_pct: number;
    }
  >;
  improved_capabilities: string[];
  new_gaps_identified: string[];
  summary_text: string;
}


