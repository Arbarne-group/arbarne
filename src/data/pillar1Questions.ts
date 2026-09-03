export interface AssessmentQuestion {
  id: string;
  capabilityId: string;
  capabilityName: string;
  capabilityFocus: string;
  question: string;
  evidenceRequired: string;
  recommendation: string;
  whyItMatters: string;
  quickWin: string;
  supportAvailable: string;
  priority: "🟢 Quick Win" | "🟡 Medium Term" | "🔵 Strategic";
}

export interface Capability {
  id: string;
  name: string;
  focus: string;
  questions: AssessmentQuestion[];
}

export const PILLAR_1_CAPABILITIES: Capability[] = [
  {
    id: "1.1",
    name: "Technology Readiness",
    focus:
      "Does the farm understand its operational needs and have the basic infrastructure, resources, willingness and capacity required to identify and adopt appropriate technologies?",
    questions: [
      {
        id: "P1.1.1",
        capabilityId: "1.1",
        capabilityName: "Technology Readiness",
        capabilityFocus:
          "Does the farm understand its operational needs and have the basic infrastructure, resources, willingness and capacity required to identify and adopt appropriate technologies?",
        question:
          "Have you identified production challenges that could be solved through technology?",
        evidenceRequired:
          "Farmer interview; documented farm challenges; farm development plan; observation of production constraints.",
        recommendation:
          "Identify the key production challenges affecting your farm and consider where technology could improve efficiency, productivity, or quality.",
        whyItMatters:
          "Technology should solve real farm problems rather than being adopted for its own sake.",
        quickWin:
          "List your top three production challenges and discuss possible technology solutions with an extension officer or advisor.",
        supportAvailable:
          "FAAB Module 1 • Future Farms Advisory • Extension Services",
        priority: "🟢 Quick Win",
      },
      {
        id: "P1.1.2",
        capabilityId: "1.1",
        capabilityName: "Technology Readiness",
        capabilityFocus:
          "Does the farm understand its operational needs and have the basic infrastructure, resources, willingness and capacity required to identify and adopt appropriate technologies?",
        question:
          "Have you explored technologies suitable for your type and scale of farming?",
        evidenceRequired:
          "Records of technology demonstrations attended; brochures; online searches; training attendance; farmer interview.",
        recommendation:
          "Learn about technologies that are appropriate for your enterprise, production system, and investment capacity.",
        whyItMatters:
          "Understanding available options helps farmers make informed investment decisions and avoid unsuitable technologies.",
        quickWin:
          "Visit one demonstration farm, agricultural exhibition, or technology provider within the next six months.",
        supportAvailable:
          "Future Farms Innovation Hub • Technology Partners • FAAB Programme",
        priority: "🟢 Quick Win",
      },
      {
        id: "P1.1.3",
        capabilityId: "1.1",
        capabilityName: "Technology Readiness",
        capabilityFocus:
          "Does the farm understand its operational needs and have the basic infrastructure, resources, willingness and capacity required to identify and adopt appropriate technologies?",
        question:
          "Have you assessed whether adopting a new technology would be practical and beneficial for your farm?",
        evidenceRequired:
          "Cost-benefit analysis; business plan; investment notes; farmer interview.",
        recommendation:
          "Evaluate the expected costs, benefits, risks, and operational requirements before investing in new technologies.",
        whyItMatters:
          "Careful assessment improves investment decisions and reduces the likelihood of technology failure.",
        quickWin:
          "Compare at least two technology options using expected costs and benefits.",
        supportAvailable:
          "Clean Farms Advisory • Farm Business Advisors • Technology Providers",
        priority: "🟡 Medium Term",
      },
      {
        id: "P1.1.4",
        capabilityId: "1.1",
        capabilityName: "Technology Readiness",
        capabilityFocus:
          "Does the farm understand its operational needs and have the basic infrastructure, resources, willingness and capacity required to identify and adopt appropriate technologies?",
        question:
          "Is technology included in your farm development or business plan?",
        evidenceRequired:
          "Farm development plan; strategic plan; business plan; investment roadmap.",
        recommendation:
          "Include technology adoption as part of your long-term farm development strategy with clear objectives and timelines.",
        whyItMatters:
          "Planned technology investments support sustainable farm growth and improve access to finance.",
        quickWin:
          "Add one technology improvement objective to your farm plan for the coming year.",
        supportAvailable: "FAAB Module 5 • Future Farms Advisory",
        priority: "🟡 Medium Term",
      },
      {
        id: "P1.1.5",
        capabilityId: "1.1",
        capabilityName: "Technology Readiness",
        capabilityFocus:
          "Does the farm understand its operational needs and have the basic infrastructure, resources, willingness and capacity required to identify and adopt appropriate technologies?",
        question:
          "Have you identified potential partners, suppliers, or financing options to support future technology adoption?",
        evidenceRequired:
          "Supplier contacts; financing applications; partnership agreements; farmer interview.",
        recommendation:
          "Explore financing opportunities, trusted suppliers, and technical partners that can support future technology investments.",
        whyItMatters:
          "Access to reliable partners and finance makes technology adoption more feasible and sustainable.",
        quickWin:
          "Identify one trusted supplier and one financing opportunity relevant to your farm.",
        supportAvailable:
          "Financial Institutions • Technology Suppliers • Future Farms Network",
        priority: "🔵 Strategic",
      },
    ],
  },
  {
    id: "1.2",
    name: "Digital Capability",
    focus:
      "Does the farmer have access to and the practical skills required to confidently use digital technologies in everyday farm and business activities?",
    questions: [
      {
        id: "P1.2.1",
        capabilityId: "1.2",
        capabilityName: "Digital Capability",
        capabilityFocus:
          "Does the farmer have access to and the practical skills required to confidently use digital technologies in everyday farm and business activities?",
        question:
          "Do you use a smartphone, tablet, or computer to support your farming activities?",
        evidenceRequired:
          "Observation of device; demonstration of use for farm activities; farmer interview.",
        recommendation:
          "Begin using a smartphone or other digital device to access farming information and manage farm activities.",
        whyItMatters:
          "Digital devices provide access to information, markets, advisory services, and farm management tools.",
        quickWin:
          "Start using your phone to record farm notes or access one agricultural information platform.",
        supportAvailable:
          "FAAB Digital Skills Module • Future Farms Advisory • Digital Extension Services",
        priority: "🟢 Quick Win",
      },
      {
        id: "P1.2.2",
        capabilityId: "1.2",
        capabilityName: "Digital Capability",
        capabilityFocus:
          "Does the farmer have access to and the practical skills required to confidently use digital technologies in everyday farm and business activities?",
        question:
          "Can you independently use digital applications or platforms relevant to your farming enterprise?",
        evidenceRequired:
          "Demonstration of app use (e.g., weather, record keeping, market information, extension services); farmer interview.",
        recommendation:
          "Build your confidence in using digital applications that support your farming activities.",
        whyItMatters:
          "Digital skills improve access to timely information and increase management efficiency.",
        quickWin:
          "Download and begin using one agriculture-related mobile application suited to your enterprise.",
        supportAvailable:
          "FAAB Digital Skills Training • ICT Partners • Extension Officers",
        priority: "🟢 Quick Win",
      },
      {
        id: "P1.2.3",
        capabilityId: "1.2",
        capabilityName: "Digital Capability",
        capabilityFocus:
          "Does the farmer have access to and the practical skills required to confidently use digital technologies in everyday farm and business activities?",
        question:
          "Do you regularly access agricultural information through digital channels such as websites, mobile apps, social media, or SMS services?",
        evidenceRequired:
          "Demonstration of information sources; subscription records; browser history where appropriate; farmer interview.",
        recommendation:
          "Use trusted digital platforms to access agricultural information on production, weather, pests, diseases, and markets.",
        whyItMatters:
          "Timely access to reliable information improves farm decision-making and reduces production risks.",
        quickWin:
          "Subscribe to one trusted digital agricultural information service.",
        supportAvailable:
          "Future Farms Knowledge Hub • Government Extension Platforms • FAAB Programme",
        priority: "🟢 Quick Win",
      },
      {
        id: "P1.2.4",
        capabilityId: "1.2",
        capabilityName: "Digital Capability",
        capabilityFocus:
          "Does the farmer have access to and the practical skills required to confidently use digital technologies in everyday farm and business activities?",
        question:
          "Have you received training that has improved your ability to use digital technologies for farming?",
        evidenceRequired:
          "Training certificates; attendance records; farmer interview; demonstration of learned skills.",
        recommendation:
          "Participate in digital agriculture training to strengthen your practical skills and confidence in using technology.",
        whyItMatters:
          "Digital skills increase the value farmers gain from technology investments and advisory services.",
        quickWin:
          "Attend one digital agriculture training session or webinar within the next six months.",
        supportAvailable:
          "FAAB Programme • Future Farms Academy • Training Partners",
        priority: "🟡 Medium Term",
      },
      {
        id: "P1.2.5",
        capabilityId: "1.2",
        capabilityName: "Digital Capability",
        capabilityFocus:
          "Does the farmer have access to and the practical skills required to confidently use digital technologies in everyday farm and business activities?",
        question:
          "Do you confidently use digital technologies without requiring regular assistance?",
        evidenceRequired:
          "Practical demonstration of digital tasks; observation; farmer interview.",
        recommendation:
          "Continue practising digital skills until you can independently use the technologies most relevant to your farming activities.",
        whyItMatters:
          "Independent digital capability enables farmers to continuously access opportunities, information, and innovations.",
        quickWin:
          "Perform one routine farm management activity digitally each week until it becomes a habit.",
        supportAvailable:
          "Future Farms Digital Champions • FAAB Mentorship • ICT Support Partners",
        priority: "🟡 Medium Term",
      },
    ],
  },
  {
    id: "1.3",
    name: "Farm Information & Data Management",
    focus:
      "Does the farm systematically collect, organise, store and maintain reliable information about its production, finances, resources and operations?",
    questions: [
      {
        id: "P1.3.1",
        capabilityId: "1.3",
        capabilityName: "Farm Information & Data Management",
        capabilityFocus:
          "Does the farm systematically collect, organise, store and maintain reliable information about its production, finances, resources and operations?",
        question:
          "Do you keep records of your farm activities (e.g., planting, feeding, spraying, harvesting)?",
        evidenceRequired:
          "Farm record books; digital records; production logs; observation; farmer interview.",
        recommendation:
          "Begin recording your routine farm activities using a notebook or digital record-keeping tool.",
        whyItMatters:
          "Farm records provide the foundation for monitoring performance and improving management decisions.",
        quickWin: "Start recording one key farm activity every day.",
        supportAvailable:
          "FAAB Record Keeping Module • Extension Officers • Future Farms Advisory",
        priority: "🟢 Quick Win",
      },
      {
        id: "P1.3.2",
        capabilityId: "1.3",
        capabilityName: "Farm Information & Data Management",
        capabilityFocus:
          "Does the farm systematically collect, organise, store and maintain reliable information about its production, finances, resources and operations?",
        question:
          "Do you maintain records of your farm's production, expenses, and income?",
        evidenceRequired:
          "Financial records; production records; sales receipts; invoices; accounting books; digital records.",
        recommendation:
          "Record production quantities, farm expenses, and income consistently to understand farm performance.",
        whyItMatters:
          "Financial and production records help determine profitability and improve business planning.",
        quickWin:
          "Create a simple record book for production, income, and expenses.",
        supportAvailable:
          "FAAB Business Skills Module • Business Advisors • Extension Services",
        priority: "🟢 Quick Win",
      },
      {
        id: "P1.3.3",
        capabilityId: "1.3",
        capabilityName: "Farm Information & Data Management",
        capabilityFocus:
          "Does the farm systematically collect, organise, store and maintain reliable information about its production, finances, resources and operations?",
        question:
          "Are your farm records organized and easily accessible when needed?",
        evidenceRequired:
          "Filing system; digital storage; record organization; observation.",
        recommendation:
          "Organize your records into categories that are easy to retrieve and update.",
        whyItMatters:
          "Organized information saves time and supports informed decision-making.",
        quickWin:
          "Create separate folders (physical or digital) for production, finance, and farm operations.",
        supportAvailable:
          "Future Farms Advisory • Digital Farm Management Tools",
        priority: "🟡 Medium Term",
      },
      {
        id: "P1.3.4",
        capabilityId: "1.3",
        capabilityName: "Farm Information & Data Management",
        capabilityFocus:
          "Does the farm systematically collect, organise, store and maintain reliable information about its production, finances, resources and operations?",
        question:
          "Do you regularly update your farm records throughout the production cycle?",
        evidenceRequired:
          "Date-stamped records; digital logs; record book review; farmer interview.",
        recommendation:
          "Update your records consistently as farm activities occur rather than waiting until the end of the season.",
        whyItMatters:
          "Up-to-date records provide accurate information for planning and performance monitoring.",
        quickWin:
          "Set aside one day each week to update your farm records.",
        supportAvailable:
          "FAAB Programme • Extension Services • Digital Record Keeping Tools",
        priority: "🟡 Medium Term",
      },
      {
        id: "P1.3.5",
        capabilityId: "1.3",
        capabilityName: "Farm Information & Data Management",
        capabilityFocus:
          "Does the farm systematically collect, organise, store and maintain reliable information about its production, finances, resources and operations?",
        question:
          "Do you securely store and back up important farm information to prevent loss?",
        evidenceRequired:
          "Digital backups; cloud storage; duplicate record books; filing system; observation.",
        recommendation:
          "Develop a simple system to safely store and back up important farm information.",
        whyItMatters:
          "Protecting farm information prevents data loss and ensures business continuity.",
        quickWin:
          "Keep copies of important records in a second location or use cloud storage where possible.",
        supportAvailable:
          "Digital Service Providers • Future Farms Advisory • ICT Partners",
        priority: "🔵 Strategic",
      },
    ],
  },
  {
    id: "1.4",
    name: "Data-Driven Decision Making",
    focus:
      "Does the farmer actually use farm records, data, digital information and analysis to make better operational, production and business decisions?",
    questions: [
      {
        id: "P1.4.1",
        capabilityId: "1.4",
        capabilityName: "Data-Driven Decision Making",
        capabilityFocus:
          "Does the farmer actually use farm records, data, digital information and analysis to make better operational, production and business decisions?",
        question:
          "Do you use your farm records to plan future farming activities?",
        evidenceRequired:
          "Farm plans linked to records; production schedules; farmer interview; planning documents.",
        recommendation:
          "Begin using your farm records to guide production planning, budgeting, and scheduling.",
        whyItMatters:
          "Planning based on evidence reduces uncertainty and improves resource allocation.",
        quickWin:
          "Review last season's records before preparing your next production plan.",
        supportAvailable:
          "FAAB Business Planning Module • Extension Services • Future Farms Advisory",
        priority: "🟢 Quick Win",
      },
      {
        id: "P1.4.2",
        capabilityId: "1.4",
        capabilityName: "Data-Driven Decision Making",
        capabilityFocus:
          "Does the farmer actually use farm records, data, digital information and analysis to make better operational, production and business decisions?",
        question:
          "Do you use weather and climate information when making farm management decisions?",
        evidenceRequired:
          "Weather applications; climate advisories; SMS alerts; farmer interview; production calendar.",
        recommendation:
          "Regularly consult reliable weather and climate information before making key farming decisions.",
        whyItMatters:
          "Climate-informed decisions reduce production risks and improve resilience.",
        quickWin:
          "Subscribe to a trusted weather or climate advisory service.",
        supportAvailable:
          "National Meteorological Services • Extension Officers • Digital Advisory Platforms",
        priority: "🟢 Quick Win",
      },
      {
        id: "P1.4.3",
        capabilityId: "1.4",
        capabilityName: "Data-Driven Decision Making",
        capabilityFocus:
          "Does the farmer actually use farm records, data, digital information and analysis to make better operational, production and business decisions?",
        question:
          "Do you use production and financial records to evaluate the performance of your farm?",
        evidenceRequired:
          "Yield records; financial reports; enterprise analysis; profitability calculations; farmer interview.",
        recommendation:
          "Analyse your production and financial records after each production cycle to identify strengths and areas for improvement.",
        whyItMatters:
          "Performance analysis supports continuous improvement and profitable decision-making.",
        quickWin:
          "Calculate the profit or loss from one enterprise after harvest or sale.",
        supportAvailable:
          "FAAB Financial Management Module • Business Advisors",
        priority: "🟡 Medium Term",
      },
      {
        id: "P1.4.4",
        capabilityId: "1.4",
        capabilityName: "Data-Driven Decision Making",
        capabilityFocus:
          "Does the farmer actually use farm records, data, digital information and analysis to make better operational, production and business decisions?",
        question:
          "Do you use market information (prices, demand, buyer requirements) when deciding what, when, or how much to produce?",
        evidenceRequired:
          "Market reports; contracts; buyer communication; production planning records; farmer interview.",
        recommendation:
          "Monitor market trends and buyer requirements before making production decisions.",
        whyItMatters:
          "Market-oriented decisions improve profitability and reduce marketing risks.",
        quickWin:
          "Compare prices from at least three buyers before your next production cycle.",
        supportAvailable:
          "Market Information Systems • Future Farms Marketplace • Extension Services",
        priority: "🟡 Medium Term",
      },
      {
        id: "P1.4.5",
        capabilityId: "1.4",
        capabilityName: "Data-Driven Decision Making",
        capabilityFocus:
          "Does the farmer actually use farm records, data, digital information and analysis to make better operational, production and business decisions?",
        question:
          "Do you regularly review farm performance and adjust your management practices based on the results?",
        evidenceRequired:
          "Annual farm reviews; performance reports; improvement plans; management meeting notes; farmer interview.",
        recommendation:
          "Establish a routine process for reviewing farm performance and implementing improvements based on lessons learned.",
        whyItMatters:
          "Continuous evaluation enables farms to adapt, innovate, and improve over time.",
        quickWin:
          "Schedule a quarterly farm performance review with your household or farm team.",
        supportAvailable:
          "Future Farms Advisory • FAAB Mentorship • Farm Business Coaches",
        priority: "🔵 Strategic",
      },
    ],
  },
  {
    id: "1.5",
    name: "Continuous Improvement & Innovation",
    focus:
      "Does the farm continuously evaluate its performance, experiment with better approaches, adopt appropriate innovations and improve how technology and information are used over time?",
    questions: [
      {
        id: "P1.5.1",
        capabilityId: "1.5",
        capabilityName: "Continuous Improvement & Innovation",
        capabilityFocus:
          "Does the farm continuously evaluate its performance, experiment with better approaches, adopt appropriate innovations and improve how technology and information are used over time?",
        question:
          "Do you regularly identify opportunities to improve your farming practices?",
        evidenceRequired:
          "Farm improvement plans; farmer interview; meeting notes; observation of implemented improvements.",
        recommendation:
          "Make it a routine to identify areas where your farm can improve efficiency, productivity, quality, or sustainability.",
        whyItMatters:
          "Continuous improvement enables farms to remain competitive and resilient in a changing agricultural environment.",
        quickWin:
          "Identify three aspects of your farm that could be improved during the next production cycle.",
        supportAvailable:
          "FAAB Programme • Extension Services • Future Farms Advisory",
        priority: "🟢 Quick Win",
      },
      {
        id: "P1.5.2",
        capabilityId: "1.5",
        capabilityName: "Continuous Improvement & Innovation",
        capabilityFocus:
          "Does the farm continuously evaluate its performance, experiment with better approaches, adopt appropriate innovations and improve how technology and information are used over time?",
        question:
          "Have you introduced a new technology, practice, or innovation on your farm within the last two years?",
        evidenceRequired:
          "Observation of innovations; purchase records; training certificates; farmer interview.",
        recommendation:
          "Begin testing practical innovations that address your farm's specific challenges and opportunities.",
        whyItMatters:
          "Innovation enables farmers to improve productivity, reduce costs, and respond to changing conditions.",
        quickWin:
          "Trial one improved farming practice or technology on a small section of your farm.",
        supportAvailable:
          "Future Farms Innovation Hub • Research Institutions • Technology Partners",
        priority: "🟡 Medium Term",
      },
      {
        id: "P1.5.3",
        capabilityId: "1.5",
        capabilityName: "Continuous Improvement & Innovation",
        capabilityFocus:
          "Does the farm continuously evaluate its performance, experiment with better approaches, adopt appropriate innovations and improve how technology and information are used over time?",
        question:
          "Do you evaluate the results of new technologies or practices before adopting them on a larger scale?",
        evidenceRequired:
          "Trial records; comparison plots; performance reports; farmer interview.",
        recommendation:
          "Test new ideas on a small scale and evaluate the results before expanding implementation.",
        whyItMatters:
          "Small-scale testing reduces investment risk and supports evidence-based innovation.",
        quickWin:
          "Establish a simple demonstration area to compare current and improved practices.",
        supportAvailable:
          "Extension Services • Demonstration Farms • Future Farms Advisory",
        priority: "🟡 Medium Term",
      },
      {
        id: "P1.5.4",
        capabilityId: "1.5",
        capabilityName: "Continuous Improvement & Innovation",
        capabilityFocus:
          "Does the farm continuously evaluate its performance, experiment with better approaches, adopt appropriate innovations and improve how technology and information are used over time?",
        question:
          "Do you regularly participate in learning opportunities such as training, demonstrations, farmer groups, webinars, or field days?",
        evidenceRequired:
          "Training certificates; attendance registers; membership records; farmer interview.",
        recommendation:
          "Participate regularly in learning activities to stay informed about new technologies, markets, and farming practices.",
        whyItMatters:
          "Continuous learning improves knowledge, strengthens capability, and supports innovation.",
        quickWin:
          "Attend one agricultural training event, webinar, or demonstration within the next six months.",
        supportAvailable:
          "FAAB Programme • Farmer Organizations • Extension Officers • Future Farms Academy",
        priority: "🟢 Quick Win",
      },
      {
        id: "P1.5.5",
        capabilityId: "1.5",
        capabilityName: "Continuous Improvement & Innovation",
        capabilityFocus:
          "Does the farm continuously evaluate its performance, experiment with better approaches, adopt appropriate innovations and improve how technology and information are used over time?",
        question:
          "Do you have a clear plan for continuously improving your farm over the next three years?",
        evidenceRequired:
          "Farm development plan; business plan; strategic roadmap; investment plan; farmer interview.",
        recommendation:
          "Develop a practical improvement plan with clear goals, priorities, and timelines for your farm.",
        whyItMatters:
          "Long-term planning helps farmers systematically transition toward future-ready farming systems.",
        quickWin:
          "Prepare a three-year farm improvement roadmap with annual milestones.",
        supportAvailable:
          "Future Farms Advisory • FAAB Business Planning Module • Farm Business Advisors",
        priority: "🔵 Strategic",
      },
    ],
  },
];
