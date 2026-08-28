import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { assessmentApi } from '../services/api';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Zap,
  Sun,
  Droplets,
  Leaf,
  Layers,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  BarChart3,
  ListChecks,
  Timer,
  Check,
  Sparkles,
  ArrowUpRight,
  Shield,
  FileText,
  Activity,
  Wind,
  Battery,
  Flame,
  Cpu,
  Search,
  Rocket,
  Brain,
  Lightbulb,
  Award,
  Play,
  RotateCcw,
  Gauge,
  Store,
  Building2,
  Briefcase,
} from 'lucide-react';

interface CapabilityMeta {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'completed' | 'in_progress' | 'ready';
  questions: string;
  score: string;
  icon: React.ReactNode;
}

const PILLAR_CAPABILITIES_MAP: Record<
  number,
  {
    pillarCode: string;
    pillarName: string;
    pillarIcon: React.ReactNode;
    accentColor: string;
    defaultScore: number;
    maturityLabel: string;
    capabilities: CapabilityMeta[];
  }
> = {
  1: {
    pillarCode: 'Pillar 1',
    pillarName: 'Smart Farming & Digital Transformation',
    pillarIcon: <Cpu className="w-5 h-5 text-[#1E88E5]" />,
    accentColor: '#1E88E5',
    defaultScore: 85,
    maturityLabel: 'Advanced',
    capabilities: [
      {
        id: 'P1.1',
        code: 'Cap 1.1',
        name: 'Technology Readiness',
        description: 'Basic infrastructure, device access, connectivity, and capacity to adopt farm technologies.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '88/100',
        icon: <Cpu className="w-5 h-5 text-[#1E88E5]" />,
      },
      {
        id: 'P1.2',
        code: 'Cap 1.2',
        name: 'Digital Capability',
        description: 'Practical digital literacy and daily smartphone/platform application in crop workflows.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '82/100',
        icon: <Activity className="w-5 h-5 text-[#1E88E5]" />,
      },
      {
        id: 'P1.3',
        code: 'Cap 1.3',
        name: 'Farm Information & Data Management',
        description: 'Systematic recording, digital log storage, and ledger backups for operational parameters.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '85/100',
        icon: <FileText className="w-5 h-5 text-[#1E88E5]" />,
      },
      {
        id: 'P1.4',
        code: 'Cap 1.4',
        name: 'Data-Driven Decision Making',
        description: 'Transforming harvest data, weather insights, and soil moisture analytics into planting schedules.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '80/100',
        icon: <BarChart3 className="w-5 h-5 text-[#1E88E5]" />,
      },
      {
        id: 'P1.5',
        code: 'Cap 1.5',
        name: 'Continuous Tech Improvement',
        description: 'Iterative testing of automated sensors, variable-rate spraying, and digital tooling.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '90/100',
        icon: <Sparkles className="w-5 h-5 text-[#1E88E5]" />,
      },
    ],
  },
  2: {
    pillarCode: 'Pillar 2',
    pillarName: 'Productive Use of Renewable Energy',
    pillarIcon: <Sun className="w-5 h-5 text-[#FDD835]" />,
    accentColor: '#FDD835',
    defaultScore: 45,
    maturityLabel: 'Basic (Needs Attention)',
    capabilities: [
      {
        id: 'P2.1',
        code: 'Cap 2.1',
        name: 'Energy Sources & Usage',
        description: 'Auditing current reliance on grid power, diesel generators, and baseline energy expenditure.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '30/100',
        icon: <Zap className="w-5 h-5 text-[#ba1a1a]" />,
      },
      {
        id: 'P2.2',
        code: 'Cap 2.2',
        name: 'Renewable Energy Adoption',
        description: 'Solar irrigation pumps, rooftop arrays, and alternative clean generation adoption.',
        status: 'in_progress',
        questions: '2/5 Qs',
        score: '10/100',
        icon: <Sun className="w-5 h-5 text-[#ba1a1a]" />,
      },
      {
        id: 'P2.3',
        code: 'Cap 2.3',
        name: 'Energy Efficiency',
        description: 'VFD motor controllers, insulation of cold hubs, and power factor correction.',
        status: 'in_progress',
        questions: '3/5 Qs',
        score: '55/100',
        icon: <Battery className="w-5 h-5 text-[#009924]" />,
      },
      {
        id: 'P2.4',
        code: 'Cap 2.4',
        name: 'Energy Infrastructure',
        description: 'Microgrid electrical balancing, surge protection, and backup battery banks.',
        status: 'ready',
        questions: '0/5 Qs',
        score: '40/100',
        icon: <Flame className="w-5 h-5 text-slate-500" />,
      },
      {
        id: 'P2.5',
        code: 'Cap 2.5',
        name: 'Energy Management',
        description: 'Smart meter telemetry, peak load shaving, and maintenance schedules.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '90/100',
        icon: <CheckCircle2 className="w-5 h-5 text-[#009924]" />,
      },
    ],
  },
  3: {
    pillarCode: 'Pillar 3',
    pillarName: 'Food Safety, Quality & Compliance',
    pillarIcon: <ShieldCheck className="w-5 h-5 text-[#43A047]" />,
    accentColor: '#43A047',
    defaultScore: 65,
    maturityLabel: 'Developing',
    capabilities: [
      {
        id: 'P3.1',
        code: 'Cap 3.1',
        name: 'GlobalGAP & Standard Compliance',
        description: 'Understanding hygiene protocols, chemical pre-harvest intervals, and biological hazards.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '60/100',
        icon: <ShieldCheck className="w-5 h-5 text-[#43A047]" />,
      },
      {
        id: 'P3.2',
        code: 'Cap 3.2',
        name: 'Cold Chain & Post-Harvest Handling',
        description: 'Crate disinfection, washing water sanitation, and cold room continuous thermal monitoring.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '70/100',
        icon: <Layers className="w-5 h-5 text-[#43A047]" />,
      },
      {
        id: 'P3.3',
        code: 'Cap 3.3',
        name: 'Water & Input Sanitization',
        description: 'Lab microbial testing of irrigation sources and spray water for pathogen prevention.',
        status: 'in_progress',
        questions: '2/5 Qs',
        score: '50/100',
        icon: <Droplets className="w-5 h-5 text-[#004447]" />,
      },
      {
        id: 'P3.4',
        code: 'Cap 3.4',
        name: 'Chemical Residue & MRL Testing',
        description: 'Maximum residue limit logs, locked agrochemical storage, and sprayer calibration.',
        status: 'in_progress',
        questions: '3/5 Qs',
        score: '55/100',
        icon: <ListChecks className="w-5 h-5 text-[#004447]" />,
      },
      {
        id: 'P3.5',
        code: 'Cap 3.5',
        name: 'Recall & Traceability Protocols',
        description: 'QR/barcode batch tracking from farm plot to packing house and supermarket dispatch.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '90/100',
        icon: <CheckCircle2 className="w-5 h-5 text-[#009924]" />,
      },
    ],
  },
  4: {
    pillarCode: 'Pillar 4',
    pillarName: 'Indigenous Knowledge & Climate Resilience',
    pillarIcon: <Leaf className="w-5 h-5 text-[#2E7D32]" />,
    accentColor: '#2E7D32',
    defaultScore: 58,
    maturityLabel: 'Developing',
    capabilities: [
      {
        id: 'P4.1',
        code: 'Cap 4.1',
        name: 'Soil Organic Matter & Biochar',
        description: 'Pyrolyzed carbon enrichment, minimum tillage, and active soil microbiology.',
        status: 'in_progress',
        questions: '3/5 Qs',
        score: '50/100',
        icon: <Layers className="w-5 h-5 text-[#2E7D32]" />,
      },
      {
        id: 'P4.2',
        code: 'Cap 4.2',
        name: 'Indigenous Seed & Crop Diversity',
        description: 'Drought-tolerant heirloom cultivars, intercropping, and regional varietal preservation.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '75/100',
        icon: <Sparkles className="w-5 h-5 text-[#2E7D32]" />,
      },
      {
        id: 'P4.3',
        code: 'Cap 4.3',
        name: 'Agroforestry & Microclimate Control',
        description: 'Multi-strata nitrogen-fixing leguminous trees, windbreaks, and biodiversity buffers.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '60/100',
        icon: <Leaf className="w-5 h-5 text-[#2E7D32]" />,
      },
      {
        id: 'P4.4',
        code: 'Cap 4.4',
        name: 'Rainwater Swales & Retention Ponds',
        description: 'Contour swales, zai pits, retention basins, and groundwater aquifer recharge.',
        status: 'in_progress',
        questions: '2/5 Qs',
        score: '45/100',
        icon: <Droplets className="w-5 h-5 text-slate-500" />,
      },
      {
        id: 'P4.5',
        code: 'Cap 4.5',
        name: 'Drought-Resistant Intercropping',
        description: 'Companion planting arrangements, micro-shade layers, and moisture retention mulch.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '60/100',
        icon: <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />,
      },
    ],
  },
  5: {
    pillarCode: 'Pillar 5',
    pillarName: 'Market Access & Value Chain Integration',
    pillarIcon: <Store className="w-5 h-5 text-[#FB8C00]" />,
    accentColor: '#FB8C00',
    defaultScore: 68,
    maturityLabel: 'Basic',
    capabilities: [
      {
        id: 'P5.1',
        code: 'Cap 5.1',
        name: 'Export Contract Negotiation',
        description: 'Securing multi-cycle forward purchase contracts with minimum base pricing.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '55/100',
        icon: <FileText className="w-5 h-5 text-[#FB8C00]" />,
      },
      {
        id: 'P5.2',
        code: 'Cap 5.2',
        name: 'Value-Add Processing & Packaging',
        description: 'Modified atmosphere packaging, washing lines, and shelf-life extension.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '65/100',
        icon: <Sparkles className="w-5 h-5 text-[#FB8C00]" />,
      },
      {
        id: 'P5.3',
        code: 'Cap 5.3',
        name: 'Cold Logistics & Freight Aggregation',
        description: 'Refrigerated transit coordination and joint consolidation to reduce shipping costs.',
        status: 'in_progress',
        questions: '2/5 Qs',
        score: '50/100',
        icon: <Layers className="w-5 h-5 text-slate-500" />,
      },
      {
        id: 'P5.4',
        code: 'Cap 5.4',
        name: 'Price Forecasting & Hedging',
        description: 'Monitoring market pricing indices, off-season windows, and price risk buffers.',
        status: 'in_progress',
        questions: '2/5 Qs',
        score: '40/100',
        icon: <TrendingUp className="w-5 h-5 text-slate-500" />,
      },
      {
        id: 'P5.5',
        code: 'Cap 5.5',
        name: 'Digital B2B Buyer Portals',
        description: 'Direct integration with institutional buyers, digital invoicing, and instant payments.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '90/100',
        icon: <CheckCircle2 className="w-5 h-5 text-[#009924]" />,
      },
    ],
  },
  6: {
    pillarCode: 'Pillar 6',
    pillarName: 'Human Capital & Agronomic Skills',
    pillarIcon: <Users className="w-5 h-5 text-[#3949AB]" />,
    accentColor: '#3949AB',
    defaultScore: 88,
    maturityLabel: 'Advanced',
    capabilities: [
      {
        id: 'P6.1',
        code: 'Cap 6.1',
        name: 'Occupational Safety & PPE Adherence',
        description: 'Safety gear protocols, pesticide handling certifications, and first-aid kits.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '85/100',
        icon: <ShieldCheck className="w-5 h-5 text-[#3949AB]" />,
      },
      {
        id: 'P6.2',
        code: 'Cap 6.2',
        name: 'Continuous Agronomic Skills Upskilling',
        description: 'Structured training on pruning, pest scouting, and precision fertilization.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '75/100',
        icon: <Users className="w-5 h-5 text-[#3949AB]" />,
      },
      {
        id: 'P6.3',
        code: 'Cap 6.3',
        name: 'Fair Wage & Ethical Labor Standards',
        description: 'Competitive remuneration, maternity leave, clean housing, and zero child labor.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '90/100',
        icon: <CheckCircle2 className="w-5 h-5 text-[#3949AB]" />,
      },
      {
        id: 'P6.4',
        code: 'Cap 6.4',
        name: 'Supervisory & Extension Delivery',
        description: 'Crew leader mentoring, task delegation metrics, and daily morning huddles.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '70/100',
        icon: <Activity className="w-5 h-5 text-[#3949AB]" />,
      },
      {
        id: 'P6.5',
        code: 'Cap 6.5',
        name: 'Mobile Digital Tools Competency',
        description: 'Smartphone data entry, digital attendance, and video learning uptake.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '80/100',
        icon: <Sparkles className="w-5 h-5 text-[#3949AB]" />,
      },
    ],
  },
  7: {
    pillarCode: 'Pillar 7',
    pillarName: 'Sustainable Business Management',
    pillarIcon: <Building2 className="w-5 h-5 text-[#8E24AA]" />,
    accentColor: '#8E24AA',
    defaultScore: 75,
    maturityLabel: 'Developing',
    capabilities: [
      {
        id: 'P7.1',
        code: 'Cap 7.1',
        name: 'Crop Unit Economics Tracking',
        description: 'Calculating margin per acre, chemical cost per kg, and labor input logs.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '60/100',
        icon: <BarChart3 className="w-5 h-5 text-[#8E24AA]" />,
      },
      {
        id: 'P7.2',
        code: 'Cap 7.2',
        name: 'Cash Flow & Working Capital Planning',
        description: 'Rolling 90-day liquidity projections, fertilizer prepayment buffers, and payroll reserves.',
        status: 'in_progress',
        questions: '3/5 Qs',
        score: '50/100',
        icon: <DollarSign className="w-5 h-5 text-[#8E24AA]" />,
      },
      {
        id: 'P7.3',
        code: 'Cap 7.3',
        name: 'Enterprise Risk Management',
        description: 'Multi-peril crop insurance, hail netting coverage, and drought contingencies.',
        status: 'in_progress',
        questions: '2/5 Qs',
        score: '45/100',
        icon: <Shield className="w-5 h-5 text-slate-500" />,
      },
      {
        id: 'P7.4',
        code: 'Cap 7.4',
        name: 'Asset Depreciation & Maintenance',
        description: 'Tractor servicing schedules, pump maintenance logs, and asset value registers.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '60/100',
        icon: <Layers className="w-5 h-5 text-[#8E24AA]" />,
      },
      {
        id: 'P7.5',
        code: 'Cap 7.5',
        name: 'ESG & Carbon Footprint Accounting',
        description: 'Measuring on-farm emissions, renewable energy offset ratios, and waste circularity.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '60/100',
        icon: <Sparkles className="w-5 h-5 text-[#8E24AA]" />,
      },
    ],
  },
  8: {
    pillarCode: 'Pillar 8',
    pillarName: 'Investment Readiness & Enterprise Development',
    pillarIcon: <Briefcase className="w-5 h-5 text-[#683C21]" />,
    accentColor: '#683C21',
    defaultScore: 71,
    maturityLabel: 'Developing',
    capabilities: [
      {
        id: 'P8.1',
        code: 'Cap 8.1',
        name: 'Audited Financial Statements',
        description: 'Certified 3-year P&L, balance sheets, and formal corporate tax compliance.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '65/100',
        icon: <FileText className="w-5 h-5 text-[#683C21]" />,
      },
      {
        id: 'P8.2',
        code: 'Cap 8.2',
        name: 'Bankable Business Plan',
        description: 'Expansion financial models, IRR projections, and unit economics sensitivity tables.',
        status: 'in_progress',
        questions: '2/5 Qs',
        score: '45/100',
        icon: <TrendingUp className="w-5 h-5 text-[#683C21]" />,
      },
      {
        id: 'P8.3',
        code: 'Cap 8.3',
        name: 'Blended Finance & Grant Navigation',
        description: 'Applying for concessional ag-loans, climate adaptation grants, and DFI funding.',
        status: 'in_progress',
        questions: '2/5 Qs',
        score: '40/100',
        icon: <DollarSign className="w-5 h-5 text-slate-500" />,
      },
      {
        id: 'P8.4',
        code: 'Cap 8.4',
        name: 'Collateral & Asset Registry',
        description: 'Documented title deeds, equipment lease agreements, and charge security.',
        status: 'completed',
        questions: '5/5 Qs',
        score: '55/100',
        icon: <Layers className="w-5 h-5 text-[#683C21]" />,
      },
      {
        id: 'P8.5',
        code: 'Cap 8.5',
        name: 'Investor Data Room Preparation',
        description: 'Secure digital repository with GAP certs, supplier contracts, and audit histories.',
        status: 'in_progress',
        questions: '2/5 Qs',
        score: '45/100',
        icon: <ShieldCheck className="w-5 h-5 text-slate-500" />,
      },
    ],
  },
};

const PILLAR_SUMMARY_ITEMS = [
  { id: 1, number: '01', code: 'P1', name: 'Smart Farming', score: 85, status: 'completed' },
  { id: 2, number: '02', code: 'P2', name: 'Renewable Energy', score: 45, status: 'in_progress' },
  { id: 3, number: '03', code: 'P3', name: 'Food Safety', score: 65, status: 'completed' },
  { id: 4, number: '04', code: 'P4', name: 'Climate Resilience', score: 58, status: 'completed' },
  { id: 5, number: '05', code: 'P5', name: 'Market Access', score: 68, status: 'in_progress' },
  { id: 6, number: '06', code: 'P6', name: 'Human Capital', score: 88, status: 'completed' },
  { id: 7, number: '07', code: 'P7', name: 'Business Mgmt', score: 75, status: 'in_progress' },
  { id: 8, number: '08', code: 'P8', name: 'Investment Readiness', score: 71, status: 'in_progress' },
];

export const AssessmentHubPage: React.FC = () => {
  const {
    pillars,
    startAssessment,
    awardXp,
    assessment,
    setScreen,
    setSelectedPillarDetailId,
  } = useAppStore();
  const [selectedPillarId, setSelectedPillarId] = useState<number>(2); // Default to Pillar 2 (P.U.R.E)
  const [loading, setLoading] = useState(false);

  const selectedPillarMeta =
    PILLAR_CAPABILITIES_MAP[selectedPillarId] || PILLAR_CAPABILITIES_MAP[2];

  // Dynamic Assessment Progress Calculations
  const hasActiveSession = assessment.questions.length > 0;
  const activeQuestionsAnswered = Object.keys(assessment.answers).length;
  const activeTotalQuestions = assessment.questions.length;
  const activeProgressPct = hasActiveSession && activeTotalQuestions > 0
    ? Math.round((activeQuestionsAnswered / activeTotalQuestions) * 100)
    : 68; // Baseline enterprise benchmark

  const completedPillarsCount = 4;
  const inProgressPillarsCount = 4;
  const completedCapabilitiesCount = 28;
  const totalCapabilitiesCount = 40;

  const handleStart = async (scope: 'full' | 'pillar') => {
    setLoading(true);
    try {
      const pId = scope === 'pillar' ? selectedPillarId : null;
      const res = await assessmentApi.startAssessment(scope, pId);
      startAssessment(res.assessment_id, scope, res.questions, pId);
      awardXp(25, 'Started Assessment');
    } catch (e: any) {
      alert(`Could not start assessment: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPillarDetail = (pId: number = selectedPillarId) => {
    setSelectedPillarDetailId(pId);
    setScreen('screen-pillar-detail');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* ─── 0. Live Assessment Progress Dashboard Card ───────────────────── */}
      <section className="bg-gradient-to-br from-[#023c3f] via-[#045D61] to-[#012527] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#045D61]/40 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#009924]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FFD700] text-[11px] font-extrabold uppercase tracking-wider border border-white/15">
                <Activity className="w-3.5 h-3.5 animate-pulse text-[#7ffd7b]" />
                <span>Enterprise Diagnostic Status</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Farm Assessment Progress
              </h2>
              <p className="text-xs text-white/80 max-w-xl">
                Track your ongoing audit progress across all 8 pillars and 40 operational capabilities.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {hasActiveSession ? (
                <button
                  onClick={() => setScreen('screen-question')}
                  className="px-5 py-2.5 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs shadow-lg shadow-[#009924]/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Assessment ({activeQuestionsAnswered}/{activeTotalQuestions})</span>
                </button>
              ) : (
                <button
                  onClick={() => setScreen('screen-result')}
                  className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#FFD700]" />
                  <span>View Verified Scorecard</span>
                </button>
              )}

              <button
                onClick={() => setScreen('screen-pricing')}
                className="px-4 py-2.5 rounded-xl bg-[#FFD700] hover:bg-[#ffe033] text-[#004447] font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Upgrade Pro ($10)</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Progress Bar & KPI Metrics */}
          <div className="space-y-3 bg-black/20 p-5 rounded-2xl border border-white/10 backdrop-blur-xs">
            <div className="flex flex-wrap justify-between items-center text-xs font-semibold gap-2">
              <span className="flex items-center gap-2 text-white/90">
                <Gauge className="w-4 h-4 text-[#7ffd7b]" />
                <span>Overall Audit Completion: <strong className="text-[#FFD700] text-sm">{activeProgressPct}%</strong></span>
              </span>
              <span className="text-white/70 text-[11px]">
                {completedCapabilitiesCount} / {totalCapabilitiesCount} Capabilities Verified • {completedPillarsCount} of 8 Pillars Complete
              </span>
            </div>

            <div className="w-full h-3.5 bg-white/15 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activeProgressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#009924] via-[#7ffd7b] to-[#FFD700] rounded-full relative shadow-sm"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>

            {/* 8-Pillar Status Tracker Strip */}
            <div className="pt-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-2">
                Pillar Completion Tracker (Click to Select):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {PILLAR_SUMMARY_ITEMS.map((item) => {
                  const isSelected = selectedPillarId === item.id;
                  const isDone = item.status === 'completed';

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedPillarId(item.id)}
                      className={`p-2 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white text-[#004447] border-[#FFD700] shadow-md scale-102 font-bold'
                          : isDone
                          ? 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                          : 'bg-black/30 hover:bg-black/40 border-white/10 text-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-extrabold">{item.code}</span>
                        {isDone ? (
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-[#009924]' : 'text-[#7ffd7b]'}`} />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-[#EF6C00] animate-pulse" />
                        )}
                      </div>
                      <span className="text-[11px] font-bold line-clamp-1 leading-tight">{item.name}</span>
                      <span className={`text-[10px] mt-1 font-semibold ${isSelected ? 'text-[#004447]' : 'text-white/70'}`}>
                        {item.score}/100
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 1. Featured Pillar Assessment Banner ────────────────────────── */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
        {/* Ambient background glow in upper right corner */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#045D61] opacity-10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex-shrink-0">
                {selectedPillarMeta.pillarIcon}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#045D61] tracking-widest uppercase bg-[#045D61]/10 px-2.5 py-0.5 rounded-full">
                  {selectedPillarMeta.pillarCode}
                </span>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">• Active Diagnostic Focus</span>
              </div>
            </div>

            <div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                {selectedPillarMeta.pillarName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
                Evaluate your farm's capability benchmarks, energy resilience, and operational readiness under this core pillar.
              </p>
            </div>

            {/* Metadata Chips Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1.5 bg-[#EF6C00]/10 text-[#EF6C00] px-3 py-1 rounded-full border border-[#EF6C00]/25 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Diagnostic Active</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1 rounded-full font-semibold">
                <BarChart3 className="w-3.5 h-3.5 text-[#045D61]" />
                <span>Maturity: {selectedPillarMeta.maturityLabel}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <ListChecks className="w-3.5 h-3.5 text-slate-400" />
                <span>5 Capabilities Evaluated</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Timer className="w-3.5 h-3.5 text-slate-400" />
                <span>~4 mins (~25 Questions)</span>
              </div>
            </div>
          </div>

          {/* Right Callout: Pillar Score & Launch CTA */}
          <div className="flex flex-col items-center lg:items-end gap-3 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-slate-200/80 pt-6 lg:pt-0 lg:pl-8">
            <div className="text-center lg:text-right">
              <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#045D61] leading-none">
                {selectedPillarMeta.defaultScore}
                <span className="text-lg font-normal text-slate-400">/100</span>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                Current Pillar Score
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full">
              <button
                onClick={() => handleStart('pillar')}
                disabled={loading}
                className="w-full bg-[#045D61] hover:bg-[#023c3f] text-white rounded-xl py-3 px-6 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:scale-102 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Continue Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={() => handleOpenPillarDetail(selectedPillarId)}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-[#009924] border border-emerald-200 rounded-xl py-2 px-4 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Pillar 0{selectedPillarId} Action Plan</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Assessment Journey & Value Prop (Consistent Animated Journey) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey Map (Spans 2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                Competency Progression
              </span>
              <h3 className="font-serif text-xl font-bold text-slate-900 mt-0.5">
                Assessment Journey
              </h3>
            </div>
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
              className="text-xs font-bold text-[#009924] bg-[#009924]/10 px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#009924]/20 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#009924] animate-pulse" />
              <span>Step 1: Baseline Diagnostic</span>
            </motion.span>
          </div>

          <div className="relative flex items-center justify-between pt-2 pb-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10 rounded-full" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '20%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#045D61] to-[#009924] -z-10 rounded-full"
            />

            {/* Step 1 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2 bg-white px-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-[#009924] text-white flex items-center justify-center border-2 border-white shadow-md relative">
                <span className="absolute -inset-1 rounded-full bg-[#009924]/30 animate-ping pointer-events-none" />
                <Check className="w-4 h-4 relative z-10" />
              </div>
              <span className="text-[11px] font-extrabold text-[#009924] group-hover:text-[#045D61] transition-colors hidden sm:block uppercase tracking-wider">
                1. Assess
              </span>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2 bg-white px-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-slate-50 border-2 border-slate-300 text-slate-400 group-hover:border-[#045D61] group-hover:text-[#045D61] flex items-center justify-center shadow-xs transition-colors">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-900 transition-colors hidden sm:block uppercase tracking-wider">
                2. Get Results
              </span>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2 bg-white px-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-slate-50 border-2 border-slate-300 text-slate-400 group-hover:border-[#045D61] group-hover:text-[#045D61] flex items-center justify-center shadow-xs transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-900 transition-colors hidden sm:block uppercase tracking-wider">
                3. Identify Gaps
              </span>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2 bg-white px-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-slate-50 border-2 border-slate-300 text-slate-400 group-hover:border-[#009924] group-hover:text-[#009924] flex items-center justify-center shadow-xs transition-colors">
                <Lightbulb className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-900 transition-colors hidden sm:block uppercase tracking-wider">
                4. Learn
              </span>
            </motion.div>

            {/* Step 5 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2 bg-white px-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-slate-50 border-2 border-slate-300 text-slate-400 group-hover:border-[#EF6C00] group-hover:text-[#EF6C00] flex items-center justify-center shadow-xs transition-colors">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-900 transition-colors hidden sm:block uppercase tracking-wider">
                5. Take Action
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Why Complete This Value Prop (Spans 1 col) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gradient-to-br from-[#023c3f] via-[#045D61] to-[#012527] text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-md hover:shadow-xl transition-all border border-[#045D61]/40 group"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-[#FFD700] flex items-center justify-center group-hover:rotate-6 transition-transform">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD700]">
                Why Complete This?
              </span>
            </div>

            <p className="text-xs text-white/90 leading-relaxed">
              Completing this diagnostic unlocks tailored insights, actionable recommendations to improve energy and operational efficiency, and direct connections to vetted service providers in your region.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#009924]" />
              <span>Verified FFMI Audit</span>
            </span>
            <span className="text-[#FFD700] font-bold">+250 XP per Full Audit</span>
          </div>
        </motion.div>
      </div>

      {/* ─── 3. Choose Pathway Section ─────────────────────────────────── */}
      <div>
        <div className="text-center space-y-1 mb-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
            Assessment Pathways
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Select Your Audit Scope
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Choose between a targeted single-pillar capability deep dive or a comprehensive 8-pillar farm baseline.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-pricing')}
              className="px-4 py-1.5 rounded-full bg-emerald-50 text-[#009924] border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>View $1 &amp; $10 Assessment Packages</span>
              <Sparkles className="w-3.5 h-3.5 text-[#009924]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pathway A: Single Pillar */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 hover:border-[#045D61]/40 transition-all flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EF6C00]/15 border border-[#EF6C00]/30 text-[#EF6C00] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#EF6C00]">
                  Pathway A • Quick Audit
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-900 mt-0.5 group-hover:text-[#045D61] transition-colors">
                  Single-Pillar Capability Deep Dive
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Target a specific operational priority (e.g. Smart Farming, Renewable Energy, or Food Safety) with 25 targeted questions in under 4 minutes.
              </p>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  Select Priority Pillar:
                </label>
                <select
                  value={selectedPillarId}
                  onChange={(e) => setSelectedPillarId(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#045D61]/20 focus:border-[#045D61] outline-none shadow-xs cursor-pointer"
                >
                  {pillars.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStart('pillar')}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Launch Single-Pillar Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Pathway B: Full 8-Pillar Baseline */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#023c3f] via-[#045D61] to-[#012527] border border-[#009924]/40 text-white flex flex-col justify-between space-y-6 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 rounded-full bg-[#FFD700] text-[#023c3f] font-extrabold text-[10px] uppercase tracking-wider shadow-sm animate-bounce">
                Recommended
              </span>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#009924]/25 border border-[#009924]/40 text-[#FFD700] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                🌟
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#009924]">
                  Pathway B • Full Baseline
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                  Comprehensive 8-Pillar Diagnostic
                </h3>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Complete baseline across all 40 capabilities. Calculates your definitive FFMI maturity score, assigns your official Tier (1–5), and unlocks your PDF scorecard.
              </p>

              <ul className="space-y-2 text-xs text-white/90 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009924]" />
                  <span>Deterministic FFMI calculation &amp; Tier certificate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009924]" />
                  <span>5-field structured action roadmap</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009924]" />
                  <span>Earn 250 XP &amp; unlock Master Steward Badges</span>
                </li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStart('full')}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#009924]/30 transition-all cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Start Full 8-Pillar Diagnostic</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ─── 4. Capabilities Breakdown Section (Below Pathways) ──────────── */}
      <section className="space-y-5 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
              Diagnostic Scope &amp; Capabilities
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Capabilities Breakdown ({selectedPillarMeta.pillarName})
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-slate-500 font-medium hidden md:inline">
              5 key capabilities evaluated under {selectedPillarMeta.pillarCode}
            </p>
            <button
              onClick={() => handleOpenPillarDetail(selectedPillarId)}
              className="px-3.5 py-1.5 rounded-xl bg-[#004447] text-white hover:bg-[#023c3f] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Inspect Pillar Detail &amp; Providers</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#009924]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {selectedPillarMeta.capabilities.map((cap) => {
            const isCompleted = cap.status === 'completed';
            const isInProgress = cap.status === 'in_progress';

            return (
              <motion.div
                key={cap.id}
                whileHover={{ y: -2 }}
                onClick={() => handleStart('pillar')}
                className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md ${
                  isInProgress
                    ? 'border-2 border-[#045D61] relative overflow-hidden'
                    : 'border-slate-200/90 hover:border-[#045D61]/40'
                }`}
              >
                {isInProgress && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#045D61]/5 rounded-bl-full pointer-events-none" />
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 group-hover:border-[#045D61] transition-colors">
                      {cap.icon}
                    </div>

                    {isCompleted ? (
                      <span className="bg-[#009924]/10 text-[#009924] border border-[#009924]/20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    ) : isInProgress ? (
                      <span className="bg-[#045D61]/10 text-[#045D61] border border-[#045D61]/20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#045D61] animate-pulse" />
                        <span>In Progress</span>
                      </span>
                    ) : (
                      <span className="border border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Ready for Audit
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {cap.code}
                  </span>
                  <h4 className="font-serif text-base font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug">
                    {cap.name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-xs">
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <ListChecks className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cap.questions}</span>
                  </span>
                  <span
                    className={`font-bold ${
                      isCompleted
                        ? 'text-[#009924]'
                        : isInProgress
                        ? 'text-[#045D61]'
                        : 'text-slate-400'
                    }`}
                  >
                    {cap.score}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
