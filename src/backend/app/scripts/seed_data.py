"""Seed data for the FFF framework - the canonical 200 questions.

This file is the **single source of truth** for all 8 pillars, 40 capabilities,
and 200 questions in the Future Farms Framework.

Question wording is verbatim from the source spreadsheets per CLAUDE.md rule #2.
Capability and pillar names are canonical per the FFF Recommendation Library."""

from __future__ import annotations

PILLARS = [{'examples': ['Digital farm records',
               'Sensors',
               'Weather monitoring',
               'Farm management platforms',
               'Automated irrigation',
               'Precision agriculture',
               'Mobile farm applications',
               'Farm dashboards',
               'AI-supported decision-making'],
  'guiding_question': 'Is the farm using appropriate technology and information to make better '
                      'decisions?',
  'id': 1,
  'name': 'Smart Farming & Digital Transformation',
  'principle': 'Use technology and data to farm smarter.',
  'seeks_to_achieve': ['Appropriate technology adoption.',
                       'Digital farm management.',
                       'Reliable farm data.',
                       'Data-driven decision-making.',
                       'Smart and precision farming.',
                       'Automation where appropriate.',
                       'Digital monitoring of farm performance.',
                       'Continuous technological improvement.']},
 {'examples': ['Solar irrigation',
               'Solar-powered cold storage',
               'Biogas systems',
               'Solar drying',
               'Solar processing',
               'Energy-efficient equipment',
               'Energy monitoring'],
  'guiding_question': 'How can energy be used to create greater productive and economic value on '
                      'the farm?',
  'id': 2,
  'name': 'Productive Use of Renewable Energy',
  'principle': 'Turn energy from an operating cost into a productive asset.',
  'seeks_to_achieve': ['Reliable energy access.',
                       'Efficient energy use.',
                       'Reduced energy costs.',
                       'Renewable energy adoption.',
                       'Productive use of solar, biogas and other appropriate technologies.',
                       'Energy-powered irrigation and processing.',
                       'Improved cold storage.',
                       'Reduced dependence on expensive or unreliable energy.']},
 {'examples': ['Farm records',
               'Input and chemical records',
               'Traceability systems',
               'Harvest records',
               'Food safety procedures',
               'GAP systems',
               'Quality-control systems',
               'Certification preparation'],
  'guiding_question': 'Can the farm consistently demonstrate that its products are safe, traceable '
                      'and compliant with its target markets?',
  'id': 3,
  'name': 'Food Safety, Quality & Compliance',
  'principle': 'Produce food that is safe, traceable, quality-assured and compliant.',
  'seeks_to_achieve': ['Food safety.',
                       'Quality assurance.',
                       'Traceability.',
                       'Responsible input use.',
                       'Regulatory compliance.',
                       'Good agricultural practices.',
                       'Worker and occupational safety.',
                       'Market and certification readiness.']},
 {'examples': ['Indigenous weather indicators',
               'Traditional soil-management practices',
               'Indigenous seed knowledge',
               'Local water-management practices',
               'Traditional pest-management approaches',
               'Climate-smart agriculture',
               'Farm climate-risk planning'],
  'guiding_question': 'Is the farm capable of anticipating, adapting to and recovering from '
                      'climate and environmental risks?',
  'id': 4,
  'name': 'Indigenous Knowledge & Climate Resilience',
  'principle': 'Build resilience by combining local knowledge, science and innovation.',
  'seeks_to_achieve': ['Climate adaptation.',
                       'Climate risk management.',
                       'Sustainable resource management.',
                       'Integration of indigenous and scientific knowledge.',
                       'Preservation of valuable agricultural knowledge.',
                       'Stronger farm resilience.',
                       'Intergenerational knowledge transfer.']},
 {'examples': ['Farm budgets',
               'Cash-flow management',
               'Cost-per-unit analysis',
               'Enterprise profitability analysis',
               'Financial records',
               'Business plans',
               'Growth strategies',
               'Value addition'],
  'guiding_question': 'Is the farm performing as a viable business and creating the foundation for '
                      'sustainable growth?',
  'id': 5,
  'name': 'Farm Business Performance & Growth',
  'principle': 'Build farms that are financially viable, sustainable and capable of growth.',
  'seeks_to_achieve': ['Profitability.',
                       'Strong financial management.',
                       'Cost control.',
                       'Productivity improvement.',
                       'Revenue growth.',
                       'Business planning.',
                       'Enterprise diversification.',
                       'Sustainable resource use.',
                       'Scalability.']},
 {'examples': ['Organisational structures',
               'Job descriptions',
               'Farm SOPs',
               'Training programmes',
               'Performance management',
               'Staff scheduling',
               'Operations manuals',
               'Safety systems'],
  'guiding_question': 'Does the farm have the people, leadership and operating systems required to '
                      'run effectively beyond the individual farmer?',
  'id': 6,
  'name': 'Human Capital, Leadership & Farm Operations',
  'principle': 'Build the people, leadership and systems required to operate a professional farm '
               'business.',
  'seeks_to_achieve': ['Skilled farm teams.',
                       'Strong leadership.',
                       'Defined roles and responsibilities.',
                       'Standard operating procedures.',
                       'Workforce development.',
                       'Worker welfare.',
                       'Performance management.',
                       'Occupational health and safety.',
                       'Succession planning.',
                       'Efficient farm operations.']},
 {'examples': ['Customer research',
               'Buyer mapping',
               'Market analysis',
               'Contract farming',
               'Regional value chains',
               'Export readiness',
               'Branding',
               'Product differentiation',
               'Digital marketplaces'],
  'guiding_question': 'Does the farm understand its customers and compete effectively in the '
                      'markets it serves?',
  'id': 7,
  'name': 'Market Access, Customer Value & Competitiveness',
  'principle': 'Build the farm around customers and markets, not production alone.',
  'seeks_to_achieve': ['Market intelligence.',
                       'Customer understanding.',
                       'Demand-driven production.',
                       'Product differentiation.',
                       'Strong buyer relationships.',
                       'Regional value-chain participation.',
                       'Cross-border trade readiness.',
                       'Competitiveness.',
                       'Customer value creation.']},
 {'examples': ['Financial statements',
               'Business plans',
               'Investment proposals',
               'Financial projections',
               'Asset registers',
               'Risk assessments',
               'Governance structures',
               'Investment-readiness profiles'],
  'guiding_question': 'Can the farm demonstrate that it is a credible, investable and well-managed '
                      'enterprise?',
  'id': 8,
  'name': 'Investment Readiness & Enterprise Development',
  'principle': 'Build farms that can attract, manage and grow capital responsibly.',
  'seeks_to_achieve': ['Financial transparency.',
                       'Investment planning.',
                       'Strong business records.',
                       'Governance.',
                       'Risk management.',
                       'Business planning.',
                       'Financial projections.',
                       'Investor readiness.',
                       'Enterprise development.',
                       'Effective capital utilisation.']}]


CAPABILITIES = [{'description': 'Does the farm understand its operational needs and have the basic '
                 'infrastructure, resources, willingness and capacity required to identify and '
                 'adopt appropriate technologies?',
  'id': 'P1.1',
  'name': 'Technology Readiness',
  'number': 1,
  'pillar_id': 1},
 {'description': 'Does the farmer have access to and the practical skills required to confidently '
                 'use digital technologies in everyday farm and business activities?',
  'id': 'P1.2',
  'name': 'Digital Capability',
  'number': 2,
  'pillar_id': 1},
 {'description': 'Does the farm systematically collect, organise, store and maintain reliable '
                 'information about its production, finances, resources and operations?',
  'id': 'P1.3',
  'name': 'Farm Information & Data Management',
  'number': 3,
  'pillar_id': 1},
 {'description': 'Does the farmer actually use farm records, data, digital information and '
                 'analysis to make better operational, production and business decisions?',
  'id': 'P1.4',
  'name': 'Data-Driven Decision Making',
  'number': 4,
  'pillar_id': 1},
 {'description': 'Does the farm continuously evaluate its performance, experiment with better '
                 'approaches, adopt appropriate innovations and improve how technology and '
                 'information are used over time?',
  'id': 'P1.5',
  'name': 'Continuous Improvement & Innovation',
  'number': 5,
  'pillar_id': 1},
 {'description': 'Does the farm understand its energy situation, needs, challenges and '
                 'opportunities well enough to make informed energy decisions?',
  'id': 'P2.1',
  'name': 'Energy Awareness & Readiness',
  'number': 1,
  'pillar_id': 2},
 {'description': 'Has the farm adopted appropriate renewable-energy technologies and integrated '
                 'them effectively into farm operations?',
  'id': 'P2.2',
  'name': 'Renewable Energy Adoption',
  'number': 2,
  'pillar_id': 2},
 {'description': 'What energy do I use, where do I use it, what does it cost me, what problems '
                 'does it create, and where are my biggest opportunities?',
  'id': 'P2.3',
  'name': 'Energy Efficiency & Management',
  'number': 3,
  'pillar_id': 2},
 {'description': 'Is energy being deliberately used to increase productivity, reduce labour, '
                 'improve quality, reduce losses and create economic value?',
  'id': 'P2.4',
  'name': 'Productive Energy Use & Adoption',
  'number': 4,
  'pillar_id': 2},
 {'description': 'Can the farm maintain reliable energy access, manage disruptions, adapt to '
                 'changing needs and continuously improve its energy systems?',
  'id': 'P2.5',
  'name': 'Energy Management, Resilience & Continuous Improvement',
  'number': 5,
  'pillar_id': 2},
 {'description': 'Does the farmer understand food-safety risks, responsibilities and the basic '
                 'principles required to produce food that is safe for consumers?',
  'id': 'P3.1',
  'name': 'Food Safety Awareness',
  'number': 1,
  'pillar_id': 3},
 {'description': 'Does the farm consistently apply appropriate practices that prevent '
                 'contamination and protect food safety throughout production, harvesting, '
                 'handling and storage?',
  'id': 'P3.2',
  'name': 'Safe Production Practices',
  'number': 2,
  'pillar_id': 3},
 {'description': 'Does the farm define, monitor and consistently deliver the product-quality '
                 'characteristics required by its customers and target markets?',
  'id': 'P3.3',
  'name': 'Product Quality Management',
  'number': 3,
  'pillar_id': 3},
 {'description': 'Can the farm demonstrate what was produced, how it was produced, which inputs '
                 'were used, where the product came from and whether relevant requirements were '
                 'followed?',
  'id': 'P3.4',
  'name': 'Compliance, Traceability & Documentation',
  'number': 4,
  'pillar_id': 3},
 {'description': 'Does the farm systematically review food-safety, quality and compliance '
                 'performance, correct weaknesses and progressively prepare to meet recognised '
                 'standards or certification requirements where commercially relevant?',
  'id': 'P3.5',
  'name': 'Continuous Improvement & Certification Readiness',
  'number': 5,
  'pillar_id': 3},
 {'description': 'Does the farmer recognise, understand and value indigenous and locally developed '
                 'knowledge and its potential contribution to productive, sustainable and '
                 'climate-resilient farming?',
  'id': 'P4.1',
  'name': 'Indigenous & Local Knowledge Awareness',
  'number': 1,
  'pillar_id': 4},
 {'description': 'Does the farm systematically identify, understand and assess the climate risks '
                 'that could affect its production, resources, infrastructure and business '
                 'performance?',
  'id': 'P4.2',
  'name': 'Climate Risk Awareness & Assessment',
  'number': 2,
  'pillar_id': 4},
 {'description': 'Does the farm apply appropriate practices that improve its ability to manage '
                 'climate risks while supporting productivity, sustainability and long-term farm '
                 'performance?',
  'id': 'P4.3',
  'name': 'Climate-Smart Farm Practices',
  'number': 3,
  'pillar_id': 4},
 {'description': 'Does the farm actively protect and restore the soil, water, biodiversity and '
                 'ecosystems on which its long-term productivity and resilience depend?',
  'id': 'P4.4',
  'name': 'Resource Conservation & Ecosystem Resilience',
  'number': 4,
  'pillar_id': 4},
 {'description': 'Does the farmer continuously learn from changing conditions, test new '
                 'approaches, combine different knowledge systems and adapt the farm to strengthen '
                 'long-term climate resilience?',
  'id': 'P4.5',
  'name': 'Adaptation, Innovation & Continuous Improvement',
  'number': 5,
  'pillar_id': 4},
 {'description': 'Does the farmer understand the basic financial position of the farm and maintain '
                 'accurate, organised and reliable records that support effective business '
                 'management?',
  'id': 'P5.1',
  'name': 'Financial Literacy & Farm Record Management',
  'number': 1,
  'pillar_id': 5},
 {'description': 'Does the farmer understand and actively manage the costs, revenues, margins and '
                 'profitability of individual farm enterprises and the overall farm business?',
  'id': 'P5.2',
  'name': 'Cost, Revenue & Profitability Management',
  'number': 2,
  'pillar_id': 5},
 {'description': 'Does the farm systematically measure how effectively its land, labour, inputs, '
                 'capital and other resources are being converted into productive and financial '
                 'results?',
  'id': 'P5.3',
  'name': 'Productivity & Performance Management',
  'number': 3,
  'pillar_id': 5},
 {'description': 'Can the farm plan its financial needs, maintain sufficient liquidity to operate, '
                 'anticipate future requirements and prepare for events that could disrupt the '
                 'business?',
  'id': 'P5.4',
  'name': 'Cash Flow, Planning & Risk Management',
  'number': 4,
  'pillar_id': 5},
 {'description': 'Does the farm have a deliberate strategy, systems and capacity to improve and '
                 'grow while maintaining or strengthening profitability, efficiency, quality, '
                 'resilience and sustainability?',
  'id': 'P5.5',
  'name': 'Growth Strategy, Scalability & Continuous Improvement',
  'number': 5,
  'pillar_id': 5},
 {'description': 'Does the farmer understand that people, skills, knowledge and leadership are '
                 'critical farm resources and recognise the human-capital requirements of the '
                 'farm?',
  'id': 'P6.1',
  'name': 'Human Capital Awareness',
  'number': 1,
  'pillar_id': 6},
 {'description': 'Does the farm systematically determine its workforce requirements and recruit '
                 'appropriate people with the skills and capacity needed to perform farm '
                 'activities effectively?',
  'id': 'P6.2',
  'name': 'Workforce Planning & Recruitment',
  'number': 2,
  'pillar_id': 6},
 {'description': 'Does the farm continuously develop the knowledge, technical skills, management '
                 'capability and adaptability of the people responsible for farm operations?',
  'id': 'P6.3',
  'name': 'Skills Development & Capacity Building',
  'number': 3,
  'pillar_id': 6},
 {'description': 'Does the farm organise, coordinate, supervise and measure people and daily '
                 'operations so that work is completed safely, efficiently, consistently and on '
                 'time?',
  'id': 'P6.4',
  'name': 'Farm Operations & Workforce Management',
  'number': 4,
  'pillar_id': 6},
 {'description': 'Does the farm provide effective leadership and create a safe, respectful, '
                 'accountable and motivating work environment that enables people to perform, '
                 'develop and remain productive over time?',
  'id': 'P6.5',
  'name': 'Leadership, Culture & Workforce Wellbeing',
  'number': 5,
  'pillar_id': 6},
 {'description': 'Does the farmer understand the markets available for their products, who their '
                 'customers are, what those customers require, and the factors that influence '
                 'demand, prices and market opportunities?',
  'id': 'P7.1',
  'name': 'Market Awareness',
  'number': 1,
  'pillar_id': 7},
 {'description': 'Can the farm consistently reach appropriate markets, establish reliable sales '
                 'channels and build relationships that attract, serve and retain customers?',
  'id': 'P7.2',
  'name': 'Market Access & Customer Relationships',
  'number': 2,
  'pillar_id': 7},
 {'description': 'Does the farm systematically collect, analyse and use market information to '
                 'understand customers, competitors, prices and trends and make better commercial '
                 'decisions?',
  'id': 'P7.3',
  'name': 'Market Intelligence & Competitiveness',
  'number': 3,
  'pillar_id': 7},
 {'description': 'Does the farm deliberately increase the value of its products and diversify '
                 'products, customers, channels or markets to improve margins, create new '
                 'opportunities and reduce market dependence?',
  'id': 'P7.4',
  'name': 'Value Addition & Market Diversification',
  'number': 4,
  'pillar_id': 7},
 {'description': 'Does the farm have a clear and differentiated market position, strong customer '
                 'value proposition and long-term strategy for strengthening its competitiveness '
                 'and market presence?',
  'id': 'P7.5',
  'name': 'Market Leadership & Strategic Positioning',
  'number': 5,
  'pillar_id': 7},
 {'description': 'Does the farmer understand why and when a farm business may require capital, the '
                 'different financing options available, their costs and obligations, and how to '
                 'make appropriate investment decisions?',
  'id': 'P8.1',
  'name': 'Investment Awareness',
  'number': 1,
  'pillar_id': 8},
 {'description': 'Is the farm enterprise appropriately structured, governed and legally organised '
                 'so that ownership, responsibilities, decision-making and accountability are '
                 'clear?',
  'id': 'P8.2',
  'name': 'Business Governance & Legal Readiness',
  'number': 2,
  'pillar_id': 8},
 {'description': 'Can the farm produce reliable financial, operational and business documentation '
                 'that demonstrates its performance, credibility, capital requirements and ability '
                 'to responsibly manage external resources?',
  'id': 'P8.3',
  'name': 'Financial & Investment Documentation',
  'number': 3,
  'pillar_id': 8},
 {'description': 'Can the farm identify its financial and non-financial resource gaps, develop '
                 'compelling propositions and build relationships that help mobilise the resources '
                 'required to achieve its objectives?',
  'id': 'P8.4',
  'name': 'Resource Mobilisation & Strategic Partnerships',
  'number': 4,
  'pillar_id': 8},
 {'description': 'Has the farm brought together its business model, governance, financial '
                 'performance, market opportunity, management capacity and growth strategy into a '
                 'credible enterprise capable of responsibly absorbing capital and scaling?',
  'id': 'P8.5',
  'name': 'Enterprise Growth & Investment Readiness',
  'number': 5,
  'pillar_id': 8}]


QUESTIONS = [{'capability_id': 'P1.1',
  'ffv_evidence_required': 'Farmer interview; documented farm challenges; farm development plan; '
                           'observation of production constraints.',
  'id': 'P1.1.1',
  'if_no_recommendation': 'Identify the key production challenges affecting your farm and consider '
                          'where technology could improve efficiency, productivity, or quality.',
  'pillar_id': 1,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Have you identified production challenges that could be solved through '
                   'technology?',
  'quick_win': 'List your top three production challenges and discuss possible technology '
               'solutions with an extension officer or advisor.',
  'support_available': ['FAAB Module 1', 'Future Farms Advisory', 'Extension Services'],
  'why_it_matters': 'Technology should solve real farm problems rather than being adopted for its '
                    'own sake.'},
 {'capability_id': 'P1.1',
  'ffv_evidence_required': 'Records of technology demonstrations attended; brochures; online '
                           'searches; training attendance; farmer interview.',
  'id': 'P1.1.2',
  'if_no_recommendation': 'Learn about technologies that are appropriate for your enterprise, '
                          'production system, and investment capacity.',
  'pillar_id': 1,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Have you explored technologies suitable for your type and scale of farming?',
  'quick_win': 'Visit one demonstration farm, agricultural exhibition, or technology provider '
               'within the next six months.',
  'support_available': ['Future Farms Innovation Hub', 'Technology Partners', 'FAAB Programme'],
  'why_it_matters': 'Understanding available options helps farmers make informed investment '
                    'decisions and avoid unsuitable technologies.'},
 {'capability_id': 'P1.1',
  'ffv_evidence_required': 'Cost-benefit analysis; business plan; investment notes; farmer '
                           'interview.',
  'id': 'P1.1.3',
  'if_no_recommendation': 'Evaluate the expected costs, benefits, risks, and operational '
                          'requirements before investing in new technologies.',
  'pillar_id': 1,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Have you assessed whether adopting a new technology would be practical and '
                   'beneficial for your farm?',
  'quick_win': 'Compare at least two technology options using expected costs and benefits.',
  'support_available': ['Clean Farms Advisory', 'Farm Business Advisors', 'Technology Providers'],
  'why_it_matters': 'Careful assessment improves investment decisions and reduces the likelihood '
                    'of technology failure.'},
 {'capability_id': 'P1.1',
  'ffv_evidence_required': 'Farm development plan; strategic plan; business plan; investment '
                           'roadmap.',
  'id': 'P1.1.4',
  'if_no_recommendation': 'Include technology adoption as part of your long-term farm development '
                          'strategy with clear objectives and timelines.',
  'pillar_id': 1,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Is technology included in your farm development or business plan?',
  'quick_win': 'Add one technology improvement objective to your farm plan for the coming year.',
  'support_available': ['FAAB Module 5', 'Future Farms Advisory'],
  'why_it_matters': 'Planned technology investments support sustainable farm growth and improve '
                    'access to finance.'},
 {'capability_id': 'P1.1',
  'ffv_evidence_required': 'Supplier contacts; financing applications; partnership agreements; '
                           'farmer interview.',
  'id': 'P1.1.5',
  'if_no_recommendation': 'Explore financing opportunities, trusted suppliers, and technical '
                          'partners that can support future technology investments.',
  'pillar_id': 1,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Have you identified potential partners, suppliers, or financing options to '
                   'support future technology adoption?',
  'quick_win': 'Identify one trusted supplier and one financing opportunity relevant to your farm.',
  'support_available': ['Financial Institutions', 'Technology Suppliers', 'Future Farms Network'],
  'why_it_matters': 'Access to reliable partners and finance makes technology adoption more '
                    'feasible and sustainable.'},
 {'capability_id': 'P1.2',
  'ffv_evidence_required': 'Observation of device; demonstration of use for farm activities; '
                           'farmer interview.',
  'id': 'P1.2.1',
  'if_no_recommendation': 'Begin using a smartphone or other digital device to access farming '
                          'information and manage farm activities.',
  'pillar_id': 1,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you use a smartphone, tablet, or computer to support your farming '
                   'activities?',
  'quick_win': 'Start using your phone to record farm notes or access one agricultural information '
               'platform.',
  'support_available': ['FAAB Digital Skills Module',
                        'Future Farms Advisory',
                        'Digital Extension Services'],
  'why_it_matters': 'Digital devices provide access to information, markets, advisory services, '
                    'and farm management tools.'},
 {'capability_id': 'P1.2',
  'ffv_evidence_required': 'Demonstration of app use (e.g., weather, record keeping, market '
                           'information, extension services); farmer interview.',
  'id': 'P1.2.2',
  'if_no_recommendation': 'Build your confidence in using digital applications that support your '
                          'farming activities.',
  'pillar_id': 1,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Can you independently use digital applications or platforms relevant to your '
                   'farming enterprise?',
  'quick_win': 'Download and begin using one agriculture-related mobile application suited to your '
               'enterprise.',
  'support_available': ['FAAB Digital Skills Training', 'ICT Partners', 'Extension Officers'],
  'why_it_matters': 'Digital skills improve access to timely information and increase management '
                    'efficiency.'},
 {'capability_id': 'P1.2',
  'ffv_evidence_required': 'Demonstration of information sources; subscription records; browser '
                           'history where appropriate; farmer interview.',
  'id': 'P1.2.3',
  'if_no_recommendation': 'Use trusted digital platforms to access agricultural information on '
                          'production, weather, pests, diseases, and markets.',
  'pillar_id': 1,
  'priority': 'quick_win',
  'question_number': 3,
  'question_text': 'Do you regularly access agricultural information through digital channels such '
                   'as websites, mobile apps, social media, or SMS services?',
  'quick_win': 'Subscribe to one trusted digital agricultural information service.',
  'support_available': ['Future Farms Knowledge Hub',
                        'Government Extension Platforms',
                        'FAAB Programme'],
  'why_it_matters': 'Timely access to reliable information improves farm decision-making and '
                    'reduces production risks.'},
 {'capability_id': 'P1.2',
  'ffv_evidence_required': 'Training certificates; attendance records; farmer interview; '
                           'demonstration of learned skills.',
  'id': 'P1.2.4',
  'if_no_recommendation': 'Participate in digital agriculture training to strengthen your '
                          'practical skills and confidence in using technology.',
  'pillar_id': 1,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Have you received training that has improved your ability to use digital '
                   'technologies for farming?',
  'quick_win': 'Attend one digital agriculture training session or webinar within the next six '
               'months.',
  'support_available': ['FAAB Programme', 'Future Farms Academy', 'Training Partners'],
  'why_it_matters': 'Digital skills increase the value farmers gain from technology investments '
                    'and advisory services.'},
 {'capability_id': 'P1.2',
  'ffv_evidence_required': 'Practical demonstration of digital tasks; observation; farmer '
                           'interview.',
  'id': 'P1.2.5',
  'if_no_recommendation': 'Continue practising digital skills until you can independently use the '
                          'technologies most relevant to your farming activities.',
  'pillar_id': 1,
  'priority': 'medium_term',
  'question_number': 5,
  'question_text': 'Do you confidently use digital technologies without requiring regular '
                   'assistance?',
  'quick_win': 'Perform one routine farm management activity digitally each week until it becomes '
               'a habit.',
  'support_available': ['Future Farms Digital Champions',
                        'FAAB Mentorship',
                        'ICT Support Partners'],
  'why_it_matters': 'Independent digital capability enables farmers to continuously access '
                    'opportunities, information, and innovations.'},
 {'capability_id': 'P1.3',
  'ffv_evidence_required': 'Farm record books; digital records; production logs; observation; '
                           'farmer interview.',
  'id': 'P1.3.1',
  'if_no_recommendation': 'Begin recording your routine farm activities using a notebook or '
                          'digital record-keeping tool.',
  'pillar_id': 1,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you keep records of your farm activities (e.g., planting, feeding, '
                   'spraying, harvesting)?',
  'quick_win': 'Start recording one key farm activity every day.',
  'support_available': ['FAAB Record Keeping Module',
                        'Extension Officers',
                        'Future Farms Advisory'],
  'why_it_matters': 'Farm records provide the foundation for monitoring performance and improving '
                    'management decisions.'},
 {'capability_id': 'P1.3',
  'ffv_evidence_required': 'Financial records; production records; sales receipts; invoices; '
                           'accounting books; digital records.',
  'id': 'P1.3.2',
  'if_no_recommendation': 'Record production quantities, farm expenses, and income consistently to '
                          'understand farm performance.',
  'pillar_id': 1,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': "Do you maintain records of your farm's production, expenses, and income?",
  'quick_win': 'Create a simple record book for production, income, and expenses.',
  'support_available': ['FAAB Business Skills Module', 'Business Advisors', 'Extension Services'],
  'why_it_matters': 'Financial and production records help determine profitability and improve '
                    'business planning.'},
 {'capability_id': 'P1.3',
  'ffv_evidence_required': 'Filing system; digital storage; record organization; observation.',
  'id': 'P1.3.3',
  'if_no_recommendation': 'Organize your records into categories that are easy to retrieve and '
                          'update.',
  'pillar_id': 1,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Are your farm records organized and easily accessible when needed?',
  'quick_win': 'Create separate folders (physical or digital) for production, finance, and farm '
               'operations.',
  'support_available': ['Future Farms Advisory', 'Digital Farm Management Tools'],
  'why_it_matters': 'Organized information saves time and supports informed decision-making.'},
 {'capability_id': 'P1.3',
  'ffv_evidence_required': 'Date-stamped records; digital logs; record book review; farmer '
                           'interview.',
  'id': 'P1.3.4',
  'if_no_recommendation': 'Update your records consistently as farm activities occur rather than '
                          'waiting until the end of the season.',
  'pillar_id': 1,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you regularly update your farm records throughout the production cycle?',
  'quick_win': 'Set aside one day each week to update your farm records.',
  'support_available': ['FAAB Programme', 'Extension Services', 'Digital Record Keeping Tools'],
  'why_it_matters': 'Up-to-date records provide accurate information for planning and performance '
                    'monitoring.'},
 {'capability_id': 'P1.3',
  'ffv_evidence_required': 'Digital backups; cloud storage; duplicate record books; filing system; '
                           'observation.',
  'id': 'P1.3.5',
  'if_no_recommendation': 'Develop a simple system to safely store and back up important farm '
                          'information.',
  'pillar_id': 1,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you securely store and back up important farm information to prevent loss?',
  'quick_win': 'Keep copies of important records in a second location or use cloud storage where '
               'possible.',
  'support_available': ['Digital Service Providers', 'Future Farms Advisory', 'ICT Partners'],
  'why_it_matters': 'Protecting farm information prevents data loss and ensures business '
                    'continuity.'},
 {'capability_id': 'P1.4',
  'ffv_evidence_required': 'Farm plans linked to records; production schedules; farmer interview; '
                           'planning documents.',
  'id': 'P1.4.1',
  'if_no_recommendation': 'Begin using your farm records to guide production planning, budgeting, '
                          'and scheduling.',
  'pillar_id': 1,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you use your farm records to plan future farming activities?',
  'quick_win': "Review last season's records before preparing your next production plan.",
  'support_available': ['FAAB Business Planning Module',
                        'Extension Services',
                        'Future Farms Advisory'],
  'why_it_matters': 'Planning based on evidence reduces uncertainty and improves resource '
                    'allocation.'},
 {'capability_id': 'P1.4',
  'ffv_evidence_required': 'Weather applications; climate advisories; SMS alerts; farmer '
                           'interview; production calendar.',
  'id': 'P1.4.2',
  'if_no_recommendation': 'Regularly consult reliable weather and climate information before '
                          'making key farming decisions.',
  'pillar_id': 1,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you use weather and climate information when making farm management '
                   'decisions?',
  'quick_win': 'Subscribe to a trusted weather or climate advisory service.',
  'support_available': ['National Meteorological Services',
                        'Extension Officers',
                        'Digital Advisory Platforms'],
  'why_it_matters': 'Climate-informed decisions reduce production risks and improve resilience.'},
 {'capability_id': 'P1.4',
  'ffv_evidence_required': 'Yield records; financial reports; enterprise analysis; profitability '
                           'calculations; farmer interview.',
  'id': 'P1.4.3',
  'if_no_recommendation': 'Analyse your production and financial records after each production '
                          'cycle to identify strengths and areas for improvement.',
  'pillar_id': 1,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you use production and financial records to evaluate the performance of '
                   'your farm?',
  'quick_win': 'Calculate the profit or loss from one enterprise after harvest or sale.',
  'support_available': ['FAAB Financial Management Module', 'Business Advisors'],
  'why_it_matters': 'Performance analysis supports continuous improvement and profitable '
                    'decision-making.'},
 {'capability_id': 'P1.4',
  'ffv_evidence_required': 'Market reports; contracts; buyer communication; production planning '
                           'records; farmer interview.',
  'id': 'P1.4.4',
  'if_no_recommendation': 'Monitor market trends and buyer requirements before making production '
                          'decisions.',
  'pillar_id': 1,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you use market information (prices, demand, buyer requirements) when '
                   'deciding what, when, or how much to produce?',
  'quick_win': 'Compare prices from at least three buyers before your next production cycle.',
  'support_available': ['Market Information Systems',
                        'Future Farms Marketplace',
                        'Extension Services'],
  'why_it_matters': 'Market-oriented decisions improve profitability and reduce marketing risks.'},
 {'capability_id': 'P1.4',
  'ffv_evidence_required': 'Annual farm reviews; performance reports; improvement plans; '
                           'management meeting notes; farmer interview.',
  'id': 'P1.4.5',
  'if_no_recommendation': 'Establish a routine process for reviewing farm performance and '
                          'implementing improvements based on lessons learned.',
  'pillar_id': 1,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you regularly review farm performance and adjust your management practices '
                   'based on the results?',
  'quick_win': 'Schedule a quarterly farm performance review with your household or farm team.',
  'support_available': ['Future Farms Advisory', 'FAAB Mentorship', 'Farm Business Coaches'],
  'why_it_matters': 'Continuous evaluation enables farms to adapt, innovate, and improve over '
                    'time.'},
 {'capability_id': 'P1.5',
  'ffv_evidence_required': 'Farm improvement plans; farmer interview; meeting notes; observation '
                           'of implemented improvements.',
  'id': 'P1.5.1',
  'if_no_recommendation': 'Make it a routine to identify areas where your farm can improve '
                          'efficiency, productivity, quality, or sustainability.',
  'pillar_id': 1,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you regularly identify opportunities to improve your farming practices?',
  'quick_win': 'Identify three aspects of your farm that could be improved during the next '
               'production cycle.',
  'support_available': ['FAAB Programme', 'Extension Services', 'Future Farms Advisory'],
  'why_it_matters': 'Continuous improvement enables farms to remain competitive and resilient in a '
                    'changing agricultural environment.'},
 {'capability_id': 'P1.5',
  'ffv_evidence_required': 'Observation of innovations; purchase records; training certificates; '
                           'farmer interview.',
  'id': 'P1.5.2',
  'if_no_recommendation': "Begin testing practical innovations that address your farm's specific "
                          'challenges and opportunities.',
  'pillar_id': 1,
  'priority': 'medium_term',
  'question_number': 2,
  'question_text': 'Have you introduced a new technology, practice, or innovation on your farm '
                   'within the last two years?',
  'quick_win': 'Trial one improved farming practice or technology on a small section of your farm.',
  'support_available': ['Future Farms Innovation Hub',
                        'Research Institutions',
                        'Technology Partners'],
  'why_it_matters': 'Innovation enables farmers to improve productivity, reduce costs, and respond '
                    'to changing conditions.'},
 {'capability_id': 'P1.5',
  'ffv_evidence_required': 'Trial records; comparison plots; performance reports; farmer '
                           'interview.',
  'id': 'P1.5.3',
  'if_no_recommendation': 'Test new ideas on a small scale and evaluate the results before '
                          'expanding implementation.',
  'pillar_id': 1,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you evaluate the results of new technologies or practices before adopting '
                   'them on a larger scale?',
  'quick_win': 'Establish a simple demonstration area to compare current and improved practices.',
  'support_available': ['Extension Services', 'Demonstration Farms', 'Future Farms Advisory'],
  'why_it_matters': 'Small-scale testing reduces investment risk and supports evidence-based '
                    'innovation.'},
 {'capability_id': 'P1.5',
  'ffv_evidence_required': 'Training certificates; attendance registers; membership records; '
                           'farmer interview.',
  'id': 'P1.5.4',
  'if_no_recommendation': 'Participate regularly in learning activities to stay informed about new '
                          'technologies, markets, and farming practices.',
  'pillar_id': 1,
  'priority': 'quick_win',
  'question_number': 4,
  'question_text': 'Do you regularly participate in learning opportunities such as training, '
                   'demonstrations, farmer groups, webinars, or field days?',
  'quick_win': 'Attend one agricultural training event, webinar, or demonstration within the next '
               'six months.',
  'support_available': ['FAAB Programme',
                        'Farmer Organizations',
                        'Extension Officers',
                        'Future Farms Academy'],
  'why_it_matters': 'Continuous learning improves knowledge, strengthens capability, and supports '
                    'innovation.'},
 {'capability_id': 'P1.5',
  'ffv_evidence_required': 'Farm development plan; business plan; strategic roadmap; investment '
                           'plan; farmer interview.',
  'id': 'P1.5.5',
  'if_no_recommendation': 'Develop a practical improvement plan with clear goals, priorities, and '
                          'timelines for your farm.',
  'pillar_id': 1,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you have a clear plan for continuously improving your farm over the next '
                   'three years?',
  'quick_win': 'Prepare a three-year farm improvement roadmap with annual milestones.',
  'support_available': ['Future Farms Advisory',
                        'FAAB Business Planning Module',
                        'Farm Business Advisors'],
  'why_it_matters': 'Long-term planning helps farmers systematically transition toward '
                    'future-ready farming systems.'},
 {'capability_id': 'P2.1',
  'ffv_evidence_required': 'Documented or observed inventory of grid electricity, solar, '
                           'generator, fuel, biogas, wind, etc.',
  'id': 'P2.1.1',
  'if_no_recommendation': 'Identify and document every energy source and the activities each '
                          'supports.',
  'pillar_id': 2,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Have you identified all the energy sources used on your farm?',
  'quick_win': 'Walk around the farm and prepare an energy-source inventory.',
  'support_available': ['FAAB Module 1',
                        'Clean Farms Energy Assessment Toolkit',
                        'Future Farms Advisory'],
  'why_it_matters': 'Understanding energy sources is the foundation for improving efficiency, '
                    'reducing costs and planning investments.'},
 {'capability_id': 'P2.1',
  'ffv_evidence_required': 'Energy-use map, activity records or farmer interview identifying major '
                           'energy-consuming activities.',
  'id': 'P2.1.2',
  'if_no_recommendation': 'Identify the activities consuming the most electricity or fuel and '
                          'estimate their energy demand.',
  'pillar_id': 2,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you know which farm activities consume the most energy?',
  'quick_win': 'List and rank your five largest energy-consuming activities.',
  'support_available': ['Clean Farms Advisory', 'Energy Assessment Toolkit'],
  'why_it_matters': 'Helps prioritise interventions with the greatest productivity and cost '
                    'impact.'},
 {'capability_id': 'P2.1',
  'ffv_evidence_required': 'Electricity bills, fuel receipts, financial records or energy-expense '
                           'log.',
  'id': 'P2.1.3',
  'if_no_recommendation': 'Begin recording electricity, fuel and other energy-related expenses.',
  'pillar_id': 2,
  'priority': 'quick_win',
  'question_number': 3,
  'question_text': "Do you keep records of your farm's energy costs?",
  'quick_win': 'Record all energy expenses for the next month.',
  'support_available': ['FAAB Module 3', 'Farm Record-Keeping Toolkit'],
  'why_it_matters': 'Energy costs directly affect farm profitability and investment decisions.'},
 {'capability_id': 'P2.1',
  'ffv_evidence_required': 'Risk register, farm development plan, notes or farmer interview.',
  'id': 'P2.1.4',
  'if_no_recommendation': 'Assess the reliability, affordability and availability of current '
                          'energy sources and document the major challenges.',
  'pillar_id': 2,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Have you identified the main energy-related challenges affecting your farm?',
  'quick_win': 'Write down your three biggest energy challenges and their effects.',
  'support_available': ['Future Farms Advisory', 'Clean Farms Energy Assessment'],
  'why_it_matters': 'Identifying energy risks supports better planning and reduces production '
                    'disruptions.'},
 {'capability_id': 'P2.1',
  'ffv_evidence_required': 'Farmer interview supported by production or financial records where '
                           'available.',
  'id': 'P2.1.5',
  'if_no_recommendation': 'Review how energy affects productivity, labour, operating costs, '
                          'quality and profitability.',
  'pillar_id': 2,
  'priority': 'quick_win',
  'question_number': 5,
  'question_text': "Do you understand how energy affects your farm's productivity and operating "
                   'costs?',
  'quick_win': 'Select one activity and estimate how better energy management could reduce costs '
               'or increase productivity.',
  'support_available': ['FAAB Module 1', 'Clean Farms Advisory'],
  'why_it_matters': 'Energy is a strategic farm-business resource, not simply an operating '
                    'expense.'},
 {'capability_id': 'P2.2',
  'ffv_evidence_required': 'Physical observation of solar PV, solar pumps, biogas, wind, '
                           'mini-hydro or other renewable-energy systems.',
  'id': 'P2.2.1',
  'if_no_recommendation': "Identify a renewable-energy technology appropriate to the farm's energy "
                          'needs.',
  'pillar_id': 2,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you currently use one or more renewable-energy technologies on your farm?',
  'quick_win': 'Research one suitable renewable-energy technology.',
  'support_available': ['FAAB Module 1',
                        'Clean Farms Advisory',
                        'Renewable Energy Technology Partners'],
  'why_it_matters': 'Renewable energy can reduce dependence on costly or unreliable conventional '
                    'energy sources.'},
 {'capability_id': 'P2.2',
  'ffv_evidence_required': 'Energy assessment, feasibility study, technical assessment, quotations '
                           'or advisory report.',
  'id': 'P2.2.2',
  'if_no_recommendation': 'Compare available technologies based on energy needs, cost, '
                          'reliability, technical suitability and expected benefits.',
  'pillar_id': 2,
  'priority': 'medium_term',
  'question_number': 2,
  'question_text': 'Have you assessed which renewable-energy technology is most suitable for your '
                   'farm?',
  'quick_win': 'Obtain information or a quotation for one suitable technology.',
  'support_available': ['Clean Farms Feasibility Toolkit', 'Renewable Energy Providers'],
  'why_it_matters': 'The cheapest technology is not necessarily the most appropriate solution.'},
 {'capability_id': 'P2.2',
  'ffv_evidence_required': 'Observation of renewable energy powering irrigation, pumping, cooling, '
                           'lighting, processing, drying, livestock systems, etc.',
  'id': 'P2.2.3',
  'if_no_recommendation': 'Integrate renewable energy into a high-impact farm activity.',
  'pillar_id': 2,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Is renewable energy currently used to support agricultural production or farm '
                   'operations?',
  'quick_win': 'Identify one farm activity that could use renewable energy within the next year.',
  'support_available': ['Clean Farms Advisory', 'Renewable Energy Providers'],
  'why_it_matters': 'Renewable energy creates the greatest value when directly linked to '
                    'productive farm activities.'},
 {'capability_id': 'P2.2',
  'ffv_evidence_required': 'Physical inspection demonstrating that the system is operational and '
                           'actively used.',
  'id': 'P2.2.4',
  'if_no_recommendation': 'Repair, recommission or improve utilisation of the renewable-energy '
                          'system.',
  'pillar_id': 2,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Is your renewable-energy system functional and regularly used?',
  'quick_win': 'Inspect the system and identify any faults preventing regular use.',
  'support_available': ['Equipment Suppliers', 'Clean Farms Technical Support'],
  'why_it_matters': 'An installed system only creates value when it is functional and used '
                    'consistently.'},
 {'capability_id': 'P2.3',
  'ffv_evidence_required': 'Energy records, electricity bills, fuel logs, renewable-energy '
                           'monitoring records or digital monitoring system.',
  'id': 'P2.3.1',
  'if_no_recommendation': 'Establish regular monitoring of electricity, fuel and renewable-energy '
                          'consumption.',
  'pillar_id': 2,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': "Do you regularly monitor your farm's energy use and performance?",
  'quick_win': 'Create a monthly energy-use log.',
  'support_available': ['FAAB Module 1',
                        'Clean Farms Energy Monitoring Toolkit',
                        'Future Farms Advisory'],
  'why_it_matters': 'Monitoring reveals inefficiencies, controls costs and establishes a baseline '
                    'for improvement.'},
 {'capability_id': 'P2.3',
  'ffv_evidence_required': 'Energy audit, observation, equipment inspection, energy-use records or '
                           'farmer interview.',
  'id': 'P2.3.2',
  'if_no_recommendation': 'Conduct a basic energy-efficiency review to identify unnecessary '
                          'consumption and inefficient equipment or practices.',
  'pillar_id': 2,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Have you identified areas where energy is being wasted or used inefficiently?',
  'quick_win': 'Identify three sources of energy waste on the farm.',
  'support_available': ['Clean Farms Advisory', 'Energy Efficiency Toolkit'],
  'why_it_matters': 'Reducing waste can lower operating costs without reducing productivity.'},
 {'capability_id': 'P2.3',
  'ffv_evidence_required': 'Observation of efficient equipment, maintenance records or documented '
                           'management practices.',
  'id': 'P2.3.3',
  'if_no_recommendation': 'Implement practical measures that reduce unnecessary energy consumption '
                          'while maintaining or improving productivity.',
  'pillar_id': 2,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': "Have you implemented measures to improve your farm's energy efficiency?",
  'quick_win': 'Replace or improve one inefficient practice where feasible.',
  'support_available': ['Clean Farms Advisory', 'Equipment Suppliers', 'Energy Efficiency Toolkit'],
  'why_it_matters': 'Efficient energy use maximises the value obtained from every unit of energy.'},
 {'capability_id': 'P2.3',
  'ffv_evidence_required': 'Maintenance records, equipment logbook, service reports or physical '
                           'observation.',
  'id': 'P2.3.4',
  'if_no_recommendation': 'Establish preventive maintenance schedules for pumps, motors, '
                          'refrigeration, generators and other energy-consuming equipment.',
  'pillar_id': 2,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you maintain energy-using equipment to ensure it operates efficiently?',
  'quick_win': 'Create a maintenance checklist for your major energy-using equipment.',
  'support_available': ['Equipment Suppliers', 'Clean Farms Technical Support'],
  'why_it_matters': 'Poorly maintained equipment can consume more energy and fail unexpectedly.'},
 {'capability_id': 'P2.3',
  'ffv_evidence_required': 'Cost records, energy-performance reviews, financial analysis or '
                           'management reports.',
  'id': 'P2.3.5',
  'if_no_recommendation': 'Compare energy costs and consumption over time and identify priority '
                          'savings opportunities.',
  'pillar_id': 2,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you review your energy costs and efficiency to identify opportunities for '
                   'savings?',
  'quick_win': "Compare this month's energy costs with the previous month.",
  'support_available': ['FAAB Module 3', 'Farm Business Advisors', 'Future Farms Advisory'],
  'why_it_matters': 'Energy efficiency should translate into measurable business value.'},
 {'capability_id': 'P2.4',
  'ffv_evidence_required': 'Observation of energy used for irrigation, pumping, greenhouse '
                           'operations, livestock, aquaculture, mechanisation or other production '
                           'activities.',
  'id': 'P2.4.1',
  'if_no_recommendation': 'Identify production activities where energy could improve efficiency or '
                          'productivity.',
  'pillar_id': 2,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you use energy to support one or more agricultural production activities?',
  'quick_win': 'Identify one production activity that could benefit from energy.',
  'support_available': ['FAAB Module 1', 'Clean Farms Advisory', 'Future Farms Advisory'],
  'why_it_matters': 'Productive energy enables more efficient and climate-smart production.'},
 {'capability_id': 'P2.4',
  'ffv_evidence_required': 'Observation of cold storage, milk cooling, dryers, milling, '
                           'processing, packaging or other systems.',
  'id': 'P2.4.2',
  'if_no_recommendation': 'Explore energy applications that reduce post-harvest losses and improve '
                          'product value.',
  'pillar_id': 2,
  'priority': 'medium_term',
  'question_number': 2,
  'question_text': 'Do you use energy for post-harvest handling, storage, processing or value '
                   'addition?',
  'quick_win': 'Identify one post-harvest activity where energy could reduce losses.',
  'support_available': ['Clean Farms Advisory', 'Value Addition Partners', 'FAAB Module 3'],
  'why_it_matters': 'Energy can improve shelf life, quality and access to higher-value markets.'},
 {'capability_id': 'P2.4',
  'ffv_evidence_required': 'Labour records, observation, farmer interview or comparison with '
                           'previous practices.',
  'id': 'P2.4.3',
  'if_no_recommendation': 'Identify repetitive or labour-intensive activities where appropriate '
                          'energy-powered technologies could improve efficiency.',
  'pillar_id': 2,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Has the use of energy improved labour efficiency or reduced time spent on farm '
                   'operations?',
  'quick_win': 'Identify the farm task consuming the most labour and research an energy-powered '
               'alternative.',
  'support_available': ['Future Farms Advisory', 'Equipment Suppliers'],
  'why_it_matters': 'Energy can reduce labour requirements and free workers for higher-value '
                    'activities.'},
 {'capability_id': 'P2.4',
  'ffv_evidence_required': 'Production records, quality records, customer feedback, reduced '
                           'spoilage or observation.',
  'id': 'P2.4.4',
  'if_no_recommendation': 'Review opportunities to use energy for better environmental control, '
                          'processing, storage or handling.',
  'pillar_id': 2,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Has the use of energy improved the quality, consistency or reliability of your '
                   'farm products?',
  'quick_win': 'Identify one quality problem that could be addressed through better energy use.',
  'support_available': ['FAAB Module 2', 'Clean Farms Advisory', 'Technical Partners'],
  'why_it_matters': 'Consistent quality strengthens customer confidence and market access.'},
 {'capability_id': 'P2.4',
  'ffv_evidence_required': 'Financial records, production records, cost-savings analysis, '
                           'increased sales or farmer interview supported by records.',
  'id': 'P2.4.5',
  'if_no_recommendation': 'Measure the financial impact of energy use and identify higher-return '
                          'productive applications.',
  'pillar_id': 2,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': "Has productive use of energy improved your farm's profitability or business "
                   'performance?',
  'quick_win': 'Compare production costs and output before and after an energy intervention.',
  'support_available': ['FAAB Module 3',
                        'Farm Business Advisors',
                        'Clean Farms Performance Toolkit'],
  'why_it_matters': 'Energy should contribute to productivity, lower costs and improved business '
                    'performance.'},
 {'capability_id': 'P2.5',
  'ffv_evidence_required': 'Energy risk register, farm development plan, contingency plan or '
                           'farmer interview.',
  'id': 'P2.5.1',
  'if_no_recommendation': 'Identify risks such as grid outages, fuel price increases, equipment '
                          'failure, water/solar variability and system breakdowns.',
  'pillar_id': 2,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Have you identified the main risks that could disrupt energy access on your '
                   'farm?',
  'quick_win': 'List your three biggest energy risks and their potential impact.',
  'support_available': ['Future Farms Advisory', 'Clean Farms Energy Assessment'],
  'why_it_matters': 'Energy disruptions can interrupt production, increase costs and cause product '
                    'losses.'},
 {'capability_id': 'P2.5',
  'ffv_evidence_required': 'Backup system, contingency plan, alternative energy source, generator, '
                           'storage system or documented response plan.',
  'id': 'P2.5.2',
  'if_no_recommendation': 'Develop a contingency plan for critical operations such as irrigation, '
                          'cooling, livestock systems, storage and processing.',
  'pillar_id': 2,
  'priority': 'medium_term',
  'question_number': 2,
  'question_text': 'Do you have a backup or contingency plan for critical energy-dependent farm '
                   'operations?',
  'quick_win': 'Identify your three most critical energy-dependent operations and define an '
               'alternative response for each.',
  'support_available': ['Clean Farms Advisory', 'Renewable Energy Providers'],
  'why_it_matters': 'Resilience reduces losses during outages and other energy disruptions.'},
 {'capability_id': 'P2.5',
  'ffv_evidence_required': 'Annual reviews, management records, improvement plans or documented '
                           'performance evaluations.',
  'id': 'P2.5.3',
  'if_no_recommendation': 'Schedule regular energy-performance reviews and document improvement '
                          'priorities.',
  'pillar_id': 2,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': "Do you regularly review your farm's energy performance and identify "
                   'opportunities for improvement?',
  'quick_win': 'Conduct an energy review and identify three improvements for the coming year.',
  'support_available': ['Future Farms Advisory', 'Clean Farms Performance Review Toolkit'],
  'why_it_matters': 'Continuous review ensures energy systems remain aligned with changing farm '
                    'needs.'},
 {'capability_id': 'P2.5',
  'ffv_evidence_required': 'Observation of recently introduced technologies, purchase records, '
                           'installation reports or training records.',
  'id': 'P2.5.4',
  'if_no_recommendation': 'Explore appropriate innovations that can improve productivity, '
                          'efficiency, sustainability and resilience.',
  'pillar_id': 2,
  'priority': 'strategic',
  'question_number': 4,
  'question_text': 'Have you adopted new energy technologies or management practices within the '
                   'last three years?',
  'quick_win': 'Identify one energy technology or management practice to trial within the next 12 '
               'months.',
  'support_available': ['Clean Farms Innovation Hub', 'Technology Partners', 'FAAB Module 1'],
  'why_it_matters': 'Continuous innovation keeps farms competitive and adaptable.'},
 {'capability_id': 'P2.5',
  'ffv_evidence_required': 'Farm development plan, strategic plan, investment roadmap or energy '
                           'improvement plan.',
  'id': 'P2.5.5',
  'if_no_recommendation': 'Develop a long-term energy improvement plan covering efficiency, '
                          'renewable adoption, resilience and innovation.',
  'pillar_id': 2,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': "Do you have a long-term plan to continuously improve your farm's energy "
                   'systems?',
  'quick_win': 'Include at least three energy improvement goals in your 3–5 year farm development '
               'plan.',
  'support_available': ['Future Farms Advisory',
                        'Clean Farms Strategic Planning Toolkit',
                        'FAAB Programme'],
  'why_it_matters': 'Long-term planning makes energy a strategic driver of productivity, '
                    'resilience and profitability.'},
 {'capability_id': 'P3.1',
  'ffv_evidence_required': 'Farmer interview; training records; demonstration of knowledge during '
                           'field verification.',
  'id': 'P3.1.1',
  'if_no_recommendation': 'Learn about the food safety risks specific to your enterprise, '
                          'including biological, chemical, and physical hazards.',
  'pillar_id': 3,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you understand the basic food safety risks associated with your farming '
                   'enterprise?',
  'quick_win': 'Attend a food safety awareness session or review enterprise-specific food safety '
               'guidance.',
  'support_available': ['Extension Services', 'FAAB Training', 'Food Safety Authorities'],
  'why_it_matters': 'Understanding food safety risks is the first step in preventing contamination '
                    'and protecting consumer health.'},
 {'capability_id': 'P3.1',
  'ffv_evidence_required': 'Training certificates; attendance registers; advisory records; farmer '
                           'interview.',
  'id': 'P3.1.2',
  'if_no_recommendation': 'Participate in food safety training to understand safe production, '
                          'handling, and storage practices.',
  'pillar_id': 3,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Have you received training or guidance on safe food production practices?',
  'quick_win': 'Enrol in one food safety training or webinar within the next six months.',
  'support_available': ['FAAB Programme', 'Extension Officers', 'Food Safety Trainers'],
  'why_it_matters': 'Training builds the knowledge needed to consistently produce safe, marketable '
                    'food.'},
 {'capability_id': 'P3.1',
  'ffv_evidence_required': 'Farmer interview; observation of hygiene awareness; training records.',
  'id': 'P3.1.3',
  'if_no_recommendation': 'Learn how hygiene throughout production, harvesting, handling, and '
                          'storage affects food safety.',
  'pillar_id': 3,
  'priority': 'quick_win',
  'question_number': 3,
  'question_text': 'Do you understand how poor hygiene and unsafe handling practices can affect '
                   'food safety?',
  'quick_win': 'Develop a simple hygiene checklist for routine farm activities.',
  'support_available': ['Public Health Officers', 'Extension Services', 'Future Farms Advisory'],
  'why_it_matters': 'Good hygiene reduces contamination risks and improves product quality.'},
 {'capability_id': 'P3.1',
  'ffv_evidence_required': 'Farmer interview; evidence of awareness materials; participation in '
                           'compliance meetings or trainings.',
  'id': 'P3.1.4',
  'if_no_recommendation': 'Familiarize yourself with relevant food safety regulations, industry '
                          'standards, and buyer specifications.',
  'pillar_id': 3,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you understand the importance of complying with food safety regulations and '
                   'buyer requirements?',
  'quick_win': 'Identify the main food safety requirements for your target market.',
  'support_available': ['Regulatory Authorities', 'Buyer Organizations', 'FAAB Business Support'],
  'why_it_matters': 'Compliance increases market access, consumer confidence, and business '
                    'sustainability.'},
 {'capability_id': 'P3.1',
  'ffv_evidence_required': 'Farmer interview; farm policy; management discussions; observation of '
                           'management commitment.',
  'id': 'P3.1.5',
  'if_no_recommendation': 'Make food safety a core objective of your farm by integrating it into '
                          'routine management and future planning.',
  'pillar_id': 3,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': "Do you recognize food safety as an important part of your farm's long-term "
                   'success and reputation?',
  'quick_win': "Include food safety as one of your farm's annual improvement priorities.",
  'support_available': ['Future Farms Advisory', 'Extension Services', 'Farmer Organizations'],
  'why_it_matters': 'A strong food safety culture protects consumers, strengthens reputation, and '
                    'improves market opportunities.'},
 {'capability_id': 'P3.2',
  'ffv_evidence_required': 'Observation of worker hygiene; handwashing facilities; harvesting '
                           'practices; hygiene protocols; farmer interview.',
  'id': 'P3.2.1',
  'if_no_recommendation': 'Establish and consistently follow hygiene practices throughout all '
                          'stages of production and handling.',
  'pillar_id': 3,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you consistently apply good hygiene practices during production, '
                   'harvesting, and post-harvest handling?',
  'quick_win': 'Create a simple hygiene checklist and ensure clean water and handwashing '
               'facilities are available.',
  'support_available': ['Extension Services', 'FAAB Training', 'Public Health Officers'],
  'why_it_matters': 'Good hygiene prevents contamination and protects food safety from farm to '
                    'consumer.'},
 {'capability_id': 'P3.2',
  'ffv_evidence_required': 'Chemical store inspection; input inventory; labels; PPE; application '
                           'records; observation.',
  'id': 'P3.2.2',
  'if_no_recommendation': 'Store and use agricultural inputs safely, following manufacturer '
                          'instructions and national regulations.',
  'pillar_id': 3,
  'priority': 'medium_term',
  'question_number': 2,
  'question_text': 'Do you safely store, handle, and apply agricultural inputs (e.g., fertilizers, '
                   'pesticides, veterinary medicines) according to recommended guidelines?',
  'quick_win': 'Designate a secure storage area for agricultural inputs and label all products '
               'clearly.',
  'support_available': ['Agro-dealers', 'Extension Officers', 'Regulatory Authorities'],
  'why_it_matters': 'Proper input management reduces contamination risks, protects workers, and '
                    'safeguards the environment.'},
 {'capability_id': 'P3.2',
  'ffv_evidence_required': 'Water source inspection; equipment cleanliness; sanitation procedures; '
                           'observation.',
  'id': 'P3.2.3',
  'if_no_recommendation': 'Ensure that water and equipment used in food production are clean and '
                          'suitable for their intended purpose.',
  'pillar_id': 3,
  'priority': 'quick_win',
  'question_number': 3,
  'question_text': 'Do you use clean water and clean equipment during production, harvesting, '
                   'washing, and processing activities?',
  'quick_win': 'Develop a cleaning schedule for all harvesting, washing, and processing equipment.',
  'support_available': ['Water Authorities', 'Extension Services', 'Future Farms Advisory'],
  'why_it_matters': 'Contaminated water or equipment is a major source of foodborne illnesses and '
                    'product spoilage.'},
 {'capability_id': 'P3.2',
  'ffv_evidence_required': 'Farm inspection; pest management records; waste disposal practices; '
                           'fencing; observation.',
  'id': 'P3.2.4',
  'if_no_recommendation': 'Implement practical measures to reduce contamination risks from '
                          'animals, pests, waste, and surrounding activities.',
  'pillar_id': 3,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you take measures to prevent contamination from animals, pests, waste, or '
                   'other environmental hazards?',
  'quick_win': 'Remove waste promptly, protect harvested products, and establish basic pest '
               'control measures.',
  'support_available': ['Extension Services', 'Pest Management Advisors', 'FAAB Programme'],
  'why_it_matters': 'Preventing contamination helps ensure safe, high-quality products and '
                    'protects consumer health.'},
 {'capability_id': 'P3.2',
  'ffv_evidence_required': 'Monitoring checklists; internal inspections; corrective action '
                           'records; farmer interview.',
  'id': 'P3.2.5',
  'if_no_recommendation': 'Regularly review food safety practices, identify weaknesses, and '
                          'implement corrective actions to reduce risks.',
  'pillar_id': 3,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': "Do you regularly monitor and improve your farm's food safety practices "
                   'throughout the production cycle?',
  'quick_win': 'Conduct a monthly food safety inspection using a simple checklist.',
  'support_available': ['Future Farms Advisory', 'Extension Officers', 'Food Safety Trainers'],
  'why_it_matters': 'Continuous monitoring helps maintain food safety standards and prevents '
                    'recurring problems.'},
 {'capability_id': 'P3.3',
  'ffv_evidence_required': 'Quality specifications; buyer requirements; grading guidelines; farm '
                           'quality manual; farmer interview.',
  'id': 'P3.3.1',
  'if_no_recommendation': 'Define simple quality standards for each product based on market and '
                          'buyer requirements.',
  'pillar_id': 3,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you have quality standards or specifications for the products you produce?',
  'quick_win': 'Write down the key quality characteristics your buyers expect (e.g., size, colour, '
               'maturity, cleanliness).',
  'support_available': ['FAAB Programme', 'Buyer Guidelines', 'Extension Services'],
  'why_it_matters': 'Clear quality standards ensure consistent production and improve customer '
                    'satisfaction.'},
 {'capability_id': 'P3.3',
  'ffv_evidence_required': 'Grading records; sorting area; observation of grading process; '
                           'rejected product records.',
  'id': 'P3.3.2',
  'if_no_recommendation': 'Introduce routine product inspection and grading before products are '
                          'stored or marketed.',
  'pillar_id': 3,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you inspect or grade your products before storage or sale?',
  'quick_win': 'Separate damaged or poor-quality products before packaging or sale.',
  'support_available': ['Extension Officers', 'Buyer Organizations', 'Future Farms Advisory'],
  'why_it_matters': 'Grading improves consistency, reduces customer complaints, and increases '
                    'product value.'},
 {'capability_id': 'P3.3',
  'ffv_evidence_required': 'Observation of harvesting methods; packaging materials; storage '
                           'facilities; handling procedures.',
  'id': 'P3.3.3',
  'if_no_recommendation': 'Improve harvesting, handling, packaging, and storage practices to '
                          'minimize physical damage and quality losses.',
  'pillar_id': 3,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you use appropriate harvesting, handling, packaging, and storage practices '
                   'to preserve product quality?',
  'quick_win': 'Use clean containers and avoid exposing harvested products to direct sunlight or '
               'rough handling.',
  'support_available': ['Post-Harvest Specialists', 'Extension Services', 'FAAB Training'],
  'why_it_matters': 'Proper post-harvest handling reduces losses and preserves product quality.'},
 {'capability_id': 'P3.3',
  'ffv_evidence_required': 'Customer feedback records; buyer communications; complaint records; '
                           'farmer interview.',
  'id': 'P3.3.4',
  'if_no_recommendation': 'Establish a simple system for collecting and using buyer feedback to '
                          'improve quality.',
  'pillar_id': 3,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you regularly receive and use customer or buyer feedback to improve product '
                   'quality?',
  'quick_win': 'Ask your next buyer to provide feedback on product quality after delivery.',
  'support_available': ['Buyer Networks', 'Farmer Organizations', 'Future Farms Advisory'],
  'why_it_matters': 'Customer feedback helps identify improvement opportunities and strengthens '
                    'market relationships.'},
 {'capability_id': 'P3.3',
  'ffv_evidence_required': 'Quality monitoring records; corrective action reports; production '
                           'reviews; farm meeting records.',
  'id': 'P3.3.5',
  'if_no_recommendation': 'Regularly review product quality performance and address recurring '
                          'issues through corrective actions.',
  'pillar_id': 3,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you monitor product quality trends and take corrective actions when quality '
                   'problems occur?',
  'quick_win': 'Record one recurring quality issue and identify its root cause with an action plan '
               'to address it.',
  'support_available': ['Future Farms Advisory', 'Quality Assurance Specialists', 'FAAB Programme'],
  'why_it_matters': 'Continuous quality improvement strengthens competitiveness, reduces losses, '
                    'and builds customer trust.'},
 {'capability_id': 'P3.4',
  'ffv_evidence_required': 'Production records; harvest logs; batch records; sales records; '
                           'traceability documents; farmer interview.',
  'id': 'P3.4.1',
  'if_no_recommendation': 'Establish a simple traceability system that links production, '
                          'harvesting, storage, and sales records.',
  'pillar_id': 3,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you maintain records that trace your products from production to sale?',
  'quick_win': 'Assign simple batch numbers or harvest dates to products and record where they '
               'were sold.',
  'support_available': ['FAAB Record Keeping Module',
                        'Future Farms Advisory',
                        'Extension Services'],
  'why_it_matters': 'Traceability enables farms to identify product origins, respond to food '
                    'safety incidents, and meet buyer requirements.'},
 {'capability_id': 'P3.4',
  'ffv_evidence_required': 'Input records; spray records; veterinary treatment logs; invoices; '
                           'observation.',
  'id': 'P3.4.2',
  'if_no_recommendation': 'Keep accurate records of all agricultural inputs applied to crops or '
                          'livestock, including dates, quantities, and application methods.',
  'pillar_id': 3,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you maintain records of agricultural inputs, including fertilizers, '
                   'pesticides, veterinary medicines, and other treatments applied to your farm?',
  'quick_win': 'Create a simple input application register and update it after every application.',
  'support_available': ['Extension Officers', 'Regulatory Authorities', 'FAAB Programme'],
  'why_it_matters': 'Input records support food safety, compliance, and responsible farm '
                    'management.'},
 {'capability_id': 'P3.4',
  'ffv_evidence_required': 'Licences; permits; buyer contracts; farmer interview; compliance '
                           'records.',
  'id': 'P3.4.3',
  'if_no_recommendation': 'Identify the regulatory and buyer requirements relevant to your '
                          'enterprise and ensure they are consistently met.',
  'pillar_id': 3,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you understand and comply with the food safety regulations and buyer '
                   'requirements that apply to your products?',
  'quick_win': 'Make a checklist of the key regulatory and buyer requirements for your products.',
  'support_available': ['Regulatory Authorities', 'Buyer Organizations', 'Future Farms Advisory'],
  'why_it_matters': 'Compliance protects market access, strengthens customer confidence, and '
                    'reduces legal and commercial risks.'},
 {'capability_id': 'P3.4',
  'ffv_evidence_required': 'Traceability demonstration; recall procedure; batch identification '
                           'records; farmer interview.',
  'id': 'P3.4.4',
  'if_no_recommendation': 'Develop a simple product identification and recall procedure that '
                          'enables rapid investigation and corrective action.',
  'pillar_id': 3,
  'priority': 'strategic',
  'question_number': 4,
  'question_text': 'Can you quickly identify the source of a food safety or quality problem if one '
                   'occurs on your farm?',
  'quick_win': 'Practise tracing one recent harvest from production through to sale using your '
               'farm records.',
  'support_available': ['Food Safety Authorities', 'Extension Services', 'Future Farms Advisory'],
  'why_it_matters': 'Effective traceability reduces the impact of food safety incidents and '
                    'protects consumers and markets.'},
 {'capability_id': 'P3.4',
  'ffv_evidence_required': 'Internal review records; updated procedures; compliance checklists; '
                           'management meeting notes.',
  'id': 'P3.4.5',
  'if_no_recommendation': 'Review compliance documentation regularly and update farm procedures '
                          'whenever requirements or practices change.',
  'pillar_id': 3,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you regularly review your compliance records and update them when '
                   'regulations, buyer requirements, or farm practices change?',
  'quick_win': 'Schedule a quarterly compliance review and update all relevant records.',
  'support_available': ['Future Farms Advisory', 'Certification Bodies', 'FAAB Programme'],
  'why_it_matters': 'Continuous compliance reduces business risk and prepares the farm for '
                    'certification and premium markets.'},
 {'capability_id': 'P3.5',
  'ffv_evidence_required': 'Internal review records; meeting minutes; improvement plans; '
                           'corrective action logs; farmer interview.',
  'id': 'P3.5.1',
  'if_no_recommendation': 'Schedule regular reviews of your food safety and quality systems to '
                          'identify strengths, weaknesses, and improvement opportunities.',
  'pillar_id': 3,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you regularly review your food safety, quality, and compliance practices to '
                   'identify areas for improvement?',
  'quick_win': 'Conduct a quarterly review using a simple food safety and quality checklist.',
  'support_available': ['Future Farms Advisory', 'FAAB Programme', 'Extension Services'],
  'why_it_matters': 'Regular reviews help prevent recurring problems and strengthen farm '
                    'performance over time.'},
 {'capability_id': 'P3.5',
  'ffv_evidence_required': 'Corrective action records; improvement logs; follow-up reports; '
                           'observation.',
  'id': 'P3.5.2',
  'if_no_recommendation': 'Record every food safety or quality issue and implement corrective '
                          'actions to prevent it from happening again.',
  'pillar_id': 3,
  'priority': 'medium_term',
  'question_number': 2,
  'question_text': 'Do you document and implement corrective actions when food safety or quality '
                   'problems are identified?',
  'quick_win': 'Create a simple corrective action register and use it whenever a quality issue '
               'occurs.',
  'support_available': ['Quality Assurance Advisors',
                        'Extension Officers',
                        'Future Farms Advisory'],
  'why_it_matters': 'Corrective actions build a culture of accountability and continuous '
                    'improvement.'},
 {'capability_id': 'P3.5',
  'ffv_evidence_required': 'Training records; attendance registers; toolbox talks; certificates; '
                           'farmer interview.',
  'id': 'P3.5.3',
  'if_no_recommendation': 'Provide ongoing food safety and quality training for everyone involved '
                          'in farm operations.',
  'pillar_id': 3,
  'priority': 'quick_win',
  'question_number': 3,
  'question_text': 'Do you regularly train yourself or your workers on food safety, quality, and '
                   'compliance requirements?',
  'quick_win': 'Hold a short monthly food safety discussion with all workers or family members '
               'involved in production.',
  'support_available': ['FAAB Programme', 'Extension Services', 'Food Safety Trainers'],
  'why_it_matters': 'Continuous learning ensures that good practices are consistently applied '
                    'across the farm.'},
 {'capability_id': 'P3.5',
  'ffv_evidence_required': 'GAP self-assessment; certification readiness checklist; advisory '
                           'reports; improvement plans.',
  'id': 'P3.5.4',
  'if_no_recommendation': 'Assess your farm against a recognised standard to identify gaps and '
                          'prepare for future certification opportunities.',
  'pillar_id': 3,
  'priority': 'strategic',
  'question_number': 4,
  'question_text': "Have you assessed your farm's readiness for recognised food safety or quality "
                   'standards (e.g., GAP, organic, export, buyer-specific standards)?',
  'quick_win': 'Complete a simple certification readiness checklist with an advisor or extension '
               'officer.',
  'support_available': ['Certification Bodies', 'Future Farms Advisory', 'FAAB Programme'],
  'why_it_matters': 'Certification readiness improves market access, increases buyer confidence, '
                    'and supports business growth.'},
 {'capability_id': 'P3.5',
  'ffv_evidence_required': 'Farm improvement plan; business plan; food safety action plan; '
                           'strategic roadmap.',
  'id': 'P3.5.5',
  'if_no_recommendation': 'Develop a structured improvement plan with clear goals, '
                          'responsibilities, timelines, and milestones for strengthening food '
                          'safety and quality.',
  'pillar_id': 3,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': "Do you have a documented improvement plan to strengthen your farm's food "
                   'safety, quality, and compliance systems over the next three years?',
  'quick_win': 'Develop a three-year food safety and quality improvement roadmap with annual '
               'targets.',
  'support_available': ['Future Farms Advisory', 'Business Advisors', 'Extension Services'],
  'why_it_matters': 'Long-term planning ensures systematic improvement rather than reactive '
                    'problem-solving.'},
 {'capability_id': 'P4.1',
  'ffv_evidence_required': 'Farmer interview demonstrating understanding; examples of locally '
                           'relevant practices.',
  'id': 'P4.1.1',
  'if_no_recommendation': 'Learn how indigenous and local knowledge can contribute to soil health, '
                          'biodiversity, production and climate adaptation.',
  'pillar_id': 4,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you understand the value of indigenous and local knowledge in farming and '
                   'climate resilience?',
  'quick_win': 'Identify three locally used practices that help farmers cope with environmental '
               'challenges.',
  'support_available': ['Community Elders', 'Extension Officers', 'FAAB Programme'],
  'why_it_matters': 'Local knowledge often reflects generations of experience with local '
                    'environmental conditions.'},
 {'capability_id': 'P4.1',
  'ffv_evidence_required': 'Farmer provides examples; observation or documentation of relevant '
                           'practices.',
  'id': 'P4.1.2',
  'if_no_recommendation': 'Identify traditional and locally developed practices that may address '
                          'current farm challenges.',
  'pillar_id': 4,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Can you identify indigenous or locally developed farming practices that are '
                   'relevant to your farm?',
  'quick_win': 'List at least three practices used in your locality.',
  'support_available': ['Farmer Groups', 'Community Knowledge Holders', 'Extension Services'],
  'why_it_matters': 'Locally adapted practices may provide practical and affordable resilience '
                    'options.'},
 {'capability_id': 'P4.1',
  'ffv_evidence_required': 'Interviews, participation records, mentorship evidence or farmer '
                           'testimony.',
  'id': 'P4.1.3',
  'if_no_recommendation': 'Establish relationships with experienced farmers and local knowledge '
                          'holders.',
  'pillar_id': 4,
  'priority': 'quick_win',
  'question_number': 3,
  'question_text': 'Do you actively learn from experienced farmers, elders or other local '
                   'knowledge holders?',
  'quick_win': 'Interview one experienced farmer or elder about farming practices that have '
               'changed over time.',
  'support_available': ['Farmer Groups', 'Community Leaders', 'Community Knowledge Holders'],
  'why_it_matters': 'Knowledge transfer helps preserve valuable experience and supports '
                    'intergenerational learning.'},
 {'capability_id': 'P4.1',
  'ffv_evidence_required': 'Farmer interview; examples of integrated approaches.',
  'id': 'P4.1.4',
  'if_no_recommendation': 'Explore how local knowledge and scientific evidence can complement one '
                          'another.',
  'pillar_id': 4,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you recognise that indigenous knowledge can complement scientific knowledge '
                   'and modern agricultural technologies?',
  'quick_win': 'Identify one traditional practice that could be improved using modern knowledge or '
               'technology.',
  'support_available': ['Future Farms Advisory', 'Universities', 'Research Institutions'],
  'why_it_matters': 'Combining different knowledge systems can produce locally appropriate '
                    'solutions.'},
 {'capability_id': 'P4.1',
  'ffv_evidence_required': 'Training records, community participation, farmer learning records or '
                           'interview.',
  'id': 'P4.1.5',
  'if_no_recommendation': 'Develop a continuous learning habit around local knowledge, climate and '
                          'farm resilience.',
  'pillar_id': 4,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you actively seek new knowledge about local farming practices, climate '
                   'adaptation and changing environmental conditions?',
  'quick_win': 'Attend one farmer learning or community knowledge-sharing activity.',
  'support_available': ['Future Farms Academy', 'FAAB Programme', 'Farmer Organizations'],
  'why_it_matters': 'Future-ready farmers need to combine existing knowledge with new '
                    'information.'},
 {'capability_id': 'P4.2',
  'ffv_evidence_required': 'Farmer interview; documented risk list; farm risk assessment.',
  'id': 'P4.2.1',
  'if_no_recommendation': 'Identify key risks such as drought, floods, heat, changing rainfall, '
                          'strong winds, pests and disease pressures.',
  'pillar_id': 4,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Can you identify the main climate-related risks affecting your farm?',
  'quick_win': 'List your five most significant climate risks.',
  'support_available': ['Extension Officers', 'Climate Advisors', 'FAAB Programme'],
  'why_it_matters': 'Understanding risks is the first step towards effective adaptation.'},
 {'capability_id': 'P4.2',
  'ffv_evidence_required': 'Climate-risk assessment; farm records; risk map or farmer interview.',
  'id': 'P4.2.2',
  'if_no_recommendation': 'Conduct a basic farm climate-risk assessment across production, '
                          'resources and infrastructure.',
  'pillar_id': 4,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you assess how climate risks could affect your crops, livestock, water, '
                   'soil and farm infrastructure?',
  'quick_win': 'Create a simple map showing areas most vulnerable to climate risks.',
  'support_available': ['Future Farms Advisory', 'Extension Services'],
  'why_it_matters': 'Different parts of the farm may be affected differently by climate hazards.'},
 {'capability_id': 'P4.2',
  'ffv_evidence_required': 'Weather records, weather application, advisories, farm logs or digital '
                           'tools.',
  'id': 'P4.2.3',
  'if_no_recommendation': 'Begin using reliable weather and climate information to inform '
                          'production decisions.',
  'pillar_id': 4,
  'priority': 'quick_win',
  'question_number': 3,
  'question_text': 'Do you monitor weather or climate information that can support farm decisions?',
  'quick_win': 'Start recording rainfall and major weather events on the farm.',
  'support_available': ['Weather Services', 'Extension Officers', 'Digital Agriculture Providers'],
  'why_it_matters': 'Timely information can improve planting, irrigation, pest management and '
                    'harvesting decisions.'},
 {'capability_id': 'P4.2',
  'ffv_evidence_required': 'Farm plans, investment decisions, production plans or farmer '
                           'interview.',
  'id': 'P4.2.4',
  'if_no_recommendation': 'Include climate risk in production, infrastructure and investment '
                          'planning.',
  'pillar_id': 4,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you consider climate risks when making major farm production or investment '
                   'decisions?',
  'quick_win': 'Review one planned farm investment through a climate-risk lens.',
  'support_available': ['Future Farms Advisory', 'Climate Advisors'],
  'why_it_matters': 'Investments that ignore future climate conditions may become costly or '
                    'unsuitable.'},
 {'capability_id': 'P4.2',
  'ffv_evidence_required': 'Updated risk assessments, farm records, management reviews or '
                           'adaptation plans.',
  'id': 'P4.2.5',
  'if_no_recommendation': 'Review climate risks periodically and update your farm response '
                          'accordingly.',
  'pillar_id': 4,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you periodically review how climate risks affecting your farm are changing?',
  'quick_win': 'Review your climate-risk list at least once each season.',
  'support_available': ['Future Farms Advisory', 'FAAB Programme', 'Climate Services'],
  'why_it_matters': 'Climate conditions and exposure can change over time.'},
 {'capability_id': 'P4.3',
  'ffv_evidence_required': 'Farm observation; production records; farmer interview.',
  'id': 'P4.3.1',
  'if_no_recommendation': 'Identify climate-smart practices appropriate to your production system '
                          'and local conditions.',
  'pillar_id': 4,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you use climate-smart practices appropriate to your crops, livestock or '
                   'farming system?',
  'quick_win': 'Select one climate-smart practice to introduce during the next production cycle.',
  'support_available': ['FAAB Programme',
                        'Extension Officers',
                        'Climate-Smart Agriculture Advisors'],
  'why_it_matters': 'Climate-smart practices help farms manage environmental risks while '
                    'maintaining productivity.'},
 {'capability_id': 'P4.3',
  'ffv_evidence_required': 'Observation of mulching, composting, cover crops, reduced tillage, '
                           'erosion control, soil testing, etc.',
  'id': 'P4.3.2',
  'if_no_recommendation': 'Introduce practices that protect soil structure, fertility and '
                          'biological activity.',
  'pillar_id': 4,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you use soil-management practices that improve soil health and resilience?',
  'quick_win': 'Start one soil-health practice such as mulching or compost application.',
  'support_available': ['Extension Officers', 'Soil Specialists', 'Farmer Organizations'],
  'why_it_matters': 'Healthy soils improve water retention, productivity and resilience to climate '
                    'stress.'},
 {'capability_id': 'P4.3',
  'ffv_evidence_required': 'Production plans, planting dates, variety choices, irrigation '
                           'schedules or farmer interview.',
  'id': 'P4.3.3',
  'if_no_recommendation': 'Adapt production calendars, varieties and management practices to '
                          'changing conditions.',
  'pillar_id': 4,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you adjust your production practices in response to changing weather or '
                   'climate conditions?',
  'quick_win': 'Review your planting or production calendar against recent weather patterns.',
  'support_available': ['Extension Services', 'Climate Advisors', 'Research Institutions'],
  'why_it_matters': 'Flexible production systems are better able to cope with climate '
                    'variability.'},
 {'capability_id': 'P4.3',
  'ffv_evidence_required': 'Irrigation systems, water-harvesting infrastructure, water records, '
                           'observation.',
  'id': 'P4.3.4',
  'if_no_recommendation': 'Improve water harvesting, storage, irrigation efficiency and water '
                          'management.',
  'pillar_id': 4,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you use practices that improve the efficiency and resilience of water use?',
  'quick_win': 'Identify one way to reduce unnecessary water loss.',
  'support_available': ['Water Specialists', 'Irrigation Providers', 'Future Farms Advisory'],
  'why_it_matters': 'Water availability is a major determinant of farm resilience.'},
 {'capability_id': 'P4.3',
  'ffv_evidence_required': 'Production records, comparison data, demonstration plots or '
                           'improvement plans.',
  'id': 'P4.3.5',
  'if_no_recommendation': 'Monitor the productivity, financial and resilience outcomes of '
                          'climate-smart practices.',
  'pillar_id': 4,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you evaluate whether climate-smart practices are improving farm '
                   'performance?',
  'quick_win': 'Compare one climate-smart practice with your previous approach.',
  'support_available': ['Future Farms Advisory', 'FAAB Programme', 'Extension Services'],
  'why_it_matters': 'Farmers need evidence to determine which practices are worth continuing or '
                    'scaling.'},
 {'capability_id': 'P4.4',
  'ffv_evidence_required': 'Soil-management practices, soil tests, composting, mulching, cover '
                           'crops or erosion-control measures.',
  'id': 'P4.4.1',
  'if_no_recommendation': 'Develop a soil-health management approach appropriate to the farm.',
  'pillar_id': 4,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you actively protect and maintain soil health on your farm?',
  'quick_win': 'Identify one area where soil degradation is occurring and introduce a protective '
               'practice.',
  'support_available': ['Soil Specialists', 'Extension Officers', 'FAAB Programme'],
  'why_it_matters': 'Soil is a foundational productive asset and requires long-term stewardship.'},
 {'capability_id': 'P4.4',
  'ffv_evidence_required': 'Water-management records, harvesting systems, irrigation practices or '
                           'observation.',
  'id': 'P4.4.2',
  'if_no_recommendation': 'Introduce water conservation, harvesting, storage or efficient '
                          'irrigation practices.',
  'pillar_id': 4,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you conserve water and manage water resources responsibly?',
  'quick_win': 'Identify and fix one source of water loss.',
  'support_available': ['Irrigation Providers', 'Water Specialists', 'Future Farms Advisory'],
  'why_it_matters': 'Efficient water management reduces vulnerability to drought and water '
                    'shortages.'},
 {'capability_id': 'P4.4',
  'ffv_evidence_required': 'Agroforestry, habitat areas, biodiversity records, integrated pest '
                           'management or observation.',
  'id': 'P4.4.3',
  'if_no_recommendation': 'Introduce practices that protect beneficial organisms, vegetation and '
                          'biodiversity.',
  'pillar_id': 4,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you protect biodiversity and beneficial organisms on or around your farm?',
  'quick_win': 'Identify one area where biodiversity could be improved.',
  'support_available': ['Environmental Organizations',
                        'Extension Services',
                        'Research Institutions'],
  'why_it_matters': 'Biodiversity supports pollination, pest regulation, soil health and ecosystem '
                    'stability.'},
 {'capability_id': 'P4.4',
  'ffv_evidence_required': 'Erosion-control structures, vegetation cover, contouring, terraces, '
                           'buffers or farm observations.',
  'id': 'P4.4.4',
  'if_no_recommendation': 'Introduce appropriate land and soil conservation measures.',
  'pillar_id': 4,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you use practices that reduce soil erosion, land degradation or ecosystem '
                   'damage?',
  'quick_win': 'Identify the most erosion-prone area of the farm and implement one protective '
               'measure.',
  'support_available': ['Conservation Organizations', 'Extension Officers'],
  'why_it_matters': "Preventing degradation protects the farm's productive capacity over the long "
                    'term.'},
 {'capability_id': 'P4.4',
  'ffv_evidence_required': 'Resource monitoring records, environmental indicators, farm plans or '
                           'farmer interview.',
  'id': 'P4.4.5',
  'if_no_recommendation': 'Establish simple indicators for monitoring soil, water, biodiversity '
                          'and ecosystem condition.',
  'pillar_id': 4,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': "Do you regularly assess whether your farm's natural resources and ecosystem "
                   'are becoming more or less resilient?',
  'quick_win': 'Select three natural-resource indicators to monitor each season.',
  'support_available': ['Future Farms Advisory', 'Environmental Advisors', 'Research Institutions'],
  'why_it_matters': 'What is not monitored is difficult to manage or improve.'},
 {'capability_id': 'P4.5',
  'ffv_evidence_required': 'Farm records, production plans, examples of changed practices or '
                           'farmer interview.',
  'id': 'P4.5.1',
  'if_no_recommendation': 'Establish a process for reviewing and adjusting farm practices when '
                          'conditions change.',
  'pillar_id': 4,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you adapt your farming practices when environmental or climate conditions '
                   'change?',
  'quick_win': 'Identify one practice that needs to change because of current conditions.',
  'support_available': ['Climate Advisors', 'Extension Officers', 'Future Farms Advisory'],
  'why_it_matters': 'Adaptation is essential when historical farming practices are no longer '
                    'sufficient.'},
 {'capability_id': 'P4.5',
  'ffv_evidence_required': 'Demonstration plots, trials, innovation records or comparison data.',
  'id': 'P4.5.2',
  'if_no_recommendation': 'Use small-scale trials to test new practices before full adoption.',
  'pillar_id': 4,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you experiment with new practices before adopting them widely across the '
                   'farm?',
  'quick_win': 'Establish one small demonstration or trial plot.',
  'support_available': ['Research Institutions',
                        'Future Farms Innovation Hub',
                        'Extension Services'],
  'why_it_matters': 'Controlled experimentation reduces risk and helps farmers learn what works '
                    'locally.'},
 {'capability_id': 'P4.5',
  'ffv_evidence_required': 'Examples of integrated practices; farmer interview; trial records.',
  'id': 'P4.5.3',
  'if_no_recommendation': 'Deliberately combine different knowledge sources when solving farm '
                          'challenges.',
  'pillar_id': 4,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you combine indigenous knowledge, scientific evidence and new technologies '
                   'when developing farm solutions?',
  'quick_win': 'Select one farm challenge and identify one traditional, one scientific and one '
               'technological solution.',
  'support_available': ['Future Farms Advisory', 'Universities', 'Research Institutions'],
  'why_it_matters': 'Multiple knowledge sources can produce practical, locally appropriate '
                    'innovations.'},
 {'capability_id': 'P4.5',
  'ffv_evidence_required': 'Trial records, farm journals, photos, production comparisons or '
                           'digital records.',
  'id': 'P4.5.4',
  'if_no_recommendation': 'Establish a simple system for recording what was tested, what happened '
                          'and what was learned.',
  'pillar_id': 4,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you document and learn from the results of your farm experiments and '
                   'adaptations?',
  'quick_win': 'Start a farm innovation log using a notebook or phone.',
  'support_available': ['Future Farms Digital Platform', 'FAAB Programme', 'Extension Services'],
  'why_it_matters': 'Documentation turns individual experience into reusable farm knowledge.'},
 {'capability_id': 'P4.5',
  'ffv_evidence_required': 'Farm strategic plan, climate-resilience plan, innovation roadmap or '
                           'investment plan.',
  'id': 'P4.5.5',
  'if_no_recommendation': 'Develop a long-term climate resilience and farm-improvement roadmap.',
  'pillar_id': 4,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you have a long-term plan for strengthening climate resilience and '
                   'continuously improving your farm?',
  'quick_win': "Add at least three climate-resilience goals to your farm's 3–5 year plan.",
  'support_available': ['Future Farms Advisory', 'FAAB Programme', 'Business Advisors'],
  'why_it_matters': 'Resilience requires continuous investment, learning and adaptation rather '
                    'than one-time action.'},
 {'capability_id': 'P5.1',
  'ffv_evidence_required': 'Farmer interview; financial training records; ability to explain basic '
                           'financial concepts.',
  'id': 'P5.1.1',
  'if_no_recommendation': 'Build basic financial literacy to understand how money moves through '
                          'the farm business.',
  'pillar_id': 5,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you understand basic financial concepts such as income, expenses, profit, '
                   'assets, liabilities and cash flow as they relate to your farm?',
  'quick_win': "Identify your farm's main income, expenses, assets and liabilities.",
  'support_available': ['FAAB Financial Literacy Module', 'Business Advisors'],
  'why_it_matters': 'Financial literacy enables farmers to understand business performance and '
                    'make better decisions.'},
 {'capability_id': 'P5.1',
  'ffv_evidence_required': 'Cashbook, notebook, spreadsheet, bookkeeping application, receipts or '
                           'transaction records.',
  'id': 'P5.1.2',
  'if_no_recommendation': 'Establish a simple system for recording every farm transaction.',
  'pillar_id': 5,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you consistently record all farm income and expenses?',
  'quick_win': 'Start recording every farm transaction from today.',
  'support_available': ['FAAB Programme', 'Record-Keeping Toolkit', 'Future Farms Advisory'],
  'why_it_matters': 'Complete records provide the foundation for budgeting, profitability analysis '
                    'and financial planning.'},
 {'capability_id': 'P5.1',
  'ffv_evidence_required': 'Production records, sales records, input records, stock/inventory '
                           'records or digital farm records.',
  'id': 'P5.1.3',
  'if_no_recommendation': 'Maintain both financial and operational records for major farm '
                          'activities.',
  'pillar_id': 5,
  'priority': 'quick_win',
  'question_number': 3,
  'question_text': 'Do you keep production, sales, input, inventory and other important farm '
                   'business records?',
  'quick_win': 'Create simple records for production, sales, inputs and inventory.',
  'support_available': ['FAAB Programme', 'Farm Record-Keeping Toolkit'],
  'why_it_matters': 'Financial results are easier to understand when connected to what happened '
                    'operationally on the farm.'},
 {'capability_id': 'P5.1',
  'ffv_evidence_required': 'Separate accounts, cashbooks, mobile-money records, bank statements or '
                           'bookkeeping records.',
  'id': 'P5.1.4',
  'if_no_recommendation': 'Maintain separate farm and personal financial records and, where '
                          'practical, separate financial accounts.',
  'pillar_id': 5,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you separate your farm business finances from your personal or household '
                   'finances?',
  'quick_win': 'Create separate farm and household transaction records.',
  'support_available': ['Financial Institutions', 'Business Advisors', 'FAAB Programme'],
  'why_it_matters': 'Separation provides a more accurate picture of farm performance and reduces '
                    'misuse of business funds.'},
 {'capability_id': 'P5.1',
  'ffv_evidence_required': 'Monthly/quarterly record reviews, reconciliations, filing system, '
                           'digital records or financial summaries.',
  'id': 'P5.1.5',
  'if_no_recommendation': 'Establish a regular process for checking, organising and updating farm '
                          'records.',
  'pillar_id': 5,
  'priority': 'medium_term',
  'question_number': 5,
  'question_text': 'Do you regularly organise and review your farm records to ensure they are '
                   'complete and accurate?',
  'quick_win': 'Set one day every month for reviewing your farm records.',
  'support_available': ['Future Farms Advisory', 'Accountants', 'FAAB Programme'],
  'why_it_matters': 'Reliable records are essential for decision-making, finance applications and '
                    'business growth.'},
 {'capability_id': 'P5.2',
  'ffv_evidence_required': 'Enterprise budgets, cost records, production records or cost '
                           'calculations.',
  'id': 'P5.2.1',
  'if_no_recommendation': 'Calculate direct and relevant indirect costs for each major farm '
                          'enterprise.',
  'pillar_id': 5,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you know the total cost of producing each major crop, livestock product or '
                   'other farm enterprise?',
  'quick_win': 'Calculate the total cost of your main enterprise for the last production cycle.',
  'support_available': ['FAAB Business Skills Module', 'Business Advisors'],
  'why_it_matters': 'Knowing production costs is essential for pricing, profitability and '
                    'investment decisions.'},
 {'capability_id': 'P5.2',
  'ffv_evidence_required': 'Sales records, enterprise revenue summaries, invoices or receipts.',
  'id': 'P5.2.2',
  'if_no_recommendation': 'Track revenue separately for each major enterprise or product.',
  'pillar_id': 5,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you know how much revenue each major farm enterprise generates?',
  'quick_win': 'Calculate total sales from your main enterprise during the last cycle.',
  'support_available': ['FAAB Programme', 'Future Farms Advisory'],
  'why_it_matters': "Revenue analysis shows which activities generate the farm's income."},
 {'capability_id': 'P5.2',
  'ffv_evidence_required': 'Gross-margin calculations, profit-and-loss records, enterprise budgets '
                           'or financial summaries.',
  'id': 'P5.2.3',
  'if_no_recommendation': 'Compare enterprise revenue against costs to determine profitability.',
  'pillar_id': 5,
  'priority': 'quick_win',
  'question_number': 3,
  'question_text': 'Do you calculate the profit or gross margin of your major farm enterprises?',
  'quick_win': 'Calculate the gross margin of one enterprise.',
  'support_available': ['FAAB Financial Training', 'Business Advisors'],
  'why_it_matters': 'Sales alone do not indicate whether a farm is making money.'},
 {'capability_id': 'P5.2',
  'ffv_evidence_required': 'Pricing calculations, production plans, enterprise comparisons, '
                           'investment decisions or farmer interview.',
  'id': 'P5.2.4',
  'if_no_recommendation': 'Use financial information when deciding what to produce, how much to '
                          'produce, what price to accept and where to invest.',
  'pillar_id': 5,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you use cost and profitability information when making production, pricing '
                   'or investment decisions?',
  'quick_win': 'Review the profitability of your main enterprise before the next production cycle.',
  'support_available': ['Future Farms Advisory', 'FAAB Programme'],
  'why_it_matters': 'Financial data should influence actual business decisions rather than simply '
                    'being recorded.'},
 {'capability_id': 'P5.2',
  'ffv_evidence_required': 'Financial reviews, cost-reduction plans, pricing changes, '
                           'revenue-growth plans or margin trends.',
  'id': 'P5.2.5',
  'if_no_recommendation': 'Regularly analyse the drivers of profitability and implement targeted '
                          'improvements.',
  'pillar_id': 5,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you regularly identify opportunities to reduce costs, increase revenue or '
                   'improve profit margins without compromising quality or sustainability?',
  'quick_win': 'Identify one cost to optimise and one opportunity to increase revenue this season.',
  'support_available': ['Business Advisors', 'Future Farms Advisory', 'FAAB Programme'],
  'why_it_matters': 'Active margin management strengthens competitiveness and long-term business '
                    'viability.'},
 {'capability_id': 'P5.3',
  'ffv_evidence_required': 'Production records, harvest records, livestock records, '
                           'farm-management system or reports.',
  'id': 'P5.3.1',
  'if_no_recommendation': 'Identify and consistently record the most important productivity '
                          'indicators for your farm.',
  'pillar_id': 5,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you track key production indicators such as yield, output, mortality, feed '
                   'conversion, productivity per animal or other measures relevant to your '
                   'enterprise?',
  'quick_win': 'Select three productivity indicators for your main enterprise.',
  'support_available': ['Extension Services', 'FAAB Programme', 'Future Farms Advisory'],
  'why_it_matters': 'Productivity measurement shows how effectively farm resources are being '
                    'converted into output.'},
 {'capability_id': 'P5.3',
  'ffv_evidence_required': 'KPI records, financial summaries, dashboards, sales reports or '
                           'enterprise records.',
  'id': 'P5.3.2',
  'if_no_recommendation': 'Develop a simple farm performance scorecard combining financial and '
                          'operational indicators.',
  'pillar_id': 5,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you track business performance indicators such as cost per unit, revenue, '
                   'sales volume, margins or losses?',
  'quick_win': 'Select five farm KPIs and begin reviewing them monthly.',
  'support_available': ['Future Farms Advisory', 'FAAB Programme'],
  'why_it_matters': 'A balanced view of performance enables better business decisions.'},
 {'capability_id': 'P5.3',
  'ffv_evidence_required': 'Historical records, target-versus-actual reports, benchmarking records '
                           'or dashboards.',
  'id': 'P5.3.3',
  'if_no_recommendation': 'Regularly compare performance against previous results and '
                          'predetermined targets.',
  'pillar_id': 5,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you compare actual farm performance against previous seasons, targets or '
                   'relevant benchmarks?',
  'quick_win': 'Compare your current yield, cost and sales with your previous production cycle.',
  'support_available': ['Extension Officers', 'Business Advisors', 'Future Farms Advisory'],
  'why_it_matters': 'Comparison helps identify improvement, decline and performance gaps.'},
 {'capability_id': 'P5.3',
  'ffv_evidence_required': 'Improvement plans, operational changes, performance reviews or '
                           'production records.',
  'id': 'P5.3.4',
  'if_no_recommendation': 'Analyse performance data to identify bottlenecks, waste, losses and '
                          'underperforming activities.',
  'pillar_id': 5,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you use performance information to identify and address inefficiencies in '
                   'your farm operations?',
  'quick_win': "Identify your farm's biggest current performance gap and one corrective action.",
  'support_available': ['Farm Management Specialists', 'Future Farms Advisory'],
  'why_it_matters': 'Measurement only creates value when it leads to action.'},
 {'capability_id': 'P5.3',
  'ffv_evidence_required': 'KPI dashboard, farm targets, performance reviews, management reports '
                           'or annual plans.',
  'id': 'P5.3.5',
  'if_no_recommendation': 'Establish measurable productivity and business-performance targets and '
                          'review them regularly.',
  'pillar_id': 5,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you set measurable performance targets and regularly review progress '
                   'towards them?',
  'quick_win': 'Set three measurable performance targets for the next production cycle.',
  'support_available': ['FAAB Programme', 'Business Coaches', 'Future Farms Advisory'],
  'why_it_matters': 'Targets create accountability and enable continuous performance improvement.'},
 {'capability_id': 'P5.4',
  'ffv_evidence_required': 'Enterprise budgets, annual budgets, investment budgets or farm plans.',
  'id': 'P5.4.1',
  'if_no_recommendation': 'Prepare expected income and expenditure before committing resources.',
  'pillar_id': 5,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you prepare budgets before major production cycles or farm investments?',
  'quick_win': 'Prepare a simple budget for your next production cycle.',
  'support_available': ['FAAB Programme', 'Financial Advisors'],
  'why_it_matters': 'Budgeting helps ensure that available resources are allocated appropriately.'},
 {'capability_id': 'P5.4',
  'ffv_evidence_required': 'Cash-flow statement, monthly cash forecast, payment schedule or '
                           'financial plan.',
  'id': 'P5.4.2',
  'if_no_recommendation': 'Develop a cash-flow forecast covering expected inflows and outflows.',
  'pillar_id': 5,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you prepare or monitor cash-flow projections showing when money is expected '
                   'to enter and leave the farm business?',
  'quick_win': 'Prepare a three-month cash-flow forecast.',
  'support_available': ['FAAB Financial Management Module', 'Business Advisors'],
  'why_it_matters': 'A profitable farm can still fail if it does not have cash when payments are '
                    'due.'},
 {'capability_id': 'P5.4',
  'ffv_evidence_required': 'Cash reserves, working-capital plan, seasonal budget, credit '
                           'arrangements or contingency fund.',
  'id': 'P5.4.3',
  'if_no_recommendation': 'Identify seasonal financing gaps and establish appropriate ways of '
                          'managing them.',
  'pillar_id': 5,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you plan for periods when farm expenses are high but income is low or '
                   'delayed?',
  'quick_win': 'Identify the months when your farm is most likely to experience a cash shortage.',
  'support_available': ['Financial Institutions', 'Business Advisors', 'Future Farms Advisory'],
  'why_it_matters': 'Farming often has long gaps between spending money and receiving income.'},
 {'capability_id': 'P5.4',
  'ffv_evidence_required': 'Risk register, risk assessment, insurance, diversification measures, '
                           'contingency plans or farmer interview.',
  'id': 'P5.4.4',
  'if_no_recommendation': 'Identify major business risks and establish practical mitigation '
                          'measures.',
  'pillar_id': 5,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you identify and manage major financial, production, market and operational '
                   'risks affecting your farm business?',
  'quick_win': 'List your five biggest business risks and one response for each.',
  'support_available': ['Insurance Providers', 'Extension Services', 'Future Farms Advisory'],
  'why_it_matters': 'Proactive risk management reduces the financial impact of unexpected events.'},
 {'capability_id': 'P5.4',
  'ffv_evidence_required': 'Emergency fund, insurance policy, contingency budget, backup '
                           'supplier/buyer arrangements or business-continuity plan.',
  'id': 'P5.4.5',
  'if_no_recommendation': 'Develop a financial and operational contingency strategy appropriate to '
                          "the farm's major risks.",
  'pillar_id': 5,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you have financial reserves, insurance, contingency arrangements or other '
                   'measures to help the business recover from unexpected disruptions?',
  'quick_win': 'Start building a farm emergency reserve or develop a one-page contingency plan.',
  'support_available': ['Financial Institutions', 'Insurance Providers', 'FAAB Programme'],
  'why_it_matters': "Resilience depends on the farm's ability to absorb shocks and continue "
                    'operating.'},
 {'capability_id': 'P5.5',
  'ffv_evidence_required': 'Growth plan, strategic plan, business plan, targets or farmer '
                           'interview.',
  'id': 'P5.5.1',
  'if_no_recommendation': 'Define measurable growth objectives covering production, revenue, '
                          'profitability, markets or enterprise development.',
  'pillar_id': 5,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you have clear and documented business growth goals for your farm over the '
                   'next 1–3 years?',
  'quick_win': 'Write three measurable business-growth goals.',
  'support_available': ['FAAB Business Planning Module', 'Future Farms Advisory'],
  'why_it_matters': 'Clear goals provide direction and enable resources to be prioritised.'},
 {'capability_id': 'P5.5',
  'ffv_evidence_required': 'Opportunity assessments, new enterprise plans, value-addition '
                           'initiatives, market research or investment plans.',
  'id': 'P5.5.2',
  'if_no_recommendation': 'Periodically assess opportunities for productivity improvements, '
                          'diversification, value addition and expansion.',
  'pillar_id': 5,
  'priority': 'medium_term',
  'question_number': 2,
  'question_text': 'Do you regularly identify opportunities to improve, diversify or expand your '
                   'farm business?',
  'quick_win': 'Identify three potential growth opportunities and rank them.',
  'support_available': ['Future Farms Advisory',
                        'Extension Services',
                        'Enterprise Development Partners'],
  'why_it_matters': 'Growth opportunities change as markets, technologies and farm capabilities '
                    'evolve.'},
 {'capability_id': 'P5.5',
  'ffv_evidence_required': 'Capacity assessment, workforce records, equipment inventory, financial '
                           'projections, market analysis or operational plans.',
  'id': 'P5.5.3',
  'if_no_recommendation': 'Conduct a scalability assessment before major expansion.',
  'pillar_id': 5,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Have you assessed whether your people, processes, infrastructure, technology, '
                   'markets and finances can support business growth?',
  'quick_win': 'Identify the three biggest constraints that would prevent you from doubling your '
               'business.',
  'support_available': ['Future Farms Advisory', 'Technical Experts', 'Business Advisors'],
  'why_it_matters': "Expanding faster than the farm's systems can support can reduce quality, "
                    'efficiency and profitability.'},
 {'capability_id': 'P5.5',
  'ffv_evidence_required': 'Production trends, unit costs, margins, quality records, operational '
                           'systems or scaling plans.',
  'id': 'P5.5.4',
  'if_no_recommendation': 'Strengthen systems and address bottlenecks before expanding '
                          'significantly.',
  'pillar_id': 5,
  'priority': 'strategic',
  'question_number': 4,
  'question_text': 'Can your farm increase production or revenue without significantly reducing '
                   'efficiency, profitability, quality or sustainability?',
  'quick_win': 'Identify one operational bottleneck that must be solved before expansion.',
  'support_available': ['Business Advisors', 'Future Farms Advisory', 'FAAB Programme'],
  'why_it_matters': 'True scalability means growing while maintaining or improving performance.'},
 {'capability_id': 'P5.5',
  'ffv_evidence_required': 'Strategic reviews, updated plans, improvement records, performance '
                           'dashboards or investment decisions.',
  'id': 'P5.5.5',
  'if_no_recommendation': 'Establish a structured cycle of reviewing performance, learning and '
                          'updating the business strategy.',
  'pillar_id': 5,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': "Do you regularly review your farm's strategy and performance and make "
                   'improvements based on results, new opportunities and changing conditions?',
  'quick_win': 'Schedule a quarterly business-performance and strategy review.',
  'support_available': ['Future Farms Advisory', 'Business Coaches', 'FAAB Programme'],
  'why_it_matters': 'Continuous improvement prevents growth from becoming a one-time exercise and '
                    'keeps the enterprise competitive.'},
 {'capability_id': 'P6.1',
  'ffv_evidence_required': 'Farmer interview; discussion demonstrating understanding of workforce '
                           'importance.',
  'id': 'P6.1.1',
  'if_no_recommendation': "Recognise people as one of your farm's most valuable assets and include "
                          'workforce development in your business planning.',
  'pillar_id': 6,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': "Do you recognise that your farm's success depends on having skilled, "
                   'motivated, and well-managed people?',
  'quick_win': "Identify the key roles that contribute most to your farm's success.",
  'support_available': ['FAAB Programme', 'Future Farms Advisory'],
  'why_it_matters': 'Skilled and motivated people improve productivity, quality, innovation, and '
                    'business resilience.'},
 {'capability_id': 'P6.1',
  'ffv_evidence_required': 'Skills assessment; job descriptions; farmer interview.',
  'id': 'P6.1.2',
  'if_no_recommendation': 'Identify the technical, business, digital, and leadership skills '
                          "required for your farm's future growth.",
  'pillar_id': 6,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you understand the skills required to operate your current and future '
                   'farming enterprise successfully?',
  'quick_win': "List the five most important skills needed to achieve your farm's goals.",
  'support_available': ['Extension Services', 'Technical Training Providers'],
  'why_it_matters': 'Understanding skill requirements helps close workforce gaps before they '
                    'affect performance.'},
 {'capability_id': 'P6.1',
  'ffv_evidence_required': 'Skills matrix; training needs assessment; farmer interview.',
  'id': 'P6.1.3',
  'if_no_recommendation': 'Conduct periodic assessments to identify strengths and development '
                          'needs across your workforce.',
  'pillar_id': 6,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you regularly assess the strengths and skill gaps of yourself and your '
                   'workers?',
  'quick_win': 'Complete a simple skills assessment for yourself and your team.',
  'support_available': ['Future Farms Academy', 'FAAB Programme'],
  'why_it_matters': 'Identifying skill gaps enables targeted training and continuous improvement.'},
 {'capability_id': 'P6.1',
  'ffv_evidence_required': 'Observation of workplace; farmer interview; workplace policies; safety '
                           'practices.',
  'id': 'P6.1.4',
  'if_no_recommendation': 'Learn about your responsibilities for worker safety, fair treatment, '
                          'inclusion, and wellbeing.',
  'pillar_id': 6,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you understand your responsibilities for providing a safe, respectful, and '
                   'inclusive working environment?',
  'quick_win': 'Discuss workplace expectations and safety practices with everyone working on the '
               'farm.',
  'support_available': ['Occupational Safety Officers', 'Extension Services'],
  'why_it_matters': 'A positive work environment improves productivity, staff retention, and '
                    'business reputation.'},
 {'capability_id': 'P6.1',
  'ffv_evidence_required': 'Training participation; leadership development activities; farmer '
                           'interview.',
  'id': 'P6.1.5',
  'if_no_recommendation': 'Commit to continuous personal and workforce development to prepare for '
                          'future farming challenges.',
  'pillar_id': 6,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you view continuous learning and leadership development as essential for '
                   "your farm's long-term success?",
  'quick_win': 'Create a personal learning goal and one training objective for your team this '
               'year.',
  'support_available': ['Future Farms Institute', 'FAAB Programme', 'Business Mentors'],
  'why_it_matters': 'Learning and leadership drive innovation, adaptability, and long-term '
                    'competitiveness.'},
 {'capability_id': 'P6.2',
  'ffv_evidence_required': 'Workforce plan; staffing assessment; organisational chart; farmer '
                           'interview.',
  'id': 'P6.2.1',
  'if_no_recommendation': 'Assess your current workforce and identify the skills and positions '
                          "required to meet your farm's objectives.",
  'pillar_id': 6,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Have you identified the people and skills your farm needs to achieve its '
                   'current and future goals?',
  'quick_win': 'List all current farm roles and identify any critical skill or staffing gaps.',
  'support_available': ['FAAB Programme', 'Future Farms Advisory', 'Business Advisors'],
  'why_it_matters': 'Workforce planning ensures the farm has the right people to support growth '
                    'and operational efficiency.'},
 {'capability_id': 'P6.2',
  'ffv_evidence_required': 'Job descriptions; work schedules; interviews with workers; '
                           'observation.',
  'id': 'P6.2.2',
  'if_no_recommendation': 'Develop clear job descriptions and communicate responsibilities to '
                          'everyone working on the farm.',
  'pillar_id': 6,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do all workers have clearly defined roles and responsibilities?',
  'quick_win': 'Write a simple description of responsibilities for each worker or family member '
               'involved in the farm.',
  'support_available': ['Extension Services', 'Human Resource Advisors'],
  'why_it_matters': 'Role clarity improves accountability, productivity, and teamwork.'},
 {'capability_id': 'P6.2',
  'ffv_evidence_required': 'Recruitment records; interview process; employment records; farmer '
                           'interview.',
  'id': 'P6.2.3',
  'if_no_recommendation': 'Use objective selection criteria when recruiting workers to ensure they '
                          'match the needs of the business.',
  'pillar_id': 6,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you recruit workers based on the skills, experience, and values needed for '
                   'your farm?',
  'quick_win': 'Develop a checklist of the skills and qualities required before hiring new '
               'workers.',
  'support_available': ['Business Mentors', 'Human Resource Professionals'],
  'why_it_matters': 'Recruiting the right people reduces turnover and improves overall farm '
                    'performance.'},
 {'capability_id': 'P6.2',
  'ffv_evidence_required': 'Employment records; workplace policies; worker interviews; '
                           'observation.',
  'id': 'P6.2.4',
  'if_no_recommendation': 'Adopt fair recruitment and employment practices that provide equal '
                          'opportunities regardless of gender, age, disability, or background, '
                          'while complying with labour laws.',
  'pillar_id': 6,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you promote fair, inclusive, and non-discriminatory employment practices on '
                   'your farm?',
  'quick_win': 'Review your recruitment practices to ensure they are transparent and based on '
               'merit.',
  'support_available': ['Labour Offices', 'Gender and Youth Programmes', 'Future Farms Advisory'],
  'why_it_matters': 'Inclusive employment strengthens workforce diversity, improves reputation, '
                    'and supports decent work.'},
 {'capability_id': 'P6.2',
  'ffv_evidence_required': 'Workforce reviews; staffing plans; strategic plans; farmer interview.',
  'id': 'P6.2.5',
  'if_no_recommendation': 'Periodically review staffing levels and workforce capabilities as your '
                          'farm grows or adopts new technologies.',
  'pillar_id': 6,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you regularly review whether your workforce is adequate to support future '
                   'farm growth and changing operational needs?',
  'quick_win': 'Conduct an annual workforce review to identify future staffing needs.',
  'support_available': ['Future Farms Institute', 'FAAB Programme', 'Business Advisors'],
  'why_it_matters': 'Workforce needs evolve with business growth, mechanisation, and innovation.'},
 {'capability_id': 'P6.3',
  'ffv_evidence_required': 'Training certificates; attendance records; learning logs; farmer '
                           'interview.',
  'id': 'P6.3.1',
  'if_no_recommendation': 'Participate in relevant agricultural, business, or technical training '
                          'to strengthen your knowledge and skills.',
  'pillar_id': 6,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you regularly participate in training, workshops, or learning opportunities '
                   'to improve your farming and business skills?',
  'quick_win': 'Register for one agricultural or business training programme within the next six '
               'months.',
  'support_available': ['Future Farms Institute (FFI)', 'FAAB Programme', 'Extension Services'],
  'why_it_matters': 'Continuous learning enables farmers to adopt better practices, improve '
                    'productivity, and remain competitive.'},
 {'capability_id': 'P6.3',
  'ffv_evidence_required': 'Training records; coaching schedules; worker interviews; observation.',
  'id': 'P6.3.2',
  'if_no_recommendation': 'Develop a simple training plan that ensures all workers receive regular '
                          'skills development opportunities.',
  'pillar_id': 6,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do your workers receive training or coaching to improve their technical, '
                   'safety, or operational skills?',
  'quick_win': 'Conduct one practical on-farm training session for all workers this season.',
  'support_available': ['Future Farms Institute', 'Technical Experts', 'Extension Officers'],
  'why_it_matters': 'Skilled workers perform tasks more efficiently, safely, and consistently.'},
 {'capability_id': 'P6.3',
  'ffv_evidence_required': 'Mentoring activities; demonstration events; peer-learning sessions; '
                           'farmer interview.',
  'id': 'P6.3.3',
  'if_no_recommendation': 'Create opportunities for experienced workers and farmers to share '
                          'knowledge with others.',
  'pillar_id': 6,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you encourage knowledge sharing and mentoring among workers, family '
                   'members, or neighbouring farmers?',
  'quick_win': 'Organise one monthly knowledge-sharing meeting or field demonstration.',
  'support_available': ['Farmer Groups', 'Future Farms Network', 'Cooperatives'],
  'why_it_matters': 'Knowledge sharing strengthens teamwork, preserves experience, and accelerates '
                    'learning.'},
 {'capability_id': 'P6.3',
  'ffv_evidence_required': 'Performance reviews; productivity records; training evaluations; '
                           'farmer interview.',
  'id': 'P6.3.4',
  'if_no_recommendation': 'Evaluate the impact of training by measuring changes in skills, '
                          'productivity, quality, or safety.',
  'pillar_id': 6,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you assess whether training has improved farm performance, productivity, '
                   'safety, or business outcomes?',
  'quick_win': 'Review one recent training activity and identify one improvement achieved because '
               'of it.',
  'support_available': ['Future Farms Advisory', 'Business Coaches', 'Extension Services'],
  'why_it_matters': 'Measuring training outcomes ensures learning delivers tangible value to the '
                    'farm.'},
 {'capability_id': 'P6.3',
  'ffv_evidence_required': 'Annual training plan; learning strategy; staff development plan; '
                           'farmer interview.',
  'id': 'P6.3.5',
  'if_no_recommendation': "Develop a structured learning plan aligned with your farm's future "
                          'goals, technology adoption, and business growth.',
  'pillar_id': 6,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you have a long-term learning and capacity development plan for yourself '
                   'and your workforce?',
  'quick_win': 'Prepare an annual learning plan identifying the skills each team member should '
               'develop.',
  'support_available': ['Future Farms Institute (FFI)',
                        'Universities',
                        'TVET Institutions',
                        'Development Partners'],
  'why_it_matters': 'A learning culture prepares the farm to adapt to new technologies, '
                    'regulations, and market opportunities.'},
 {'capability_id': 'P6.4',
  'ffv_evidence_required': 'Standard operating procedures (SOPs); work instructions; observation; '
                           'staff interviews.',
  'id': 'P6.4.1',
  'if_no_recommendation': 'Develop simple written procedures for routine farm tasks such as '
                          'planting, irrigation, harvesting, feeding, hygiene, and equipment '
                          'operation.',
  'pillar_id': 6,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you have documented procedures or standard operating practices (SOPs) for '
                   'key farm activities?',
  'quick_win': 'Document the step-by-step process for one critical farm activity this month.',
  'support_available': ['Future Farms Advisory', 'Extension Services', 'FAAB Programme'],
  'why_it_matters': 'Standardised procedures improve consistency, efficiency, quality, and reduce '
                    'operational errors.'},
 {'capability_id': 'P6.4',
  'ffv_evidence_required': 'Work schedules; duty rosters; supervision records; observation; worker '
                           'interviews.',
  'id': 'P6.4.2',
  'if_no_recommendation': 'Introduce daily work planning and supervision to improve accountability '
                          'and operational efficiency.',
  'pillar_id': 6,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you assign, supervise, and monitor daily work to ensure tasks are completed '
                   'on time and to the required standard?',
  'quick_win': 'Hold a short daily briefing to assign tasks and review progress.',
  'support_available': ['Farm Management Advisors', 'Extension Officers'],
  'why_it_matters': 'Effective supervision ensures work is completed correctly, safely, and on '
                    'schedule.'},
 {'capability_id': 'P6.4',
  'ffv_evidence_required': 'Productivity records; labour reports; performance indicators; '
                           'observation.',
  'id': 'P6.4.3',
  'if_no_recommendation': 'Measure productivity and operational performance to identify '
                          'bottlenecks and improve efficiency.',
  'pillar_id': 6,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you regularly monitor labour productivity and operational efficiency to '
                   'identify opportunities for improvement?',
  'quick_win': 'Track the time and output of one key farm activity for one production cycle.',
  'support_available': ['Future Farms Advisory', 'Business Coaches'],
  'why_it_matters': 'Monitoring performance enables continuous improvement and better resource '
                    'utilisation.'},
 {'capability_id': 'P6.4',
  'ffv_evidence_required': 'Farm management software; digital records; mobile applications; '
                           'observation; farmer interview.',
  'id': 'P6.4.4',
  'if_no_recommendation': 'Explore practical digital or management tools that simplify planning, '
                          'record keeping, communication, or operational monitoring.',
  'pillar_id': 6,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you use tools, technology, or digital systems to improve farm operations, '
                   'communication, or workforce management where appropriate?',
  'quick_win': 'Introduce one digital tool such as a farm calendar, task tracker, or '
               'record-keeping application.',
  'support_available': ['Future Farms Institute', 'AgTech Providers', 'Extension Services'],
  'why_it_matters': 'Appropriate technology improves efficiency, decision-making, and '
                    'coordination.'},
 {'capability_id': 'P6.4',
  'ffv_evidence_required': 'Operational review reports; improvement plans; meeting minutes; farmer '
                           'interview.',
  'id': 'P6.4.5',
  'if_no_recommendation': 'Establish a routine process to review operational performance and '
                          'implement corrective actions where needed.',
  'pillar_id': 6,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you regularly review operational performance and implement improvements '
                   'based on lessons learned?',
  'quick_win': 'Hold a monthly operations review to discuss successes, challenges, and improvement '
               'actions.',
  'support_available': ['Future Farms Advisory', 'Business Mentors', 'FAAB Programme'],
  'why_it_matters': 'Continuous operational improvement increases productivity, quality, '
                    'profitability, and resilience.'},
 {'capability_id': 'P6.5',
  'ffv_evidence_required': 'Farmer and worker interviews; team meetings; observation of workplace '
                           'interactions.',
  'id': 'P6.5.1',
  'if_no_recommendation': 'Strengthen leadership by promoting regular communication, shared '
                          'decision-making, and accountability across the farm.',
  'pillar_id': 6,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you lead your farm in a way that encourages teamwork, accountability, '
                   'trust, and open communication?',
  'quick_win': 'Hold a weekly team meeting where workers can share progress, challenges, and '
               'ideas.',
  'support_available': ['Future Farms Institute (FFI)', 'Leadership Coaches', 'Business Mentors'],
  'why_it_matters': 'Effective leadership builds trust, improves teamwork, and increases overall '
                    'farm performance.'},
 {'capability_id': 'P6.5',
  'ffv_evidence_required': 'Workplace inspection; health and safety records; worker interviews; '
                           'observation.',
  'id': 'P6.5.2',
  'if_no_recommendation': 'Improve workplace wellbeing through safe working conditions, respectful '
                          "treatment, and attention to workers' physical and mental wellbeing.",
  'pillar_id': 6,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you promote worker wellbeing by providing a safe, respectful, healthy, and '
                   'supportive working environment?',
  'quick_win': 'Review the workplace with your team and address one issue affecting worker '
               'wellbeing.',
  'support_available': ['Occupational Safety Officers', 'Extension Services', 'Health Providers'],
  'why_it_matters': 'Healthy and motivated workers are more productive, engaged, and likely to '
                    'remain with the business.'},
 {'capability_id': 'P6.5',
  'ffv_evidence_required': 'Recognition records; performance reviews; staff interviews; '
                           'observation.',
  'id': 'P6.5.3',
  'if_no_recommendation': 'Introduce simple ways of recognising good performance and encouraging '
                          'continuous improvement.',
  'pillar_id': 6,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you recognise, motivate, and support workers based on their performance and '
                   'contributions?',
  'quick_win': 'Publicly acknowledge one outstanding contribution by a worker during your next '
               'team meeting.',
  'support_available': ['Human Resource Advisors', 'Future Farms Advisory'],
  'why_it_matters': 'Recognition increases motivation, strengthens commitment, and improves staff '
                    'retention.'},
 {'capability_id': 'P6.5',
  'ffv_evidence_required': 'Meeting minutes; suggestion records; improvement initiatives; worker '
                           'interviews.',
  'id': 'P6.5.4',
  'if_no_recommendation': 'Create opportunities for workers to contribute ideas for improving '
                          'productivity, quality, safety, and sustainability.',
  'pillar_id': 6,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you encourage innovation, problem-solving, and continuous improvement by '
                   'involving workers in farm decisions where appropriate?',
  'quick_win': 'Introduce a monthly suggestion session where workers propose improvement ideas.',
  'support_available': ['Future Farms Institute', 'Innovation Programmes', 'FAAB'],
  'why_it_matters': 'Engaged workers often identify practical solutions that improve farm '
                    'performance and innovation.'},
 {'capability_id': 'P6.5',
  'ffv_evidence_required': 'Leadership development plans; mentoring records; succession planning '
                           'documents; interviews.',
  'id': 'P6.5.5',
  'if_no_recommendation': 'Identify and mentor individuals who can take on greater responsibility '
                          'and contribute to the future success of the business.',
  'pillar_id': 6,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you actively develop future leaders within your farm business to ensure '
                   'long-term continuity and organisational resilience?',
  'quick_win': 'Select one team member or family member to mentor in leadership and '
               'decision-making over the next year.',
  'support_available': ['Future Farms Institute',
                        'Business Mentors',
                        'Leadership Development Programmes'],
  'why_it_matters': 'Leadership development strengthens business continuity, resilience, and '
                    'long-term organisational growth.'},
 {'capability_id': 'P7.1',
  'ffv_evidence_required': 'Farmer interview; customer list; sales records; buyer agreements.',
  'id': 'P7.1.1',
  'if_no_recommendation': 'Identify and document your main customer groups, including their needs '
                          'and purchasing patterns.',
  'pillar_id': 7,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you know who your primary customers or buyers are?',
  'quick_win': 'List your top five customers or buyer groups and the products they purchase.',
  'support_available': ['FAAB Programme', 'Future Farms Advisory', 'Cooperatives'],
  'why_it_matters': 'Understanding your customers helps you produce what the market demands.'},
 {'capability_id': 'P7.1',
  'ffv_evidence_required': 'Customer feedback; buyer interviews; contracts; market survey results.',
  'id': 'P7.1.2',
  'if_no_recommendation': 'Engage with customers to understand the attributes they value and '
                          'incorporate them into your production and business practices.',
  'pillar_id': 7,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you understand what your customers value most (e.g., quality, price, '
                   'reliability, food safety, sustainability)?',
  'quick_win': 'Ask three regular customers what they value most about your products and where you '
               'can improve.',
  'support_available': ['Extension Services', 'Buyer Networks', 'Market Advisors'],
  'why_it_matters': 'Meeting customer expectations improves satisfaction, loyalty, and market '
                    'competitiveness.'},
 {'capability_id': 'P7.1',
  'ffv_evidence_required': 'Market records; price monitoring logs; digital market information; '
                           'farmer interview.',
  'id': 'P7.1.3',
  'if_no_recommendation': 'Monitor market trends, prices, and demand to inform production planning '
                          'and pricing decisions.',
  'pillar_id': 7,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you regularly monitor market prices and demand before making production or '
                   'marketing decisions?',
  'quick_win': 'Check local or digital market prices weekly during the production season.',
  'support_available': ['Market Information Systems', 'Cooperatives', 'Extension Officers'],
  'why_it_matters': 'Market information reduces risk and helps maximise profitability.'},
 {'capability_id': 'P7.1',
  'ffv_evidence_required': 'Buyer specifications; certification records; product samples; farmer '
                           'interview.',
  'id': 'P7.1.4',
  'if_no_recommendation': 'Learn the requirements of your target markets and adjust your '
                          'production and post-harvest practices accordingly.',
  'pillar_id': 7,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you understand the quality, packaging, certification, or compliance '
                   'requirements of your target markets?',
  'quick_win': 'Obtain the quality specifications of one target buyer or market.',
  'support_available': ['Future Farms Advisory',
                        'Food Safety Experts',
                        'Export Promotion Agencies'],
  'why_it_matters': 'Understanding market requirements improves market access and reduces product '
                    'rejection.'},
 {'capability_id': 'P7.1',
  'ffv_evidence_required': 'Market research; buyer meetings; market assessment reports; farmer '
                           'interview.',
  'id': 'P7.1.5',
  'if_no_recommendation': 'Conduct regular market assessments to identify emerging customer '
                          'segments, products, and business opportunities.',
  'pillar_id': 7,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you actively identify new market opportunities for your farm products?',
  'quick_win': 'Identify one potential new customer, market channel, or product opportunity within '
               'the next three months.',
  'support_available': ['Future Farms Network',
                        'Trade Promotion Organisations',
                        'Business Advisors'],
  'why_it_matters': 'Exploring new markets increases resilience, growth potential, and business '
                    'competitiveness.'},
 {'capability_id': 'P7.2',
  'ffv_evidence_required': 'Sales records; buyer agreements; contracts; customer lists; farmer '
                           'interview.',
  'id': 'P7.2.1',
  'if_no_recommendation': 'Identify and establish relationships with reliable buyers, '
                          'cooperatives, aggregators, processors, or retailers to reduce market '
                          'uncertainty.',
  'pillar_id': 7,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you have reliable and consistent buyers or market channels for your farm '
                   'products?',
  'quick_win': 'Identify and contact at least three potential buyers or marketing channels within '
               'the next month.',
  'support_available': ['FAAB Programme',
                        'Cooperatives',
                        'Buyer Networks',
                        'Future Farms Advisory'],
  'why_it_matters': 'Stable market channels improve income predictability and reduce post-harvest '
                    'losses.'},
 {'capability_id': 'P7.2',
  'ffv_evidence_required': 'Buyer feedback; delivery records; quality inspection reports; '
                           'contracts; observation.',
  'id': 'P7.2.2',
  'if_no_recommendation': 'Improve production planning, quality management, and logistics to '
                          'consistently meet buyer expectations.',
  'pillar_id': 7,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you consistently deliver products that meet agreed quality, quantity, and '
                   'delivery requirements?',
  'quick_win': 'Review the requirements of one key buyer and identify one area for improvement.',
  'support_available': ['Food Safety Advisors', 'Extension Services', 'Future Farms Advisory'],
  'why_it_matters': 'Reliable suppliers build trust, secure repeat business, and strengthen market '
                    'reputation.'},
 {'capability_id': 'P7.2',
  'ffv_evidence_required': 'Customer feedback records; meeting notes; surveys; communication logs.',
  'id': 'P7.2.3',
  'if_no_recommendation': 'Establish regular communication with customers to gather feedback and '
                          'anticipate changing market needs.',
  'pillar_id': 7,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you actively communicate with customers to understand their satisfaction, '
                   'needs, and future demand?',
  'quick_win': 'Contact three regular customers and ask for feedback on product quality and '
               'service.',
  'support_available': ['Future Farms Network', 'Business Advisors', 'Marketing Specialists'],
  'why_it_matters': 'Customer feedback helps improve products, services, and long-term business '
                    'relationships.'},
 {'capability_id': 'P7.2',
  'ffv_evidence_required': 'Contracts; negotiation records; supply agreements; farmer interview.',
  'id': 'P7.2.4',
  'if_no_recommendation': 'Improve negotiation skills and use written agreements where appropriate '
                          'to strengthen business relationships and reduce disputes.',
  'pillar_id': 7,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you negotiate prices, contracts, or supply agreements that support fair and '
                   'sustainable business relationships?',
  'quick_win': 'Develop a simple written supply agreement with one regular buyer.',
  'support_available': ['Business Mentors', 'Legal Advisors', 'Cooperatives'],
  'why_it_matters': 'Effective negotiation improves profitability, transparency, and long-term '
                    'partnerships.'},
 {'capability_id': 'P7.2',
  'ffv_evidence_required': 'Customer retention records; partnership reviews; repeat sales data; '
                           'farmer interview.',
  'id': 'P7.2.5',
  'if_no_recommendation': 'Review your customer relationships regularly and identify opportunities '
                          'to improve service, communication, and collaboration.',
  'pillar_id': 7,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you regularly evaluate and strengthen your relationships with existing '
                   'customers and market partners?',
  'quick_win': 'Schedule quarterly meetings or follow-up calls with your key customers or '
               'partners.',
  'support_available': ['Future Farms Advisory',
                        'Business Coaches',
                        'Market Development Organisations'],
  'why_it_matters': 'Strong relationships increase customer loyalty, repeat business, and market '
                    'resilience.'},
 {'capability_id': 'P7.3',
  'ffv_evidence_required': 'Market research records; price monitoring logs; market reports; farmer '
                           'interview.',
  'id': 'P7.3.1',
  'if_no_recommendation': 'Establish a routine for collecting market information from reliable '
                          'sources and use it when planning production and sales.',
  'pillar_id': 7,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you regularly collect and use market information (prices, demand, consumer '
                   'trends, and competitor activity) to guide business decisions?',
  'quick_win': 'Identify two reliable sources of market information and review them every week.',
  'support_available': ['FAAB Programme', 'Market Information Systems', 'Extension Services'],
  'why_it_matters': 'Market intelligence helps farmers make informed decisions and reduce business '
                    'risk.'},
 {'capability_id': 'P7.3',
  'ffv_evidence_required': 'Competitor analysis; market comparison reports; farmer interview.',
  'id': 'P7.3.2',
  'if_no_recommendation': 'Compare your products and services with competitors to identify '
                          'strengths, weaknesses, and opportunities for improvement.',
  'pillar_id': 7,
  'priority': 'medium_term',
  'question_number': 2,
  'question_text': 'Do you analyse your competitors to understand how your products or services '
                   'compare in terms of quality, price, value, and customer experience?',
  'quick_win': 'Compare your products with two competitors using quality, price, packaging, and '
               'service as criteria.',
  'support_available': ['Future Farms Advisory', 'Business Mentors', 'Marketing Specialists'],
  'why_it_matters': 'Understanding competitors helps improve market positioning and '
                    'competitiveness.'},
 {'capability_id': 'P7.3',
  'ffv_evidence_required': 'Production plans; market forecasts; planting schedules; business '
                           'plans.',
  'id': 'P7.3.3',
  'if_no_recommendation': 'Align production planning with market demand and seasonal opportunities '
                          'rather than relying solely on tradition or routine.',
  'pillar_id': 7,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you use market intelligence to decide what to produce, when to produce, and '
                   'how much to produce?',
  'quick_win': 'Review market demand before making your next production plan.',
  'support_available': ['Extension Officers', 'Market Advisors', 'Future Farms Institute'],
  'why_it_matters': 'Market-led production reduces oversupply, increases profitability, and '
                    'improves customer satisfaction.'},
 {'capability_id': 'P7.3',
  'ffv_evidence_required': 'Trend reports; customer surveys; market research; farmer interview.',
  'id': 'P7.3.4',
  'if_no_recommendation': 'Stay informed about changing consumer preferences, regulations, '
                          'technologies, and emerging market opportunities.',
  'pillar_id': 7,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you monitor emerging consumer preferences, industry trends, and new market '
                   'opportunities that could affect your farm business?',
  'quick_win': 'Subscribe to one agricultural market newsletter or join one industry association.',
  'support_available': ['Trade Associations', 'Export Promotion Agencies', 'Future Farms Network'],
  'why_it_matters': 'Anticipating market trends allows farmers to adapt early and remain '
                    'competitive.'},
 {'capability_id': 'P7.3',
  'ffv_evidence_required': 'Business improvement plans; pricing strategies; product changes; '
                           'customer feedback records.',
  'id': 'P7.3.5',
  'if_no_recommendation': 'Use market insights to continuously improve your products, services, '
                          'pricing, branding, and customer value proposition.',
  'pillar_id': 7,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you use market information to improve your products, services, pricing, '
                   'branding, or overall business strategy?',
  'quick_win': 'Implement one improvement based on recent customer or market feedback within the '
               'next production cycle.',
  'support_available': ['Future Farms Advisory', 'Marketing Consultants', 'FAAB Programme'],
  'why_it_matters': 'Businesses that respond to market intelligence remain competitive and grow '
                    'sustainably.'},
 {'capability_id': 'P7.4',
  'ffv_evidence_required': 'Product samples; packaging; branding materials; value addition plan; '
                           'farmer interview.',
  'id': 'P7.4.1',
  'if_no_recommendation': 'Assess opportunities to increase product value through processing, '
                          'packaging, grading, branding, or quality enhancement.',
  'pillar_id': 7,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Have you identified opportunities to add value to your products through '
                   'processing, packaging, branding, grading, or other improvements?',
  'quick_win': 'Identify one product that could generate higher value through simple processing or '
               'improved packaging.',
  'support_available': ['Future Farms Advisory', 'Value Addition Specialists', 'FAAB Programme'],
  'why_it_matters': 'Value addition increases product appeal, market differentiation, and '
                    'profitability.'},
 {'capability_id': 'P7.4',
  'ffv_evidence_required': 'Sales records; buyer agreements; marketing records; farmer interview.',
  'id': 'P7.4.2',
  'if_no_recommendation': 'Diversify market channels to reduce dependence on a single buyer or '
                          'market.',
  'pillar_id': 7,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you sell your products through more than one market channel (e.g., farm '
                   'gate, cooperatives, retailers, processors, institutions, digital platforms, '
                   'export)?',
  'quick_win': 'Identify one new sales channel to test during the next production cycle.',
  'support_available': ['Cooperatives', 'Digital Marketplaces', 'Trade Organisations'],
  'why_it_matters': 'Multiple market channels improve resilience and create additional income '
                    'opportunities.'},
 {'capability_id': 'P7.4',
  'ffv_evidence_required': 'Product development records; customer feedback; innovation records; '
                           'observation.',
  'id': 'P7.4.3',
  'if_no_recommendation': 'Use customer feedback and market intelligence to improve existing '
                          'products or introduce new offerings.',
  'pillar_id': 7,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you regularly develop or improve products and services based on customer '
                   'needs or market opportunities?',
  'quick_win': 'Make one product or packaging improvement based on customer feedback.',
  'support_available': ['Innovation Hubs', 'Future Farms Institute', 'Product Development Experts'],
  'why_it_matters': 'Continuous product improvement strengthens competitiveness and customer '
                    'satisfaction.'},
 {'capability_id': 'P7.4',
  'ffv_evidence_required': 'Marketing materials; website; social media; promotional campaigns; '
                           'farmer interview.',
  'id': 'P7.4.4',
  'if_no_recommendation': "Develop a simple marketing strategy that highlights your farm's value "
                          'proposition and reaches target customers.',
  'pillar_id': 7,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you actively promote your farm, products, or brand through appropriate '
                   'marketing and communication channels?',
  'quick_win': 'Create a simple farm profile or social media page showcasing your products and '
               'services.',
  'support_available': ['Marketing Consultants', 'Future Farms Network', 'Business Advisors'],
  'why_it_matters': 'Effective marketing increases visibility, customer trust, and market '
                    'opportunities.'},
 {'capability_id': 'P7.4',
  'ffv_evidence_required': 'Business plans; diversification records; market research; farmer '
                           'interview.',
  'id': 'P7.4.5',
  'if_no_recommendation': 'Continuously identify and evaluate opportunities for product '
                          'diversification and new revenue streams.',
  'pillar_id': 7,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you regularly explore new products, services, or business opportunities '
                   'that increase income and strengthen business resilience?',
  'quick_win': 'Brainstorm three new products, services, or business opportunities that complement '
               'your current enterprise.',
  'support_available': ['Business Incubators', 'Future Farms Advisory', 'Development Partners'],
  'why_it_matters': 'Innovation and diversification support long-term growth and reduce dependence '
                    'on a single product or market.'},
 {'capability_id': 'P7.5',
  'ffv_evidence_required': 'Brand strategy; marketing materials; buyer interviews; farmer '
                           'interview.',
  'id': 'P7.5.1',
  'if_no_recommendation': 'Define what makes your farm unique and communicate this consistently to '
                          'customers and partners.',
  'pillar_id': 7,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Does your farm have a clear value proposition that differentiates it from '
                   'competitors (e.g., quality, sustainability, innovation, traceability, '
                   'reliability, or customer service)?',
  'quick_win': 'Write a one-sentence statement describing what makes your farm different from '
               'others.',
  'support_available': ['Future Farms Advisory', 'Marketing Consultants', 'Business Mentors'],
  'why_it_matters': 'A strong value proposition helps attract customers, build loyalty, and '
                    'compete effectively.'},
 {'capability_id': 'P7.5',
  'ffv_evidence_required': 'Partnership agreements; contracts; MoUs; buyer interviews; '
                           'collaboration records.',
  'id': 'P7.5.2',
  'if_no_recommendation': 'Develop long-term relationships with strategic partners that support '
                          'business growth and market stability.',
  'pillar_id': 7,
  'priority': 'medium_term',
  'question_number': 2,
  'question_text': 'Have you built long-term strategic partnerships with buyers, processors, '
                   'retailers, institutions, or other value chain actors?',
  'quick_win': 'Identify one organisation or buyer with whom you would like to establish a '
               'long-term partnership.',
  'support_available': ['Cooperatives', 'Trade Associations', 'Future Farms Network'],
  'why_it_matters': 'Strategic partnerships create more secure markets, knowledge exchange, and '
                    'growth opportunities.'},
 {'capability_id': 'P7.5',
  'ffv_evidence_required': 'Customer testimonials; repeat sales records; awards; certifications; '
                           'buyer feedback.',
  'id': 'P7.5.3',
  'if_no_recommendation': 'Focus on delivering consistent quality, reliable service, and '
                          'professional business practices to strengthen your reputation.',
  'pillar_id': 7,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Is your farm recognised by customers or stakeholders for consistently '
                   'delivering quality, reliability, and professionalism?',
  'quick_win': 'Request structured feedback from your top three customers and identify one '
               'improvement action.',
  'support_available': ['Quality Assurance Advisors', 'Future Farms Advisory'],
  'why_it_matters': 'Reputation is a valuable business asset that drives customer trust and repeat '
                    'business.'},
 {'capability_id': 'P7.5',
  'ffv_evidence_required': 'Website; social media; promotional materials; exhibition '
                           'participation; observation.',
  'id': 'P7.5.4',
  'if_no_recommendation': "Build your farm's visibility by sharing your story, achievements, and "
                          'value proposition through appropriate communication channels.',
  'pillar_id': 7,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you actively promote your farm as a trusted brand through storytelling, '
                   'digital platforms, exhibitions, or community engagement?',
  'quick_win': 'Publish one story, customer success, or farm achievement through a digital '
               'platform or community event.',
  'support_available': ['Marketing Specialists', 'Future Farms Network', 'Media Partners'],
  'why_it_matters': 'Strong branding increases recognition, attracts customers, and strengthens '
                    'market positioning.'},
 {'capability_id': 'P7.5',
  'ffv_evidence_required': 'Strategic reviews; market assessments; business plans; performance '
                           'reports; farmer interview.',
  'id': 'P7.5.5',
  'if_no_recommendation': 'Conduct regular reviews of your competitive position and update your '
                          'business strategy to respond to market changes and future '
                          'opportunities.',
  'pillar_id': 7,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you regularly evaluate your market position and adapt your business '
                   'strategy to remain competitive in changing markets?',
  'quick_win': 'Complete an annual review of your market position and identify three strategic '
               'priorities for the coming year.',
  'support_available': ['Future Farms Advisory', 'Business Coaches', 'FAAB Programme'],
  'why_it_matters': 'Strategic positioning enables long-term competitiveness, resilience, and '
                    'sustainable business growth.'},
 {'capability_id': 'P8.1',
  'ffv_evidence_required': 'Farmer interview; financing records; evidence of participation in '
                           'financial literacy programmes.',
  'id': 'P8.1.1',
  'if_no_recommendation': 'Learn about the financing options available for agricultural businesses '
                          'and understand when each is appropriate.',
  'pillar_id': 8,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you understand the different sources of finance available for growing your '
                   'farm business (e.g., savings, loans, grants, equity, blended finance, carbon '
                   'finance)?',
  'quick_win': 'Identify three financing options suitable for your farm and compare their '
               'requirements.',
  'support_available': ['FAAB Programme',
                        'Financial Institutions',
                        'Enterprise Support Organisations'],
  'why_it_matters': 'Knowing your financing options helps you choose the right source of capital '
                    'for your business stage and growth goals.'},
 {'capability_id': 'P8.1',
  'ffv_evidence_required': 'Farmer interview; business planning documents; investment readiness '
                           'training records.',
  'id': 'P8.1.2',
  'if_no_recommendation': 'Learn the key criteria used to assess investable businesses, including '
                          'financial performance, governance, market potential, and risk '
                          'management.',
  'pillar_id': 8,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you understand what lenders, investors, or development partners typically '
                   'look for before supporting a farm business?',
  'quick_win': 'Attend one investment readiness or business finance training session.',
  'support_available': ['Future Farms Institute (FFI)', 'Business Development Service Providers'],
  'why_it_matters': 'Understanding investor expectations helps farmers prepare before seeking '
                    'external support.'},
 {'capability_id': 'P8.1',
  'ffv_evidence_required': 'Business plan; growth strategy; farmer interview.',
  'id': 'P8.1.3',
  'if_no_recommendation': 'Identify how external investment could support business expansion, '
                          'technology adoption, infrastructure, or market development.',
  'pillar_id': 8,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you know how investment could help your farm achieve its long-term goals?',
  'quick_win': 'Identify one business improvement that would require external financing.',
  'support_available': ['Business Mentors', 'Financial Advisors', 'Future Farms Advisory'],
  'why_it_matters': 'Investment should support clear business objectives rather than simply '
                    'provide additional funds.'},
 {'capability_id': 'P8.1',
  'ffv_evidence_required': 'Farmer interview; financing agreements; governance documents; '
                           'financial literacy records.',
  'id': 'P8.1.4',
  'if_no_recommendation': 'Learn about repayment obligations, reporting requirements, governance '
                          'expectations, and responsible financial management.',
  'pillar_id': 8,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you understand the responsibilities and obligations that come with '
                   'receiving external funding or investment?',
  'quick_win': 'Review the basic obligations associated with one financing option relevant to your '
               'business.',
  'support_available': ['Financial Institutions', 'Legal Advisors', 'Development Partners'],
  'why_it_matters': 'Responsible use of finance builds credibility and increases future funding '
                    'opportunities.'},
 {'capability_id': 'P8.1',
  'ffv_evidence_required': 'Investment readiness assessment; business review; farmer interview.',
  'id': 'P8.1.5',
  'if_no_recommendation': 'Conduct an investment readiness assessment to identify strengths, gaps, '
                          'and priority improvements before approaching investors or lenders.',
  'pillar_id': 8,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Have you assessed whether your farm is currently ready to seek external '
                   'finance or investment?',
  'quick_win': 'Complete a Future Farms investment readiness assessment and develop an action plan '
               'to address identified gaps.',
  'support_available': ['Future Farms Advisory', 'FFI', 'Enterprise Development Partners'],
  'why_it_matters': 'Assessing readiness improves the likelihood of securing appropriate financing '
                    'and building long-term investor confidence.'},
 {'capability_id': 'P8.2',
  'ffv_evidence_required': 'Business registration certificate; cooperative membership certificate; '
                           'legal registration documents.',
  'id': 'P8.2.1',
  'if_no_recommendation': 'Register your farm under a legal structure that aligns with your '
                          'business goals and financing needs.',
  'pillar_id': 8,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Is your farm business formally registered under the appropriate legal '
                   'structure (e.g., sole proprietorship, partnership, company, cooperative, or '
                   'other recognised entity)?',
  'quick_win': 'Identify the most suitable legal structure and begin the registration process.',
  'support_available': ['Business Registration Services',
                        'Legal Advisors',
                        'Business Development Providers'],
  'why_it_matters': 'Legal registration enhances credibility, enables access to finance, and '
                    'supports formal business growth.'},
 {'capability_id': 'P8.2',
  'ffv_evidence_required': 'Licences; permits; certification documents; compliance records; '
                           'observation.',
  'id': 'P8.2.2',
  'if_no_recommendation': 'Identify and obtain the licences, permits, and certifications required '
                          'for your enterprise and keep them up to date.',
  'pillar_id': 8,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you maintain all required licences, permits, certifications, and regulatory '
                   'approvals relevant to your farming enterprise?',
  'quick_win': 'Create a checklist of required licences and review their validity annually.',
  'support_available': ['Regulatory Authorities', 'Extension Services', 'Future Farms Advisory'],
  'why_it_matters': 'Regulatory compliance reduces legal risks and increases investor confidence.'},
 {'capability_id': 'P8.2',
  'ffv_evidence_required': 'Organisational structure; governance documents; meeting minutes; '
                           'farmer interview.',
  'id': 'P8.2.3',
  'if_no_recommendation': 'Establish clear governance structures, define responsibilities, and '
                          'maintain records of important business decisions.',
  'pillar_id': 8,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you have clear governance arrangements, including defined decision-making '
                   'responsibilities, accountability, and record-keeping?',
  'quick_win': 'Document who is responsible for finance, production, marketing, and strategic '
               'decisions.',
  'support_available': ['Business Mentors', 'Governance Advisors', 'Future Farms Institute'],
  'why_it_matters': 'Good governance improves transparency, accountability, and organisational '
                    'resilience.'},
 {'capability_id': 'P8.2',
  'ffv_evidence_required': 'Policy documents; operational manuals; SOPs; employee handbook; '
                           'observation.',
  'id': 'P8.2.4',
  'if_no_recommendation': 'Develop basic business policies that support consistent management, '
                          'compliance, and organisational growth.',
  'pillar_id': 8,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you have documented business policies and procedures that guide financial '
                   'management, employment, procurement, safety, and other key operations?',
  'quick_win': 'Develop one written policy for a key area such as financial management or '
               'workplace safety.',
  'support_available': ['Future Farms Advisory', 'Human Resource Advisors', 'Business Consultants'],
  'why_it_matters': 'Policies improve consistency, reduce operational risk, and demonstrate '
                    'business maturity.'},
 {'capability_id': 'P8.2',
  'ffv_evidence_required': 'Compliance reviews; governance reviews; updated registrations; farmer '
                           'interview.',
  'id': 'P8.2.5',
  'if_no_recommendation': 'Conduct periodic reviews of legal, governance, and compliance '
                          'requirements to keep pace with business growth and changing '
                          'regulations.',
  'pillar_id': 8,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you regularly review your legal and governance obligations to ensure your '
                   'farm remains compliant as it grows?',
  'quick_win': 'Schedule an annual legal and compliance review for your business.',
  'support_available': ['Legal Advisors', 'Accountants', 'Future Farms Advisory'],
  'why_it_matters': 'Ongoing compliance protects the business, strengthens reputation, and '
                    'improves investment readiness.'},
 {'capability_id': 'P8.3',
  'ffv_evidence_required': 'Cashbook; accounting records; financial statements; bank statements; '
                           'digital accounting system.',
  'id': 'P8.3.1',
  'if_no_recommendation': 'Establish a consistent financial record-keeping system and update it '
                          'regularly.',
  'pillar_id': 8,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you maintain complete and up-to-date financial records, including income, '
                   'expenses, assets, liabilities, and cash flow?',
  'quick_win': 'Record all farm income and expenses for the next production cycle using a notebook '
               'or digital tool.',
  'support_available': ['Accountants', 'Future Farms Advisory', 'Financial Literacy Programmes'],
  'why_it_matters': 'Accurate financial records are essential for business management, financing, '
                    'and investor confidence.'},
 {'capability_id': 'P8.3',
  'ffv_evidence_required': 'Business plan; strategic plan; enterprise development plan.',
  'id': 'P8.3.2',
  'if_no_recommendation': 'Develop or update a comprehensive business plan that reflects your '
                          'current operations and future ambitions.',
  'pillar_id': 8,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you have a current business plan that clearly outlines your goals, '
                   'operations, markets, financial projections, and growth strategy?',
  'quick_win': 'Update your business goals, target markets, and financial projections for the next '
               'three years.',
  'support_available': ['FAAB Programme',
                        'Business Development Advisors',
                        'Future Farms Institute (FFI)'],
  'why_it_matters': 'A business plan demonstrates direction, preparedness, and strategic thinking '
                    'to investors and partners.'},
 {'capability_id': 'P8.3',
  'ffv_evidence_required': 'Annual budgets; cash flow forecasts; financial projections; budget '
                           'monitoring reports.',
  'id': 'P8.3.3',
  'if_no_recommendation': 'Prepare annual budgets and financial forecasts to guide spending and '
                          'investment decisions.',
  'pillar_id': 8,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you prepare budgets and financial forecasts to support planning and '
                   'investment decisions?',
  'quick_win': 'Prepare a simple annual budget covering expected income, expenses, and planned '
               'investments.',
  'support_available': ['Financial Advisors', 'Accountants', 'Business Coaches'],
  'why_it_matters': 'Budgeting improves financial discipline and demonstrates responsible business '
                    'planning.'},
 {'capability_id': 'P8.3',
  'ffv_evidence_required': 'Production records; sales records; productivity reports; KPI '
                           'dashboard; digital farm records.',
  'id': 'P8.3.4',
  'if_no_recommendation': 'Organise operational and business records that demonstrate the '
                          'performance and growth of your farm.',
  'pillar_id': 8,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': "Can you provide evidence of your farm's performance through production "
                   'records, sales records, productivity data, and key business indicators?',
  'quick_win': 'Create a simple dashboard showing annual production, sales, and profitability '
               'trends.',
  'support_available': ['Future Farms Advisory', 'Extension Services', 'AgTech Providers'],
  'why_it_matters': 'Investors and lenders rely on evidence of performance rather than '
                    'assumptions.'},
 {'capability_id': 'P8.3',
  'ffv_evidence_required': 'Pitch deck; investment proposal; financing strategy; funding '
                           'applications; business case.',
  'id': 'P8.3.5',
  'if_no_recommendation': 'Prepare a professional investment package that explains your business '
                          'opportunity, financing needs, expected returns, and growth strategy.',
  'pillar_id': 8,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you have an investment proposal, financing plan, or business case prepared '
                   'for future funding opportunities?',
  'quick_win': 'Prepare a one-page investment concept outlining the amount required, its purpose, '
               'and expected business impact.',
  'support_available': ['Future Farms Institute',
                        'Investment Readiness Programmes',
                        'Business Mentors'],
  'why_it_matters': 'Well-prepared investment documents improve credibility and significantly '
                    'increase funding success.'},
 {'capability_id': 'P8.4',
  'ffv_evidence_required': 'Funding applications; financing enquiries; funding strategy; farmer '
                           'interview.',
  'id': 'P8.4.1',
  'if_no_recommendation': 'Develop a financing strategy and actively monitor opportunities that '
                          'match your business needs and stage of growth.',
  'pillar_id': 8,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': "Do you actively seek financing opportunities that align with your farm's "
                   'growth objectives (e.g., loans, grants, investors, blended finance, carbon '
                   'finance)?',
  'quick_win': 'Identify three relevant funding opportunities and note their eligibility '
               'requirements.',
  'support_available': ['Financial Institutions', 'Development Partners', 'Future Farms Advisory'],
  'why_it_matters': 'Proactively seeking finance increases the likelihood of securing appropriate '
                    'resources when opportunities arise.'},
 {'capability_id': 'P8.4',
  'ffv_evidence_required': 'MoUs; partnership agreements; collaboration records; membership '
                           'certificates; farmer interview.',
  'id': 'P8.4.2',
  'if_no_recommendation': 'Develop relationships with organisations that can strengthen your '
                          'business beyond financial support.',
  'pillar_id': 8,
  'priority': 'quick_win',
  'question_number': 2,
  'question_text': 'Do you actively build partnerships with organisations that can provide '
                   'technical support, market access, finance, innovation, or business '
                   'development?',
  'quick_win': 'Join one farmer organisation, cooperative, industry association, or business '
               'network relevant to your enterprise.',
  'support_available': ['Future Farms Network', 'Cooperatives', 'Universities', 'NGOs'],
  'why_it_matters': 'Strategic partnerships provide knowledge, credibility, market opportunities, '
                    'and long-term growth.'},
 {'capability_id': 'P8.4',
  'ffv_evidence_required': 'Funding applications; concept notes; proposals; grant submissions; '
                           'investment proposals.',
  'id': 'P8.4.3',
  'if_no_recommendation': 'Build the skills and documentation needed to confidently apply for '
                          'funding and partnership opportunities.',
  'pillar_id': 8,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you prepare and submit funding, partnership, or project applications when '
                   'suitable opportunities become available?',
  'quick_win': 'Prepare a standard business profile and concept note that can be adapted for '
               'different opportunities.',
  'support_available': ['Future Farms Institute (FFI)',
                        'Business Development Advisors',
                        'Proposal Writing Support'],
  'why_it_matters': 'Businesses that apply consistently create more opportunities for growth and '
                    'investment.'},
 {'capability_id': 'P8.4',
  'ffv_evidence_required': 'Meeting records; communication logs; networking activities; '
                           'partnership reviews.',
  'id': 'P8.4.4',
  'if_no_recommendation': 'Build long-term relationships with financing and support organisations '
                          'before funding becomes necessary.',
  'pillar_id': 8,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Do you maintain relationships with financial institutions, investors, '
                   'development partners, or business support organisations even when you are not '
                   'actively seeking funding?',
  'quick_win': 'Schedule one meeting or networking session with a potential strategic partner '
               'during the next quarter.',
  'support_available': ['Banks', 'Investment Networks', 'Enterprise Development Organisations'],
  'why_it_matters': 'Trust and credibility are built through ongoing engagement rather than '
                    'one-time funding requests.'},
 {'capability_id': 'P8.4',
  'ffv_evidence_required': 'Partnership evaluations; project reports; funding impact reports; '
                           'strategic reviews.',
  'id': 'P8.4.5',
  'if_no_recommendation': 'Periodically review partnerships and funding outcomes to ensure they '
                          'contribute to your long-term business objectives.',
  'pillar_id': 8,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you regularly evaluate whether external resources and partnerships are '
                   'delivering value to your business and supporting your long-term strategy?',
  'quick_win': 'Review one partnership or externally funded activity and identify lessons for '
               'future collaboration.',
  'support_available': ['Future Farms Advisory',
                        'Business Mentors',
                        'Monitoring & Evaluation Specialists'],
  'why_it_matters': 'Effective resource mobilisation is measured by business impact, not simply by '
                    'funds received.'},
 {'capability_id': 'P8.5',
  'ffv_evidence_required': 'Strategic plan; growth roadmap; business plan; performance targets.',
  'id': 'P8.5.1',
  'if_no_recommendation': 'Develop a multi-year growth strategy with clear objectives, milestones, '
                          'resource requirements, and success indicators.',
  'pillar_id': 8,
  'priority': 'quick_win',
  'question_number': 1,
  'question_text': 'Do you have a clearly defined long-term growth strategy with measurable '
                   'business, financial, market, and sustainability goals?',
  'quick_win': 'Prepare a three- to five-year enterprise growth roadmap with annual milestones.',
  'support_available': ['Future Farms Institute (FFI)', 'Business Advisors', 'FAAB Programme'],
  'why_it_matters': 'A defined strategy demonstrates vision, direction, and preparedness for '
                    'sustainable growth.'},
 {'capability_id': 'P8.5',
  'ffv_evidence_required': 'Governance documents; financial records; operational procedures; '
                           'leadership structure; FFV assessment results.',
  'id': 'P8.5.2',
  'if_no_recommendation': 'Strengthen governance, management systems, and internal controls before '
                          'seeking significant external investment.',
  'pillar_id': 8,
  'priority': 'medium_term',
  'question_number': 2,
  'question_text': 'Can your farm demonstrate that it has the governance, financial management, '
                   'operational systems, and leadership capacity needed to manage external '
                   'investment responsibly?',
  'quick_win': 'Conduct an internal review of governance, finance, operations, and leadership '
               'using the Future Farms Framework.',
  'support_available': ['Future Farms Advisory', 'Governance Experts', 'Accountants'],
  'why_it_matters': 'Investors seek businesses that can responsibly manage capital and deliver '
                    'measurable results.'},
 {'capability_id': 'P8.5',
  'ffv_evidence_required': 'KPI dashboard; monitoring reports; annual reviews; business '
                           'performance records.',
  'id': 'P8.5.3',
  'if_no_recommendation': 'Establish key performance indicators (KPIs) and review them regularly '
                          'to guide continuous improvement.',
  'pillar_id': 8,
  'priority': 'medium_term',
  'question_number': 3,
  'question_text': 'Do you regularly measure progress against your business goals and use '
                   'performance data to improve strategic decision-making?',
  'quick_win': 'Develop a simple dashboard tracking five key business indicators and review it '
               'quarterly.',
  'support_available': ['Business Coaches',
                        'Monitoring & Evaluation Specialists',
                        'Future Farms Advisory'],
  'why_it_matters': 'Performance monitoring supports accountability, learning, and informed '
                    'investment decisions.'},
 {'capability_id': 'P8.5',
  'ffv_evidence_required': 'Pitch deck; investment proposal; enterprise profile; presentation '
                           'materials; farmer interview.',
  'id': 'P8.5.4',
  'if_no_recommendation': 'Prepare a professional investment package and practise presenting your '
                          'business clearly and confidently.',
  'pillar_id': 8,
  'priority': 'medium_term',
  'question_number': 4,
  'question_text': 'Are you prepared to communicate your business opportunity confidently to '
                   'investors, lenders, partners, or customers through professional presentations '
                   'and investment materials?',
  'quick_win': 'Develop a concise enterprise profile and a five-minute investment pitch.',
  'support_available': ['Future Farms Institute',
                        'Pitch Coaching Programmes',
                        'Investment Networks'],
  'why_it_matters': 'Effective communication increases credibility and improves access to '
                    'investment and strategic partnerships.'},
 {'capability_id': 'P8.5',
  'ffv_evidence_required': 'Improvement plans; annual FFV reports; strategic reviews; action '
                           'plans.',
  'id': 'P8.5.5',
  'if_no_recommendation': 'Use regular assessments to identify strengths, address weaknesses, and '
                          'continuously improve every aspect of your business.',
  'pillar_id': 8,
  'priority': 'strategic',
  'question_number': 5,
  'question_text': 'Do you regularly review your overall business readiness and continuously '
                   'improve your farm to remain competitive, investable, and future-ready?',
  'quick_win': 'Complete a Future Farms Verification annually and implement priority improvement '
               'actions before the next assessment.',
  'support_available': ['Future Farms Institute',
                        'Future Farms Advisory',
                        'Enterprise Development Partners'],
  'why_it_matters': 'Investment readiness is an ongoing journey that requires continuous '
                    'adaptation and improvement.'},
 {'capability_id': 'P2.2',
  'ffv_evidence_required': 'Energy records, system monitoring data, cost-savings analysis or '
                           'farmer interview.',
  'id': 'P2.2.5',
  'if_no_recommendation': "Establish simple monitoring of your renewable-energy system's output, "
                          'cost savings or productivity gains to inform future investments.',
  'pillar_id': 2,
  'priority': 'medium_term',
  'question_number': 5,
  'question_text': 'Do you monitor the performance, savings or benefits of your renewable-energy '
                   'system to guide further investment?',
  'quick_win': 'Record one month of energy output or savings from your renewable-energy system.',
  'support_available': ['Clean Farms Performance Toolkit',
                        'Renewable Energy Providers',
                        'Future Farms Advisory'],
  'why_it_matters': 'Monitoring demonstrates the value of renewable energy and supports better '
                    'investment decisions.'}]

