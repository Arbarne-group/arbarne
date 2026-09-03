export interface OnboardingOption {
  value: string;
  label: string;
  icon?: string;
  desc?: string;
}

export interface OnboardingQuestion {
  id: string;
  number: number;
  question: string;
  instruction?: string;
  type: "single" | "multi" | "text" | "textarea";
  maxSelect?: number;
  options?: OnboardingOption[];
  placeholder?: string;
}

export interface OnboardingSection {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  questions: OnboardingQuestion[];
}

export const ONBOARDING_SECTIONS: OnboardingSection[] = [
  {
    id: "farmer-profile",
    step: 1,
    title: "Farmer Profile",
    subtitle: "Tell us about the person building the future-ready farm.",
    href: "/onboarding/step-1",
    icon: "person",
    questions: [
      {
        id: "jobTitle",
        number: 1,
        question: "What is your current job title or primary occupation?",
        type: "single",
        options: [
          { value: "Farm Owner", label: "Farm Owner", icon: "agriculture" },
          { value: "Farm Manager", label: "Farm Manager", icon: "manage_accounts" },
          { value: "Farm Consultant | Specialist", label: "Farm Consultant | Specialist", icon: "support_agent" },
          { value: "Farm Assistant", label: "Farm Assistant", icon: "person_outline" },
          { value: "Farm Supervisor", label: "Farm Supervisor", icon: "supervisor_account" },
        ],
      },
      {
        id: "valueChain",
        number: 2,
        question: "Which agricultural value chain(s) are you involved in?",
        type: "text",
        placeholder: "e.g., Dairy, Avocado, Horticulture & Specialty Vegetables, Poultry...",
      },
      {
        id: "experienceYears",
        number: 3,
        question: "How many years of professional or business experience do you have?",
        type: "single",
        options: [
          { value: "Less than 1 year", label: "Less than 1 year" },
          { value: "1–3 years", label: "1–3 years" },
          { value: "4–6 years", label: "4–6 years" },
          { value: "7–10 years", label: "7–10 years" },
          { value: "More than 10 years", label: "More than 10 years" },
        ],
      },
      {
        id: "businessHistory",
        number: 4,
        question: "Have you previously started, owned, or managed a business?",
        type: "single",
        options: [
          { value: "Yes, I currently run a business", label: "Yes, I currently run a business" },
          { value: "Yes, I have run a business before", label: "Yes, I have run a business before" },
          { value: "No, this is my first business venture", label: "No, this is my first business venture" },
        ],
      },
      {
        id: "education",
        number: 5,
        question: "What is your highest level of education?",
        type: "single",
        options: [
          { value: "No formal qualification", label: "No formal qualification" },
          { value: "Primary school", label: "Primary school" },
          { value: "Secondary school", label: "Secondary school" },
          { value: "Vocational or trade certificate", label: "Vocational or trade certificate" },
          { value: "Undergraduate degree", label: "Undergraduate degree" },
          { value: "Postgraduate degree", label: "Postgraduate degree" },
          { value: "Other", label: "Other" },
        ],
      },
    ],
  },
  {
    id: "farm-management",
    step: 2,
    title: "Farm Management Experience",
    subtitle: "Help us understand how you currently manage your farm.",
    href: "/onboarding/step-2",
    icon: "manage_accounts",
    questions: [
      {
        id: "mgmtAbility",
        number: 6,
        question: "Which statement best describes your current farm management ability?",
        type: "single",
        options: [
          {
            value: "I manage most farm operations myself.",
            label: "I manage most farm operations myself.",
          },
          {
            value: "I direct farm operations confidently and delegate execution to my team.",
            label: "I direct farm operations confidently and delegate execution to my team.",
          },
          {
            value: "I understand farm management, but I rely on a Farm Manager or technical professional for significant support.",
            label: "I understand farm management, but I rely on a Farm Manager or technical professional for significant support.",
          },
          {
            value: "I have limited farm management experience and rely heavily on a Farm Manager or other professionals.",
            label: "I have limited farm management experience and rely heavily on a Farm Manager or other professionals.",
          },
          {
            value: "I am new to farm management and would like structured professional support.",
            label: "I am new to farm management and would like structured professional support.",
          },
        ],
      },
      {
        id: "opsResponsibility",
        number: 7,
        question: "Who is currently responsible for day-to-day farm operations?",
        type: "single",
        options: [
          { value: "I am", label: "I am" },
          { value: "A Farm Manager", label: "A Farm Manager" },
          { value: "A Farm Supervisor", label: "A Farm Supervisor" },
          { value: "A family member", label: "A family member" },
          { value: "Farm workers", label: "Farm workers" },
          { value: "Operations are shared between several people", label: "Operations are shared between several people" },
          { value: "No one has a clearly defined responsibility", label: "No one has a clearly defined responsibility" },
        ],
      },
      {
        id: "desiredInvolvement",
        number: 8,
        question: "How involved would you like to be in the day-to-day management of your farm?",
        type: "single",
        options: [
          {
            value: "Very involved — I want to participate in most operational decisions.",
            label: "Very involved — I want to participate in most operational decisions.",
          },
          {
            value: "Moderately involved — I want regular updates and to approve major decisions.",
            label: "Moderately involved — I want regular updates and to approve major decisions.",
          },
          {
            value: "Strategically involved — I want to focus on business direction while the Farm Manager handles operations.",
            label: "Strategically involved — I want to focus on business direction while the Farm Manager handles operations.",
          },
          {
            value: "Minimally involved — I prefer the Farm Manager to handle most operations and report performance to me.",
            label: "Minimally involved — I prefer the Farm Manager to handle most operations and report performance to me.",
          },
        ],
      },
    ],
  },
  {
    id: "operating-style",
    step: 3,
    title: "Your Operating Style",
    subtitle: "Help us understand how you make decisions",
    href: "/onboarding/step-3",
    icon: "psychology",
    questions: [
      {
        id: "decisionStyle",
        number: 9,
        question: "When facing an important business decision, what do you typically do first?",
        type: "single",
        options: [
          {
            value: "Gather data and analyse the situation before acting.",
            label: "Gather data and analyse the situation before acting.",
          },
          {
            value: "Talk the decision through with someone I trust.",
            label: "Talk the decision through with someone I trust.",
          },
          {
            value: "Trust my instincts and act quickly.",
            label: "Trust my instincts and act quickly.",
          },
          {
            value: "Look for a framework, process, or expert guidance to follow.",
            label: "Look for a framework, process, or expert guidance to follow.",
          },
          {
            value: "I sometimes delay decisions because I am unsure what to do.",
            label: "I sometimes delay decisions because I am unsure what to do.",
          },
        ],
      },
      {
        id: "failureResponse",
        number: 10,
        question: "How do you usually respond when a plan is not working?",
        type: "single",
        options: [
          {
            value: "I change direction quickly and try a different approach.",
            label: "I change direction quickly and try a different approach.",
          },
          {
            value: "I first investigate the problem before changing course.",
            label: "I first investigate the problem before changing course.",
          },
          {
            value: "I keep pushing the existing plan for longer.",
            label: "I keep pushing the existing plan for longer.",
          },
          {
            value: "I seek an outside perspective before deciding.",
            label: "I seek an outside perspective before deciding.",
          },
          {
            value: "I sometimes struggle to decide what to do next.",
            label: "I sometimes struggle to decide what to do next.",
          },
        ],
      },
      {
        id: "obstacles",
        number: 11,
        question: "What is currently the biggest obstacle to growing your farm business?",
        instruction: "Select up to three.",
        type: "multi",
        maxSelect: 3,
        options: [
          { value: "Time", label: "Time" },
          { value: "Finance", label: "Finance" },
          { value: "Farm management knowledge", label: "Farm management knowledge" },
          { value: "Technical knowledge", label: "Technical knowledge" },
          { value: "Access to markets", label: "Access to markets" },
          { value: "Networks and partnerships", label: "Networks and partnerships" },
          { value: "Reliable workers or management team", label: "Reliable workers or management team" },
          { value: "Confidence in decision-making", label: "Confidence in decision-making" },
          { value: "Clarity on what to do next", label: "Clarity on what to do next" },
          { value: "Access to technology", label: "Access to technology" },
          { value: "Infrastructure", label: "Infrastructure" },
          { value: "Other", label: "Other" },
        ],
      },
      {
        id: "guidancePreference",
        number: 12,
        question: "How do you prefer to receive professional guidance and feedback?",
        type: "single",
        options: [
          {
            value: "Direct — tell me clearly what is working and what needs to change.",
            label: "Direct — tell me clearly what is working and what needs to change.",
          },
          {
            value: "Structured — give me clear plans, actions, and deadlines.",
            label: "Structured — give me clear plans, actions, and deadlines.",
          },
          {
            value: "Encouraging — help me improve through supportive guidance.",
            label: "Encouraging — help me improve through supportive guidance.",
          },
          {
            value: "Consultative — discuss the options with me before making decisions.",
            label: "Consultative — discuss the options with me before making decisions.",
          },
          {
            value: "A combination of the above",
            label: "A combination of the above",
          },
        ],
      },
      {
        id: "trackingFrequency",
        number: 13,
        question: "How often do you currently review or track your farm's business performance?",
        type: "single",
        options: [
          { value: "Weekly", label: "Weekly" },
          { value: "Monthly", label: "Monthly" },
          { value: "Quarterly", label: "Quarterly" },
          { value: "Once or twice a year", label: "Once or twice a year" },
          { value: "Rarely", label: "Rarely" },
          { value: "I do not currently track business performance", label: "I do not currently track business performance" },
        ],
      },
      {
        id: "updatePreference",
        number: 14,
        question: "How would you prefer to receive updates about your farm?",
        type: "single",
        options: [
          { value: "Real-time alerts for important issues", label: "Real-time alerts for important issues" },
          { value: "Weekly operational updates", label: "Weekly operational updates" },
          { value: "Monthly performance reports", label: "Monthly performance reports" },
          { value: "Scheduled calls or meetings with the Farm Manager", label: "Scheduled calls or meetings with the Farm Manager" },
          { value: "A combination of digital reports and manager discussions", label: "A combination of digital reports and manager discussions" },
        ],
      },
    ],
  },
  {
    id: "aspirations",
    step: 4,
    title: "Your Future Farms Aspirations",
    subtitle: "Tell us where you want your farm to go.",
    href: "/onboarding/step-4",
    icon: "rocket_launch",
    questions: [
      {
        id: "twelveMonthSuccess",
        number: 15,
        question: "What would success look like for your farm over the next 12 months?",
        instruction: "Consider areas such as production, profitability, markets, systems, workforce, technology, or expansion.",
        type: "textarea",
        placeholder: "Describe your 12-month vision in detail...",
      },
      {
        id: "greatestImpactSupport",
        number: 16,
        question: "What kind of support would have the greatest impact on your farm business right now?",
        type: "textarea",
        placeholder: "The support that would help most right now...",
      },
      {
        id: "marketInsight",
        number: 17,
        question: "What is one thing you understand about your market or customers that you believe many other farmers may not yet have recognized?",
        type: "textarea",
        placeholder: "Your unique market insight...",
      },
      {
        id: "threeToFiveYearRole",
        number: 18,
        question: "What do you want your role in the farm business to look like over the next three to five years?",
        type: "textarea",
        placeholder: "Your future role and strategic focus...",
      },
      {
        id: "fmResponsibility",
        number: 19,
        question: "What would you like a professional Farm Manager to take responsibility for on your behalf?",
        type: "single",
        options: [
          { value: "Production planning", label: "Production planning" },
          { value: "Day-to-day operations", label: "Day-to-day operations" },
          { value: "Worker supervision", label: "Worker supervision" },
          { value: "Input management", label: "Input management" },
          { value: "Cost control", label: "Cost control" },
          { value: "Farm records", label: "Farm records" },
          { value: "Production monitoring", label: "Production monitoring" },
          { value: "Risk management", label: "Risk management" },
          { value: "Reporting", label: "Reporting" },
          { value: "Market preparation", label: "Market preparation" },
          { value: "All of the above", label: "All of the above" },
        ],
      },
      {
        id: "personallyApprovedDecisions",
        number: 20,
        question: "What decisions would you always want to personally approve before they are made?",
        type: "textarea",
        placeholder: "Decisions you always want to personally review and approve...",
      },
      {
        id: "twentyFiveYearVision",
        number: 21,
        question: "Describe your vision for African farms 25 years from now. How do you want your farm or agricultural business to contribute to that future?",
        type: "textarea",
        placeholder: "Your 25-year vision for African agriculture and your farm's contribution...",
      },
    ],
  },
  {
    id: "digital-platforms",
    step: 5,
    title: "Working With digital farm management platforms",
    subtitle: "How you feel about professional, digitally-enabled farm management.",
    href: "/onboarding/step-5",
    icon: "devices",
    questions: [
      {
        id: "supportReasons",
        number: 22,
        question: "What could be your main reason for considering professional farm management support?",
        type: "multi",
        options: [
          { value: "I do not have enough time to manage the farm myself.", label: "I do not have enough time to manage the farm myself." },
          { value: "I need stronger technical and operational expertise.", label: "I need stronger technical and operational expertise." },
          { value: "I want better visibility into what is happening on the farm.", label: "I want better visibility into what is happening on the farm." },
          { value: "I want to improve productivity and profitability.", label: "I want to improve productivity and profitability." },
          { value: "I want stronger accountability from workers and service providers.", label: "I want stronger accountability from workers and service providers." },
          { value: "I want more reliable farm records and reporting.", label: "I want more reliable farm records and reporting." },
          { value: "I want to manage the farm remotely.", label: "I want to manage the farm remotely." },
          { value: "I want to professionalize the farm as a business.", label: "I want to professionalize the farm as a business." },
          { value: "Other", label: "Other" },
        ],
      },
      {
        id: "remoteConfidence",
        number: 23,
        question: "What would make you feel confident that your farm is being managed well even when you are not physically present?",
        type: "textarea",
        placeholder: "What builds your confidence when managing remotely...",
      },
      {
        id: "remoteComfort",
        number: 24,
        question: "Are you comfortable with your Farm Manager using remote solutions to digitally plan, monitor, verify, and report farm operations?",
        type: "single",
        options: [
          { value: "Yes", label: "Yes" },
          { value: "Yes, but I would like guidance on how it works", label: "Yes, but I would like guidance on how it works" },
          { value: "Unsure", label: "Unsure" },
          { value: "No", label: "No" },
        ],
      },
      {
        id: "recordKeeping",
        number: 25,
        question: "Are you willing to maintain accurate farm, financial, production, and operational records as part of the management service?",
        type: "single",
        options: [
          { value: "Yes", label: "Yes" },
          { value: "Mostly, but I will need support", label: "Mostly, but I will need support" },
          { value: "Unsure", label: "Unsure" },
          { value: "No", label: "No" },
        ],
      },
      {
        id: "physicalAudits",
        number: 26,
        question: "Are you comfortable with a Farm Manager conducting periodic physical operational audits to verify farm records and performance?",
        type: "single",
        options: [
          { value: "Yes", label: "Yes" },
          { value: "Yes, with prior scheduling", label: "Yes, with prior scheduling" },
          { value: "Unsure", label: "Unsure" },
          { value: "No", label: "No" },
        ],
      },
      {
        id: "additionalNotes",
        number: 27,
        question: "Is there anything else we should understand about you, your farm, or the kind of support you are looking for?",
        type: "textarea",
        placeholder: "Anything else you would like us to know...",
      },
    ],
  },
];

export const TOTAL_ONBOARDING_QUESTIONS = 27;
