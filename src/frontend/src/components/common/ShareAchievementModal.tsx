import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import {
  X,
  Copy,
  Download,
  Check,
  Trophy,
  Cpu,
  Zap,
  ShieldCheck,
  Trees,
  Store,
  Users,
  Building2,
  Briefcase,
  Star,
  Share2,
  Sparkles,
  Award,
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { PILLAR_BRAND_COLORS, AssessmentResult } from '../../types';

// ─── Static pillar icon map ───────────────────────────────────────────────────
const PILLAR_ICONS: Record<number, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  1: Cpu,
  2: Zap,
  3: ShieldCheck,
  4: Trees,
  5: Store,
  6: Users,
  7: Building2,
  8: Briefcase,
};

// ─── Social SVGs ──────────────────────────────────────────────────────────────
const XIcon = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden>
    <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.017 1.792-4.684 4.533-4.684 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.955.93-1.955 1.886v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

// ─── Reusable social button ───────────────────────────────────────────────────
interface SocialBtnProps {
  bg: string;
  name: string;
  onClick: () => void;
  children: React.ReactNode;
}

const SocialBtn: React.FC<SocialBtnProps> = ({ bg, name, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={`Share on ${name}`}
    aria-label={`Share on ${name}`}
    className="group flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-white/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#009924]/60"
  >
    <div
      className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
      style={{ background: bg }}
    >
      {children}
    </div>
    <span className="text-[11px] font-medium text-white/70 group-hover:text-white transition-colors">
      {name}
    </span>
  </button>
);

// ─── Main export ──────────────────────────────────────────────────────────────
export const ShareAchievementModal: React.FC = () => {
  const result = useAppStore((s) => s.shareResult);
  const closeShare = useAppStore((s) => s.closeShare);

  return (
    <AnimatePresence>
      {result && <ShareOverlay result={result} onClose={closeShare} key="share-overlay" />}
    </AnimatePresence>
  );
};

// ─── Overlay Component ────────────────────────────────────────────────────────
const GOLD = '#F0C75E';

const ShareOverlay: React.FC<{ result: AssessmentResult; onClose: () => void }> = ({ result, onClose }) => {
  const user = useAppStore((s) => s.user);
  const gamification = useAppStore((s) => s.gamification);
  const showNotification = useAppStore((s) => s.showNotification);

  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock scroll while modal is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Compute pillar/assessment data
  const keys = Object.keys(result.pillar_scores ?? {}).map(Number);
  const isPillar = keys.length === 1;
  const pillarId = isPillar ? keys[0] : undefined;
  const brand = pillarId ? PILLAR_BRAND_COLORS[pillarId] : null;
  const PillarIcon = pillarId ? PILLAR_ICONS[pillarId] ?? Trophy : Trophy;

  const farmName = user.farm_name || 'Our Farm';
  const ownerName = user.name || 'Farmer';
  const region = user.farm_region || '';

  const pct = isPillar
    ? Math.round(
        ((result.pillar_scores[pillarId as number] ?? 0) <= 1
          ? (result.pillar_scores[pillarId as number] ?? 0)
          : (result.pillar_scores[pillarId as number] ?? 0) / 3) * 100
      )
    : Math.round(Math.min(100, (result.ffmi_score / 24) * 100));

  const pillarName = brand?.name ?? 'Full Assessment';
  const band = isPillar
    ? result.pillar_status?.[pillarId as number] ?? 'Pillar Assessed'
    : result.tier_classification;

  // Accent theme color
  const accentHex = brand?.hex ?? '#009924';

  // Share text
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://futurefarmsframework.org';
  const shareText = isPillar
    ? `🌱 ${farmName} just completed the ${pillarName} pillar on the Future Farms Framework — reaching ${pct}% maturity. Join the movement to build 100,000 future-ready farms across East Africa. #FutureReadyFarm #Arbarne`
    : `🌱 ${farmName} completed the full Future Farms Framework assessment — Tier ${result.tier} (${result.tier_classification}), ${pct}% future-ready across all 8 pillars. Join the movement. #FutureReadyFarm #Arbarne`;

  const enc = encodeURIComponent;
  const open = useCallback((u: string) => window.open(u, '_blank', 'noopener,noreferrer'), []);

  const shareX = () => open(`https://twitter.com/intent/tweet?text=${enc(shareText)}&url=${enc(shareUrl)}`);
  const shareFb = () => open(`https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`);
  const shareLi = () => open(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}`);
  const shareWa = () => open(`https://wa.me/?text=${enc(`${shareText} ${shareUrl}`)}`);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      showNotification('Share text copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showNotification('Could not copy to clipboard', 'error');
    }
  };

  const download = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      // Warm-up render
      await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#06363c',
      });
      const a = document.createElement('a');
      a.download = `arbarne-achievement-${isPillar ? `p${pillarId}` : 'full'}.png`;
      a.href = dataUrl;
      a.click();
      showNotification('Achievement card downloaded!', 'success');
    } catch {
      showNotification('Could not generate image — please try again', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto overflow-x-hidden">
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Centering / Scrollable Wrapper */}
      <div className="min-h-full w-full flex items-center justify-center p-3 sm:p-5 md:p-8">
        <motion.div
          className="relative z-10 w-full max-w-3xl my-auto rounded-3xl bg-[#032a2e]/95 border border-white/15 shadow-2xl backdrop-blur-xl p-4 sm:p-6 lg:p-7 text-white"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Grid: Card on Left, Share details on Right on md+ screens */}
          <div className="grid grid-cols-1 md:grid-cols-[310px_1fr] gap-6 items-center">
            
            {/* ╔════════════════════════════════════════════════════╗ */}
            {/* ║  ACHIEVEMENT CARD  (captured for download)         ║ */}
            {/* ╚════════════════════════════════════════════════════╝ */}
            <div className="flex justify-center">
              <div
                ref={cardRef}
                className="relative w-full max-w-[310px] overflow-hidden rounded-2xl text-white shadow-2xl flex flex-col border border-white/10"
                style={{
                  background: 'linear-gradient(155deg, #062f35 0%, #074a52 50%, #09606a 100%)',
                  minHeight: 440,
                }}
              >
                {/* Glow blobs */}
                <div
                  className="absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl opacity-25 pointer-events-none"
                  style={{ background: accentHex }}
                />
                <div
                  className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full blur-3xl opacity-15 pointer-events-none"
                  style={{ background: GOLD }}
                />

                {/* Arbarne Emblem Watermark */}
                <img
                  src="/assets/arbarne-emblem-white.png"
                  alt=""
                  className="absolute -bottom-6 -right-6 w-36 h-36 opacity-[0.07] object-contain pointer-events-none select-none"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col h-full p-5 gap-4">
                  {/* ── Header Row with Arbarne Logo ── */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#009924]/30 to-[#045D61] border border-[#009924]/40 flex items-center justify-center shadow-md p-1 flex-shrink-0 backdrop-blur-md">
                        <img
                          src="/assets/arbarne-emblem-white.png"
                          alt="Arbarne"
                          className="h-full w-auto object-contain drop-shadow"
                        />
                      </div>
                      <div className="leading-tight">
                        <div className="text-[10px] font-extrabold tracking-[0.16em] text-white uppercase font-sans">
                          ARBARNE
                        </div>
                        <div className="text-[8.5px] font-bold tracking-[0.12em] uppercase" style={{ color: GOLD }}>
                          Future Farms
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold tracking-widest uppercase"
                      style={{
                        borderColor: 'rgba(240,199,94,0.45)',
                        border: '1px solid',
                        background: 'rgba(240,199,94,0.10)',
                        color: GOLD,
                      }}
                    >
                      <Star className="w-2.5 h-2.5" fill={GOLD} />
                      Milestone
                    </div>
                  </div>

                  {/* ── Score Seal ── */}
                  <div className="flex justify-center py-1">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                        <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke={`url(#cardGrad-${pillarId ?? 'full'})`}
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray={`${(pct / 100) * 351.8} 351.8`}
                          className="transition-all duration-700"
                        />
                        <defs>
                          <linearGradient id={`cardGrad-${pillarId ?? 'full'}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={accentHex} />
                            <stop offset="100%" stopColor={GOLD} />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Inner disc */}
                      <div
                        className="absolute inset-[8px] rounded-full flex flex-col items-center justify-center"
                        style={{ background: 'rgba(6,47,53,0.95)' }}
                      >
                        <span className="text-3xl font-black leading-none" style={{ color: GOLD }}>
                          {pct}
                        </span>
                        <span className="text-[9px] font-bold tracking-widest text-white/50 mt-0.5">/ 100</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Title & Milestone Text ── */}
                  <div className="text-center space-y-1 px-1">
                    <div className="text-base font-black leading-snug tracking-tight truncate">
                      {farmName}
                    </div>
                    <div className="text-xs font-medium text-white/80 leading-relaxed">
                      {isPillar ? (
                        <>
                          completed the{' '}
                          <span className="font-bold" style={{ color: GOLD }}>
                            {pillarName}
                          </span>{' '}
                          pillar
                        </>
                      ) : (
                        <>
                          completed the{' '}
                          <span className="font-bold" style={{ color: GOLD }}>
                            Full 8-Pillar
                          </span>{' '}
                          assessment
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Band / Tier Pill ── */}
                  <div className="flex justify-center">
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                      style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}
                    >
                      {isPillar ? (
                        <>
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: accentHex }} />
                          <span className="truncate max-w-[170px]">{band}</span>
                        </>
                      ) : (
                        <>
                          <Trophy className="w-3 h-3" style={{ color: GOLD }} />
                          <span>{result.tier_classification} · Tier {result.tier}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Single Pillar Icon Badge */}
                  {isPillar && (
                    <div className="flex justify-center">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                        style={{ background: accentHex }}
                      >
                        <PillarIcon className="w-4.5 h-4.5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* ── Footer on Card ── */}
                  <div className="mt-auto space-y-1 pt-2 border-t border-white/10">
                    <div className="text-[10.5px] text-white/70 text-center font-medium truncate">
                      {ownerName}
                      {region ? ` · ${region}` : ''}
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-[9.5px] text-white/55">
                      <Award className="w-3 h-3 flex-shrink-0" style={{ color: GOLD }} />
                      <span>
                        Lv {gamification.level} {gamification.level_name} · {gamification.total_xp} XP
                      </span>
                    </div>
                    <div className="text-center text-[8px] tracking-wide text-white/40 uppercase font-medium">
                      Arbarne · Future Farms Framework
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ╔════════════════════════════════════════════════════╗ */}
            {/* ║  SHARE ACTIONS PANEL                               ║ */}
            {/* ╚════════════════════════════════════════════════════╝ */}
            <div className="flex flex-col gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#009924]/20 border border-[#009924]/30 text-[#00c42e] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Achievement Unlocked
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                  Share Your Milestone
                </h2>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Inspire farmers and agri-partners across East Africa. Share your verified progress card or download it for your records.
                </p>
              </div>

              {/* Social Channels Row */}
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-[11px] font-bold text-white/75 mb-2 px-1">
                  1-Click Direct Share:
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <SocialBtn bg="#000000" name="X" onClick={shareX}>
                    <XIcon />
                  </SocialBtn>
                  <SocialBtn bg="#25D366" name="WhatsApp" onClick={shareWa}>
                    <WhatsAppIcon />
                  </SocialBtn>
                  <SocialBtn bg="#0A66C2" name="LinkedIn" onClick={shareLi}>
                    <LinkedInIcon />
                  </SocialBtn>
                  <SocialBtn bg="#1877F2" name="Facebook" onClick={shareFb}>
                    <FacebookIcon />
                  </SocialBtn>
                </div>
              </div>

              {/* Share Message Box & Copy Button */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-white/70">
                  Share message preview:
                </label>
                <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white/80 line-clamp-2 italic leading-relaxed">
                  "{shareText}"
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Copy className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{copied ? 'Text & Link Copied!' : 'Copy Share Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={download}
                  disabled={downloading}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs transition-all shadow-lg hover:shadow-[#009924]/25 hover:brightness-110 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#009924]"
                  style={{
                    background: 'linear-gradient(135deg, #009924 0%, #007a1c 100%)',
                    color: '#ffffff',
                  }}
                >
                  <Download className="w-4 h-4 flex-shrink-0" />
                  <span>{downloading ? 'Generating PNG…' : 'Download Card (PNG)'}</span>
                </button>
              </div>

              {/* Bottom Done / Dismiss button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-white/40 hover:text-white/80 transition-colors cursor-pointer px-2 py-1"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShareAchievementModal;
