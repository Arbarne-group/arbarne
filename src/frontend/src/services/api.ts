import {
  User,
  Pillar,
  Question,
  AssessmentResult,
  AssessmentHistoryItem,
  DiagnosisReport,
  AssessmentComparison,
  DashboardSummary,
  GamificationState,
  LeaderboardEntry,
  ServiceProvider,
  Course,
} from '../types';

const API_BASE = '';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('fff_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: getAuthHeaders(),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);

  if (response.status === 401) {
    // Clean up expired or invalid session token
    localStorage.removeItem('fff_token');
    localStorage.removeItem('fff_user');
    window.dispatchEvent(new CustomEvent('fff_auth_expired'));
  }

  if (!response.ok) {
    let errorDetail = `Request failed (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorDetail =
          typeof errJson.detail === 'string'
            ? errJson.detail
            : JSON.stringify(errJson.detail);
      }
    } catch {
      // Use fallback errorDetail
    }
    throw new Error(errorDetail);
  }

  return response.json() as Promise<T>;
}

// ─── API Services ───────────────────────────────────────────────────────────

export const authApi = {
  login: async (email: string, password?: string) => {
    const res = await apiRequest<any>('/api/auth/login', 'POST', {
      email,
      password: password || 'demo1234',
    });
    const user: User = {
      id: res.user_id,
      name: res.name || 'Farmer',
      email: res.email,
      phone: res.phone || '',
      role: res.role || 'farmer',
      farm_id: res.farm_id,
      farm_name: res.farm_name || 'Demonstration Farm',
      farm_region: res.region || 'Western Kenya',
      farm_size_acres: res.size_acres || 5.0,
      farm_crop_type: res.crop_type || 'Mixed Crop & Livestock',
      tier: 1,
      tier_name: 'Informal Farm',
      ffmi_score: 0,
      farmer_profile: res.farmer_profile,
      farm_image: res.farm_image || '',
    };
    return { access_token: res.access_token, user };
  },

  register: async (userData: any) => {
    const res = await apiRequest<any>('/api/auth/register', 'POST', {
      name: userData.name,
      email: userData.email,
      phone: userData.phone || undefined,
      password: userData.password || 'demo1234',
      farm_name: userData.farm_name,
      region: userData.farm_region || userData.region,
      size_acres: userData.farm_size_acres || userData.size_acres,
      crop_type: userData.farm_crop_type || userData.crop_type,
      farmer_profile: userData.farmer_profile,
    });
    const user: User = {
      id: res.user_id,
      name: res.name || userData.name || 'Farmer',
      email: res.email || userData.email,
      phone: res.phone || userData.phone || '',
      role: res.role || 'farmer',
      farm_id: res.farm_id,
      farm_name: res.farm_name || userData.farm_name || 'Demonstration Farm',
      farm_region: res.region || userData.farm_region || 'Western Kenya',
      farm_size_acres: res.size_acres || userData.farm_size_acres || 5.0,
      farm_crop_type: res.crop_type || userData.farm_crop_type || 'Mixed Crop & Livestock',
      tier: 1,
      tier_name: 'Informal Farm',
      ffmi_score: 0,
      farmer_profile: res.farmer_profile,
    };
    return { access_token: res.access_token, user };
  },

  getProfile: async (): Promise<User> => {
    const res = await apiRequest<any>('/api/auth/me');
    return {
      id: res.id,
      name: res.name || 'Farmer',
      email: res.email,
      phone: res.phone || '',
      role: res.role || 'farmer',
      farm_id: res.farm_id,
      farm_name: res.farm_name || 'Demonstration Farm',
      farm_region: res.farm_region || 'Western Kenya',
      farm_size_acres: res.farm_size_acres || 5.0,
      farm_crop_type: res.farm_crop || 'Mixed Crop & Livestock',
      tier: 3,
      tier_name: 'Structured Farm',
      ffmi_score: 13.8,
      farmer_profile: res.farmer_profile,
      farm_image: res.farm_image || '',
    };
  },

  updateProfile: async (data: any): Promise<User> => {
    const res = await apiRequest<any>('/api/auth/me', 'PUT', {
      name: data.name,
      phone: data.phone,
      email: data.email,
      farm_name: data.farm_name,
      region: data.farm_region,
      crop_type: data.farm_crop_type,
      size_acres: data.farm_size_acres,
      farmer_profile: data.farmer_profile,
      farm_image: data.farm_image,
    });
    return {
      id: res.id,
      name: res.name || data.name || 'Farmer',
      email: res.email || data.email,
      phone: res.phone || data.phone || '',
      role: res.role || 'farmer',
      farm_id: res.farm_id,
      farm_name: res.farm_name || data.farm_name,
      farm_region: res.farm_region || data.farm_region,
      farm_size_acres: res.farm_size_acres || data.farm_size_acres,
      farm_crop_type: res.farm_crop || data.farm_crop_type,
      tier: data.tier || 1,
      tier_name: data.tier_name || 'Informal Farm',
      ffmi_score: data.ffmi_score || 0,
      farmer_profile: res.farmer_profile,
      farm_image: res.farm_image || '',
    };
  },

  requestOtp: (email: string) =>
    apiRequest<{ message: string }>('/api/auth/otp', 'POST', { email }),
};

export const mlApi = {
  simulate: (payload: {
    farm_name?: string;
    region?: string;
    crop_type?: string;
    farm_size?: number;
    pillar_scores: Record<number, number>;
  }) =>
    apiRequest<{
      ffmi_score: number;
      max_ffmi: number;
      tier: number;
      tier_classification: string;
      strongest_pillar_id: number | null;
      strongest_pillar_name: string;
      priority_gap_pillar_id: number | null;
      priority_gap_pillar_name: string;
      trajectory_risk: string;
      pillar_scores: Record<number, number>;
      recommendations: Array<{
        question_id: string;
        pillar_id: number;
        capability_id: string;
        gap: string;
        recommended_action: string;
        recommended_learning: string;
        potential_service: string;
        priority: string;
      }>;
    }>('/api/ml/simulate', 'POST', payload),
};

export const assessmentApi = {
  getPillars: () => apiRequest<Pillar[]>('/api/pillars'),

  startAssessment: (scope: 'full' | 'pillar', targetPillarId?: number | null) =>
    apiRequest<{
      assessment_id: number | string;
      farm_id: number | string;
      status: string;
      scope: string;
      target_pillar_id?: number | null;
      question_count: number;
      questions: Question[];
    }>('/api/assessments/start', 'POST', {
      name: 'Farm Assessment',
      scope,
      target_pillar_id: targetPillarId,
    }),

  submitAnswers: (
    assessmentId: number | string,
    answers: Array<{ question_id: number | string; answer: 'yes' | 'no' }>
  ) =>
    apiRequest<{ assessment_id: string; saved: number }>(
      `/api/assessments/${assessmentId}/answers`,
      'POST',
      answers.map((a) => ({
        question_id: String(a.question_id),
        value: a.answer,
      }))
    ),

  calculateScore: (assessmentId: number | string) =>
    apiRequest<AssessmentResult>(`/api/assessments/${assessmentId}/submit`, 'POST'),

  getAssessment: (assessmentId: number | string) =>
    apiRequest<AssessmentResult>(`/api/assessments/${assessmentId}`),

  compareAssessments: (baselineId: string, currentId: string) =>
    apiRequest<AssessmentComparison>(
      `/api/assessments/compare?baseline_id=${encodeURIComponent(baselineId)}&current_id=${encodeURIComponent(currentId)}`
    ),

  getHistory: async (): Promise<AssessmentHistoryItem[]> => {
    const raw = await apiRequest<any[]>('/api/assessments/history');
    return raw.map((item) => ({
      id: item.id,
      started_at: item.started_at,
      submitted_at: item.submitted_at,
      completed_at: item.submitted_at || item.completed_at || item.started_at,
      status: item.status || 'completed',
      scope: item.scope || 'full',
      target_pillar_id: item.target_pillar_id,
      target_pillar_name: item.target_pillar_name,
      ffmi_score:
        typeof item.ffmi_score === 'number'
          ? item.ffmi_score
          : typeof item.score === 'number'
          ? item.score
          : null,
      score:
        typeof item.ffmi_score === 'number'
          ? item.ffmi_score
          : typeof item.score === 'number'
          ? item.score
          : null,
      tier: item.tier ?? 3,
      tier_classification:
        item.tier_classification || item.tier_name || 'Structured Farm',
      tier_name: item.tier_classification || item.tier_name || 'Structured Farm',
      pillar_scores: item.pillar_scores || {},
    }));
  },

  getDiagnosis: (assessmentId: number | string) =>
    apiRequest<{ assessment_id: string; diagnosis: DiagnosisReport; is_fallback: boolean }>(
      `/api/assessments/${assessmentId}/diagnosis`,
      'GET',
    ),
};

export const portalApi = {
  getDashboardSummary: () =>
    apiRequest<DashboardSummary>('/api/portal/dashboard-summary'),

  getServices: async (category?: string): Promise<ServiceProvider[]> => {
    const raw = await apiRequest<any[]>(
      category && category !== 'all'
        ? `/api/portal/services?category=${encodeURIComponent(category)}`
        : '/api/portal/services'
    );
    return raw.map((s) => ({
      id: s.id,
      name: s.provider || s.name || 'Agro-Provider',
      category: s.category || 'Agro-Services',
      service_title: s.title || s.service_title || 'Agro-Enterprise Service',
      description: s.description || '',
      cost_model: s.cost_model || 'Contact for pricing',
      pillar_id: s.pillar_id,
      is_recommended: s.is_recommended ?? false,
      contact_phone: s.contact_phone,
      icon: s.icon,
    }));
  },

  requestService: (
    serviceId: number | string,
    assessmentId?: number | string | null,
    notes?: string
  ) =>
    apiRequest<{
      id: number;
      service_id: number;
      service_title: string;
      status: string;
      notes?: string;
      requested_at: string;
    }>('/api/portal/services/request', 'POST', {
      service_id: Number(serviceId),
      assessment_id: assessmentId ? String(assessmentId) : null,
      notes: notes || 'Service requested via Future Farms portal.',
    }),

  deliverService: (serviceRequestId: number | string) =>
    apiRequest<{
      id: number;
      service_id: number;
      status: string;
      delivered_at: string;
    }>(`/api/portal/services/${serviceRequestId}/deliver`, 'POST'),

  getLearning: async (pillarId?: number): Promise<Course[]> => {
    const raw = await apiRequest<any[]>(
      pillarId ? `/api/portal/learning?pillar_id=${pillarId}` : '/api/portal/learning'
    );
    return raw.map((m) => ({
      id: m.id,
      title: m.title || 'Learning Module',
      pillar_id: m.pillar_id || 1,
      pillar_name:
        m.pillar_name || (m.pillar_id ? `Pillar ${m.pillar_id}` : 'Agronomic Practice'),
      duration_mins: m.duration_minutes || m.duration_mins || 15,
      level: m.level || 'Practical',
      description: m.summary || m.description || '',
      completed: m.status === 'completed' || m.completed || false,
      is_recommended: m.is_recommended ?? false,
      format_type: m.format_type,
      key_takeaways: m.key_takeaways,
      icon: m.icon,
    }));
  },

  completeCourse: (moduleId: number | string) =>
    apiRequest<{
      id: number;
      module_id: number;
      module_title: string;
      status: string;
      completed_at?: string;
    }>(`/api/portal/learning/${moduleId}/complete`, 'POST', {
      status: 'completed',
    }),

  getGamification: () =>
    apiRequest<any>('/api/portal/gamification'),

  recordGamificationAction: (actionType: string, details?: any) =>
    apiRequest<{ xp_awarded: number; new_total_xp: number; level_up: boolean }>(
      '/api/portal/gamification/action',
      'POST',
      { action_type: actionType, details }
    ),

  claimQuest: (questId: string) =>
    apiRequest<{
      quest_id: string;
      xp_awarded: number;
      new_total_xp: number;
      new_level: number;
      new_level_name: string;
      level_up: boolean;
    }>('/api/portal/gamification/claim-quest', 'POST', { quest_id: questId }),

  getLeaderboard: (region: string = 'All Regions') =>
    apiRequest<{ top_entries: LeaderboardEntry[] }>(
      `/api/portal/gamification/leaderboard?region=${encodeURIComponent(region)}`
    ),
};

/**
 * Adapts the backend GamificationStatusOut payload (object-based badges/quests)
 * into the flat-array shape the UI store expects.
 */
export function adaptGamification(raw: any): GamificationState {
  if (!raw) return raw;
  const badges: any[] = raw.badges || [];
  const quests: any[] = raw.active_quests || [];
  const rarityMap: Record<string, 'Bronze' | 'Silver' | 'Gold' | 'Diamond'> = {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    diamond: 'Diamond',
  };
  return {
    total_xp: raw.total_xp ?? 0,
    level: raw.level ?? 1,
    level_name: raw.level_name ?? 'Seedling Pioneer',
    current_level_min_xp: raw.current_level_min_xp ?? 0,
    next_level_xp: raw.next_level_xp ?? 200,
    streak_days: raw.streak_days ?? 0,
    unlocked_badge_keys: badges.filter((b) => b.is_unlocked).map((b) => b.badge_key),
    completed_quest_ids: quests.filter((q) => q.is_completed).map((q) => q.id),
    claimed_quest_ids: quests.filter((q) => q.is_claimed).map((q) => q.id),
    badges: badges.map((b) => ({
      key: b.badge_key,
      title: b.title,
      description: b.description,
      icon: b.icon,
      rarity: rarityMap[(b.tier || 'bronze').toLowerCase()] || 'Bronze',
      is_unlocked: !!b.is_unlocked,
    })),
  };
}

