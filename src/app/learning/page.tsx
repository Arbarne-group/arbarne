"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";

export default function DigitalLearningPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const categories = [
    "All",
    "Irrigation & Water",
    "Soil & Crops",
    "Business & Finance",
    "Post-Harvest & Cold Chain",
    "Climate Resilience",
  ];

  const courses = [
    {
      id: "irrigation-telemetry",
      title: "Precision Drip Scheduling & Soil Telemetry",
      category: "Irrigation & Water",
      level: "Intermediate",
      duration: "45 mins • 6 lessons",
      instructor: "Eng. Samuel Kibet",
      role: "Agricultural Water Systems Lead",
      badge: "High Impact for Your Farm",
      progress: 60,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCGvmyW_iCOmYyPwkGp3vckhLEVCzHw2dhEYGTAKtjTVWVde9bOch4L-cipVHJ03vnywNHKmY5AyG66Bp1Wrnjgk-xxP-J5DRWBvJaJX8GFSNqiw-k2V6w70KbHz2uGKRPDjvI1qw2Nh9wgn1BUY_MQ7uYmOcvxnVDrcULwJU2MyO54BJpjcxB74hrtI-XavAjDY9xBmk7xAzeMjtDUdwdx2-iztSXT0iy5akM3XFZSlOlqNMna_KY",
      description:
        "Learn how to integrate solar-powered telemetry with low-pressure drip tape to cut fuel pump costs by 28% and eliminate crop stress during hot spells.",
      lessons: [
        "1. Calculating Field Evapotranspiration Rates",
        "2. Selecting Soil Moisture Sensor Depths",
        "3. Solenoid Valve Wiring & Solar Inverter Setup",
        "4. Automating Scheduled Fertigation Cycles",
      ],
    },
    {
      id: "export-standards",
      title: "Commercial Horticulture Export Standards (GlobalGAP)",
      category: "Soil & Crops",
      level: "Advanced",
      duration: "1h 15m • 8 lessons",
      instructor: "Dr. Beatrice Mwangi",
      role: "Phytosanitary & Export Specialist",
      badge: "Market Access Required",
      progress: 0,
      image:
        "https://lh3.googleusercontent.com/aida/AEtjO1We64MQUaGsXjzRP8tdnhq6TOE5QCcMOaGlV2uds2PGUjSDq0ts_RYK39wdTVQGPipX7Puw4951nBRNnB-XI3bo1m14bR7DBfgaaZDgKmUM7LbgSkRdHXqM9Jum8qVGcvdCxslhOtZd1aCcFZ2olZDV05MulVhotuh9YFrx3pNFvosBFRiYWoGg6O5PrHie_ukd-tGjd0ysF-rBjlmw_e3QynPOyQ8NP_pTcgw1rFeyc6h0Nx5NK4ocFw",
      description:
        "Step-by-step audit checklist for securing direct buyer contracts with European, Middle Eastern, and regional African supermarket chains.",
      lessons: [
        "1. MRL (Maximum Residue Limits) Management",
        "2. Traceability Coding from Field to Packing House",
        "3. Worker Hygiene & Safety Protocols",
        "4. Mock Inspection Simulation & Audit Readiness",
      ],
    },
    {
      id: "solar-cold-chain",
      title: "Decentralized Solar Cold Storage Maintenance",
      category: "Post-Harvest & Cold Chain",
      level: "Beginner",
      duration: "35 mins • 4 lessons",
      instructor: "Amina Hassan",
      role: "Cold Chain Logistics Engineer",
      badge: "Reduce Post-Harvest Loss",
      progress: 25,
      image:
        "https://lh3.googleusercontent.com/aida/AEtjO1VyfklRqqOiWnHBaFz1qydPdjD6YxAD-yXctUuelHBa1Or1qNSYa_rxGl5QoirNE2t6bkX89EW1NyiFiv7MLpB_wz29dDfHtHPCtYJxyeXbGSb36HBXjkq9y2zu3zxZ6KlIkhWXoSwICDqq5U0yM6HIIl3P-dnB82ZNTwmGq00u3Vx7YJi9nSOIj0aC0CLmTSWsiE9gJhIpd2lmsgeeqWUVf0UiDVkzm5JOmNCU49StKLYMPYUYuGkY",
      description:
        "Practical routines for operating walk-in cool rooms, pre-cooling harvested greens, and managing thermal battery storage overnight.",
      lessons: [
        "1. The First 2 Hours: Rapid Field Heat Removal",
        "2. Monitoring Humidity & Ethylene Build-up",
        "3. Battery Management & Compressor Cleaning",
        "4. Packing Room Temperature Consistency",
      ],
    },
    {
      id: "agribusiness-finance",
      title: "Farm Cash-Flow Modeling & Input Working Capital",
      category: "Business & Finance",
      level: "Intermediate",
      duration: "50 mins • 5 lessons",
      instructor: "David Ochieng, CPA",
      role: "Agri-Lending Portfolio Manager",
      badge: "Investor Ready",
      progress: 0,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAHcZ--zOAZIaqKU3S45BkNvc8Xy_P3a--CB0gwn466ssefMYTRS5Bdm0fVc52lrWrTGMMTVxTjPco0pQqJUZ7tbFrjmliK4ofdWxWySVTx9uiR6u-xIlYhGXxeL-Df8fZemuH85s2-iNgC4M50e8yGoxo5Ax5Ss53cXgzAg278AeUa5jvU3a62Ds39W3wpWg2d2pZYjWQAqyGnCwZHSt91oYYjm8txxW3I4nycpSpR2_nr2YfelYE",
      description:
        "Bridge the gap between planting expenditure and harvest sales. Build robust crop-cycle budgets banks and grantors love.",
      lessons: [
        "1. Crop Cycle Costing: Seeds, Labor, Inputs",
        "2. Break-Even Price Thresholds per Kilogram",
        "3. Structuring Supplier Credit vs Bank Overdrafts",
        "4. Real-time Expense Tracking on Mobile",
      ],
    },
    {
      id: "farm-sops",
      title: "Codifying Shift SOPs for Farm Managers",
      category: "Business & Finance",
      level: "Beginner",
      duration: "40 mins • 5 lessons",
      instructor: "Keziah Wanjiku",
      role: "Commercial Farm Operator",
      badge: "Delegation Essential",
      progress: 100,
      image:
        "https://lh3.googleusercontent.com/aida/AEtjO1We64MQUaGsXjzRP8tdnhq6TOE5QCcMOaGlV2uds2PGUjSDq0ts_RYK39wdTVQGPipX7Puw4951nBRNnB-XI3bo1m14bR7DBfgaaZDgKmUM7LbgSkRdHXqM9Jum8qVGcvdCxslhOtZd1aCcFZ2olZDV05MulVhotuh9YFrx3pNFvosBFRiYWoGg6O5PrHie_ukd-tGjd0ysF-rBjlmw_e3QynPOyQ8NP_pTcgw1rFeyc6h0Nx5NK4ocFw",
      description:
        "Free up your time by implementing simple daily shift checklists for supervisors, pest scouting logs, and harvest grading standards.",
      lessons: [
        "1. Creating 1-Page Visual Job Cards",
        "2. Morning Muster Routines & Tool Checkouts",
        "3. Daily Yield & Loss Discrepancy Reporting",
        "4. Monthly Supervisor Performance Bonuses",
      ],
    },
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = activeCategory === "All" || c.category === activeCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-variant pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-sm fill">school</span>
              <span>Future Farms Academy</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface">
              Digital Learning &amp; Masterclasses
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mt-1">
              Practical video masterclasses and agronomic certifications designed to transform your farm operations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded-full">
              4 Courses Enrolled • 1 Completed
            </span>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="space-y-4">
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search masterclasses, topics, instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-surface-container-high">
                  <img
                    alt={course.title}
                    src={course.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[11px] font-bold bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full">
                    {course.category}
                  </span>
                  {course.badge && (
                    <span className="absolute bottom-3 left-3 text-[11px] font-bold bg-primary text-white px-2.5 py-0.5 rounded-full shadow-sm">
                      {course.badge}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>{course.duration}</span>
                    <span>•</span>
                    <span>{course.level}</span>
                  </div>

                  <h3 className="text-base font-bold text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 mb-4">
                    {course.description}
                  </p>

                  <div className="pt-3 border-t border-surface-variant/50 flex items-center justify-between text-xs text-on-surface-variant">
                    <div>
                      <span className="font-semibold text-on-surface block">
                        {course.instructor}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        {course.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Action */}
              <div className="px-6 pb-6 pt-2">
                {course.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-[11px] font-bold text-on-surface mb-1">
                      <span>{course.progress === 100 ? "Completed" : "Progress"}</span>
                      <span className="text-primary">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedCourse(course)}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-primary hover:text-white text-on-surface font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {course.progress === 100 ? "replay" : "play_circle"}
                  </span>
                  <span>
                    {course.progress === 100
                      ? "Review Course"
                      : course.progress > 0
                      ? "Resume Lesson"
                      : "Start Learning"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Lesson Preview */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-surface-variant animate-fade-in-up">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-primary uppercase">
                    {selectedCourse.category}
                  </span>
                  <h3 className="text-xl font-bold text-on-surface mt-1">
                    {selectedCourse.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                {selectedCourse.description}
              </p>

              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-3">
                  Lesson Modules Included:
                </h4>
                <div className="space-y-2">
                  {selectedCourse.lessons.map((lesson: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-surface text-xs font-medium text-on-surface border border-surface-variant/60"
                    >
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        play_arrow
                      </span>
                      <span>{lesson}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert(`Starting masterclass: ${selectedCourse.title}`);
                    setSelectedCourse(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all btn-shadow flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">play_circle</span>
                  <span>Play Video</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
