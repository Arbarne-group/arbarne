/**
 * Farmer Profile onboarding schema.
 *
 * The 27 questions supplied for the "Farmer Profile" are grouped into five
 * sections and rendered both during onboarding and on the profile page so the
 * farmer can review and edit their answers. Question `id`s double as the
 * storage keys persisted in `User.farmer_profile` (see backend `models/user.py`).
 */

export type FPFieldType = 'single' | 'multi' | 'text';

import type { FarmerProfile } from '../types';

export interface FPOption {
  value: string;
  label: string;
}

export interface FPQuestion {
  /** Storage key — must match a field in the `FarmerProfile` type. */
  id: string;
  /** Original question number in the supplied brief (1–27). */
  no: number;
  text: string;
  type: FPFieldType;
  options?: FPOption[];
  /** For `multi` questions: maximum number of selectable options. */
  max?: number;
  placeholder?: string;
  /** Optional helper shown beneath the question. */
  hint?: string;
}

export interface FPSection {
  id: string;
  title: string;
  subtitle: string;
  questions: FPQuestion[];
}

export const FARMER_PROFILE_SECTIONS: FPSection[] = [
  {
    id: 'about',
    title: 'Farmer Profile',
    subtitle: 'Tell us about the person building the future-ready farm.',
    questions: [
      {
        id: 'job_title',
        no: 1,
        text: 'What is your current job title or primary occupation?',
        type: 'single',
        options: [
          { value: 'farm_owner', label: 'Farm Owner' },
          { value: 'farm_manager', label: 'Farm Manager' },
          { value: 'farm_consultant', label: 'Farm Consultant | Specialist' },
          { value: 'farm_assistant', label: 'Farm Assistant' },
          { value: 'farm_supervisor', label: 'Farm Supervisor' },
        ],
      },
      {
        id: 'value_chains',
        no: 2,
        text: 'Which agricultural value chain(s) are you involved in?',
        type: 'text',
        placeholder: 'e.g. Dairy, Avocado, Horticulture, Poultry…',
      },
      {
        id: 'experience_years',
        no: 3,
        text: 'How many years of professional or business experience do you have?',
        type: 'single',
        options: [
          { value: 'lt_1', label: 'Less than 1 year' },
          { value: '1_3', label: '1–3 years' },
          { value: '4_6', label: '4–6 years' },
          { value: '7_10', label: '7–10 years' },
          { value: 'gt_10', label: 'More than 10 years' },
        ],
      },
      {
        id: 'business_history',
        no: 4,
        text: 'Have you previously started, owned, or managed a business?',
        type: 'single',
        options: [
          { value: 'yes_current', label: 'Yes, I currently run a business' },
          { value: 'yes_before', label: 'Yes, I have run a business before' },
          { value: 'no_first', label: 'No, this is my first business venture' },
        ],
      },
      {
        id: 'education',
        no: 5,
        text: 'What is your highest level of education?',
        type: 'single',
        options: [
          { value: 'none', label: 'No formal qualification' },
          { value: 'primary', label: 'Primary school' },
          { value: 'secondary', label: 'Secondary school' },
          { value: 'vocational', label: 'Vocational or trade certificate' },
          { value: 'undergraduate', label: 'Undergraduate degree' },
          { value: 'postgraduate', label: 'Postgraduate degree' },
          { value: 'other', label: 'Other' },
        ],
      },
    ],
  },
  {
    id: 'management',
    title: 'Farm Management Experience',
    subtitle: 'Help us understand how you currently manage your farm.',
    questions: [
      {
        id: 'management_ability',
        no: 6,
        text: 'Which statement best describes your current farm management ability?',
        type: 'single',
        options: [
          { value: 'self', label: 'I manage most farm operations myself.' },
          {
            value: 'delegate',
            label:
              'I direct farm operations confidently and delegate execution to my team.',
          },
          {
            value: 'rely_professional',
            label:
              'I understand farm management, but I rely on a Farm Manager or technical professional for significant support.',
          },
          {
            value: 'rely_heavy',
            label:
              'I have limited farm management experience and rely heavily on a Farm Manager or other professionals.',
          },
          {
            value: 'new_support',
            label:
              'I am new to farm management and would like structured professional support.',
          },
        ],
      },
      {
        id: 'ops_responsibility',
        no: 7,
        text: 'Who is currently responsible for day-to-day farm operations?',
        type: 'single',
        options: [
          { value: 'self', label: 'I am' },
          { value: 'farm_manager', label: 'A Farm Manager' },
          { value: 'farm_supervisor', label: 'A Farm Supervisor' },
          { value: 'family', label: 'A family member' },
          { value: 'workers', label: 'Farm workers' },
          { value: 'shared', label: 'Operations are shared between several people' },
          { value: 'none', label: 'No one has a clearly defined responsibility' },
        ],
      },
      {
        id: 'involvement_level',
        no: 8,
        text: 'How involved would you like to be in the day-to-day management of your farm?',
        type: 'single',
        options: [
          {
            value: 'very',
            label:
              'Very involved — I want to participate in most operational decisions.',
          },
          {
            value: 'moderate',
            label:
              'Moderately involved — I want regular updates and to approve major decisions.',
          },
          {
            value: 'strategic',
            label:
              'Strategically involved — I want to focus on business direction while the Farm Manager handles operations.',
          },
          {
            value: 'minimal',
            label:
              'Minimally involved — I prefer the Farm Manager to handle most operations and report performance to me.',
          },
        ],
      },
    ],
  },
  {
    id: 'style',
    title: 'Your Operating Style',
    subtitle: 'Help us understand how you make decisions.',
    questions: [
      {
        id: 'decision_style',
        no: 9,
        text: 'When facing an important business decision, what do you typically do first?',
        type: 'single',
        options: [
          { value: 'data', label: 'Gather data and analyse the situation before acting.' },
          { value: 'trust', label: 'Talk the decision through with someone I trust.' },
          { value: 'instinct', label: 'Trust my instincts and act quickly.' },
          {
            value: 'framework',
            label: 'Look for a framework, process, or expert guidance to follow.',
          },
          {
            value: 'delay',
            label: 'I sometimes delay decisions because I am unsure what to do.',
          },
        ],
      },
      {
        id: 'plan_response',
        no: 10,
        text: 'How do you usually respond when a plan is not working?',
        type: 'single',
        options: [
          { value: 'change', label: 'I change direction quickly and try a different approach.' },
          { value: 'investigate', label: 'I first investigate the problem before changing course.' },
          { value: 'push', label: 'I keep pushing the existing plan for longer.' },
          { value: 'outside', label: 'I seek an outside perspective before deciding.' },
          { value: 'struggle', label: 'I sometimes struggle to decide what to do next.' },
        ],
      },
      {
        id: 'obstacles',
        no: 11,
        text: 'What is currently the biggest obstacle to growing your farm business? (Select up to three.)',
        type: 'multi',
        max: 3,
        options: [
          { value: 'time', label: 'Time' },
          { value: 'finance', label: 'Finance' },
          { value: 'mgmt_knowledge', label: 'Farm management knowledge' },
          { value: 'technical_knowledge', label: 'Technical knowledge' },
          { value: 'markets', label: 'Access to markets' },
          { value: 'networks', label: 'Networks and partnerships' },
          { value: 'workers', label: 'Reliable workers or management team' },
          { value: 'confidence', label: 'Confidence in decision-making' },
          { value: 'clarity', label: 'Clarity on what to do next' },
          { value: 'technology', label: 'Access to technology' },
          { value: 'infrastructure', label: 'Infrastructure' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'guidance_style',
        no: 12,
        text: 'How do you prefer to receive professional guidance and feedback?',
        type: 'single',
        options: [
          {
            value: 'direct',
            label: 'Direct — tell me clearly what is working and what needs to change.',
          },
          {
            value: 'structured',
            label: 'Structured — give me clear plans, actions, and deadlines.',
          },
          {
            value: 'encouraging',
            label: 'Encouraging — help me improve through supportive guidance.',
          },
          {
            value: 'consultative',
            label: 'Consultative — discuss the options with me before making decisions.',
          },
          { value: 'combination', label: 'A combination of the above' },
        ],
      },
      {
        id: 'review_frequency',
        no: 13,
        text: 'How often do you currently review or track your farm’s business performance?',
        type: 'single',
        options: [
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'quarterly', label: 'Quarterly' },
          { value: 'once_twice_year', label: 'Once or twice a year' },
          { value: 'rarely', label: 'Rarely' },
          { value: 'never', label: 'I do not currently track business performance' },
        ],
      },
      {
        id: 'update_preference',
        no: 14,
        text: 'How would you prefer to receive updates about your farm?',
        type: 'single',
        options: [
          { value: 'realtime', label: 'Real-time alerts for important issues' },
          { value: 'weekly', label: 'Weekly operational updates' },
          { value: 'monthly', label: 'Monthly performance reports' },
          { value: 'calls', label: 'Scheduled calls or meetings with the Farm Manager' },
          { value: 'combination', label: 'A combination of digital reports and manager discussions' },
        ],
      },
    ],
  },
  {
    id: 'aspirations',
    title: 'Your Future Farms Aspirations',
    subtitle: 'Tell us where you want your farm to go.',
    questions: [
      {
        id: 'success_12m',
        no: 15,
        text: 'What would success look like for your farm over the next 12 months? (production, profitability, markets, systems, workforce, technology, expansion…)',
        type: 'text',
        placeholder: 'Describe your 12-month vision…',
      },
      {
        id: 'support_impact',
        no: 16,
        text: 'What kind of support would have the greatest impact on your farm business right now?',
        type: 'text',
        placeholder: 'The support that would help most…',
      },
      {
        id: 'market_insight',
        no: 17,
        text: 'What is one thing you understand about your market or customers that you believe many other farmers may not yet have recognized?',
        type: 'text',
        placeholder: 'Your unique market insight…',
      },
      {
        id: 'role_3_5y',
        no: 18,
        text: 'What do you want your role in the farm business to look like over the next three to five years?',
        type: 'text',
        placeholder: 'Your future role…',
      },
      {
        id: 'fm_responsibility',
        no: 19,
        text: 'What would you like a professional Farm Manager to take responsibility for on your behalf?',
        type: 'single',
        options: [
          { value: 'production_planning', label: 'Production planning' },
          { value: 'day_to_day', label: 'Day-to-day operations' },
          { value: 'worker_supervision', label: 'Worker supervision' },
          { value: 'input_management', label: 'Input management' },
          { value: 'cost_control', label: 'Cost control' },
          { value: 'farm_records', label: 'Farm records' },
          { value: 'production_monitoring', label: 'Production monitoring' },
          { value: 'risk_management', label: 'Risk management' },
          { value: 'reporting', label: 'Reporting' },
          { value: 'market_preparation', label: 'Market preparation' },
          { value: 'all', label: 'All of the above' },
        ],
      },
      {
        id: 'approve_decisions',
        no: 20,
        text: 'What decisions would you always want to personally approve before they are made?',
        type: 'text',
        placeholder: 'Decisions you want to approve…',
      },
      {
        id: 'vision_25y',
        no: 21,
        text: 'Describe your vision for African farms 25 years from now. How do you want your farm or agricultural business to contribute to that future?',
        type: 'text',
        placeholder: 'Your 25-year vision…',
      },
    ],
  },
  {
    id: 'digital',
    title: 'Working With Digital Farm Management Platforms',
    subtitle: 'How you feel about professional, digitally-enabled farm management.',
    questions: [
      {
        id: 'fm_support_reasons',
        no: 22,
        text: 'What could be your main reason for considering professional farm management support? (Select all that apply.)',
        type: 'multi',
        options: [
          { value: 'time', label: 'I do not have enough time to manage the farm myself.' },
          { value: 'expertise', label: 'I need stronger technical and operational expertise.' },
          { value: 'visibility', label: 'I want better visibility into what is happening on the farm.' },
          { value: 'productivity', label: 'I want to improve productivity and profitability.' },
          { value: 'accountability', label: 'I want stronger accountability from workers and service providers.' },
          { value: 'records', label: 'I want more reliable farm records and reporting.' },
          { value: 'remote', label: 'I want to manage the farm remotely.' },
          { value: 'professionalize', label: 'I want to professionalize the farm as a business.' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'confidence_remote',
        no: 23,
        text: 'What would make you feel confident that your farm is being managed well even when you are not physically present?',
        type: 'text',
        placeholder: 'What builds your confidence…',
      },
      {
        id: 'record_keeping',
        no: 24,
        text: 'Are you comfortable with your Farm Manager using remote solutions to digitally plan, monitor, verify, and report farm operations?',
        type: 'single',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'yes_guidance', label: 'Yes, but I would like guidance on how it works' },
          { value: 'unsure', label: 'Unsure' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        id: 'record_keeping_consent',
        no: 25,
        text: 'Are you willing to maintain accurate farm, financial, production, and operational records as part of the management service?',
        type: 'single',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'mostly_support', label: 'Mostly, but I will need support' },
          { value: 'unsure', label: 'Unsure' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        id: 'physical_audits',
        no: 26,
        text: 'Are you comfortable with a Farm Manager conducting periodic physical operational audits to verify farm records and performance?',
        type: 'single',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'yes_scheduled', label: 'Yes, with prior scheduling' },
          { value: 'unsure', label: 'Unsure' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        id: 'other_notes',
        no: 27,
        text: 'Is there anything else we should understand about you, your farm, or the kind of support you are looking for?',
        type: 'text',
        placeholder: 'Anything else we should know…',
      },
    ],
  },
];

/** Total number of questions across all sections. */
export const FARMER_PROFILE_QUESTION_COUNT = FARMER_PROFILE_SECTIONS.reduce(
  (sum, s) => sum + s.questions.length,
  0
);

/**
 * Render a stored Farmer Profile answer as a human-readable string for display
 * on the profile page and dashboard.
 */
export function formatFpAnswer(q: FPQuestion, profile?: FarmerProfile): string {
  if (!profile) return '';
  const raw = profile[q.id];
  if (raw === undefined || raw === null) return '';
  if (q.type === 'multi') {
    const arr = Array.isArray(raw) ? raw : [];
    if (arr.length === 0) return '';
    return arr
      .map((v) => q.options?.find((o) => o.value === v)?.label || String(v))
      .join(', ');
  }
  if (q.type === 'single') {
    return q.options?.find((o) => o.value === raw)?.label || String(raw);
  }
  return String(raw);
}

/**
 * Build a flat lookup from question id → its schema definition, used by the
 * profile page to render answers with their human-readable labels.
 */
export const FARMER_PROFILE_BY_ID: Record<string, FPQuestion> = (() => {
  const map: Record<string, FPQuestion> = {};
  for (const section of FARMER_PROFILE_SECTIONS) {
    for (const q of section.questions) map[q.id] = q;
  }
  return map;
})();
