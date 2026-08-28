import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Gauge,
  BookOpen,
  PlayCircle,
  Handshake,
  ChevronRight,
  Sun,
  Cpu,
  ShieldCheck,
  Trees,
  Truck,
  Users,
  Building2,
  Briefcase,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { assessmentApi } from '../services/api';

interface CapabilityItem {
  id: number;
  name: string;
  score: number;
  color: 'error' | 'secondary' | 'warning' | 'primary';
}

interface ActionPlanItem {
  id: string;
  icon: 'lightbulb' | 'speed';
  title: string;
  description: string;
  capabilityTarget: string;
}

interface LearningCourseItem {
  id: string;
  title: string;
  duration: string;
  type: string;
  image: string;
}

interface VettedProviderItem {
  id: string;
  initials: string;
  name: string;
  category: string;
  colorScheme: 'secondary' | 'primary' | 'gold' | 'blue';
}

interface PillarDetailData {
  id: number;
  number: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  iconName: string;
  score: number;
  maturity: 'Non-Existent' | 'Basic' | 'Developing' | 'Established' | 'Advanced';
  maturityColor: string;
  capabilities: CapabilityItem[];
  actionPlan: ActionPlanItem[];
  courses: LearningCourseItem[];
  providers: VettedProviderItem[];
}

const PILLAR_DETAILS: Record<number, PillarDetailData> = {
  1: {
    id: 1,
    number: '01',
    name: 'Smart Farming & Digital Transformation',
    shortName: 'Smart Farming',
    tagline: 'Digital Infrastructure & Precision Agronomy',
    description:
      "Evaluates your adoption of IoT sensor arrays, digital farm records, precision UAV imagery, and real-time yield prediction algorithms. Your current score indicates active digitalization with opportunities to automate telemetry and field scout data.",
    icon: <Cpu className="w-6 h-6 text-[#1E88E5]" />,
    iconName: 'memory',
    score: 72,
    maturity: 'Developing',
    maturityColor: '#7CB342',
    capabilities: [
      { id: 1, name: '1. Sensor Networks & IoT Telemetry', score: 65, color: 'secondary' },
      { id: 2, name: '2. Farm Management Software & ERP', score: 80, color: 'secondary' },
      { id: 3, name: '3. Precision Agronomy & Drone Mapping', score: 45, color: 'warning' },
      { id: 4, name: '4. Soil & Yield Predictive Analytics', score: 78, color: 'secondary' },
      { id: 5, name: '5. Traceability & Data Governance', score: 92, color: 'secondary' },
    ],
    actionPlan: [
      {
        id: 'p1-act-1',
        icon: 'lightbulb',
        title: 'Deploy Multispectral Drone Mapping for Crop Stress',
        description: 'Conduct bi-weekly aerial NDVI flights over high-value blocks to catch nitrogen deficiencies and pest hot-spots 7 days before visual onset.',
        capabilityTarget: 'Precision Agronomy & Drone Mapping',
      },
      {
        id: 'p1-act-2',
        icon: 'speed',
        title: 'Calibrate Soil Moisture Probes with ERP Irrigation Schedule',
        description: 'Sync root-zone capacitive sensor readings directly to automated solenoid valve controllers to eliminate over-watering.',
        capabilityTarget: 'Sensor Networks & IoT Telemetry',
      },
    ],
    courses: [
      {
        id: 'c-sf-1',
        title: 'Introduction to Drone NDVI Crop Analytics',
        duration: '20 min video',
        type: 'Video',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA79Wetje4xrVu7HbTrR5gRP2u4JE16p73dHmcBgvxPyaqWpRS50x1PlrVs-0CEBEMQ5nxQSX9m-xkr7RY5sSX1WHZ7kp7y2gMCfvLhgGXRoVsEdkdKCQKqY03ehH8X7i17wxGYKtRheM6Vc_q2XkyWG5vJz2XW2C6whaYM9L3hoSY6Oog2RT_vqAhfoTL_ITHeK3amR_PK2UuTdhyV9WnCeXlRrgqTlfPyV4HGNTVxjW-LVXPggn8',
      },
      {
        id: 'c-sf-2',
        title: 'Connected Farm Management Software & Data Integrity',
        duration: '35 min module',
        type: 'Interactive',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOkJyhoFv5iF_H3k5UPJM7funfKEdLxuTRNiW7zghYgwzeQKEpuP_aC0gaYp7k0WwO5nwJ0womvOuuGMC7dpGrC6xk4hrmPnpa3cXmpHYqUB39hbzhWQtsaZRo5gmQdDegGwElknRgtEqH5L70TROMjhY7txnxyWpqmb3DqeRjnJEJFxH2NqNwkl_pDvHJNXnP3f4pI43vNXXYc6xdxT_lKaVPHQGlnYSW41NTAhkBfBtbg7ZLVHw',
      },
    ],
    providers: [
      { id: 'prov-sf-1', initials: 'AT', name: 'AgriTech Telemetry Solutions', category: 'IoT & Sensor Systems', colorScheme: 'primary' },
      { id: 'prov-sf-2', initials: 'PD', name: 'Precision Drones Africa', category: 'UAV Mapping & Scouting', colorScheme: 'secondary' },
    ],
  },
  2: {
    id: 2,
    number: '02',
    name: 'Renewable Energy',
    shortName: 'Renewable Energy',
    tagline: 'Productive Use of Renewable Energy (P.U.R.E)',
    description:
      "This pillar evaluates your farm's transition away from fossil fuels towards sustainable, self-generating energy solutions. Your current score indicates foundational steps have been taken, but significant optimization is required for long-term resilience and cost savings.",
    icon: <Sun className="w-6 h-6 text-[#FDD835]" />,
    iconName: 'solar_power',
    score: 45,
    maturity: 'Basic',
    maturityColor: '#FBC02D',
    capabilities: [
      { id: 1, name: '1. Energy Sources & Usage', score: 30, color: 'error' },
      { id: 2, name: '2. Renewable Energy Adoption', score: 10, color: 'error' },
      { id: 3, name: '3. Energy Efficiency', score: 55, color: 'secondary' },
      { id: 4, name: '4. Energy Infrastructure', score: 40, color: 'secondary' },
      { id: 5, name: '5. Energy Management', score: 90, color: 'secondary' },
    ],
    actionPlan: [
      {
        id: 'p2-act-1',
        icon: 'lightbulb',
        title: 'Conduct a Solar Feasibility Study',
        description: 'Assess roof space and local irradiance data to determine potential ROI for a 50kW array.',
        capabilityTarget: 'Adoption & Sources',
      },
      {
        id: 'p2-act-2',
        icon: 'speed',
        title: 'Install Smart Meters on High-Draw Equipment',
        description: 'Begin tracking granular energy usage for irrigation pumps and cold storage to identify baseline waste.',
        capabilityTarget: 'Energy Efficiency & Usage',
      },
    ],
    courses: [
      {
        id: 'c-re-1',
        title: 'Introduction to On-Farm Solar',
        duration: '15 min video',
        type: 'Video',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOkJyhoFv5iF_H3k5UPJM7funfKEdLxuTRNiW7zghYgwzeQKEpuP_aC0gaYp7k0WwO5nwJ0womvOuuGMC7dpGrC6xk4hrmPnpa3cXmpHYqUB39hbzhWQtsaZRo5gmQdDegGwElknRgtEqH5L70TROMjhY7txnxyWpqmb3DqeRjnJEJFxH2NqNwkl_pDvHJNXnP3f4pI43vNXXYc6xdxT_lKaVPHQGlnYSW41NTAhkBfBtbg7ZLVHw',
      },
      {
        id: 'c-re-2',
        title: 'Energy Auditing Basics',
        duration: '45 min module',
        type: 'Interactive',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA79Wetje4xrVu7HbTrR5gRP2u4JE16p73dHmcBgvxPyaqWpRS50x1PlrVs-0CEBEMQ5nxQSX9m-xkr7RY5sSX1WHZ7kp7y2gMCfvLhgGXRoVsEdkdKCQKqY03ehH8X7i17wxGYKtRheM6Vc_q2XkyWG5vJz2XW2C6whaYM9L3hoSY6Oog2RT_vqAhfoTL_ITHeK3amR_PK2UuTdhyV9WnCeXlRrgqTlfPyV4HGNTVxjW-LVXPggn8',
      },
    ],
    providers: [
      { id: 'prov-re-1', initials: 'SS', name: 'SunSync Agri', category: 'Solar Installers', colorScheme: 'secondary' },
      { id: 'prov-re-2', initials: 'EA', name: 'EcoAudit Pros', category: 'Energy Consultants', colorScheme: 'primary' },
    ],
  },
  3: {
    id: 3,
    number: '03',
    name: 'Food Safety, Quality & Compliance',
    shortName: 'Food Safety',
    tagline: 'Standardization, HACCP & Export Certification',
    description:
      'Evaluates post-harvest sanitization, Maximum Residue Limit (MRL) chemical governance, cold-chain temperature continuous monitoring, and traceability audit preparedness for global and regional export markets.',
    icon: <ShieldCheck className="w-6 h-6 text-[#43A047]" />,
    iconName: 'verified_user',
    score: 65,
    maturity: 'Developing',
    maturityColor: '#7CB342',
    capabilities: [
      { id: 1, name: '1. GlobalGAP & Standard Compliance', score: 60, color: 'secondary' },
      { id: 2, name: '2. Cold Chain & Post-Harvest Handling', score: 70, color: 'secondary' },
      { id: 3, name: '3. Water & Input Sanitization', score: 50, color: 'warning' },
      { id: 4, name: '4. Chemical Residue & MRL Testing', score: 55, color: 'secondary' },
      { id: 5, name: '5. Recall & Traceability Protocols', score: 90, color: 'secondary' },
    ],
    actionPlan: [
      {
        id: 'p3-act-1',
        icon: 'lightbulb',
        title: 'Establish Digital HACCP Temperature Logging',
        description: 'Automate cold-room thermal alerts to ensure pre-cooling standards meet strict GlobalGAP export thresholds.',
        capabilityTarget: 'Cold Chain Handling',
      },
      {
        id: 'p3-act-2',
        icon: 'speed',
        title: 'Conduct Water Microbial Sanitization Test',
        description: 'Send irrigation and wash-station water samples for certified lab analysis of E. coli and heavy metal residues.',
        capabilityTarget: 'Water Sanitization',
      },
    ],
    courses: [
      {
        id: 'c-fs-1',
        title: 'GlobalGAP Certification Step-by-Step Guide',
        duration: '30 min module',
        type: 'Interactive',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOkJyhoFv5iF_H3k5UPJM7funfKEdLxuTRNiW7zghYgwzeQKEpuP_aC0gaYp7k0WwO5nwJ0womvOuuGMC7dpGrC6xk4hrmPnpa3cXmpHYqUB39hbzhWQtsaZRo5gmQdDegGwElknRgtEqH5L70TROMjhY7txnxyWpqmb3DqeRjnJEJFxH2NqNwkl_pDvHJNXnP3f4pI43vNXXYc6xdxT_lKaVPHQGlnYSW41NTAhkBfBtbg7ZLVHw',
      },
      {
        id: 'c-fs-2',
        title: 'HACCP Principles & Post-Harvest Quality',
        duration: '25 min video',
        type: 'Video',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA79Wetje4xrVu7HbTrR5gRP2u4JE16p73dHmcBgvxPyaqWpRS50x1PlrVs-0CEBEMQ5nxQSX9m-xkr7RY5sSX1WHZ7kp7y2gMCfvLhgGXRoVsEdkdKCQKqY03ehH8X7i17wxGYKtRheM6Vc_q2XkyWG5vJz2XW2C6whaYM9L3hoSY6Oog2RT_vqAhfoTL_ITHeK3amR_PK2UuTdhyV9WnCeXlRrgqTlfPyV4HGNTVxjW-LVXPggn8',
      },
    ],
    providers: [
      { id: 'prov-fs-1', initials: 'CA', name: 'CertiSafe Africa Auditors', category: 'Compliance & Audit', colorScheme: 'primary' },
      { id: 'prov-fs-2', initials: 'QL', name: 'QualiTech Lab Services', category: 'MRL & Water Testing', colorScheme: 'secondary' },
    ],
  },
  4: {
    id: 4,
    number: '04',
    name: 'Indigenous Knowledge & Climate Resilience',
    shortName: 'Climate Resilience',
    tagline: 'Regenerative Practices & Ecological Wisdom',
    description:
      'Measures integration of traditional agro-ecological insights with scientific climate forecasting, biochar soil carbon enhancement, indigenous drought-tolerant crop cultivars, and micro-watershed swale structures.',
    icon: <Trees className="w-6 h-6 text-[#2E7D32]" />,
    iconName: 'forest',
    score: 58,
    maturity: 'Developing',
    maturityColor: '#7CB342',
    capabilities: [
      { id: 1, name: '1. Soil Organic Matter & Biochar', score: 50, color: 'warning' },
      { id: 2, name: '2. Indigenous Seed & Crop Diversity', score: 75, color: 'secondary' },
      { id: 3, name: '3. Agroforestry & Microclimate Control', score: 60, color: 'secondary' },
      { id: 4, name: '4. Rainwater Swales & Retention Ponds', score: 45, color: 'warning' },
      { id: 5, name: '5. Drought-Resistant Intercropping', score: 60, color: 'secondary' },
    ],
    actionPlan: [
      {
        id: 'p4-act-1',
        icon: 'lightbulb',
        title: 'Construct Swales & Contour Catchments',
        description: 'Dig contour swales to capture run-off water on slopes, replenishing groundwater and preventing topsoil erosion.',
        capabilityTarget: 'Rainwater Retention',
      },
      {
        id: 'p4-act-2',
        icon: 'speed',
        title: 'Integrate On-Farm Biochar Kiln Production',
        description: 'Pyrolyze crop prunings to produce high-grade biochar, boosting soil microbial retention and nutrient exchange capacity.',
        capabilityTarget: 'Soil Organic Matter',
      },
    ],
    courses: [
      {
        id: 'c-cr-1',
        title: 'Agroforestry Design for Commercial Resilience',
        duration: '40 min module',
        type: 'Interactive',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOkJyhoFv5iF_H3k5UPJM7funfKEdLxuTRNiW7zghYgwzeQKEpuP_aC0gaYp7k0WwO5nwJ0womvOuuGMC7dpGrC6xk4hrmPnpa3cXmpHYqUB39hbzhWQtsaZRo5gmQdDegGwElknRgtEqH5L70TROMjhY7txnxyWpqmb3DqeRjnJEJFxH2NqNwkl_pDvHJNXnP3f4pI43vNXXYc6xdxT_lKaVPHQGlnYSW41NTAhkBfBtbg7ZLVHw',
      },
      {
        id: 'c-cr-2',
        title: 'Soil Carbon & Biochar Practical Application',
        duration: '20 min video',
        type: 'Video',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA79Wetje4xrVu7HbTrR5gRP2u4JE16p73dHmcBgvxPyaqWpRS50x1PlrVs-0CEBEMQ5nxQSX9m-xkr7RY5sSX1WHZ7kp7y2gMCfvLhgGXRoVsEdkdKCQKqY03ehH8X7i17wxGYKtRheM6Vc_q2XkyWG5vJz2XW2C6whaYM9L3hoSY6Oog2RT_vqAhfoTL_ITHeK3amR_PK2UuTdhyV9WnCeXlRrgqTlfPyV4HGNTVxjW-LVXPggn8',
      },
    ],
    providers: [
      { id: 'prov-cr-1', initials: 'RE', name: 'RegenEarth Consulting', category: 'Agro-Ecology Specialists', colorScheme: 'secondary' },
      { id: 'prov-cr-2', initials: 'HB', name: 'Heritage Biochar Systems', category: 'Soil Enhancement Systems', colorScheme: 'primary' },
    ],
  },
  5: {
    id: 5,
    number: '05',
    name: 'Market Access & Value Chain Integration',
    shortName: 'Market Access',
    tagline: 'Off-Take Contracts & Direct B2B Distribution',
    description:
      'Assesses your connectivity to premium domestic and export off-takers, value-added packaging facilities, contracted price minimum guarantees, and digital market pricing intelligence.',
    icon: <Truck className="w-6 h-6 text-[#FB8C00]" />,
    iconName: 'storefront',
    score: 60,
    maturity: 'Developing',
    maturityColor: '#7CB342',
    capabilities: [
      { id: 1, name: '1. Export Contract Negotiation', score: 55, color: 'secondary' },
      { id: 2, name: '2. Value-Add Processing & Packaging', score: 65, color: 'secondary' },
      { id: 3, name: '3. Cold Logistics & Freight Aggregation', score: 50, color: 'warning' },
      { id: 4, name: '4. Price Forecasting & Commodity Hedging', score: 40, color: 'warning' },
      { id: 5, name: '5. Digital B2B Buyer Marketplace Integration', score: 90, color: 'secondary' },
    ],
    actionPlan: [
      {
        id: 'p5-act-1',
        icon: 'lightbulb',
        title: 'Lock Formal 12-Month Off-Take Master Agreement',
        description: 'Transition from spot market brokers to multi-cycle forward purchase contracts with minimum base pricing.',
        capabilityTarget: 'Export Contract Negotiation',
      },
      {
        id: 'p5-act-2',
        icon: 'speed',
        title: 'Implement Modified Atmosphere Retail Packaging',
        description: 'Upgrade sorting line packaging to extend supermarket shelf life from 4 to 12 days for premium price capture.',
        capabilityTarget: 'Value-Add Packaging',
      },
    ],
    courses: [
      {
        id: 'c-ma-1',
        title: 'Negotiating Bankable Off-Take Agribusiness Contracts',
        duration: '35 min module',
        type: 'Interactive',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA79Wetje4xrVu7HbTrR5gRP2u4JE16p73dHmcBgvxPyaqWpRS50x1PlrVs-0CEBEMQ5nxQSX9m-xkr7RY5sSX1WHZ7kp7y2gMCfvLhgGXRoVsEdkdKCQKqY03ehH8X7i17wxGYKtRheM6Vc_q2XkyWG5vJz2XW2C6whaYM9L3hoSY6Oog2RT_vqAhfoTL_ITHeK3amR_PK2UuTdhyV9WnCeXlRrgqTlfPyV4HGNTVxjW-LVXPggn8',
      },
      {
        id: 'c-ma-2',
        title: 'Cold-Chain Freight Optimization & Logistics',
        duration: '25 min video',
        type: 'Video',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOkJyhoFv5iF_H3k5UPJM7funfKEdLxuTRNiW7zghYgwzeQKEpuP_aC0gaYp7k0WwO5nwJ0womvOuuGMC7dpGrC6xk4hrmPnpa3cXmpHYqUB39hbzhWQtsaZRo5gmQdDegGwElknRgtEqH5L70TROMjhY7txnxyWpqmb3DqeRjnJEJFxH2NqNwkl_pDvHJNXnP3f4pI43vNXXYc6xdxT_lKaVPHQGlnYSW41NTAhkBfBtbg7ZLVHw',
      },
    ],
    providers: [
      { id: 'prov-ma-1', initials: 'GE', name: 'GlobalExport Direct', category: 'Export Logistics & Brokerage', colorScheme: 'primary' },
      { id: 'prov-ma-2', initials: 'AF', name: 'AgriFreight Cold Logistics', category: 'Refrigerated Transport', colorScheme: 'secondary' },
    ],
  },
  6: {
    id: 6,
    number: '06',
    name: 'Human Capital & Agronomic Skills',
    shortName: 'Human Capital',
    tagline: 'Workforce Upskilling, Safety & Leadership',
    description:
      'Evaluates worker safety training, fair wage compliance, field agronomic continuous upskilling, supervisory capability, and digital mobile learning adoption across the farm team.',
    icon: <Users className="w-6 h-6 text-[#3949AB]" />,
    iconName: 'badge',
    score: 80,
    maturity: 'Established',
    maturityColor: '#388E3C',
    capabilities: [
      { id: 1, name: '1. Occupational Safety & PPE Adherence', score: 85, color: 'secondary' },
      { id: 2, name: '2. Continuous Agronomic Skills Upskilling', score: 75, color: 'secondary' },
      { id: 3, name: '3. Fair Wage & Ethical Labor Standards', score: 90, color: 'secondary' },
      { id: 4, name: '4. Supervisory & Extension Delivery', score: 70, color: 'secondary' },
      { id: 5, name: '5. Mobile Digital Tools Competency', score: 80, color: 'secondary' },
    ],
    actionPlan: [
      {
        id: 'p6-act-1',
        icon: 'lightbulb',
        title: 'Launch Bi-Weekly Mobile GAP Micro-Learnings',
        description: 'Equip harvest crew leaders with 3-minute video modules on fruit grading and hygienic handling.',
        capabilityTarget: 'Skills Upskilling',
      },
      {
        id: 'p6-act-2',
        icon: 'speed',
        title: 'Formalize Incentive-Based Yield & Quality Bonuses',
        description: 'Tie picker retention bonuses to export pack-out ratios to align incentives and minimize grading rejects.',
        capabilityTarget: 'Ethical Labor & Performance',
      },
    ],
    courses: [
      {
        id: 'c-hc-1',
        title: 'Modern Agronomy Crew Leadership & Safety',
        duration: '25 min module',
        type: 'Interactive',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOkJyhoFv5iF_H3k5UPJM7funfKEdLxuTRNiW7zghYgwzeQKEpuP_aC0gaYp7k0WwO5nwJ0womvOuuGMC7dpGrC6xk4hrmPnpa3cXmpHYqUB39hbzhWQtsaZRo5gmQdDegGwElknRgtEqH5L70TROMjhY7txnxyWpqmb3DqeRjnJEJFxH2NqNwkl_pDvHJNXnP3f4pI43vNXXYc6xdxT_lKaVPHQGlnYSW41NTAhkBfBtbg7ZLVHw',
      },
      {
        id: 'c-hc-2',
        title: 'Field Safety Protocols & Incident Prevention',
        duration: '15 min video',
        type: 'Video',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA79Wetje4xrVu7HbTrR5gRP2u4JE16p73dHmcBgvxPyaqWpRS50x1PlrVs-0CEBEMQ5nxQSX9m-xkr7RY5sSX1WHZ7kp7y2gMCfvLhgGXRoVsEdkdKCQKqY03ehH8X7i17wxGYKtRheM6Vc_q2XkyWG5vJz2XW2C6whaYM9L3hoSY6Oog2RT_vqAhfoTL_ITHeK3amR_PK2UuTdhyV9WnCeXlRrgqTlfPyV4HGNTVxjW-LVXPggn8',
      },
    ],
    providers: [
      { id: 'prov-hc-1', initials: 'AI', name: 'AgroSkill Institute', category: 'Workforce Training & Certification', colorScheme: 'primary' },
      { id: 'prov-hc-2', initials: 'TH', name: 'TalentHarvest Africa', category: 'Agronomic Human Resources', colorScheme: 'secondary' },
    ],
  },
  7: {
    id: 7,
    number: '07',
    name: 'Sustainable Business Management',
    shortName: 'Business Management',
    tagline: 'Financial Discipline, Cost Accounting & ESG',
    description:
      'Measures unit economics margin calculations per crop block, cash flow runway forecasting, operational risk reserves, asset maintenance scheduling, and carbon accounting compliance.',
    icon: <Building2 className="w-6 h-6 text-[#8E24AA]" />,
    iconName: 'analytics',
    score: 55,
    maturity: 'Developing',
    maturityColor: '#7CB342',
    capabilities: [
      { id: 1, name: '1. Crop Unit Economics & Gross Margin Tracking', score: 60, color: 'secondary' },
      { id: 2, name: '2. Cash Flow & Working Capital Planning', score: 50, color: 'warning' },
      { id: 3, name: '3. Enterprise Risk Management & Insurance', score: 45, color: 'warning' },
      { id: 4, name: '4. Asset Depreciation & Preventative Maintenance', score: 60, color: 'secondary' },
      { id: 5, name: '5. ESG & Carbon Footprint Accounting', score: 60, color: 'secondary' },
    ],
    actionPlan: [
      {
        id: 'p7-act-1',
        icon: 'lightbulb',
        title: 'Establish Block-by-Block Cost Accounting',
        description: 'Track labor hours, chemical inputs, and diesel liters down to each 1-acre plot to pinpoint unviable blocks.',
        capabilityTarget: 'Crop Unit Economics',
      },
      {
        id: 'p7-act-2',
        icon: 'speed',
        title: 'Set Up 90-Day Rolling Working Capital Forecast',
        description: 'Model seed and fertilizer purchase lead times to prevent mid-season liquidity pinches.',
        capabilityTarget: 'Working Capital Planning',
      },
    ],
    courses: [
      {
        id: 'c-bm-1',
        title: 'Agribusiness Financial Modeling & Margin Precision',
        duration: '45 min module',
        type: 'Interactive',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA79Wetje4xrVu7HbTrR5gRP2u4JE16p73dHmcBgvxPyaqWpRS50x1PlrVs-0CEBEMQ5nxQSX9m-xkr7RY5sSX1WHZ7kp7y2gMCfvLhgGXRoVsEdkdKCQKqY03ehH8X7i17wxGYKtRheM6Vc_q2XkyWG5vJz2XW2C6whaYM9L3hoSY6Oog2RT_vqAhfoTL_ITHeK3amR_PK2UuTdhyV9WnCeXlRrgqTlfPyV4HGNTVxjW-LVXPggn8',
      },
      {
        id: 'c-bm-2',
        title: 'Managing Cash Flow Cycles in Commercial Farming',
        duration: '20 min video',
        type: 'Video',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOkJyhoFv5iF_H3k5UPJM7funfKEdLxuTRNiW7zghYgwzeQKEpuP_aC0gaYp7k0WwO5nwJ0womvOuuGMC7dpGrC6xk4hrmPnpa3cXmpHYqUB39hbzhWQtsaZRo5gmQdDegGwElknRgtEqH5L70TROMjhY7txnxyWpqmb3DqeRjnJEJFxH2NqNwkl_pDvHJNXnP3f4pI43vNXXYc6xdxT_lKaVPHQGlnYSW41NTAhkBfBtbg7ZLVHw',
      },
    ],
    providers: [
      { id: 'prov-bm-1', initials: 'FA', name: 'AgriFinance Advisory Group', category: 'Financial Modeling & Tax', colorScheme: 'primary' },
      { id: 'prov-bm-2', initials: 'FC', name: 'FarmBooks Cloud ERP', category: 'Agri-Accounting Software', colorScheme: 'secondary' },
    ],
  },
  8: {
    id: 8,
    number: '08',
    name: 'Investment Readiness & Enterprise Development',
    shortName: 'Investment Readiness',
    tagline: 'Capital Structuring, Data Rooms & Growth',
    description:
      'Evaluates bankable business plans, audited financial accounts, blended climate finance navigation, asset registry titling, and investor due diligence readiness for equity and debt expansion.',
    icon: <Briefcase className="w-6 h-6 text-[#683C21]" />,
    iconName: 'domain',
    score: 50,
    maturity: 'Developing',
    maturityColor: '#7CB342',
    capabilities: [
      { id: 1, name: '1. Audited Financial Statements & Bookkeeping', score: 65, color: 'secondary' },
      { id: 2, name: '2. Bankable Business Plan & Expansion Model', score: 45, color: 'warning' },
      { id: 3, name: '3. Blended Climate Finance & Grant Navigation', score: 40, color: 'warning' },
      { id: 4, name: '4. Collateral, Land Title & Asset Registry', score: 55, color: 'secondary' },
      { id: 5, name: '5. Investor Data Room & Due Diligence Deck', score: 45, color: 'warning' },
    ],
    actionPlan: [
      {
        id: 'p8-act-1',
        icon: 'lightbulb',
        title: 'Build Standard 5-Year Pro-Forma Investment Model',
        description: 'Structure revenue forecasts, capex payoff periods, and sensitivity tables compliant with commercial ag-lender formats.',
        capabilityTarget: 'Bankable Business Plan',
      },
      {
        id: 'p8-act-2',
        icon: 'speed',
        title: 'Consolidate Digital Due Diligence Data Room',
        description: 'Upload title deeds, GAP certs, supplier contracts, and audit histories to a secure investor portal.',
        capabilityTarget: 'Investor Data Room',
      },
    ],
    courses: [
      {
        id: 'c-ir-1',
        title: 'Pitching to Agri-Impact Investors & DFIs',
        duration: '40 min module',
        type: 'Interactive',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOkJyhoFv5iF_H3k5UPJM7funfKEdLxuTRNiW7zghYgwzeQKEpuP_aC0gaYp7k0WwO5nwJ0womvOuuGMC7dpGrC6xk4hrmPnpa3cXmpHYqUB39hbzhWQtsaZRo5gmQdDegGwElknRgtEqH5L70TROMjhY7txnxyWpqmb3DqeRjnJEJFxH2NqNwkl_pDvHJNXnP3f4pI43vNXXYc6xdxT_lKaVPHQGlnYSW41NTAhkBfBtbg7ZLVHw',
      },
      {
        id: 'c-ir-2',
        title: 'Navigating Concessional Green Climate Grants',
        duration: '25 min video',
        type: 'Video',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA79Wetje4xrVu7HbTrR5gRP2u4JE16p73dHmcBgvxPyaqWpRS50x1PlrVs-0CEBEMQ5nxQSX9m-xkr7RY5sSX1WHZ7kp7y2gMCfvLhgGXRoVsEdkdKCQKqY03ehH8X7i17wxGYKtRheM6Vc_q2XkyWG5vJz2XW2C6whaYM9L3hoSY6Oog2RT_vqAhfoTL_ITHeK3amR_PK2UuTdhyV9WnCeXlRrgqTlfPyV4HGNTVxjW-LVXPggn8',
      },
    ],
    providers: [
      { id: 'prov-ir-1', initials: 'AC', name: 'AgriCap Investment Advisory', category: 'Capital Raising & Debt Structuring', colorScheme: 'primary' },
      { id: 'prov-ir-2', initials: 'VS', name: 'VentureScale East Africa', category: 'Investor Data Room Prep', colorScheme: 'secondary' },
    ],
  },
};

export const PillarDetailPage: React.FC = () => {
  const {
    selectedPillarDetailId,
    setSelectedPillarDetailId,
    setScreen,
    showNotification,
    startAssessment,
    awardXp,
    setCheckoutItem,
  } = useAppStore();

  const [activePillarId, setActivePillarId] = useState<number>(selectedPillarDetailId || 2);
  const [startedActions, setStartedActions] = useState<Record<string, boolean>>({});
  const [dismissedActions, setDismissedActions] = useState<Record<string, boolean>>({});
  const [isRetaking, setIsRetaking] = useState(false);

  const pillarData = PILLAR_DETAILS[activePillarId] || PILLAR_DETAILS[2];

  const handlePillarChange = (newId: number) => {
    setActivePillarId(newId);
    setSelectedPillarDetailId(newId);
  };

  const handleStartAction = (actionId: string, actionTitle: string) => {
    setStartedActions((prev) => ({ ...prev, [actionId]: true }));
    awardXp(15, `Started Action: ${actionTitle}`);
    showNotification(
      `Action "${actionTitle}" has been added to your Active Farm Roadmap!`,
      'success',
      4000,
      'Action Started (+15 XP)'
    );
  };

  const handleDismissAction = (actionId: string) => {
    setDismissedActions((prev) => ({ ...prev, [actionId]: true }));
    showNotification('Action dismissed from priority view.', 'info', 2500);
  };

  const handleRetakeAssessment = async () => {
    setIsRetaking(true);
    try {
      const res = await assessmentApi.startAssessment('pillar', activePillarId);
      startAssessment(res.assessment_id, 'pillar', res.questions, activePillarId);
      awardXp(20, `Retook Diagnostic: Pillar ${pillarData.number}`);
      showNotification(
        `Retaking diagnostic for Pillar ${pillarData.number}: ${pillarData.name}`,
        'info',
        3500,
        'Pillar Audit Launched'
      );
    } catch (e: any) {
      showNotification(`Could not start retake: ${e.message || e}`, 'error');
    } finally {
      setIsRetaking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ─── 1. Breadcrumbs & Pillar Switcher ─────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => setScreen('screen-result')}
            className="hover:text-[#004447] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Assessment Results</span>
          </button>
          <span>/</span>
          <span className="text-slate-900 font-bold">Pillar {pillarData.number} ({pillarData.shortName})</span>
        </div>

        {/* Quick Pillar Selector Dropdown/Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((pid) => (
            <button
              key={pid}
              onClick={() => handlePillarChange(pid)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activePillarId === pid
                  ? 'bg-[#004447] text-white shadow-sm scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Pillar 0{pid}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 2. Header Hero Card (Bento Style) ────────────────────────── */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Decorative subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/30 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center">
              {pillarData.icon}
            </div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#009924]">
              Pillar {pillarData.number} • {pillarData.tagline}
            </h2>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#004447] mb-2 tracking-tight">
            {pillarData.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pillarData.description}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 relative z-10 min-w-[200px] w-full md:w-auto">
          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-[#004447] leading-none">
                {pillarData.score}
              </span>
              <span className="text-sm sm:text-base text-slate-400 font-medium">/100</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: pillarData.maturityColor }}
              />
              <span className="text-xs font-bold text-slate-700">
                Maturity: {pillarData.maturity}
              </span>
            </div>
          </div>

          <button
            onClick={handleRetakeAssessment}
            disabled={isRetaking}
            className="w-full md:w-auto px-5 py-2.5 border-2 border-[#009924] text-[#009924] hover:bg-[#009924] hover:text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 bg-white shadow-xs cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRetaking ? 'animate-spin' : ''}`} />
            <span>Retake Assessment</span>
          </button>
        </div>
      </section>

      {/* ─── 3. Main Layout Grid (12 Columns) ─────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 Columns: Capabilities Breakdown & Action Plan) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Capabilities Breakdown Card */}
          <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-serif text-lg font-bold text-[#004447] flex items-center gap-2">
                <Gauge className="w-5 h-5 text-[#009924]" />
                <span>Capabilities Breakdown</span>
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                5 Assessment Areas
              </span>
            </div>

            <div className="flex flex-col gap-5">
              {pillarData.capabilities.map((cap) => {
                const isHigh = cap.score >= 70;
                const isLow = cap.score <= 35;
                const barColor = isLow
                  ? 'bg-[#ba1a1a]'
                  : isHigh
                  ? 'bg-[#009924]'
                  : 'bg-[#009924]/70';
                const textColor = isLow
                  ? 'text-[#ba1a1a]'
                  : isHigh
                  ? 'text-[#009924]'
                  : 'text-[#004447]';

                return (
                  <div key={cap.id} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                          {cap.name}
                        </h4>
                        {isHigh && (
                          <CheckCircle2 className="w-4 h-4 text-[#009924]" />
                        )}
                      </div>
                      <span className={`font-serif text-base font-bold ${textColor} leading-none`}>
                        {cap.score}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cap.score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full ${barColor} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Priority Action Plan Card */}
          <section className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs flex flex-col">
            <div className="bg-slate-50 p-6 border-b border-slate-200/80">
              <h3 className="font-serif text-lg font-bold text-[#004447] flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-[#009924]" />
                <span>Priority Action Plan</span>
              </h3>
              <p className="text-xs text-slate-500">
                Targeting your lowest-scoring capabilities in Pillar {pillarData.number}.
              </p>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {pillarData.actionPlan
                .filter((act) => !dismissedActions[act.id])
                .map((act) => {
                  const isStarted = startedActions[act.id];

                  return (
                    <div
                      key={act.id}
                      className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-slate-200/90 hover:shadow-md transition-all bg-white group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-[#009924] mt-0.5 group-hover:scale-105 transition-transform">
                        {act.icon === 'lightbulb' ? (
                          <Lightbulb className="w-5 h-5" />
                        ) : (
                          <Gauge className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-[#004447]">
                            {act.title}
                          </h4>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {act.capabilityTarget}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {act.description}
                        </p>

                        <div className="flex items-center gap-3 pt-3">
                          <button
                            onClick={() => handleStartAction(act.id, act.title)}
                            disabled={isStarted}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isStarted
                                ? 'bg-emerald-100 text-[#007519] border border-emerald-200'
                                : 'bg-[#009924] text-white hover:bg-[#007a1c] shadow-xs'
                            }`}
                          >
                            {isStarted ? 'Action Active ✓' : 'Start Action'}
                          </button>
                          <button
                            onClick={() => handleDismissAction(act.id)}
                            className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {pillarData.actionPlan.every((act) => dismissedActions[act.id]) && (
                <div className="text-center py-6 text-slate-500 text-xs">
                  All priority actions for this pillar have been addressed or dismissed.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column (4 Columns: Relevant Learning & Vetted Providers) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Relevant Learning Card */}
          <section className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#004447] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#004447]" />
              <span>Relevant Learning</span>
            </h3>

            <div className="flex flex-col gap-3">
              {pillarData.courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => setScreen('screen-learning')}
                  className="group flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200/80 hover:bg-slate-50 hover:border-[#009924] transition-all cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 border border-slate-200 bg-slate-100">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-[#004447]/30 group-hover:bg-[#004447]/10 transition-colors flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-white drop-shadow-md" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#004447] transition-colors line-clamp-2 leading-snug">
                      {course.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span className="font-semibold text-[#009924]">{course.type}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setScreen('screen-learning')}
              className="mt-2 w-full text-center py-2.5 text-xs font-bold text-[#009924] hover:bg-emerald-50 rounded-xl transition-colors border border-emerald-200/60 cursor-pointer"
            >
              View All Courses in Learning Hub
            </button>
          </section>

          {/* Vetted Providers Card */}
          <section className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#004447] flex items-center gap-2">
              <Handshake className="w-5 h-5 text-[#004447]" />
              <span>Vetted Providers</span>
            </h3>

            <div className="flex flex-col gap-3">
              {pillarData.providers.map((prov) => (
                <div
                  key={prov.id}
                  onClick={() => setScreen('screen-services')}
                  className="flex items-center justify-between gap-3 p-3.5 border border-slate-200/80 rounded-2xl bg-white hover:border-[#009924] hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        prov.colorScheme === 'secondary'
                          ? 'bg-emerald-100 text-[#007519] border border-emerald-200'
                          : 'bg-[#004447]/10 text-[#004447] border border-[#004447]/20'
                      }`}
                    >
                      {prov.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#004447] transition-colors">
                        {prov.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{prov.category}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#009924] group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>

            <button
              onClick={() => setScreen('screen-services')}
              className="mt-2 w-full text-center py-2.5 text-xs font-bold text-[#004447] hover:bg-slate-50 rounded-xl transition-colors border border-slate-200 cursor-pointer"
            >
              Browse Services Directory
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
