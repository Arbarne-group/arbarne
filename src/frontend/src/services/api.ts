import {
  User,
  Pillar,
  Question,
  AssessmentResult,
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
      tier: 3,
      tier_name: 'Commercializing Farm',
      ffmi_score: 13.8,
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
      tier_name: 'Seedling Farm',
      ffmi_score: 5.0,
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
      tier_name: 'Commercializing Farm',
      ffmi_score: 13.8,
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
      tier: data.tier || 3,
      tier_name: data.tier_name || 'Commercializing Farm',
      ffmi_score: data.ffmi_score || 13.8,
    };
  },
};

export const assessmentApi = {
  getPillars: () => apiRequest<Pillar[]>('/api/pillars'),

  startAssessment: (scope: 'full' | 'pillar', targetPillarId?: number | null) =>
    apiRequest<{
      assessment_id: number;
      scope: string;
      target_pillar_id?: number;
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
    apiRequest<{ message: string; saved: number }>(
      `/api/assessments/${assessmentId}/answers`,
      'POST',
      answers.map((a) => ({
        question_id: String(a.question_id),
        value: a.answer,
      }))
    ),

  calculateScore: (assessmentId: number | string) =>
    apiRequest<AssessmentResult>(`/api/assessments/${assessmentId}/submit`, 'POST'),

  getHistory: () =>
    apiRequest<Array<{ id: number; completed_at: string; score: number; tier: number }>>(
      '/api/assessments/history'
    ),
};

export const portalApi = {
  getDashboardSummary: () =>
    apiRequest<{
      farmer_name: string;
      farm_name: string;
      tier: number;
      tier_name: string;
      ffmi_score: number;
      active_recommendations_count: number;
      completed_courses_count: number;
    }>('/api/portal/dashboard-summary'),

  getServices: (category?: string) =>
    apiRequest<ServiceProvider[]>(
      category && category !== 'all'
        ? `/api/portal/services?category=${encodeURIComponent(category)}`
        : '/api/portal/services'
      ),

  getLearning: (pillarId?: number) =>
    apiRequest<Course[]>(
      pillarId ? `/api/portal/learning?pillar_id=${pillarId}` : '/api/portal/learning'
    ),

  getGamification: () =>
    apiRequest<GamificationState>('/api/portal/gamification/status'),

  recordGamificationAction: (actionType: string, details?: any) =>
    apiRequest<{ xp_awarded: number; new_total_xp: number; level_up: boolean }>(
      '/api/portal/gamification/action',
      'POST',
      { action_type: actionType, details }
    ),

  getLeaderboard: (region: string = 'Western Kenya') =>
    apiRequest<{ top_entries: LeaderboardEntry[] }>(
      `/api/portal/leaderboard?region=${encodeURIComponent(region)}`
    ),
};
