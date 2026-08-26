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
