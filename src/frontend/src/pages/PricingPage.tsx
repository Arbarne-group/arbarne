import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { assessmentApi } from '../services/api';
import {
  Shield,
  Info,
  CheckCircle2,
  Check,
  FileText,
  Lightbulb,
  MessageSquare,
  BarChart3,
  Target,
  AlertCircle,
  ShieldCheck,
  Lock,
  ArrowRight,
  Cpu,
  Sun,
  Award,
  Trees,
  TrendingUp,
  Users,
  Store,
  Briefcase,
  X,
  CreditCard,
  Smartphone,
  Sparkles,
  Loader2,
} from 'lucide-react';

const PILLARS_LIST = [
  {
    id: 1,
    number: '1',
    name: 'Smart Farming & Digital Transformation',
    icon: <Cpu className="w-8 h-8 text-[#009924]" />,
    price: '$1',
  },
  {
    id: 2,
    number: '2',
    name: 'Productive Use of Renewable Energy',
    icon: <Sun className="w-8 h-8 text-[#FDD835]" />,
    price: '$1',
  },
  {
    id: 3,
    number: '3',
    name: 'Food Safety, Quality & Compliance',
    icon: <ShieldCheck className="w-8 h-8 text-[#43A047]" />,
    price: '$1',
  },
  {
    id: 4,
    number: '4',
    name: 'Indigenous Knowledge & Climate Resilience',
    icon: <Trees className="w-8 h-8 text-[#2E7D32]" />,
    price: '$1',
  },
  {
    id: 5,
    number: '5',
    name: 'Business, Financial & Strategic Agribusiness',
    icon: <TrendingUp className="w-8 h-8 text-[#8E24AA]" />,
    price: '$1',
  },
  {
    id: 6,
    number: '6',
    name: 'Human Capital & Operations',
    icon: <Users className="w-8 h-8 text-[#3949AB]" />,
    price: '$1',
  },
  {
    id: 7,
    number: '7',
    name: 'Market Access, Customer Value & Competitiveness',
    icon: <Store className="w-8 h-8 text-[#FB8C00]" />,
    price: '$1',
  },
  {
    id: 8,
    number: '8',
    name: 'Investment Readiness & Enterprise Development',
    icon: <Briefcase className="w-8 h-8 text-[#683C21]" />,
    price: '$1',
  },
];

export const PricingPage: React.FC = () => {
  const { setScreen, showNotification, setCheckoutItem } = useAppStore();

  const handleGoToFullCheckout = () => {
    setCheckoutItem({
      scope: 'full',
      pillarId: null,
      title: 'Full Farm Check',
      description: 'A full check across all 8 areas of your farm with simple tips to improve.',
      priceUsd: 10,
      priceKes: 1300,
    });
    setScreen('screen-checkout');
  };

  const handleGoToPillarCheckout = (pillarId: number = 1) => {
    const p = PILLARS_LIST.find((item) => item.id === pillarId) || PILLARS_LIST[0];
    setCheckoutItem({
      scope: 'pillar',
      pillarId: p.id,
      title: `Area ${p.number}: ${p.name}`,
      description: 'A quick check of one area with instant tips and feedback.',
      priceUsd: 1,
      priceKes: 130,
    });
    setScreen('screen-checkout');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2">
      {/* ─── 1. Header Section ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#009924]" />
            <span>Future Farms</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#004447]">
            Plans
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Choose how you want to assess and grow your farm.
          </p>
        </div>

        {/* Trust Badge */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-start gap-3.5 max-w-sm shadow-xs shrink-0">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 text-[#009924]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#004447] flex items-center gap-1.5">
              <span>Secure</span>
              <span className="text-slate-300">•</span>
              <span>Private</span>
              <span className="text-slate-300">•</span>
              <span>Your data is safe</span>
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
              Your information is used only to generate your assessment results and recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 2. Info Banner ───────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xs">
        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 text-[#009924]">
          <Info className="w-5 h-5" />
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          Check your farm across 8 areas and get simple tips to improve, grow and do well.
        </p>
      </div>

      {/* ─── 3. Pricing Layout: 2 Options ─────────────────────────────── */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#004447] mb-8 text-center">
          Choose Your Assessment Option
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Option 1: Individual Pillar */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-8 flex flex-col justify-between shadow-xs hover:border-[#009924] transition-all"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 text-[#004447]">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#004447]">
                    Check One Area
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Check any <strong className="text-slate-800">single area</strong> to see how your farm is doing.
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="font-serif text-4xl font-bold text-[#004447] flex items-baseline gap-1">
                  <span>$1</span>
                  <span className="text-xs text-slate-400 font-sans font-normal">
                    (or KES 130)
                  </span>
                </div>
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mt-1">
                  Per Pillar
                </span>
              </div>

              {/* Inclusions */}
              <div>
                <p className="text-xs font-bold text-[#004447] mb-4 uppercase tracking-wider">
                  This gives you:
                </p>
                <ul className="space-y-3.5 pl-1">
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#009924] shrink-0 mt-0.5" />
                     <span>A check of <strong>1 area</strong></span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#009924] shrink-0 mt-0.5" />
                     <span>Instant tips for anything you answer 'No' to</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#009924] shrink-0 mt-0.5" />
                     <span>Feedback on each question</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#009924] shrink-0 mt-0.5" />
                     <span>Your area score</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleGoToPillarCheckout(1)}
              className="mt-8 w-full bg-white text-[#009924] hover:bg-[#009924] hover:text-white font-bold text-xs sm:text-sm py-3.5 rounded-2xl border-2 border-[#009924] transition-all shadow-xs flex justify-center items-center"
            >
               Choose – $1
            </button>
          </motion.div>

          {/* Option 2: Full Assessment (Best Value) */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-white border-2 border-[#009924] rounded-3xl p-8 flex flex-col justify-between relative shadow-xl shadow-[#004447]/10"
          >
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#009924] text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm whitespace-nowrap">
              Best Value
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6 mt-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200 text-[#009924]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#004447]">
                     Full Farm Check
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Check all 8 areas and get your full farm plan.
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="font-serif text-4xl font-bold text-[#004447] flex items-baseline gap-1">
                  <span>$10</span>
                  <span className="text-xs text-slate-400 font-sans font-normal">
                    (or KES 1,300)
                  </span>
                </div>
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mt-1">
                  One-time Payment
                </span>
              </div>

              {/* Inclusions */}
              <div>
                <p className="text-xs font-bold text-[#004447] mb-4 uppercase tracking-wider">
                  Includes everything in the single-area check, plus:
                </p>
                <ul className="space-y-3.5 pl-1">
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-[#009924] shrink-0 mt-0.5" />
                     <span>All 8 areas checked (40 questions)</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#009924] shrink-0 mt-0.5" />
                     <span>Full farm plan you can download (PDF)</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#009924] shrink-0 mt-0.5" />
                     <span>Your farm stage (e.g. Informal, Developing, Commercial)</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#009924] shrink-0 mt-0.5" />
                     <span>Top 3–5 areas to work on first</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#009924] shrink-0 mt-0.5" />
                     <span>Scores for all 8 areas</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#009924] shrink-0 mt-0.5" />
                     <span>Tips made for your farm</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleGoToFullCheckout}
              className="mt-8 w-full bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs sm:text-sm py-3.5 rounded-2xl transition-all shadow-md shadow-[#009924]/20 flex justify-center items-center gap-2 hover:scale-102 cursor-pointer"
            >
               <span>Choose Full Check – $10</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ─── 4. What You Get with Full Assessment Section ─────────────── */}
      <div className="pt-6">
        <h3 className="font-serif text-2xl font-bold text-[#004447] mb-8 text-center">
           What You Get with the Full Check
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Recommendations for No Answers */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E1] flex items-center justify-center shrink-0 border border-[#FFE082] text-[#F57F17]">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#004447] mb-1">
                Recommendations for 'No' Answers
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant, practical recommendations to help you address gaps immediately.
              </p>
            </div>
          </div>

          {/* Card 2: Capability Status Feedback */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#E0F2F1] flex items-center justify-center shrink-0 border border-[#80CBC4] text-[#00695C]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#004447] mb-1">
                Capability Status Feedback
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Detailed feedback after every capability to show where you stand.
              </p>
            </div>
          </div>

          {/* Card 3: Pillar Scores */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#E3F2FD] flex items-center justify-center shrink-0 border border-[#90CAF9] text-[#1565C0]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#004447] mb-1">
                Pillar Scores
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear scores for all 8 pillars to help you see your strengths and gaps.
              </p>
            </div>
          </div>

          {/* Card 4: Personalised Recommendations */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#F3E5F5] flex items-center justify-center shrink-0 border border-[#CE93D8] text-[#6A1B9A]">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#004447] mb-1">
                Personalised Recommendations
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Actionable recommendations tailored to your farm's specific results.
              </p>
            </div>
          </div>

          {/* Card 5: Priority Development Areas */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#045d61]/10 flex items-center justify-center shrink-0 border border-[#045d61]/30 text-[#045d61]">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#004447] mb-1">
                Priority Development Areas
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Focus on the top 3-5 capabilities that will drive the most impact.
              </p>
            </div>
          </div>

          {/* Card 6: Farm Classification */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-300 text-slate-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#004447] mb-1">
                 Your Farm Stage
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover your farm's classification and transformation stage.
              </p>
            </div>
          </div>

          {/* Card 7: Full Transformation Plan (PDF) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col gap-4 shadow-xs lg:col-span-2">
            <div className="w-12 h-12 rounded-xl bg-[#7ffd7b]/20 flex items-center justify-center shrink-0 border border-[#009924]/30 text-[#007519]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#004447] mb-1">
                Full Transformation Plan (PDF)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                A comprehensive, downloadable PDF guide for your farm's future roadmap.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 5. Assess Any Pillar – $1 Each Grid ──────────────────────── */}
      <div className="pt-6 border-t border-slate-200">
        <div className="mb-6 text-center sm:text-left">
          <h3 className="font-serif text-2xl font-bold text-[#004447] mb-1">
            Check Any Area – $1 Each
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Choose the pillar you want to assess. You can assess others later.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {PILLARS_LIST.map((pillar) => (
            <motion.div
              key={pillar.id}
              whileHover={{ y: -2 }}
              onClick={() => handleGoToPillarCheckout(pillar.id)}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col items-center text-center hover:border-[#009924] hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="mb-2 p-2 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform">
                {pillar.icon}
              </div>
              <span className="text-xs font-extrabold text-[#004447] mb-1">
                 Area {pillar.number}
              </span>
              <span className="text-xs text-slate-600 h-10 flex items-center justify-center leading-snug">
                {pillar.name}
              </span>
              <span className="text-xs font-bold text-[#009924] mt-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                {pillar.price}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── 6. Secure Footer ─────────────────────────────────────────── */}
      <div className="text-center pt-8 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-500 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-[#009924]" />
          <span>Payments are secure and encrypted via SSL.</span>
        </p>
      </div>
    </div>
  );
};
