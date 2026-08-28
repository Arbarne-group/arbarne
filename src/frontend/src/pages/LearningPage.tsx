import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portalApi } from '../services/api';
import { useAppStore } from '../store/useStore';
import { Course, PILLAR_BRAND_COLORS } from '../types';
import {
  GraduationCap,
  Clock,
  PlayCircle,
  CheckCircle,
  Loader2,
  Headphones,
  Sparkles,
  BookOpen,
  Check,
  Search,
  ArrowRight,
  Brain,
  Layers,
  Lightbulb,
  Rocket,
  Volume2,
  X,
  Award,
  Filter,
  CheckCircle2,
  Flame,
  Sun,
  Droplets,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Users,
  Leaf,
} from 'lucide-react';

const DEFAULT_COURSES: Course[] = [
  {
    id: 1,
    title: 'Solar Drip Scheduling & PV Array Maintenance',
    pillar_id: 2,
    pillar_name: 'Productive Renewable Energy',
    duration_mins: 12,
    level: 'Beginner',
    description: 'Step-by-step cleaning of solar photovoltaic panels, pressure valve regulation, and automated fertigation scheduling to maximize crop yield per kilowatt.',
    completed: true,
    is_recommended: true,
  },
  {
    id: 2,
    title: 'Regenerative Soil Conditioning & Biochar Pyrolysis',
    pillar_id: 5,
    pillar_name: 'Environmental Sustainability',
    duration_mins: 15,
    level: 'Beginner',
    description: 'Practical on-farm pyrolytic biomass kiln construction, inoculation with worm tea, and soil biological carbon enhancement for dryland water retention.',
    completed: true,
    is_recommended: true,
  },
  {
    id: 3,
    title: 'Farm Gross Margin Ledger & Unit Cost Bookkeeping',
    pillar_id: 8,
    pillar_name: 'Investment Readiness',
    duration_mins: 20,
    level: 'Intermediate',
    description: 'Practical financial recording to calculate unit production costs per kilogram, operational margins, and achieve bankable enterprise credibility.',
    completed: false,
    is_recommended: true,
  },
  {
    id: 4,
    title: 'Pre-Harvest Chemical Intervals & GlobalGAP Traceability',
    pillar_id: 3,
    pillar_name: 'Food Safety & Quality',
    duration_mins: 18,
    level: 'Intermediate',
    description: 'Understanding maximum residue limits (MRLs), spray withholding periods, harvest sanitation, and digital lot-tracking to access export markets.',
    completed: false,
    is_recommended: false,
  },
  {
    id: 5,
    title: 'Indigenous Weather Indicators & Contour Swale Catchments',
    pillar_id: 4,
    pillar_name: 'Indigenous Knowledge',
    duration_mins: 14,
    level: 'Beginner',
    description: 'Harmonizing elder bio-indicator observations with modern weather forecasts, building zai pits, and constructing contour swales for zero runoff.',
    completed: false,
    is_recommended: false,
  },
  {
    id: 6,
    title: 'Smartphone Sensor Moisture Probes & Precision Irrigation',
    pillar_id: 1,
    pillar_name: 'Smart Farming',
    duration_mins: 16,
    level: 'Advanced',
    description: 'Deploying low-cost IoT soil moisture probes, interpreting smartphone telemetry, and reducing irrigation water waste by 35%.',
    completed: false,
    is_recommended: false,
  },
  {
    id: 7,
    title: 'Agricultural Worker Safety & Illustrated Field SOPs',
    pillar_id: 6,
    pillar_name: 'Human Capital',
    duration_mins: 15,
    level: 'Beginner',
    description: 'Designing visual pictorial workflows for field crews, chemical PPE handling, heat stress hydration protocols, and team performance incentives.',
    completed: false,
    is_recommended: false,
  },
  {
    id: 8,
    title: 'Supermarket Grade Specifications & Offtake Negotiation',
    pillar_id: 7,
    pillar_name: 'Market Access',
    duration_mins: 22,
    level: 'Intermediate',
    description: 'Sorting and grading produce to premium buyer standards, packaging for minimum transit loss, and locking in annual forward purchase contracts.',
    completed: false,
    is_recommended: true,
  },
  {
    id: 9,
    title: 'Biogas Digestate Bio-Fertilizer Optimization',
    pillar_id: 2,
    pillar_name: 'Productive Renewable Energy',
    duration_mins: 14,
    level: 'Intermediate',
    description: 'Utilizing nitrogen-rich anaerobic digestate effluent as a foliar liquid bio-fertilizer for greenhouse tomato and horticulture production.',
    completed: false,
    is_recommended: false,
  },
];

export const LearningPage: React.FC = () => {
  const { awardXp, showNotification, setScreen } = useAppStore();
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [loading, setLoading] = useState(false);
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<number | 'all'>('all');
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(35);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await portalApi.getLearning();
      if (data && data.length > 0) {
        // Merge with default courses to ensure rich coverage
        const existingIds = new Set(data.map((d) => d.id));
        const merged = [...data, ...DEFAULT_COURSES.filter((d) => !existingIds.has(d.id))];
        setCourses(merged);
      } else {
        setCourses(DEFAULT_COURSES);
      }
    } catch {
      setCourses(DEFAULT_COURSES);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteCourse = async (course: Course) => {
    try {
      if (typeof course.id === 'number' || (typeof course.id === 'string' && !isNaN(Number(course.id)))) {
        await portalApi.completeCourse(Number(course.id));
      }
    } catch {
      // Graceful offline fallback
    }

    awardXp(50, `Completed Course: ${course.title}`);
    setCourses((prev) =>
      prev.map((c) => (c.id === course.id ? { ...c, completed: true } : c))
    );
    showNotification(
      `Module "${course.title}" completed! +50 XP awarded.`,
      'success',
      4500,
      'Academy Milestone'
    );
    setActiveCourseModal(null);
    setIsPlayingAudio(false);
  };

  const filteredCourses =
    selectedPillarFilter === 'all'
      ? courses
      : courses.filter((c) => c.pillar_id === selectedPillarFilter);

  const completedCount = courses.filter((c) => c.completed).length;
  const progressPercent = Math.round((completedCount / courses.length) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ─── 1. Featured Learning Academy Header ────────────────────────── */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#045D61] opacity-10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#045D61]/10 text-[#045D61] border border-[#045D61]/20 shadow-xs flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-[#009924]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#045D61] tracking-widest uppercase bg-[#045D61]/10 px-2.5 py-0.5 rounded-full">
                  FFF Practical Curriculum
                </span>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">• 8-Pillar Alignment</span>
              </div>
            </div>

            <div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                Learning Academy &amp; Skills Studio
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
                Practical, audio-assisted micro-modules and step-by-step Standard Operating Procedures (SOPs) designed to close farm capability gaps and maximize gross margins.
              </p>
            </div>

            {/* Metadata Chips */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1.5 bg-[#009924]/10 text-[#009924] px-3 py-1 rounded-full border border-[#009924]/25 font-bold">
                <Headphones className="w-3.5 h-3.5" />
                <span>Audio-Assisted Micro-Lessons</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Earn 50 XP per Module</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#009924]" />
                <span>{completedCount} / {courses.length} Completed</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>~12–20 mins per lesson</span>
              </div>
            </div>
          </div>

          {/* Right Callout: Academy Progress & Next Lesson CTA */}
          <div className="flex flex-col items-center lg:items-end gap-5 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-slate-200/80 pt-6 lg:pt-0 lg:pl-8">
            <div className="text-center lg:text-right">
              <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#045D61] leading-none">
                {progressPercent}%
                <span className="text-lg font-normal text-slate-400"> done</span>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                Academy Mastery Progress
              </div>
            </div>

            <button
              onClick={() => {
                const nextUncompleted = courses.find((c) => !c.completed) || courses[0];
                if (nextUncompleted) {
                  setActiveCourseModal(nextUncompleted);
                  setIsPlayingAudio(true);
                }
              }}
              className="w-full lg:w-auto bg-[#009924] hover:bg-[#007a1c] text-white rounded-xl py-3 px-6 text-xs font-bold transition-all shadow-md shadow-[#009924]/20 flex items-center justify-center gap-2 hover:scale-102"
            >
              <PlayCircle className="w-4 h-4 text-[#FFD700]" />
              <span>Resume Next Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── 2. Assessment & Learning Journey Map + Value Prop ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey Map (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                Competency Progression
              </span>
              <h3 className="font-serif text-xl font-bold text-slate-900 mt-0.5">
                5-Step Agronomic Mastery Journey
              </h3>
            </div>
            <span className="text-xs font-bold text-[#045D61] bg-[#045D61]/10 px-2.5 py-1 rounded-full">
              Step 4: Learn
            </span>
          </div>

          <div className="relative flex items-center justify-between pt-2 pb-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10 rounded-full" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[75%] h-1 bg-[#009924] -z-10 rounded-full transition-all duration-700" />

            <div className="flex flex-col items-center gap-2 bg-white px-2">
              <div className="w-8 h-8 rounded-full bg-[#009924] text-white flex items-center justify-center border-2 border-white shadow-xs">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 hidden sm:block uppercase tracking-wider">
                1. Assess
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 bg-white px-2">
              <div className="w-8 h-8 rounded-full bg-[#009924] text-white flex items-center justify-center border-2 border-white shadow-xs">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 hidden sm:block uppercase tracking-wider">
                2. Scorecard
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 bg-white px-2">
              <div className="w-8 h-8 rounded-full bg-[#009924] text-white flex items-center justify-center border-2 border-white shadow-xs">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 hidden sm:block uppercase tracking-wider">
                3. Gaps
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 bg-white px-2">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-[#009924] text-[#009924] flex items-center justify-center shadow-xs">
                <span className="w-3 h-3 bg-[#009924] rounded-full animate-ping" />
              </div>
              <span className="text-[11px] font-extrabold text-[#009924] hidden sm:block uppercase tracking-wider">
                4. Learn
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 bg-white px-2">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center">
                <Rocket className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 hidden sm:block uppercase tracking-wider">
                5. Take Action
              </span>
            </div>
          </div>
        </div>

        {/* Why Complete This Value Prop (Spans 1 col) */}
        <div className="bg-gradient-to-br from-[#023c3f] via-[#045D61] to-[#012527] text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-md border border-[#045D61]/40">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 text-[#FFD700] flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD700]">
                Why Complete This?
              </span>
            </div>

            <p className="text-xs text-white/90 leading-relaxed">
              Completing these modules unlocks tailored agronomic insights, actionable cost-reduction methods, and verified digital capability credentials recognized by offtakers and agri-finance partners.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
            <span>Certification Ready</span>
            <span className="text-[#FFD700] font-bold">50 XP per lesson</span>
          </div>
        </div>
      </div>

      {/* ─── 3. Pillar Category Filters ─────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedPillarFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedPillarFilter === 'all'
              ? 'bg-[#045D61] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
          }`}
        >
          All Modules ({courses.length})
        </button>
        <button
          onClick={() => setSelectedPillarFilter(1)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedPillarFilter === 1
              ? 'bg-[#1E88E5] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
          }`}
        >
          Smart Farming (P1)
        </button>
        <button
          onClick={() => setSelectedPillarFilter(2)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedPillarFilter === 2
              ? 'bg-[#045D61] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
          }`}
        >
          Renewable Energy (P2)
        </button>
        <button
          onClick={() => setSelectedPillarFilter(3)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedPillarFilter === 3
              ? 'bg-[#43A047] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
          }`}
        >
          Food Safety (P3)
        </button>
        <button
          onClick={() => setSelectedPillarFilter(4)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedPillarFilter === 4
              ? 'bg-[#2E7D32] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
          }`}
        >
          Indigenous Knowledge (P4)
        </button>
        <button
          onClick={() => setSelectedPillarFilter(5)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedPillarFilter === 5
              ? 'bg-[#009924] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
          }`}
        >
          Regenerative Ag (P5)
        </button>
        <button
          onClick={() => setSelectedPillarFilter(8)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedPillarFilter === 8
              ? 'bg-[#8E24AA] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
          }`}
        >
          Investment Readiness (P8)
        </button>
      </div>

      {/* ─── 4. Curriculum Modules Bento Grid ───────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500 text-xs font-semibold">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#045D61]" />
          <span>Loading curriculum modules...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const pBrand = PILLAR_BRAND_COLORS[course.pillar_id] || {
              hex: '#045D61',
              textClass: 'text-[#045D61]',
              bgLight: 'bg-[#045D61]/10',
              borderLight: 'border-[#045D61]/30',
            };

            return (
              <motion.div
                key={course.id}
                whileHover={{ y: -2 }}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${pBrand.bgLight} ${pBrand.borderLight} ${pBrand.textClass}`}
                    >
                      {course.pillar_name || `Pillar ${course.pillar_id}`}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.duration_mins} mins</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      Level: {course.level}
                    </span>
                    <span className="text-[11px] font-bold text-[#009924] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>+50 XP</span>
                    </span>
                  </div>

                  {course.completed ? (
                    <div className="py-2.5 rounded-xl bg-[#009924]/10 text-[#009924] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#009924]/30">
                      <CheckCircle className="w-4 h-4" />
                      <span>Module Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveCourseModal(course);
                        setIsPlayingAudio(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#045D61]/20 transition-all hover:scale-102"
                    >
                      <PlayCircle className="w-4 h-4 text-[#FFD700]" />
                      <span>Start Audio Module</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ─── 5. Audio Player & Lesson Drawer Modal ──────────────────────── */}
      <AnimatePresence>
        {activeCourseModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-6"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                    Interactive Audio Lesson
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                    {activeCourseModal.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeCourseModal.pillar_name} • {activeCourseModal.duration_mins} Minutes
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveCourseModal(null);
                    setIsPlayingAudio(false);
                  }}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Audio Waveform Player Simulation */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#023c3f] to-[#045D61] text-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-10 h-10 rounded-full bg-[#FFD700] text-[#023c3f] flex items-center justify-center font-bold shadow-md hover:scale-105 transition-transform"
                    >
                      {isPlayingAudio ? (
                        <Volume2 className="w-5 h-5" />
                      ) : (
                        <PlayCircle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {isPlayingAudio ? 'Playing Lesson Audio...' : 'Audio Paused'}
                      </p>
                      <p className="text-[10px] text-white/70">Narrated by Senior Agronomist</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#FFD700]">
                    04:15 / {activeCourseModal.duration_mins}:00
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#FFD700] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Key Practical Takeaways */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-slate-900">
                  Key Practical Field Takeaways:
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#009924] flex-shrink-0 mt-0.5" />
                    <span>Always monitor pressure gauges before opening automated sub-block drip valves.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#009924] flex-shrink-0 mt-0.5" />
                    <span>Maintain weekly logbooks for all fertilizer and organic amendment applications.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#009924] flex-shrink-0 mt-0.5" />
                    <span>Calculate cost-per-kg to compare solar irrigation against diesel generators.</span>
                  </li>
                </ul>
              </div>

              {/* Complete & Claim XP CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setActiveCourseModal(null);
                    setIsPlayingAudio(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Close Player
                </button>
                <button
                  onClick={() => handleCompleteCourse(activeCourseModal)}
                  className="px-6 py-2.5 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs shadow-md shadow-[#009924]/20 transition-all flex items-center gap-2 hover:scale-105"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark Complete &amp; Claim +50 XP</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
