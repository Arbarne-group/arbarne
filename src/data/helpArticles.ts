export interface HelpArticle {
  slug: string;
  title: string;
  href: string;
  /** Optional illustration/screenshot. Rendered above the body when set. */
  image?: string;
  imageAlt?: string;
  updatedAt?: string;
  body: string[];
}

/**
 * Help Center content, kept as data so it can later be managed from the
 * admin panel (and rendered newspaper-style with screenshots) without
 * touching the layout in src/app/help/page.tsx.
 */
export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "business-profile",
    title: "Business Profile (Overview)",
    href: "/overview",
    body: [
      "Your farm's home page. It shows your profile summary, farm details and quick actions.",
      "How to use it: review your details after signup, tap Edit Profile to update anything (size, enterprises, water, markets), and use the action cards to jump into your assessment or complete your Farm Business Profile.",
    ],
  },
  {
    slug: "my-future-farm",
    title: "My Future Farm (Dashboard)",
    href: "/dashboard",
    body: [
      "Your progress headquarters: maturity index, pillar radar chart and next steps.",
      "How to use it: if your Farm Business Profile is incomplete, the dashboard blurs and asks you to finish it first — the numbers are computed from it. Once complete, track your maturity here after every assessment.",
    ],
  },
  {
    slug: "assessment",
    title: "FFMI/24 Assessment",
    href: "/assessment",
    body: [
      "The 8-pillar farm maturity assessment — 25 questions per pillar. Answer YES or NO honestly for each question; the questionnaire autosaves as you go.",
      "How to use it: work pillar by pillar from the assessment home. Submit a pillar to unlock its summary and report. Completed pillars lock for 90 days, then you may reassess to track improvement.",
    ],
  },
  {
    slug: "ffv",
    title: "FFV — Verify Your Progress",
    href: "/ffv",
    body: [
      "Future Farms Verification. Every question you answered YES to appears here with guidance on what proves it.",
      "How to use it: upload a photo, scan or PDF per question plus an optional note. Each item carries a badge — Not Submitted, Submitted, Verified or Needs Review. If an item comes back as Needs Review, read the reviewer's note and upload clearer evidence; it is a chance to improve, not a penalty. Finish all uploads to clear the attention mark in the sidebar.",
    ],
  },
  {
    slug: "learning",
    title: "Digital Learning",
    href: "/learning",
    body: [
      "Blogs, documents, videos and audio matched to your weakest capabilities.",
      "How to use it: complete your assessment first — materials unlock from capabilities where you scored under 60% (less than 3 out of 5). Filter by type (blog, document, video, audio). General materials stay open to everyone.",
    ],
  },
  {
    slug: "opportunities",
    title: "Opportunity Desk",
    href: "/opportunities",
    body: [
      "Events, partner offers, programmes, markets and financing matched to your farm.",
      "How to use it: items flagged “Matched to you” target capabilities you scored under 60% — including field days and cooperative offers. Filter by type. Anything without capability links is open to everyone.",
    ],
  },
  {
    slug: "solutions",
    title: "Solutions Hub",
    href: "/service-desk",
    body: [
      "Everything Future Farms offers directly: farmer training, soil and water lab testing, irrigation design, cold-chain, market linkage and business setup.",
      "How to use it: browse the full catalogue and open any card for details, pricing guidance and contact information.",
    ],
  },
  {
    slug: "referrals",
    title: "Referrals",
    href: "/referrals",
    body: [
      "Invite fellow farmers with your personal link. Each invited farmer who completes an assessment earns you KES 500 credit — up to KES 1,000 applies to every pillar assessment or report.",
      "How to use it: copy your link from the Referrals page and share it. Link visits, signups and qualified referrals are tracked there. Joined by word of mouth and got a code later? Enter it in the “Were you invited?” card to credit your inviter.",
    ],
  },
  {
    slug: "pricing",
    title: "Pricing & Payments",
    href: "/pricing",
    body: [
      "Your first full assessment is free. Afterwards you pay per pillar action: individual assessments and reports at KES 1,500 each (less any referral credit), FFV verification at KES 2,500, or the annual review at KES 5,600.",
      "How to use it: pay with M-Pesa or card through Paystack at checkout; coupons apply there too. Payment questions go to the Pricing & Payments support department.",
    ],
  },
  {
    slug: "support",
    title: "Support tickets",
    href: "/support",
    body: [
      "Raise issues with the right team: Pillar Support, FFMI/24 Assessment, Learning, FFV, Opportunity Desk, Services Desk, Pricing & Payments or a General Inquiry.",
      "How to use it: open the New ticket tab, pick a department, describe the issue and submit. You receive an email with your ticket number and a tracking link. The My tickets tab lists everything with status filters (Open, In Progress, Resolved, Closed) — open any ticket to see its live status.",
    ],
  },
  {
    slug: "account",
    title: "Account basics",
    href: "/login",
    body: [
      "Sign up with email and password or with Google. New Google accounts are verified instantly; password accounts confirm via email code.",
      "Forgot your password? Use Forgot password on the login page. To change an existing password, use Settings. Keep your profile email current — tickets, verification and assessment reports all go there.",
    ],
  },
];
