import React, { useState, useEffect } from 'react';
import { portalApi } from '../services/api';
import { useAppStore } from '../store/useStore';
import { Course, PILLAR_BRAND_COLORS } from '../types';
import { GraduationCap, Clock, PlayCircle, CheckCircle, Loader2 } from 'lucide-react';

export const LearningPage: React.FC = () => {
  const { awardXp, showNotification } = useAppStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await portalApi.getLearning();
      setCourses(data);
    } catch {
      // Mock Fallback
      setCourses([
        {
          id: 1,
          title: 'Regenerative Soil Conditioning & Biochar',
          pillar_id: 4,
          pillar_name: 'Climate Resilience',
          duration_mins: 15,
          level: 'Beginner',
          description: 'Step-by-step pyrolytic composting techniques to enhance microbial water retention in dry seasons.',
          completed: true,
        },
        {
          id: 2,
          title: 'Farm Gross Margin Ledger Bookkeeping',
          pillar_id: 5,
          pillar_name: 'Farm Business Performance',
          duration_mins: 20,
          level: 'Intermediate',
          description: 'Practical financial recording to calculate unit cost per kg and achieve loan bankability.',
          completed: false,
        },
        {
          id: 3,
          title: 'Solar Drip Scheduling & Maintenance',
          pillar_id: 2,
          pillar_name: 'Renewable Energy',
          duration_mins: 12,
          level: 'Beginner',
          description: 'Cleaning PV arrays, pressure regulation, and fertigation valve management.',
          completed: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteCourse = (course: Course) => {
    awardXp(50, `Completed Course: ${course.title}`);
    setCourses((prev) =>
      prev.map((c) => (c.id === course.id ? { ...c, completed: true } : c))
    );
    showNotification(
      `Course "${course.title}" completed! +50 XP awarded.`,
      'success',
      4500,
      'Academy Milestone'
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30 text-xs font-bold uppercase tracking-wider mb-2">
          <GraduationCap className="w-4 h-4 text-[#009924]" />
          <span>Regenerative Agronomy Curriculum</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Learning Academy &amp; Practical Training
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Audio-assisted micro-modules to build technical and financial capabilities across all 8 transformation pillars.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500 text-xs font-semibold">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#045D61]" />
          <span>Loading curriculum modules...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const pBrand = PILLAR_BRAND_COLORS[course.pillar_id] || {
              hex: '#045D61',
              textClass: 'text-[#045D61]',
              bgLight: 'bg-[#045D61]/10',
              borderLight: 'border-[#045D61]/30',
            };

            return (
              <div
                key={course.id}
                className="p-6 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-xl transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${pBrand.bgLight} ${pBrand.borderLight} ${pBrand.textClass}`}
                    >
                      {course.pillar_name || `Pillar ${course.pillar_id}`}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.duration_mins} mins</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  {course.completed ? (
                    <div className="py-2.5 rounded-xl bg-[#009924]/10 text-[#009924] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#009924]/30">
                      <CheckCircle className="w-4 h-4" />
                      <span>Module Completed (+50 XP Earned)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCompleteCourse(course)}
                      className="w-full py-2.5 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#045D61]/20 transition-colors"
                    >
                      <PlayCircle className="w-4 h-4 text-[#FFD700]" />
                      <span>Start Audio Module (Earn +50 XP)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
