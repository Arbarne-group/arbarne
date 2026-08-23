/**
 * Future Farms Framework (FFF) — Arbarne Agriculture Group Digital Platform
 * Main Application Logic & Gamification Engine
 * 
 * Includes:
 * - Georgia Serif & Inter typography integration
 * - Deep Midnight Pine & Forest Teal brand aesthetics (arbarnegroup.com)
 * - 6-Tier Stepped Transformation Roadmap
 * - Active Agro-Missions & Quests with live reward claims & canvas confetti
 * - Trophy Cabinet with 12 Metallic Badges
 * - Regional Agribusiness Leaderboard (Top 3 Gold/Silver/Bronze Podiums)
 * - Animated Number Counters & Floating XP Particles
 * - Path A (Single Pillar) & Path B (Full 8-Pillar) Assessment Lifecycles
 */

// ─── Master Badges Definitions ──────────────────────────────────────────────
const MASTER_BADGES_DATA = [
    { key: 'soil_guardian', title: 'Soil Alchemist', category: 'Pillar 1', tier: 'gold', icon: '🧪', desc: 'Baseline farm soil chemistry, carbon organic matter, and test nutrient balances.' },
    { key: 'water_steward', title: 'Water Guardian', category: 'Pillar 2', tier: 'gold', icon: '💧', desc: 'Establish water harvesting reservoirs, rainwater catchment, and solar drip irrigation.' },
    { key: 'biodiversity_hero', title: 'Biodiversity Champion', category: 'Pillar 3', tier: 'silver', icon: '🌱', desc: 'Diversify crop genetics, plant ecological agro-borders, and practice biological IPM.' },
    { key: 'mechanization_pioneer', title: 'Mechanization Pioneer', category: 'Pillar 4', tier: 'silver', icon: '🚜', desc: 'Adopt solar crop drying or clean mechanization to reduce field labor bottlenecks.' },
    { key: 'market_master', title: 'Commercial Leader', category: 'Pillar 5', tier: 'gold', icon: '💳', desc: 'Maintain digital gross-margin ledger and establish forward buyer offtake agreements.' },
    { key: 'safety_shield', title: 'Safety & Labour Shield', category: 'Pillar 6', tier: 'bronze', icon: '🛡️', desc: 'Enforce worker PPE gear, fair wage standards, and emergency first-aid readiness.' },
    { key: 'circular_champion', title: 'Circularity Champion', category: 'Pillar 7', tier: 'silver', icon: '♻️', desc: 'Recycle 80%+ biomass residues and compost cattle manure into organic fertilizer.' },
    { key: 'governance_pro', title: 'Governance & Audit Pro', category: 'Pillar 8', tier: 'gold', icon: '📈', desc: 'Conduct continuous digitized audits and maintain transparent verifiable records.' },
    { key: 'assessment_veteran', title: 'Transformation Climber', category: 'Milestone', tier: 'silver', icon: '🚀', desc: 'Complete 3 or more farm assessments to map longitudinal capability progression.' },
    { key: 'quick_learner', title: 'Agro-Knowledge Scholar', category: 'Learning', tier: 'bronze', icon: '📚', desc: 'Successfully finish 3 or more practical training courses in the Learning Academy.' },
    { key: 'service_implementer', title: 'Input & Service Adopter', category: 'Services', tier: 'silver', icon: '🛠️', desc: 'Request and implement vetted agro-services to overcome field capability gaps.' },
    { key: 'future_ready_100k', title: '100k Future Farms Hero', category: 'Mastery', tier: 'gold', icon: '🌟', desc: 'Attain Tier 3+ (Commercializing Farm) accelerating the 100,000 future-ready farm vision.' }
];

// ─── 6-Tier Stepped Roadmap Definitions ──────────────────────────────────────
const ROADMAP_TIERS = [
    { tier: 1, name: 'Piloting Farm', scoreMin: 0.0, scoreMax: 5.9, desc: 'Initial baseline evaluation & diagnostic audit.' },
    { tier: 2, name: 'Transitioning Smallholder', scoreMin: 6.0, scoreMax: 10.9, desc: 'Adopting basic agronomy & soil conservation practices.' },
    { tier: 3, name: 'Commercializing Farm', scoreMin: 11.0, scoreMax: 15.9, desc: 'Structured market linkages & verified input services.' },
    { tier: 4, name: 'Established Agribusiness', scoreMin: 16.0, scoreMax: 20.9, desc: 'Robust farm governance, mechanization & circular waste.' },
    { tier: 5, name: 'Commercial Lighthouse Farm', scoreMin: 21.0, scoreMax: 23.9, desc: 'Regional demonstration leader with advanced capability.' },
    { tier: 6, name: 'Future-Ready Pioneer (100K)', scoreMin: 24.0, scoreMax: 24.0, desc: 'Highest standard: verified climate resilience & global export.' }
];

// ─── Application State ──────────────────────────────────────────────────────
const state = {
    token: localStorage.getItem('fff_token') || null,
    user: JSON.parse(localStorage.getItem('fff_user') || 'null') || {
        name: 'Joseph Ochieng',
        phone: '+254712345678',
        email: 'joseph@example.com',
        farm_name: 'Kakamega Demonstration Farm',
        farm_region: 'Western Kenya',
        farm_crop_type: 'Maize, Dairy & Vegetables',
        farm_size_acres: 5.0,
        tier: 3,
        tier_name: 'Commercializing Farm',
        ffmi_score: 13.80,
    },
    gamification: JSON.parse(localStorage.getItem('fff_gamification') || 'null') || {
        total_xp: 620,
        level: 3,
        level_name: 'Resilient Steward',
        current_level_min_xp: 500,
        next_level_xp: 1000,
        streak_days: 3,
        unlocked_badge_keys: ['soil_guardian', 'quick_learner', 'future_ready_100k'],
        completed_quest_ids: ['quest_soil_baseline'],
        claimed_quest_ids: [],
    },
    activeScreen: 'screen-dashboard',
    badgeFilter: 'all',
    leaderboardRegion: 'Western Kenya',
    qStreak: 0,
    assessment: {
        id: null,
        scope: 'full',
        targetPillarId: null,
        questions: [],
        currentIndex: 0,
        answers: {},
        latestResult: null,
    },
    pillars: [
        { id: 1, name: 'Soil & Land Health', icon: '🧪', principle: 'Optimize chemical, physical, and biological soil health for long-term yields.' },
        { id: 2, name: 'Water Stewardship & Resilience', icon: '💧', principle: 'Capture, store, and efficiently apply water with zero wastage.' },
        { id: 3, name: 'Crop Management & Biodiversity', icon: '🌱', principle: 'Diversify crop genetics, IPM pest controls, and ecological buffers.' },
        { id: 4, name: 'Energy, Infra & Mechanization', icon: '🚜', principle: 'Deploy clean renewable energy and targeted field mechanization.' },
        { id: 5, name: 'Farm Economy & Market Linkages', icon: '💳', principle: 'Strengthen financial records, credit access, and structured offtake contracts.' },
        { id: 6, name: 'Labour, Safety & Community', icon: '🛡️', principle: 'Maintain fair labour, PPE safety standards, and shared community knowledge.' },
        { id: 7, name: 'Waste, Circularity & Footprint', icon: '♻️', principle: 'Recycle crop residues, manure composting, and lower carbon footprint.' },
        { id: 8, name: 'Governance, Strategy & Improvement', icon: '📈', principle: 'Establish continuous digitized farm records, goal tracking, and audits.' }
    ],
    services: [],
    learning: [],
    history: [],
    selectedHistoryIds: [],
    simScores: { 1: 0.75, 2: 0.40, 3: 0.65, 4: 0.50, 5: 0.60, 6: 0.70, 7: 0.45, 8: 0.55 }
};

// ─── API Helper ─────────────────────────────────────────────────────────────
const AUTH_EXEMPT_ENDPOINTS = ['/api/auth/login', '/api/auth/register', '/api/auth/otp'];

function formatApiError(errData, status) {
    const detail = errData && errData.detail;
    if (typeof detail === 'string' && detail) return detail;
    if (Array.isArray(detail)) {
        return detail.map(e => {
            const field = Array.isArray(e.loc) ? e.loc.filter(p => p !== 'body').join('.') : '';
            return `${field ? `${field}: ` : ''}${e.msg || 'invalid value'}`;
        }).join('; ');
    }
    if (detail && typeof detail === 'object') return JSON.stringify(detail);
    return `HTTP ${status}`;
}

function isAuthenticated() {
    return Boolean(state.token);
}

function clearSession() {
    state.token = null;
    state.user = { name: 'Farmer', tier: 3, tier_name: 'Piloting Farm', ffmi_score: 0.0 };
    localStorage.removeItem('fff_token');
    localStorage.removeItem('fff_user');
    updateHeaderHUD();
}

async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (state.token) {
        headers['Authorization'] = `Bearer ${state.token}`;
    }
    const opts = { method, headers };
    if (body) {
        opts.body = JSON.stringify(body);
    }
    try {
        const res = await fetch(endpoint, opts);
        if (!res.ok) {
            if (res.status === 401 && !AUTH_EXEMPT_ENDPOINTS.includes(endpoint)) {
                clearSession();
                showScreen('screen-auth');
            }
            const errData = await res.json().catch(() => ({}));
            throw new Error(formatApiError(errData, res.status));
        }
        return await res.json();
    } catch (err) {
        console.warn(`API Error [${endpoint}]:`, err);
        throw err;
    }
}

// ─── Screen Navigation ──────────────────────────────────────────────────────
const PUBLIC_SCREENS = new Set(['screen-auth']);

function updateAuthChrome() {
    const authed = isAuthenticated();
    document.querySelectorAll('.app-nav .nav-tab').forEach(btn => {
        if (btn.id !== 'nav-btn-auth') btn.hidden = !authed;
    });
    const hud = document.getElementById('header-hud-group');
    if (hud) hud.hidden = !authed;
    const pill = document.getElementById('user-profile-pill');
    if (pill) pill.hidden = !authed;
}

function showScreen(screenId) {
    if (!PUBLIC_SCREENS.has(screenId) && !isAuthenticated()) {
        screenId = 'screen-auth';
    }
    updateAuthChrome();
    document.querySelectorAll('.screen').forEach(el => el.hidden = true);
    const target = document.getElementById(screenId);
    if (target) {
        target.hidden = false;
        state.activeScreen = screenId;
    }

    // Update nav tab active state
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('nav-tab-active'));
    const tabMap = {
        'screen-dashboard': 'nav-btn-dashboard',
        'screen-journey': 'nav-btn-journey',
        'screen-assessment-choice': 'nav-btn-assessment',
        'screen-question': 'nav-btn-assessment',
        'screen-result': 'nav-btn-assessment',
        'screen-history': 'nav-btn-history',
        'screen-services': 'nav-btn-services',
        'screen-learning': 'nav-btn-learning',
        'screen-profile': 'nav-btn-profile',
        'screen-simulator': 'nav-btn-simulator',
        'screen-auth': 'nav-btn-auth'
    };
    const activeTabId = tabMap[screenId];
    if (activeTabId) {
        const btn = document.getElementById(activeTabId);
        if (btn) btn.classList.add('nav-tab-active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Number Counter Animation Helper ────────────────────────────────────────
function animateNumberCounter(elementId, startVal, endVal, duration = 800, formatFn = val => val.toFixed(2)) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const startTime = performance.now();
    function update(time) {
        const elapsed = time - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Exponential ease-out
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = startVal + (endVal - startVal) * easeOut;
        el.textContent = formatFn(current);
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

// ─── Floating XP & Canvas Confetti Particle System ─────────────────────────
function showXpFloater(amount, label = '', event = null) {
    const container = document.getElementById('xp-floater-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'xp-floater';
    el.innerHTML = `<span>✨</span> <span>+${amount} XP</span> <small>${label}</small>`;

    let x = window.innerWidth / 2;
    let y = 120;

    if (event && event.clientX) {
        x = event.clientX;
        y = event.clientY - 20;
    }

    el.style.left = `${Math.max(90, Math.min(window.innerWidth - 140, x))}px`;
    el.style.top = `${Math.max(60, y)}px`;

    container.appendChild(el);

    setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
    }, 1700);
}

function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#10b981', '#22c55e', '#4ade80', '#f59e0b', '#fbbf24', '#2dd4bf', '#ffffff'];

    for (let i = 0; i < 95; i++) {
        particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 250,
            y: canvas.height * 0.42 + (Math.random() - 0.5) * 60,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 1.2) * 15,
            size: Math.random() * 9 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 12,
            life: 1.0,
            decay: Math.random() * 0.016 + 0.01
        });
    }

    let animationFrame;
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;

        particles.forEach(p => {
            if (p.life > 0) {
                active = true;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.42;
                p.rotation += p.rotSpeed;
                p.life -= p.decay;

                ctx.save();
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
                ctx.restore();
            }
        });

        if (active) {
            animationFrame = requestAnimationFrame(render);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationFrame);
        }
    }
    render();
}

function showLevelUpModal(level, levelName) {
    const modal = document.getElementById('modal-level-up');
    const titleEl = document.getElementById('modal-level-name');
    if (titleEl) titleEl.textContent = `Level ${level}: ${levelName}`;
    if (modal) {
        modal.hidden = false;
        triggerConfetti();
    }
}

function showBadgeUnlockedModal(badge) {
    const modal = document.getElementById('modal-badge-unlocked');
    const titleEl = document.getElementById('modal-badge-title');
    const descEl = document.getElementById('modal-badge-desc');
    const iconEl = document.getElementById('modal-badge-icon');

    if (titleEl) titleEl.textContent = badge.title;
    if (descEl) descEl.textContent = badge.desc || badge.description;
    if (iconEl) iconEl.textContent = badge.icon || '🏅';

    if (modal) {
        modal.hidden = false;
        triggerConfetti();
    }
}

// ─── Gamification State Sync ────────────────────────────────────────────────
async function syncGamificationState() {
    try {
        const data = await apiCall('/api/portal/gamification');
        if (data) {
            state.gamification.total_xp = data.total_xp;
            state.gamification.level = data.level;
            state.gamification.level_name = data.level_name;
            state.gamification.current_level_min_xp = data.current_level_min_xp;
            state.gamification.next_level_xp = data.next_level_xp;
            state.gamification.streak_days = data.streak_days;

            if (data.badges) {
                state.gamification.unlocked_badge_keys = data.badges
                    .filter(b => b.is_unlocked)
                    .map(b => b.badge_key);
            }
            if (data.active_quests) {
                state.gamification.completed_quest_ids = data.active_quests
                    .filter(q => q.is_completed)
                    .map(q => q.id);
                state.gamification.claimed_quest_ids = data.active_quests
                    .filter(q => q.is_claimed)
                    .map(q => q.id);
            }
            localStorage.setItem('fff_gamification', JSON.stringify(state.gamification));
        }
    } catch (e) {
        // use storage fallback
    }

    updateHeaderHUD();
}

function awardXP(amount, actionLabel = '', event = null) {
    const prevLvl = state.gamification.level;
    state.gamification.total_xp += amount;

    const lvlThresholds = [
        [1, 0, 200, "Seedling Farmer"],
        [2, 200, 500, "Emerging Cultivator"],
        [3, 500, 1000, "Resilient Steward"],
        [4, 1000, 1800, "Commercial Grower"],
        [5, 1800, 2800, "Agro-Ecological Leader"],
        [6, 2800, 4000, "Future-Ready Pioneer"],
        [7, 4000, 10000, "Agribusiness Master"],
    ];

    let currentLvl = 1;
    let lvlName = "Seedling Farmer";
    let minXp = 0;
    let maxXp = 200;

    for (const [lvl, minX, maxX, name] of lvlThresholds) {
        if (state.gamification.total_xp >= minX) {
            currentLvl = lvl;
            lvlName = name;
            minXp = minX;
            maxXp = maxX;
        }
    }

    state.gamification.level = currentLvl;
    state.gamification.level_name = lvlName;
    state.gamification.current_level_min_xp = minXp;
    state.gamification.next_level_xp = maxXp;

    localStorage.setItem('fff_gamification', JSON.stringify(state.gamification));
    updateHeaderHUD();
    showXpFloater(amount, actionLabel, event);

    if (currentLvl > prevLvl) {
        setTimeout(() => showLevelUpModal(currentLvl, lvlName), 500);
    }

    apiCall('/api/portal/gamification/action', 'POST', {
        action_type: actionLabel || 'award_xp',
        details: { amount }
    }).catch(() => {});
}

// ─── Header HUD Updates ─────────────────────────────────────────────────────
function updateHeaderHUD() {
    updateAuthChrome();
    const g = state.gamification;
    const levelTextEl = document.getElementById('hud-level-text');
    const xpBarEl = document.getElementById('hud-xp-bar');
    const xpTextEl = document.getElementById('hud-xp-text');
    const streakTextEl = document.getElementById('hud-streak-text');

    const span = Math.max(1, g.next_level_xp - g.current_level_min_xp);
    const pct = Math.max(5, Math.min(100, ((g.total_xp - g.current_level_min_xp) / span) * 100));

    if (levelTextEl) levelTextEl.textContent = `Lvl ${g.level} ${g.level_name}`;
    if (xpBarEl) xpBarEl.style.width = `${pct}%`;
    if (xpTextEl) xpTextEl.textContent = `${g.total_xp.toLocaleString()} / ${g.next_level_xp.toLocaleString()} XP`;
    if (streakTextEl) streakTextEl.textContent = `${g.streak_days}-Day Streak`;

    const userNameEl = document.getElementById('header-user-name');
    const userTierEl = document.getElementById('header-user-tier');
    const authBtn = document.getElementById('nav-btn-auth');

    if (state.user) {
        if (userNameEl) userNameEl.textContent = state.user.name || 'Farmer';
        if (userTierEl) userTierEl.textContent = `Tier ${state.user.tier || 3}`;
        if (authBtn) authBtn.textContent = state.token ? '🚪 Sign Out' : '🔑 Sign In';
    }
}

// ─── 1. Dashboard Logic ─────────────────────────────────────────────────────
async function refreshDashboard() {
    updateHeaderHUD();

    const farmerNameEl = document.getElementById('dash-farmer-name');
    const farmMetaEl = document.getElementById('dash-farm-meta');
    if (farmerNameEl) farmerNameEl.textContent = state.user.name || 'Joseph';
    if (farmMetaEl) {
        farmMetaEl.textContent = `🌾 ${state.user.farm_name || 'Kakamega Demonstration Farm'} · ${state.user.farm_region || 'Western Kenya'} · ${state.user.farm_size_acres || 5.0} Acres`;
    }

    // Gamification teaser in dashboard
    const gLvlTitle = document.getElementById('dash-gamify-level-title');
    const gTotalXp = document.getElementById('dash-gamify-total-xp');
    const gStreak = document.getElementById('dash-gamify-streak');
    const gBadgesCount = document.getElementById('dash-gamify-badges-count');

    if (gLvlTitle) gLvlTitle.textContent = `Level ${state.gamification.level}: ${state.gamification.level_name}`;
    if (gTotalXp) gTotalXp.textContent = state.gamification.total_xp.toLocaleString();
    if (gStreak) gStreak.textContent = state.gamification.streak_days;
    if (gBadgesCount) {
        const unlockedCount = (state.gamification.unlocked_badge_keys || []).length;
        gBadgesCount.textContent = `${unlockedCount} / ${MASTER_BADGES_DATA.length}`;
    }

    const tierNameEl = document.getElementById('dash-tier-name');
    const ffmiScoreEl = document.getElementById('dash-ffmi-score');

    const tierName = state.user.tier_name || 'Commercializing Farm';
    const ffmi = state.user.ffmi_score || 13.80;
    const tier = state.user.tier || 3;

    if (tierNameEl) tierNameEl.textContent = tierName;
    if (ffmiScoreEl) ffmiScoreEl.textContent = `${ffmi.toFixed(2)} / 24.00`;

    // Baseline farm scores for the 8 pillars
    const farmScores = state.user.pillar_scores || {
        1: 0.80, 2: 0.38, 3: 0.65, 4: 0.70,
        5: 0.55, 6: 0.60, 7: 0.42, 8: 0.50
    };

    // Render Dashboard Interactive Charts Suite
    const togglePeer = document.getElementById('toggle-dash-peer-benchmark');
    const showPeer = togglePeer ? togglePeer.checked : true;
    renderInteractiveRadarChart('dash-radar-chart', farmScores, null, 'dash-radar-tooltip', showPeer);

    if (togglePeer) {
        togglePeer.onchange = () => {
            renderInteractiveRadarChart('dash-radar-chart', farmScores, null, 'dash-radar-tooltip', togglePeer.checked);
        };
    }

    renderTrajectoryRiskGauge('dash-risk-gauge', 'dash-risk-headline', 'dash-risk-drivers', ffmi, farmScores);
    renderTierMilestoneLadder('dash-tier-ladder', ffmi, tier);
    renderEconomicDividendChart('dash-economic-dividend', farmScores, state.user.farm_crop_type || 'Maize', state.user.farm_size_acres || 5.0);
    renderGapWaterfall('dash-gap-waterfall', farmScores, ffmi);
    renderPriorityMatrix('dash-priority-matrix', farmScores);
    renderRegionalViolin('dash-regional-violin', state.user.farm_region || 'Western Kenya');

    try {
        const summary = await apiCall('/api/portal/dashboard-summary');
        if (summary) {
            const servEl = document.getElementById('dash-services-count');
            const learnEl = document.getElementById('dash-learning-count');
            if (servEl) servEl.textContent = `${summary.delivered_services_count || 0} Delivered`;
            if (learnEl) learnEl.textContent = `${summary.completed_courses_count || 0} Completed`;
        }
    } catch (e) {}
}

// ─── 2. Transformation Journey & Leaderboard Screen ─────────────────────────
async function loadJourneyScreen() {
    await syncGamificationState();

    const g = state.gamification;
    const farmerName = state.user.name || 'Joseph Ochieng';

    const jName = document.getElementById('journey-farmer-name');
    const jLvlBadge = document.getElementById('journey-lvl-badge');
    const jLvlTitle = document.getElementById('journey-lvl-title');
    const jTotalXp = document.getElementById('journey-total-xp');
    const jXpFill = document.getElementById('journey-xp-fill');
    const jCurrentMin = document.getElementById('journey-current-min-xp');
    const jNextMax = document.getElementById('journey-next-max-xp');
    const jRemaining = document.getElementById('journey-xp-remaining-text');
    const jStreak = document.getElementById('journey-streak-count');
    const jUnlockedSummary = document.getElementById('journey-unlocked-summary');
    const jRankSummary = document.getElementById('journey-rank-summary');

    if (jName) jName.textContent = farmerName;
    if (jLvlBadge) jLvlBadge.textContent = g.level;
    if (jLvlTitle) jLvlTitle.textContent = g.level_name;
    if (jTotalXp) jTotalXp.textContent = g.total_xp.toLocaleString();

    const span = Math.max(1, g.next_level_xp - g.current_level_min_xp);
    const pct = Math.max(5, Math.min(100, ((g.total_xp - g.current_level_min_xp) / span) * 100));
    if (jXpFill) jXpFill.style.width = `${pct}%`;
    if (jCurrentMin) jCurrentMin.textContent = `${g.current_level_min_xp} XP`;
    if (jNextMax) jNextMax.textContent = `${g.next_level_xp} XP`;

    const remainingXp = Math.max(0, g.next_level_xp - g.total_xp);
    if (jRemaining) {
        jRemaining.textContent = remainingXp > 0
            ? `${remainingXp} XP until next Capability Level`
            : 'Maximum Capability Master Level Attained!';
    }

    const unlockedCount = (g.unlocked_badge_keys || []).length;
    if (jStreak) jStreak.textContent = `${g.streak_days}-Day Streak 🔥`;
    if (jUnlockedSummary) jUnlockedSummary.textContent = `${unlockedCount} / ${MASTER_BADGES_DATA.length} Badges`;
    if (jRankSummary) jRankSummary.textContent = `Rank #3 in ${state.user.farm_region || 'Western Kenya'}`;

    renderRoadmap();
    renderQuests();
    renderBadges();
    await renderLeaderboard(state.leaderboardRegion);
    renderMasteryMatrix();
}

function renderRoadmap() {
    const container = document.getElementById('roadmap-track-container');
    if (!container) return;

    const currTier = state.user.tier || 3;
    const tierPill = document.getElementById('roadmap-current-tier-pill');
    if (tierPill) tierPill.textContent = `Current: Tier ${currTier} ${state.user.tier_name || 'Commercializing'}`;

    container.innerHTML = ROADMAP_TIERS.map(step => {
        let statusClass = 'locked';
        let statusLabel = '🔒 Locked';

        if (step.tier < currTier) {
            statusClass = 'completed';
            statusLabel = '✓ Mastered';
        } else if (step.tier === currTier) {
            statusClass = 'active';
            statusLabel = '⭐ Active Goal';
        }

        return `
            <div class="roadmap-step-card ${statusClass}">
                <div class="step-node-badge">${step.tier < currTier ? '✓' : step.tier}</div>
                <div class="step-tier-title">Tier ${step.tier}: ${step.name}</div>
                <div class="step-req-text">${step.scoreMin > 0 ? `${step.scoreMin.toFixed(1)}+ FFMI Points` : 'Diagnostic Baseline'}</div>
                <span class="badge ${step.tier <= currTier ? 'badge-success' : 'badge-warning'}" style="font-size: 0.7rem; margin-top: 0.4rem; display: inline-block;">${statusLabel}</span>
            </div>
        `;
    }).join('');
}

function renderQuests() {
    const container = document.getElementById('quests-container');
    if (!container) return;

    const completed = new Set(state.gamification.completed_quest_ids || []);
    const claimed = new Set(state.gamification.claimed_quest_ids || []);

    const quests = [
        {
            id: 'quest_soil_baseline',
            numeral: '01',
            title: 'Evaluate Soil & Land Health',
            category: 'Assessment',
            desc: 'Take a Single-Pillar assessment or full audit to diagnose soil nutrient & carbon baseline.',
            xp: 60,
            actionType: 'assessment',
            icon: '🧪'
        },
        {
            id: 'quest_water_service',
            numeral: '02',
            title: 'Explore Water Stewardship Services',
            category: 'Services',
            desc: 'Browse solar drip irrigation and rainwater harvesting providers in the Services Portal.',
            xp: 40,
            actionType: 'services',
            icon: '💧'
        },
        {
            id: 'quest_learn_ipm',
            numeral: '03',
            title: 'Master Biological Pest Management',
            category: 'Learning',
            desc: 'Complete the Integrated Pest Management (IPM) practical module in the Learning Academy.',
            xp: 50,
            actionType: 'learning',
            icon: '🌱'
        },
        {
            id: 'quest_sim_leap',
            numeral: '04',
            title: 'Simulate Next Tier Roadmap',
            category: 'Simulation',
            desc: 'Adjust capability sliders in the Scenario Simulator to plan your Tier advancement.',
            xp: 25,
            actionType: 'simulator',
            icon: '🔮'
        }
    ];

    container.innerHTML = quests.map(q => {
        const isDone = completed.has(q.id);
        const isClaimed = claimed.has(q.id);

        let actionBtn = '';
        if (isDone && !isClaimed) {
            actionBtn = `<button class="btn btn-accent btn-sm btn-claim-quest" data-quest-id="${q.id}" data-xp="${q.xp}">🎁 Claim +${q.xp} XP</button>`;
        } else if (isClaimed) {
            actionBtn = `<span class="badge badge-success">✓ Claimed</span>`;
        } else {
            actionBtn = `<button class="btn btn-primary btn-sm btn-quest-action" data-action="${q.actionType}">Take Action ➔</button>`;
        }

        return `
            <div class="quest-card ${isDone ? 'quest-completed' : ''}">
                <div class="watermark-numeral">${q.numeral}</div>
                <div class="quest-header-row" style="position: relative; z-index: 1;">
                    <span class="quest-cat-tag">${q.icon} ${q.category}</span>
                    <span class="quest-xp-tag">✨ +${q.xp} XP</span>
                </div>
                <h4 class="quest-title" style="position: relative; z-index: 1;">${q.title}</h4>
                <p class="small muted" style="margin: 0; position: relative; z-index: 1;">${q.desc}</p>
                <div class="quest-progress-track">
                    <div class="quest-progress-fill" style="width: ${isDone ? 100 : 0}%;"></div>
                </div>
                <div class="quest-actions-row">
                    <span class="small" style="font-weight: 700; color: #52756d;">${isDone ? '1/1 Completed' : '0/1 In Progress'}</span>
                    ${actionBtn}
                </div>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.btn-claim-quest').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const qId = btn.getAttribute('data-quest-id');
            const xp = parseInt(btn.getAttribute('data-xp'), 10);
            claimQuestReward(qId, xp, e);
        });
    });

    container.querySelectorAll('.btn-quest-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const act = btn.getAttribute('data-action');
            if (act === 'assessment') showScreen('screen-assessment-choice');
            else if (act === 'services') { loadServicesPortal('recommended'); showScreen('screen-services'); }
            else if (act === 'learning') { loadLearningPortal('recommended'); showScreen('screen-learning'); }
            else if (act === 'simulator') showScreen('screen-simulator');
        });
    });
}

async function claimQuestReward(questId, xp, event) {
    const claimed = new Set(state.gamification.claimed_quest_ids || []);
    claimed.add(questId);
    state.gamification.claimed_quest_ids = Array.from(claimed);

    awardXP(xp, 'Mission Accomplished! 🎯', event);
    triggerConfetti();
    renderQuests();

    try {
        await apiCall('/api/portal/gamification/claim-quest', 'POST', { quest_id: questId });
    } catch (e) {}
}

function renderBadges(filter = state.badgeFilter) {
    const container = document.getElementById('badges-container');
    if (!container) return;

    state.badgeFilter = filter;
    const unlockedSet = new Set(state.gamification.unlocked_badge_keys || []);
    const countUnlockedEl = document.getElementById('count-unlocked-badges');
    if (countUnlockedEl) countUnlockedEl.textContent = unlockedSet.size;

    let list = MASTER_BADGES_DATA;
    if (filter === 'unlocked') {
        list = list.filter(b => unlockedSet.has(b.key));
    } else if (filter === 'in_progress') {
        list = list.filter(b => !unlockedSet.has(b.key));
    }

    if (list.length === 0) {
        container.innerHTML = '<p class="muted small" style="grid-column: 1/-1; text-align: center;">No badges match this filter.</p>';
        return;
    }

    container.innerHTML = list.map(b => {
        const isUnlocked = unlockedSet.has(b.key);
        return `
            <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'} tier-${b.tier}" data-badge-key="${b.key}">
                <span class="badge-tier-tag">${b.tier}</span>
                <div class="badge-icon-wrap">${b.icon}</div>
                <h4 style="margin: 0 0 0.25rem 0; font-size: 1rem;">${b.title}</h4>
                <span class="small" style="font-weight: 700; color: var(--color-emerald-500); margin-bottom: 0.35rem;">${b.category}</span>
                <p class="small muted" style="margin: 0; line-height: 1.4;">${b.desc}</p>
                <div style="margin-top: auto; padding-top: 0.75rem; width: 100%;">
                    <span class="badge ${isUnlocked ? 'badge-success' : 'badge-warning'}" style="font-size: 0.72rem; width: 100%; display: block; text-align: center;">
                        ${isUnlocked ? '✨ Unlocked' : '⏳ In Progress'}
                    </span>
                </div>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.badge-card.unlocked').forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-badge-key');
            const badgeObj = MASTER_BADGES_DATA.find(x => x.key === key);
            if (badgeObj) showBadgeUnlockedModal(badgeObj);
        });
    });
}

async function renderLeaderboard(region = 'Western Kenya') {
    state.leaderboardRegion = region;
    const podiumContainer = document.getElementById('leaderboard-podium-container');
    const tableContainer = document.getElementById('leaderboard-table-container');

    try {
        const res = await apiCall(`/api/portal/gamification/leaderboard?region=${encodeURIComponent(region)}`);
        const entries = res.top_entries || [];

        if (podiumContainer && entries.length >= 3) {
            const [first, second, third] = entries;
            podiumContainer.innerHTML = `
                <!-- 2nd Place (Silver) -->
                <div class="podium-card podium-second">
                    <div class="podium-rank-badge">2</div>
                    <div class="podium-avatar">🥈</div>
                    <div class="podium-farmer-name">${second.farmer_name}</div>
                    <div class="podium-farm-meta">${second.farm_name} · ${second.region}</div>
                    <div class="podium-score-pill">${second.ffmi_score.toFixed(2)} / 24 FFMI</div>
                    <div class="podium-velocity-tag">🔥 +${second.weekly_xp_delta} XP this week</div>
                </div>

                <!-- 1st Place (Gold Podium) -->
                <div class="podium-card podium-first">
                    <div class="podium-rank-badge">👑 1</div>
                    <div class="podium-avatar">🥇</div>
                    <div class="podium-farmer-name">${first.farmer_name}</div>
                    <div class="podium-farm-meta">${first.farm_name} · ${first.region}</div>
                    <div class="podium-score-pill" style="background: var(--color-amber-400); color: var(--color-pine-950);">${first.ffmi_score.toFixed(2)} / 24 FFMI</div>
                    <div class="podium-velocity-tag">🔥 +${first.weekly_xp_delta} XP this week</div>
                </div>

                <!-- 3rd Place (Bronze) -->
                <div class="podium-card podium-third">
                    <div class="podium-rank-badge">3</div>
                    <div class="podium-avatar">🥉</div>
                    <div class="podium-farmer-name">${third.farmer_name}</div>
                    <div class="podium-farm-meta">${third.farm_name} · ${third.region}</div>
                    <div class="podium-score-pill">${third.ffmi_score.toFixed(2)} / 24 FFMI</div>
                    <div class="podium-velocity-tag">🔥 +${third.weekly_xp_delta} XP this week</div>
                </div>
            `;
        }

        if (tableContainer) {
            tableContainer.innerHTML = `
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Farmer &amp; Enterprise</th>
                            <th>Region</th>
                            <th>Maturity Status</th>
                            <th>FFMI Score</th>
                            <th>Level &amp; XP</th>
                            <th>Velocity</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${entries.map(e => `
                            <tr class="${e.is_current_user ? 'leaderboard-row-highlight' : ''}">
                                <td><strong>#${e.rank}</strong></td>
                                <td>
                                    <strong>${e.farmer_name}</strong> ${e.is_current_user ? '<span class="badge badge-success">You</span>' : ''}
                                    <div class="small muted">${e.farm_name}</div>
                                </td>
                                <td>${e.region}</td>
                                <td><span class="badge ${e.tier >= 4 ? 'badge-success' : 'badge-warning'}">${e.tier_name}</span></td>
                                <td><strong>${e.ffmi_score.toFixed(2)}</strong> / 24</td>
                                <td>Lvl ${e.level} (${e.total_xp.toLocaleString()} XP)</td>
                                <td style="color: #ea580c; font-weight: 800;">+${e.weekly_xp_delta} XP</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (err) {
        console.warn('Leaderboard error:', err);
    }
}

function renderMasteryMatrix() {
    const container = document.getElementById('mastery-matrix-container');
    if (!container) return;

    container.innerHTML = state.pillars.map(p => {
        const score = parseFloat(state.simScores[p.id] || 0.65);
        const capsDone = Math.round(score * 5);
        const pct = Math.round(score * 100);

        return `
            <div class="mastery-card">
                <div class="mastery-header">
                    <span>${p.icon} P${p.id}: ${p.name}</span>
                    <span style="color: var(--color-emerald-500);">${capsDone} / 5 Mastered</span>
                </div>
                <div class="mastery-track">
                    <div class="mastery-fill" style="width: ${pct}%;"></div>
                </div>
            </div>
        `;
    }).join('');
}

// ─── 3. Assessment Hub & Question Answering ──────────────────────────────────
function initAssessmentPathChooser() {
    const container = document.getElementById('pillar-picker-container');
    if (!container) return;

    container.innerHTML = state.pillars.map(p => `
        <button class="btn btn-ghost btn-sm" data-pillar-id="${p.id}" type="button" style="justify-content: flex-start; text-align: left; padding: 0.6rem 0.85rem;">
            <span>${p.icon}</span>
            <span>P${p.id}: ${p.name}</span>
        </button>
    `).join('');

    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const pId = parseInt(btn.getAttribute('data-pillar-id'), 10);
            startAssessmentFlow('pillar', pId);
        });
    });

    const btnStartPathB = document.getElementById('btn-start-path-b');
    if (btnStartPathB) {
        btnStartPathB.onclick = () => startAssessmentFlow('full', null);
    }
}

async function startAssessmentFlow(scope = 'full', targetPillarId = null) {
    showScreen('screen-loading');
    const loadingText = document.getElementById('loading-text');
    if (loadingText) {
        loadingText.textContent = scope === 'pillar' 
            ? `Preparing Single-Pillar Assessment (Pillar ${targetPillarId})…`
            : 'Preparing Full 8-Pillar Comprehensive Assessment…';
    }

    try {
        const payload = {
            name: state.user.farm_name || 'Kakamega Demonstration Farm',
            region: state.user.farm_region || 'Western Kenya',
            crop_type: state.user.farm_crop_type || 'Mixed Crops',
            size_acres: state.user.farm_size_acres || 5.0,
            scope: scope,
            target_pillar_id: targetPillarId
        };

        const res = await apiCall('/api/assessments/start', 'POST', payload);
        state.assessment.id = res.assessment_id;
        state.assessment.scope = res.scope;
        state.assessment.targetPillarId = res.target_pillar_id;
        state.assessment.answers = {};
        state.assessment.currentIndex = 0;
        state.qStreak = 0;

        const qUrl = scope === 'pillar' 
            ? `/api/questions?pillar_id=${targetPillarId}`
            : '/api/questions';
        
        const questions = await apiCall(qUrl);
        state.assessment.questions = questions;

        renderCurrentQuestion();
        showScreen('screen-question');
    } catch (err) {
        alert(`Error starting assessment: ${err.message}`);
        showScreen('screen-assessment-choice');
    }
}

function renderCurrentQuestion() {
    const q = state.assessment.questions[state.assessment.currentIndex];
    if (!q) return;

    const total = state.assessment.questions.length;
    const current = state.assessment.currentIndex + 1;
    const pct = ((current - 1) / total) * 100;

    const fillEl = document.getElementById('progress-fill');
    const textEl = document.getElementById('progress-text');
    const pillarBadge = document.getElementById('progress-pillar-badge');
    const metaEl = document.getElementById('question-meta');
    const qTextEl = document.getElementById('question-text');
    const whyEl = document.getElementById('question-why');
    const btnPrev = document.getElementById('btn-prev');
    const streakText = document.getElementById('q-streak-text');

    if (fillEl) fillEl.style.width = `${pct}%`;
    if (textEl) textEl.textContent = `Question ${current} of ${total}`;
    if (streakText) {
        const mult = state.qStreak >= 5 ? '1.5x' : state.qStreak >= 3 ? '1.2x' : '1.0x';
        streakText.textContent = `Streak: ${state.qStreak} (${mult} XP)`;
    }
    
    const pillarObj = state.pillars.find(p => p.id === q.pillar_id) || { name: `Pillar ${q.pillar_id}` };
    if (pillarBadge) pillarBadge.textContent = `${pillarObj.icon || '🌱'} Pillar ${q.pillar_id}: ${pillarObj.name}`;
    if (metaEl) metaEl.textContent = `Pillar ${q.pillar_id} · Capability ${q.capability_id} · Question #${q.question_number}`;
    if (qTextEl) qTextEl.textContent = q.question_text;
    if (whyEl) whyEl.textContent = q.why_it_matters ? `💡 Why it matters: ${q.why_it_matters}` : '';

    if (btnPrev) btnPrev.disabled = state.assessment.currentIndex === 0;

    const toast = document.getElementById('q-milestone-toast');
    if (toast) {
        if (current > 1 && (current - 1) % 25 === 0) {
            const pCompleted = Math.floor((current - 1) / 25);
            document.getElementById('q-milestone-title').textContent = `🌟 Pillar ${pCompleted} Section Completed!`;
            toast.hidden = false;
            setTimeout(() => { toast.hidden = true; }, 3500);
        } else {
            toast.hidden = true;
        }
    }
}

async function handleAnswer(value, event = null) {
    const q = state.assessment.questions[state.assessment.currentIndex];
    if (!q) return;

    state.assessment.answers[q.id] = value;

    if (value === 'yes') {
        state.qStreak++;
        const bonus = state.qStreak >= 5 ? 8 : state.qStreak >= 3 ? 6 : 5;
        awardXP(bonus, 'Positive Practice! 🌱', event);
    } else {
        state.qStreak = 0;
    }

    if (state.assessment.currentIndex < state.assessment.questions.length - 1) {
        state.assessment.currentIndex++;
        renderCurrentQuestion();
    } else {
        await submitAssessmentAnswers();
    }
}

async function submitAssessmentAnswers() {
    showScreen('screen-loading');
    const loadingText = document.getElementById('loading-text');
    if (loadingText) loadingText.textContent = 'Generating verified farm scorecard…';

    try {
        const answersList = Object.entries(state.assessment.answers).map(([qId, val]) => ({
            question_id: qId,
            value: val
        }));

        await apiCall(`/api/assessments/${state.assessment.id}/answers`, 'POST', answersList);
        const result = await apiCall(`/api/assessments/${state.assessment.id}/submit`, 'POST');
        state.assessment.latestResult = result;

        if (result.ffmi_score !== undefined && result.ffmi_score !== null) {
            state.user.ffmi_score = result.ffmi_score;
        }
        if (result.tier) {
            state.user.tier = result.tier;
            state.user.tier_name = result.tier_name;
        }
        localStorage.setItem('fff_user', JSON.stringify(state.user));

        const awardAmount = state.assessment.scope === 'full' ? 250 : 60;
        awardXP(awardAmount, `${state.assessment.scope === 'full' ? 'Full Assessment' : 'Pillar Audit'} Completed! 🚀`);
        triggerConfetti();

        renderResultsScreen(result);
        showScreen('screen-result');
    } catch (err) {
        alert(`Error scoring assessment: ${err.message}`);
        showScreen('screen-dashboard');
    }
}

// ─── 4. Results Screen & Radar Chart ────────────────────────────────────────
function renderResultsScreen(res) {
    const tierEl = document.getElementById('result-tier');
    const ffmiEl = document.getElementById('result-ffmi');
    const riskBadge = document.getElementById('result-risk-badge');
    const strongestEl = document.getElementById('result-strongest');
    const priorityGapEl = document.getElementById('result-priority-gap');

    const ffmi = res.ffmi_score || 0.0;
    const tier = res.tier || 1;
    const tierName = res.tier_name || 'Piloting Farm';

    if (tierEl) tierEl.textContent = `${tierName} (Tier ${tier})`;
    if (ffmiEl) ffmiEl.textContent = `${ffmi.toFixed(2)} / 24.00`;

    if (riskBadge) {
        if (tier >= 4) {
            riskBadge.textContent = '🟢 Low Trajectory Risk';
            riskBadge.className = 'badge badge-success';
        } else if (tier >= 2) {
            riskBadge.textContent = '🟡 Medium Trajectory Risk';
            riskBadge.className = 'badge badge-warning';
        } else {
            riskBadge.textContent = '🔴 High Trajectory Risk';
            riskBadge.className = 'badge badge-danger';
        }
    }

    if (strongestEl) strongestEl.textContent = res.strongest_pillar || 'Soil & Land Health';
    if (priorityGapEl) priorityGapEl.textContent = res.priority_gap_pillar || 'Water Stewardship';

    renderRadarChart('result-radar-chart', res.pillar_scores || {});
    renderPillarBars('result-pillar-bars', res.pillar_scores || {});

    const recsList = document.getElementById('result-recommendations');
    if (recsList) {
        const recs = res.recommendations || [];
        if (recs.length === 0) {
            recsList.innerHTML = '<li class="muted">All answered capabilities meet established thresholds.</li>';
        } else {
            recsList.innerHTML = recs.slice(0, 5).map(r => `
                <li style="background: var(--color-canvas); padding: 1.1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border-light); box-shadow: var(--shadow-soft);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                        <span class="badge badge-success" style="font-size: 0.72rem;">${(r.priority || 'Action').toUpperCase().replace('_', ' ')}</span>
                        <strong style="font-size: 0.95rem;">${r.action}</strong>
                    </div>
                    <div class="small muted" style="padding-left: 0.25rem;">
                        <em>Why it matters:</em> ${r.why_it_matters || 'Improves farm capability score.'}
                    </div>
                </li>
            `).join('');
        }
    }

    initSectionTabs(state.assessment.id, res);

    const btnPdf = document.getElementById('btn-download-pdf');
    if (btnPdf) {
        btnPdf.onclick = () => {
            window.open(`/api/assessments/${state.assessment.id}/pdf`, '_blank');
        };
    }
}

// ─── Canonical Peer Cohort Benchmarks (Derived from K-Means Cluster 1) ──────
const REGIONAL_PEER_BENCHMARKS = {
    'Western Kenya': { 1: 0.55, 2: 0.48, 3: 0.52, 4: 0.60, 5: 0.45, 6: 0.58, 7: 0.50, 8: 0.46 },
    'Rift Valley': { 1: 0.62, 2: 0.50, 3: 0.55, 4: 0.58, 5: 0.52, 6: 0.60, 7: 0.54, 8: 0.50 },
    'Central Highlands': { 1: 0.68, 2: 0.56, 3: 0.62, 4: 0.65, 5: 0.58, 6: 0.64, 7: 0.60, 8: 0.55 },
    'Default': { 1: 0.55, 2: 0.48, 3: 0.52, 4: 0.60, 5: 0.45, 6: 0.58, 7: 0.50, 8: 0.46 }
};

// ─── 1. Interactive Dual-Layer Radar Chart Engine ───────────────────────────
function renderInteractiveRadarChart(containerId, farmScores = {}, peerScores = null, tooltipId = null, showPeer = true) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const size = 320;
    const center = size / 2;
    const radius = 105;
    const numPillars = 8;
    const angleStep = (Math.PI * 2) / numPillars;

    const region = (state.user && state.user.farm_region) || 'Western Kenya';
    const peerMap = peerScores || REGIONAL_PEER_BENCHMARKS[region] || REGIONAL_PEER_BENCHMARKS['Default'];

    // Concentric grid circles & level labels
    let gridSvg = '';
    const levels = [
        { val: 0.25, label: '25%' },
        { val: 0.50, label: '50%' },
        { val: 0.75, label: '75%' },
        { val: 1.00, label: '100%' }
    ];

    levels.forEach(lvl => {
        const r = radius * lvl.val;
        gridSvg += `<circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="#d5e2dc" stroke-width="1" stroke-dasharray="${lvl.val === 1.0 ? 'none' : '3,3'}" />`;
    });

    let axesSvg = '';
    let farmPoints = [];
    let peerPoints = [];
    let nodesSvg = '';

    const pNames = {
        1: 'Soil & Land Health',
        2: 'Water Stewardship',
        3: 'Crop Management',
        4: 'Climate Resilience',
        5: 'Farm Business',
        6: 'Human Capital',
        7: 'Market Access',
        8: 'Investment Readiness'
    };

    for (let i = 0; i < numPillars; i++) {
        const pId = i + 1;
        const angle = i * angleStep - Math.PI / 2;
        const xEdge = center + radius * Math.cos(angle);
        const yEdge = center + radius * Math.sin(angle);

        // Axis line
        axesSvg += `<line x1="${center}" y1="${center}" x2="${xEdge}" y2="${yEdge}" stroke="#d5e2dc" stroke-width="1" />`;

        // Outer Axis Label
        const labelR = radius + 22;
        const labelX = center + labelR * Math.cos(angle);
        const labelY = center + labelR * Math.sin(angle) + 4;
        axesSvg += `<text x="${labelX}" y="${labelY}" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#022c24" text-anchor="middle">P${pId}</text>`;

        // Farm score point
        const rawScore = parseFloat(farmScores[pId] || farmScores[String(pId)] || 0.5);
        const farmVal = Math.max(0.08, Math.min(1.0, rawScore));
        const fx = center + (radius * farmVal) * Math.cos(angle);
        const fy = center + (radius * farmVal) * Math.sin(angle);
        farmPoints.push(`${fx.toFixed(1)},${fy.toFixed(1)}`);

        // Peer score point
        const rawPeer = parseFloat(peerMap[pId] || peerMap[String(pId)] || 0.5);
        const peerVal = Math.max(0.08, Math.min(1.0, rawPeer));
        const px = center + (radius * peerVal) * Math.cos(angle);
        const py = center + (radius * peerVal) * Math.sin(angle);
        peerPoints.push(`${px.toFixed(1)},${py.toFixed(1)}`);

        // Interactive vertex hover node
        const pName = (state.pillars.find(p => p.id === pId) || {}).name || pNames[pId];
        const fPts = (rawScore * 3.0).toFixed(2);
        const pPts = (rawPeer * 3.0).toFixed(2);
        const fPct = Math.round(rawScore * 100);
        const pPct = Math.round(rawPeer * 100);
        const deltaPct = fPct - pPct;

        nodesSvg += `
            <circle class="radar-interactive-node" 
                    cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="5.5" 
                    fill="#10b981" stroke="#ffffff" stroke-width="2" 
                    data-pillar="${pId}"
                    data-pname="${pName}"
                    data-fscore="${fPts}"
                    data-fpct="${fPct}"
                    data-pscore="${pPts}"
                    data-ppct="${pPct}"
                    data-delta="${deltaPct}"
                    style="cursor: pointer; transition: transform 0.15s ease;" />
        `;
    }

    // Peer polygon
    let peerPolySvg = '';
    if (showPeer) {
        peerPolySvg = `
            <polygon points="${peerPoints.join(' ')}" 
                     fill="rgba(245, 158, 11, 0.10)" 
                     stroke="#f59e0b" 
                     stroke-width="1.8" 
                     stroke-dasharray="4,4" />
        `;
    }

    // Farm polygon
    const farmPolySvg = `
        <defs>
            <radialGradient id="radarGlow-${containerId}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.55" />
                <stop offset="100%" stop-color="#022c24" stop-opacity="0.18" />
            </radialGradient>
        </defs>
        <polygon points="${farmPoints.join(' ')}" 
                 fill="url(#radarGlow-${containerId})" 
                 stroke="#10b981" 
                 stroke-width="2.6" />
    `;

    container.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="overflow: visible;">
            ${gridSvg}
            ${axesSvg}
            ${peerPolySvg}
            ${farmPolySvg}
            ${nodesSvg}
        </svg>
    `;

    // Attach interactive tooltip handlers
    if (tooltipId) {
        const tooltipEl = document.getElementById(tooltipId);
        if (tooltipEl) {
            container.querySelectorAll('.radar-interactive-node').forEach(node => {
                node.addEventListener('mouseenter', (e) => {
                    const pId = node.getAttribute('data-pillar');
                    const pName = node.getAttribute('data-pname');
                    const fScore = node.getAttribute('data-fscore');
                    const fPct = node.getAttribute('data-fpct');
                    const pScore = node.getAttribute('data-pscore');
                    const pPct = node.getAttribute('data-ppct');
                    const delta = parseInt(node.getAttribute('data-delta'), 10);

                    const deltaBadge = delta >= 0 
                        ? `<span style="color: #4ade80; font-weight: 700;">+${delta}% ahead</span>`
                        : `<span style="color: #f87171; font-weight: 700;">${delta}% gap</span>`;

                    tooltipEl.innerHTML = `
                        <div style="font-weight: 800; font-size: 0.84rem; margin-bottom: 0.25rem; color: #ffffff;">
                            Pillar ${pId}: ${pName}
                        </div>
                        <div style="display: flex; gap: 0.75rem; align-items: center; font-size: 0.78rem;">
                            <div>Farm: <strong style="color: #4ade80;">${fPct}%</strong> (${fScore}/3.00 pts)</div>
                            <div>Peer: <strong style="color: #fbbf24;">${pPct}%</strong> (${pScore}/3.00 pts)</div>
                        </div>
                        <div style="margin-top: 0.25rem; font-size: 0.74rem;">
                            Cohort Comparison: ${deltaBadge}
                        </div>
                    `;

                    const rect = node.getBoundingClientRect();
                    const parentRect = container.parentElement.getBoundingClientRect();
                    tooltipEl.style.left = `${rect.left - parentRect.left + rect.width / 2}px`;
                    tooltipEl.style.top = `${rect.top - parentRect.top}px`;
                    tooltipEl.classList.add('visible');
                    node.setAttribute('r', '7.5');
                });

                node.addEventListener('mouseleave', () => {
                    tooltipEl.classList.remove('visible');
                    node.setAttribute('r', '5.5');
                });
            });
        }
    }
}

// ─── 2. 12-Month Trajectory Default Risk Gauge & Sensitivity Drivers ────────
function renderTrajectoryRiskGauge(gaugeContainerId, headlineId, driversContainerId, ffmi, scoresMap = {}) {
    const gaugeContainer = document.getElementById(gaugeContainerId);
    const headlineEl = document.getElementById(headlineId);
    const driversContainer = document.getElementById(driversContainerId);

    // Compute priority gap depth
    const scores = Object.values(scoresMap).map(v => parseFloat(v) || 0.5);
    const minScore = scores.length > 0 ? Math.min(...scores) : 0.4;
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0.55;

    // Trajectory risk level calculation
    let riskLevel = 'Low';
    let riskConfidence = 88;
    let needleDeg = -45; // -60 (Low) to 0 (Med) to +60 (High)
    let headlineColor = 'var(--color-emerald-600)';
    let headlineText = 'Low Trajectory Risk (88% Model Confidence)';
    let subtext = 'Resilient capability foundation with minimal climate or market default vulnerability.';

    if (ffmi < 6.0 || minScore < 0.25) {
        riskLevel = 'High';
        riskConfidence = 92;
        needleDeg = 50;
        headlineColor = '#dc2626';
        headlineText = '🔴 High Trajectory Risk (92% Vulnerability)';
        subtext = 'Critical gap depth in core pillars. High exposure to seasonal climate and market price shocks.';
    } else if (ffmi < 16.0 || minScore < 0.45) {
        riskLevel = 'Medium';
        riskConfidence = 79;
        needleDeg = 0;
        headlineColor = '#d97706';
        headlineText = '🟡 Medium Trajectory Risk (79% Vulnerability)';
        subtext = 'Developing agronomic capabilities. Targeted interventions required in priority gap areas.';
    }

    if (headlineEl) {
        headlineEl.innerHTML = headlineText;
        headlineEl.style.color = headlineColor;
    }

    // Render semi-circular radial gauge SVG
    if (gaugeContainer) {
        gaugeContainer.innerHTML = `
            <svg width="220" height="141" viewBox="0 -16 220 141" style="overflow: visible;">
                <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#10b981" />
                        <stop offset="50%" stop-color="#f59e0b" />
                        <stop offset="100%" stop-color="#ef4444" />
                    </linearGradient>
                </defs>

                <!-- Background Arc -->
                <path d="M 25 105 A 85 85 0 0 1 195 105"
                      fill="none"
                      stroke="#e2ece6"
                      stroke-width="18"
                      stroke-linecap="round" />

                <!-- Active Gradient Arc -->
                <path d="M 25 105 A 85 85 0 0 1 195 105"
                      fill="none"
                      stroke="url(#gaugeGrad)"
                      stroke-width="16"
                      stroke-linecap="round" />

                <!-- Needle -->
                <g transform="translate(110, 105) rotate(${needleDeg})" style="transition: transform 0.8s var(--ease-out-expo);">
                    <polygon points="-4,-10 4,-10 0,-76" fill="#021e16" />
                    <circle cx="0" cy="0" r="8" fill="#021e16" />
                    <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
                </g>

                <!-- Zone Labels -->
                <text x="35" y="122" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#059669">LOW</text>
                <text x="110" y="-5" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#d97706" text-anchor="middle">MEDIUM</text>
                <text x="185" y="122" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#dc2626" text-anchor="end">HIGH</text>
            </svg>
        `;
    }

    // 4 Model Sensitivity Drivers
    if (driversContainer) {
        const p1 = parseFloat(scoresMap[1] || 0.6);
        const p2 = parseFloat(scoresMap[2] || 0.4);
        const p4 = parseFloat(scoresMap[4] || 0.5);
        const p5 = parseFloat(scoresMap[5] || 0.55);
        const p7 = parseFloat(scoresMap[7] || 0.45);

        const gapProtection = Math.round(minScore * 100);
        const climateProtection = Math.round(((p2 + p4) / 2) * 100);
        const marketBuffer = Math.round(((p5 + p7) / 2) * 100);
        const stabilityScore = Math.max(30, Math.round((1 - Math.abs(avgScore - minScore)) * 100));

        driversContainer.innerHTML = `
            <div class="risk-driver-item">
                <div class="risk-driver-header">
                    <span>Weakest Gap Resilience</span>
                    <span style="color: ${gapProtection > 50 ? '#059669' : '#dc2626'};">${gapProtection}% Protected</span>
                </div>
                <div class="risk-driver-track">
                    <div class="risk-driver-fill" style="width: ${gapProtection}%; background: ${gapProtection > 50 ? 'var(--color-emerald-500)' : '#ef4444'};"></div>
                </div>
            </div>

            <div class="risk-driver-item">
                <div class="risk-driver-header">
                    <span>Climate &amp; Water Shock Buffer</span>
                    <span style="color: ${climateProtection > 50 ? '#059669' : '#d97706'};">${climateProtection}% Protected</span>
                </div>
                <div class="risk-driver-track">
                    <div class="risk-driver-fill" style="width: ${climateProtection}%; background: ${climateProtection > 50 ? 'var(--color-emerald-500)' : '#f59e0b'};"></div>
                </div>
            </div>

            <div class="risk-driver-item">
                <div class="risk-driver-header">
                    <span>Market &amp; Cash Flow Stability</span>
                    <span style="color: ${marketBuffer > 50 ? '#059669' : '#d97706'};">${marketBuffer}% Protected</span>
                </div>
                <div class="risk-driver-track">
                    <div class="risk-driver-fill" style="width: ${marketBuffer}%; background: ${marketBuffer > 50 ? 'var(--color-emerald-500)' : '#f59e0b'};"></div>
                </div>
            </div>

            <div class="risk-driver-item">
                <div class="risk-driver-header">
                    <span>Cross-Pillar Practice Balance</span>
                    <span style="color: var(--color-emerald-600);">${stabilityScore}% Consistency</span>
                </div>
                <div class="risk-driver-track">
                    <div class="risk-driver-fill" style="width: ${stabilityScore}%; background: var(--color-emerald-500);"></div>
                </div>
            </div>
        `;
    }
}

// ─── 3. 5-Tier Transformation Maturity Milestone Ladder ─────────────────────
function renderTierMilestoneLadder(containerId, currentFfmi = 13.80, currentTier = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tiers = [
        { num: 1, name: 'Piloting Farm', min: 0.0, max: 5.99, icon: '🌱' },
        { num: 2, name: 'Transitioning Smallholder', min: 6.0, max: 10.99, icon: '🌿' },
        { num: 3, name: 'Commercializing Farm', min: 11.0, max: 15.99, icon: '🌾' },
        { num: 4, name: 'Established Agribusiness', min: 16.0, max: 20.99, icon: '🚜' },
        { num: 5, name: 'Lighthouse Leader', min: 21.0, max: 24.0, icon: '👑' }
    ];

    const nextTierObj = tiers.find(t => t.num === currentTier + 1);
    let nextTierBanner = '';

    if (nextTierObj) {
        const gapPts = Math.max(0.1, nextTierObj.min - currentFfmi);
        nextTierBanner = `
            <div class="next-tier-goal-banner">
                <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem;">
                        <span class="next-tier-badge-pill">Next Target: Tier ${nextTierObj.num}</span>
                        <strong style="font-size: 0.95rem; color: var(--color-pine-950);">${nextTierObj.name}</strong>
                    </div>
                    <p class="small muted" style="margin: 0;">
                        Target score: <strong>${nextTierObj.min.toFixed(2)} pts</strong> · Gap to close: <strong style="color: var(--color-emerald-600);">+${gapPts.toFixed(2)} pts</strong>
                    </p>
                </div>
                <div>
                    <button class="btn btn-primary btn-sm" onclick="showScreen('screen-journey');">View Action Quests ➔</button>
                </div>
            </div>
        `;
    } else {
        nextTierBanner = `
            <div class="next-tier-goal-banner" style="background: rgba(16, 185, 129, 0.1);">
                <div>
                    <span class="next-tier-badge-pill" style="background: #f59e0b;">Champion Status</span>
                    <strong style="margin-left: 0.5rem;">Tier 5 Lighthouse Farm Achieved! 👑</strong>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="tier-ladder-track">
            ${tiers.map(t => {
                const isCompleted = currentFfmi > t.max;
                const isActive = currentTier === t.num;
                const cssClass = isActive ? 'tier-milestone-step tier-active' : isCompleted ? 'tier-milestone-step tier-completed' : 'tier-milestone-step';
                const mark = isCompleted ? '✓ ' : '';
                return `
                    <div class="${cssClass}">
                        <div class="tier-step-num">${mark}Tier ${t.num}</div>
                        <div class="tier-step-name">${t.icon} ${t.name}</div>
                        <div class="tier-step-pts">${t.min.toFixed(0)}–${t.max.toFixed(0)} pts</div>
                    </div>
                `;
            }).join('')}
        </div>
        ${nextTierBanner}
    `;
}

// ─── 4. Projected Economic Dividend & Yield Impact Engine ───────────────────
function renderEconomicDividendChart(containerId, farmScores = {}, cropType = 'Maize', acreage = 5.0) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scores = Object.values(farmScores).map(v => parseFloat(v) || 0.5);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0.55;

    // Smallholder Agronomic Yield Model
    // Baseline Maize yield in Western Kenya: ~14.0 bags/acre
    // Max potential yield with Soil Health + Regenerative Water: ~28.0 bags/acre
    const baseYieldPerAcre = 14.0;
    const currentYieldPerAcre = baseYieldPerAcre * (1 + 0.65 * avgScore);
    const targetYieldPerAcre = 26.5;
    const yieldUpliftPct = Math.round(((currentYieldPerAcre - baseYieldPerAcre) / baseYieldPerAcre) * 100);

    const totalCurrentBags = (currentYieldPerAcre * acreage).toFixed(0);
    const totalTargetBags = (targetYieldPerAcre * acreage).toFixed(0);

    // Gross Margin Revenue Model (KES)
    // Avg price per bag: KES 3,600. Cost of production baseline: KES 22,000/acre
    const revenuePerAcre = currentYieldPerAcre * 3600;
    const grossMarginPerAcre = Math.max(12000, revenuePerAcre - 19500);
    const baseGrossMargin = 28000;
    const marginUpliftPct = Math.round(((grossMarginPerAcre - baseGrossMargin) / baseGrossMargin) * 100);

    const yieldPct = Math.min(100, Math.round((currentYieldPerAcre / targetYieldPerAcre) * 100));
    const soilCarbonUplift = Math.round(avgScore * 42);

    container.innerHTML = `
        <div class="economic-dividend-grid">
            <div class="economic-kpi-card">
                <div class="economic-kpi-header">
                    <span>Projected ${cropType} Yield</span>
                    <span>🌾 Bags / Acre</span>
                </div>
                <div class="economic-kpi-val">${currentYieldPerAcre.toFixed(1)} <small style="font-size: 0.85rem; font-family: Inter, sans-serif; font-weight: 500;">bags/ac</small></div>
                <div class="economic-kpi-delta">
                    <span>↑ +${yieldUpliftPct}% vs regional baseline</span>
                </div>
            </div>

            <div class="economic-kpi-card">
                <div class="economic-kpi-header">
                    <span>Net Gross Margin</span>
                    <span>💳 KES / Season</span>
                </div>
                <div class="economic-kpi-val">KES ${(grossMarginPerAcre * acreage).toLocaleString()}</div>
                <div class="economic-kpi-delta">
                    <span>↑ +${marginUpliftPct}% profitability dividend</span>
                </div>
            </div>
        </div>

        <div class="yield-comparison-bars">
            <div class="yield-bar-row">
                <div class="yield-bar-meta">
                    <span>Yield Efficiency (${totalCurrentBags} of ${totalTargetBags} bags max capacity)</span>
                    <strong style="color: var(--color-emerald-600);">${yieldPct}%</strong>
                </div>
                <div class="yield-bar-track">
                    <div class="yield-bar-fill" style="width: ${yieldPct}%; background: var(--color-emerald-500);"></div>
                </div>
            </div>

            <div class="yield-bar-row">
                <div class="yield-bar-meta">
                    <span>Soil Carbon &amp; Climate Resilience Index</span>
                    <strong style="color: var(--color-green-400);">+${soilCarbonUplift}% Organic Matter</strong>
                </div>
                <div class="yield-bar-track">
                    <div class="yield-bar-fill" style="width: ${Math.min(100, soilCarbonUplift * 2.2)}%; background: #059669;"></div>
                </div>
            </div>
        </div>
    `;
}

// ─── 5. Historical Multi-Cycle Trajectory Trend Line Chart ──────────────────
function renderHistoricalTrendChart(containerId, historyItems = []) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Synthesize longitudinal data if single or fresh account
    let points = [
        { label: 'Q1 Baseline', date: 'Jan 2026', ffmi: 10.50, tier: 2 },
        { label: 'Q2 Mid-Season', date: 'Apr 2026', ffmi: 12.20, tier: 3 },
        { label: 'Q3 Harvest Audit', date: 'Jul 2026', ffmi: 13.80, tier: 3 },
        { label: 'Q4 Target Goal', date: 'Oct 2026', ffmi: 17.50, tier: 4 }
    ];

    if (historyItems && historyItems.length >= 2) {
        points = historyItems.filter(h => h.ffmi_score !== null).map((h, i) => ({
            label: `Audit #${i + 1}`,
            date: (h.submitted_at || h.started_at || '').substring(0, 10),
            ffmi: parseFloat(h.ffmi_score),
            tier: h.tier || 1
        }));
    }

    const width = 640;
    const height = 180;
    const padL = 45;
    const padR = 25;
    const padT = 20;
    const padB = 30;

    const chartW = width - padL - padR;
    const chartH = height - padT - padB;
    const maxFfmi = 24.0;

    const xStep = chartW / (points.length - 1);

    const svgCoords = points.map((pt, i) => {
        const x = padL + i * xStep;
        const y = padT + chartH - (pt.ffmi / maxFfmi) * chartH;
        return { ...pt, x, y };
    });

    const pathD = svgCoords.reduce((acc, pt, i) => {
        return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    const areaD = `${pathD} L ${svgCoords[svgCoords.length - 1].x} ${padT + chartH} L ${svgCoords[0].x} ${padT + chartH} Z`;

    // Tier Threshold Guide Lines (Tier 2: 6.0, Tier 3: 11.0, Tier 4: 16.0, Tier 5: 21.0)
    const tierLines = [
        { val: 6.0, label: 'Tier 2 (6.0)' },
        { val: 11.0, label: 'Tier 3 (11.0)' },
        { val: 16.0, label: 'Tier 4 (16.0)' },
        { val: 21.0, label: 'Tier 5 (21.0)' }
    ];

    const guideLinesSvg = tierLines.map(t => {
        const y = padT + chartH - (t.val / maxFfmi) * chartH;
        return `
            <line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="#e2ece6" stroke-width="1" stroke-dasharray="3,3" />
            <text x="${padL - 6}" y="${y + 3}" font-family="Inter, sans-serif" font-size="9" fill="#8ba398" text-anchor="end">${t.val}</text>
        `;
    }).join('');

    const nodesSvg = svgCoords.map((pt, i) => `
        <g style="cursor: pointer;">
            <circle cx="${pt.x}" cy="${pt.y}" r="5" fill="#10b981" stroke="#ffffff" stroke-width="2.5" />
            <text x="${pt.x}" y="${padT + chartH + 18}" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#022c24" text-anchor="middle">${pt.label}</text>
            <text x="${pt.x}" y="${pt.y - 8}" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#065f46" text-anchor="middle">${pt.ffmi.toFixed(2)}</text>
        </g>
    `).join('');

    container.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; overflow: visible;">
            <defs>
                <linearGradient id="trendAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#10b981" stop-opacity="0.32" />
                    <stop offset="100%" stop-color="#10b981" stop-opacity="0.02" />
                </linearGradient>
            </defs>
            ${guideLinesSvg}
            <path d="${areaD}" fill="url(#trendAreaGrad)" />
            <path d="${pathD}" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            ${nodesSvg}
        </svg>
    `;
}

// ─── Responsive SVG chart sizing ──────────────────────────────────────────
// Charts re-measure their card and re-layout fonts/labels so text never
// overlaps or clips at any viewport width. Registered charts re-render on a
// debounced window resize when their measured width has actually changed.
const chartRerenderRegistry = new Map();

function measureChartWidth(containerId, fallback, min, max) {
    const el = document.getElementById(containerId);
    const cw = el ? Math.round(el.clientWidth || 0) : 0;
    return Math.max(min, Math.min(max, cw > 0 ? cw : fallback));
}

function estTextWidth(str, fontSize) {
    return String(str).length * fontSize * 0.56;
}

function fitLabel(str, fontSize, maxPx) {
    const s = String(str);
    if (estTextWidth(s, fontSize) <= maxPx) return s;
    const maxChars = Math.max(4, Math.floor((maxPx - fontSize * 0.56) / (fontSize * 0.56)));
    return s.slice(0, maxChars) + '…';
}

function registerResponsiveChart(containerId, renderFn) {
    chartRerenderRegistry.set(containerId, renderFn);
    if (window.__chartResizeBound) return;
    window.__chartResizeBound = true;
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            chartRerenderRegistry.forEach((fn, id) => {
                const el = document.getElementById(id);
                if (!el || el.clientWidth === 0) return;
                const lastW = parseInt(el.dataset.lastRenderedWidth || '0', 10);
                if (Math.abs(el.clientWidth - lastW) < 12) return;
                try { fn(); } catch (err) { console.warn(`chart re-render failed: ${id}`, err); }
            });
        }, 160);
    });
}

// ─── Gap-to-Next-Tier Waterfall ────────────────────────────────────────────
function renderGapWaterfall(containerId, farmScores = {}, currentFfmi = 13.80) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Tier threshold table (matches the locked FFMI bands)
    const tiers = [
        { num: 1, name: 'Piloting Farm',           min: 0.0,  max: 5.99 },
        { num: 2, name: 'Transitioning Smallholder', min: 6.0,  max: 10.99 },
        { num: 3, name: 'Commercializing Farm',    min: 11.0, max: 15.99 },
        { num: 4, name: 'Established Agribusiness', min: 16.0, max: 20.99 },
        { num: 5, name: 'Lighthouse Leader',       min: 21.0, max: 24.0 }
    ];

    // Identify the current tier and the next-tier threshold
    const currentTier = tiers.find(t => currentFfmi >= t.min && currentFfmi <= t.max) || tiers[0];
    const nextTier = tiers.find(t => t.num === currentTier.num + 1);
    const nextThreshold = nextTier ? nextTier.min : currentTier.max;

    // Per-pillar gap = (next-tier min) - (current pillar pts out of 3)
    // Each pillar contributes up to 3 pts; total possible = 24 pts.
    const pillarGaps = state.pillars.map(p => {
        const score = parseFloat(farmScores[p.id] || farmScores[String(p.id)] || 0.0);
        const pillarPts = score * 3.0;
        // Stepped threshold for the next tier (proportional)
        const pillarTarget = nextThreshold * (3.0 / 24.0);
        const gap = Math.max(0, pillarTarget - pillarPts);
        return {
            id: p.id, name: p.name, icon: p.icon,
            pillarPts, pillarTarget, gap
        };
    });

    const totalGap = pillarGaps.reduce((sum, g) => sum + g.gap, 0);
    const openCount = pillarGaps.filter(g => g.gap > 0.05).length;

    // Responsive geometry: viewBox tracks the measured card width so 1 svg px
    // ≈ 1 css px; fonts shrink at most ~22% before compact mode kicks in.
    const width = measureChartWidth(containerId, 720, 340, 760);
    const k = Math.max(0.78, Math.min(1, width / 720));
    const fs = v => v * k;
    const height = 292;
    const padL = Math.max(42, 70 * k);
    const padR = Math.max(18, 30 * k);
    const padT = 36;
    const padB = 86;
    const chartW = width - padL - padR;
    const chartH = height - padT - padB;
    const maxPts = 3.0;
    const barW = chartW / pillarGaps.length;
    const compact = barW < 56;

    const guideLinesSvg = [0, 1, 2, 3].map(v => {
        const y = padT + chartH - (v / maxPts) * chartH;
        return `
            <line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="#e2ece6" stroke-width="1" stroke-dasharray="3,3" />
            <text x="${padL - 6}" y="${y + 3 * k}" font-size="${fs(9).toFixed(1)}" fill="#8ba398" text-anchor="end">${v.toFixed(0)}</text>
        `;
    }).join('');

    const targetPts = pillarGaps[0].pillarTarget;
    const targetY = padT + chartH - (targetPts / maxPts) * chartH;
    const targetLineSvg = `
        <line x1="${padL}" y1="${targetY}" x2="${width - padR}" y2="${targetY}"
              stroke="#b45309" stroke-width="1.4" stroke-dasharray="6,4" opacity="0.8" />
        <text x="${width - padR}" y="${padT - 10 * k}" font-size="${fs(8.5).toFixed(1)}"
              font-weight="700" fill="#b45309" text-anchor="end">
            <tspan stroke="#ffffff" stroke-width="3" paint-order="stroke">– – next-tier target ${targetPts.toFixed(2)} pts / pillar</tspan>
        </text>
    `;

    const wrapName = (name, cpl) => {
        const words = String(name).split(/\s+/);
        let l1 = '', l2 = '';
        for (const wd of words) {
            if (!l2 && (l1 + ' ' + wd).trim().length <= cpl) l1 = (l1 + ' ' + wd).trim();
            else l2 = (l2 ? l2 + ' ' : '') + wd;
        }
        if (!l1) l1 = String(name).slice(0, cpl);
        if (l2.length > cpl) l2 = l2.slice(0, Math.max(3, cpl - 1)) + '…';
        return [l1, l2];
    };
    const nameCpl = Math.floor((barW * 0.96) / (8.2 * k * 0.56));

    const barsSvg = pillarGaps.map((g, i) => {
        const x = padL + i * barW + barW * 0.12;
        const w = barW * 0.76;
        const cxm = x + w / 2;
        const curH = Math.max(2, (g.pillarPts / maxPts) * chartH);
        const curY = padT + chartH - curH;
        const gapH = (g.gap / maxPts) * chartH;
        const gapY = curY - gapH;
        const gapClosed = g.gap <= 0.05;
        const stackTopY = gapClosed ? curY : gapY;
        const valLabel = compact
            ? `${g.pillarPts.toFixed(2)}${gapClosed ? ' ✓' : ''}`
            : `${g.pillarPts.toFixed(2)} / 3`;
        const gapRectSvg = gapClosed
            ? `<rect x="${x}" y="${gapY}" width="${w}" height="3" fill="#bbf7d0" rx="2" />`
            : `<rect x="${x}" y="${gapY}" width="${w}" height="${Math.max(gapH, 2)}"
                     fill="#f59e0b" stroke="#92400e" stroke-width="1" rx="3" opacity="0.85" />`;
        const gapLabelSvg = (!compact && !gapClosed && gapH >= 15)
            ? `<text x="${cxm}" y="${gapY + gapH / 2 + 3 * k}" font-size="${fs(8.6).toFixed(1)}"
                     font-weight="700" fill="#7c2d12" text-anchor="middle">+${g.gap.toFixed(2)} pts</text>`
            : '';
        const [nl1, nl2] = wrapName(g.name, nameCpl);
        return `
            <g style="cursor: pointer;">
                ${gapRectSvg}
                <rect x="${x}" y="${curY}" width="${w}" height="${curH}"
                      fill="#10b981" stroke="#065f46" stroke-width="1" rx="3" />
                ${gapLabelSvg}
                <text x="${cxm}" y="${stackTopY - 4 * k}" font-size="${fs(9).toFixed(1)}"
                      font-weight="700" fill="${gapClosed ? '#16a34a' : '#065f46'}" text-anchor="middle">${valLabel}</text>
                <text x="${cxm}" y="${padT + chartH + 13 * k + 4}" font-size="${fs(9.6).toFixed(1)}"
                      font-weight="700" fill="#022c24" text-anchor="middle">${g.icon} P${g.id}</text>
                <text x="${cxm}" y="${padT + chartH + 23 * k + 4}" font-size="${fs(8.2).toFixed(1)}"
                      fill="#475569" text-anchor="middle">${nl1}</text>
                ${nl2 ? `<text x="${cxm}" y="${padT + chartH + 33 * k + 4}" font-size="${fs(8.2).toFixed(1)}"
                      fill="#475569" text-anchor="middle">${nl2}</text>` : ''}
            </g>
        `;
    }).join('');

    const footWide = width >= 650;
    const footersSvg = `
        <text x="${padL}" y="${height - 36}" font-size="${fs(9.5).toFixed(1)}" font-weight="700" fill="#475569">Current Tier: <tspan fill="#065f46">Tier ${currentTier.num} (${currentTier.name})</tspan></text>
        ${footWide
            ? `<text x="${width - padR}" y="${height - 36}" font-size="${fs(9.5).toFixed(1)}" font-weight="700" fill="#475569" text-anchor="end">Next Tier Threshold: <tspan fill="#7c2d12">${nextThreshold.toFixed(1)} pts (${nextTier ? nextTier.name : '—'})</tspan></text>`
            : `<text x="${padL}" y="${height - 6}" font-size="${fs(9.5).toFixed(1)}" font-weight="700" fill="#475569">Next Tier Threshold: <tspan fill="#7c2d12">${nextThreshold.toFixed(1)} pts</tspan>${nextTier ? ` → ${fitLabel(nextTier.name, fs(9.5), width - padL - padR - estTextWidth('Next Tier Threshold: XX.X pts → ', 9.5))}` : ''}</text>`}
        <text x="${padL}" y="${footWide ? height - 21 : height - 21}" font-size="${fs(9).toFixed(1)}" fill="#475569"><tspan font-style="italic">${totalGap <= 0.05
            ? 'All pillars at or beyond the next-tier threshold — ready to certify.'
            : `Total closing work: <tspan font-weight="700" fill="#7c2d12">${totalGap.toFixed(2)} pts</tspan> across ${openCount} pillar(s).`}</tspan></text>
    `;

    container.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto;">
            ${guideLinesSvg}
            ${targetLineSvg}
            ${barsSvg}
            <line x1="${padL}" y1="${padT + chartH}" x2="${width - padR}" y2="${padT + chartH}"
                  stroke="#022c24" stroke-width="1.5" />
            ${footersSvg}
        </svg>
    `;
    container.dataset.lastRenderedWidth = String(width);
    registerResponsiveChart(containerId, () => renderGapWaterfall(containerId, farmScores, currentFfmi));
}

// ─── Impact vs Effort Priority Matrix ──────────────────────────────────────
function renderPriorityMatrix(containerId, farmScores = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Heuristic scoring per pillar:
    // Impact = how low the pillar is relative to the FFMI average (lower → bigger opportunity).
    // Effort = standard 1-3 scale (Quick Win < 3mo, Medium < 12mo, Strategic > 12mo) encoded as a cost score.
    const effortDefaults = {
        1: 1.6, // Soil & Land Health — relatively fast wins
        2: 2.4, // Water Stewardship — capital-heavy
        3: 1.3, // Crop Mgmt & Biodiversity — quickest gains
        4: 2.7, // Energy / Infra — capital-heavy
        5: 1.9, // Farm Economy — knowledge-heavy
        6: 1.4, // Labour / Safety — policy-driven
        7: 1.7, // Waste / Circularity — moderate
        8: 2.2  // Governance — slow-burn
    };

    // Use score deviation from FFMI average as Impact (inverted: lower score = higher impact).
    const pillarVals = state.pillars.map(p => parseFloat(farmScores[p.id] || farmScores[String(p.id)] || 0.5));
    const meanScore = pillarVals.reduce((s, v) => s + v, 0) / pillarVals.length;
    const dots = state.pillars.map((p, i) => {
        const score = pillarVals[i];
        const gap = Math.max(0, 0.85 - score); // distance from "advanced" target
        const impact = Math.min(3.0, gap * 4.5 + (1 - meanScore) * 0.6); // 1..3 scale
        const effort = effortDefaults[p.id] || 2.0;
        return {
            id: p.id, name: p.name, icon: p.icon,
            impact, effort, score
        };
    });

    const width = measureChartWidth(containerId, 600, 320, 640);
    const k = Math.max(0.75, Math.min(1, width / 600));
    const fs = v => v * k;
    const height = 372;
    const padL = Math.max(34, 56 * k);
    const padR = 24;
    const padT = 24;
    const padB = 40;
    const chartW = width - padL - padR;
    const chartH = height - padT - padB;

    // Scale axes 1..3
    const xToPx = x => padL + ((x - 1) / 2) * chartW;
    const yToPx = y => padT + (1 - (y - 1) / 2) * chartH;

    // Quadrant background tints
    const quadrantMidX = xToPx(2);
    const quadrantMidY = yToPx(2);
    const quadrants = `
        <rect x="${padL}" y="${padT}" width="${quadrantMidX - padL}" height="${quadrantMidY - padT}"
              fill="#d1fae5" opacity="0.55" />
        <rect x="${quadrantMidX}" y="${padT}" width="${padL + chartW - quadrantMidX}" height="${quadrantMidY - padT}"
              fill="#fef3c7" opacity="0.55" />
        <rect x="${padL}" y="${quadrantMidY}" width="${quadrantMidX - padL}" height="${padT + chartH - quadrantMidY}"
              fill="#e0e7ff" opacity="0.40" />
        <rect x="${quadrantMidX}" y="${quadrantMidY}" width="${padL + chartW - quadrantMidX}" height="${padT + chartH - quadrantMidY}"
              fill="#fee2e2" opacity="0.45" />
        <line x1="${quadrantMidX}" y1="${padT}" x2="${quadrantMidX}" y2="${padT + chartH}"
              stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="4,4" />
        <line x1="${padL}" y1="${quadrantMidY}" x2="${padL + chartW}" y2="${quadrantMidY}"
              stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="4,4" />
    `;

    // Quadrant tags live INSIDE the plot corners so nothing clips at the edges.
    const quadrantTags = [
        { x: padL + 8, y: padT + 14 * k, a: 'start', c: '#065f46', t: k >= 0.9 ? '⚡ QUICK WINS · low effort' : '⚡ QUICK WINS' },
        { x: padL + chartW - 8, y: padT + 14 * k, a: 'end', c: '#7c2d12', t: k >= 0.9 ? '🪨 STRATEGIC BETS · high effort' : '🪨 STRATEGIC BETS' },
        { x: padL + 8, y: padT + chartH - 8, a: 'start', c: '#3730a3', t: 'FILL-INS' },
        { x: padL + chartW - 8, y: padT + chartH - 8, a: 'end', c: '#991b1b', t: k >= 0.9 ? 'DEFER · low impact' : 'DEFER' }
    ].map(q => `
        <text x="${q.x}" y="${q.y}" font-size="${fs(9.5).toFixed(1)}" font-weight="800"
              fill="${q.c}" text-anchor="${q.a}" opacity="0.95">${q.t}</text>
    `).join('');

    // Axis titles
    const axisLabels = `
        <text x="${padL + chartW / 2}" y="${height - 10}" font-size="${fs(9.5).toFixed(1)}"
              font-weight="700" fill="#475569" text-anchor="middle">Effort (Low → High)</text>
        <text transform="rotate(-90 ${padL - 22} ${padT + chartH / 2})" x="${padL - 22}" y="${padT + chartH / 2}"
              font-size="${fs(9.5).toFixed(1)}" font-weight="700" fill="#475569" text-anchor="middle">Impact (Low → High)</text>
        <text x="${padL - 7}" y="${padT + 10 * k}" font-size="${fs(9).toFixed(1)}"
              font-weight="700" fill="#64748b" text-anchor="end">High ↑</text>
        <text x="${padL - 7}" y="${padT + chartH - 5}" font-size="${fs(9).toFixed(1)}"
              font-weight="700" fill="#64748b" text-anchor="end">Low ↓</text>
    `;

    // Dots — labels flip inside the right edge and dodge vertically when dots cluster
    const placed = [];
    const labelDys = [4, -9, 18, -19];
    const dotsSvg = dots.map(d => {
        const cx = xToPx(d.effort);
        const cy = yToPx(d.impact);
        const isQuickWin = d.impact >= 2 && d.effort < 2;
        const isStrategic = d.impact >= 2 && d.effort >= 2;
        const color = isQuickWin ? '#16a34a' : (isStrategic ? '#dc2626' : '#6366f1');
        let slot = 0;
        placed.forEach(q => {
            if (Math.abs(q.x - cx) < 32 && Math.abs(q.y - cy) < 32) slot = Math.max(slot, q.slot + 1);
        });
        placed.push({ x: cx, y: cy, slot });
        const flip = cx > padL + chartW - 96;
        const lx = flip ? cx - 17 : cx + 17;
        const anchor = flip ? 'end' : 'start';
        const ly = cy + labelDys[Math.min(slot, 3)];
        const nameLab = fitLabel(`${d.icon} ${d.name}`, fs(9.2), flip ? 82 : 92);
        return `
            <g style="cursor: pointer;">
                <circle cx="${cx}" cy="${cy}" r="17" fill="${color}" opacity="0.14" />
                <circle cx="${cx}" cy="${cy}" r="13" fill="${color}" opacity="0.82"
                        stroke="white" stroke-width="2.5" />
                <text x="${cx}" y="${cy + 3.5 * k}" font-size="${fs(10).toFixed(1)}"
                      font-weight="700" fill="white" text-anchor="middle">P${d.id}</text>
                <text x="${lx}" y="${ly}" font-size="${fs(9.2).toFixed(1)}"
                      fill="#022c24" text-anchor="${anchor}">${nameLab}</text>
            </g>
        `;
    }).join('');

    container.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto;">
            ${quadrants}
            ${axisLabels}
            ${quadrantTags}
            <line x1="${padL}" y1="${padT + chartH}" x2="${padL + chartW}" y2="${padT + chartH}"
                  stroke="#022c24" stroke-width="1.5" />
            <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + chartH}"
                  stroke="#022c24" stroke-width="1.5" />
            ${dotsSvg}
        </svg>
    `;
    container.dataset.lastRenderedWidth = String(width);
    registerResponsiveChart(containerId, () => renderPriorityMatrix(containerId, farmScores));
}

// ─── Before / After Reassessment Butterfly Chart ─────────────────────────────
function renderButterflyChart(containerId, pillarDeltas = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Synthesise baseline → current delta data if not supplied (matches Kakamega demo profile)
    const baseline = {
        1: 0.45, 2: 0.30, 3: 0.50, 4: 0.40,
        5: 0.32, 6: 0.42, 7: 0.35, 8: 0.28
    };
    const current = {
        1: 0.80, 2: 0.38, 3: 0.65, 4: 0.70,
        5: 0.55, 6: 0.60, 7: 0.42, 8: 0.50
    };
    const pairs = state.pillars.map(p => {
        const b = (pillarDeltas && pillarDeltas[p.id]) ? pillarDeltas[p.id].baseline : (baseline[p.id] || 0);
        const c = (pillarDeltas && pillarDeltas[p.id]) ? pillarDeltas[p.id].current : (current[p.id] || 0);
        const delta = c - b;
        return { id: p.id, name: p.name, icon: p.icon, baseline: b, current: c, delta };
    });

    const width = measureChartWidth(containerId, 700, 320, 760);
    const k = Math.max(0.75, Math.min(1, width / 700));
    const fs = v => v * k;
    const height = 322;
    const padL = Math.max(78, 112 * k);
    const padR = Math.max(64, 112 * k);
    const padT = 26;
    const padB = 34;
    const chartW = width - padL - padR;
    const chartH = height - padT - padB;
    const centerX = padL + chartW / 2;

    // Max delta in absolute value (anchor both sides symmetrically)
    const maxAbs = Math.max(0.05, ...pairs.map(p => Math.abs(p.delta)));
    const halfW = chartW / 2;
    const xToPx = d => centerX + (d / maxAbs) * halfW;
    const rowH = chartH / pairs.length;

    // Center-out headers grow away from each other so they can never collide,
    // and share no row with a center title (caption moved below the axis).
    const headers = `
        <text x="${centerX - 10}" y="${padT - 9}" font-size="${fs(10).toFixed(1)}"
              font-weight="800" fill="#dc2626" text-anchor="end">${k >= 0.95 ? '← Capability lost' : '← Lost'}</text>
        <text x="${centerX + 10}" y="${padT - 9}" font-size="${fs(10).toFixed(1)}"
              font-weight="800" fill="#16a34a" text-anchor="start">${k >= 0.95 ? 'Capability gained →' : 'Gained →'}</text>
    `;

    // Tick marks at -max, -50%, 0, +50%, +max
    const tickSvg = [-1, -0.5, 0, 0.5, 1].map(t => {
        const x = centerX + t * halfW;
        const pct = (t * maxAbs * 100).toFixed(0);
        return `
            <line x1="${x}" y1="${padT + chartH}" x2="${x}" y2="${padT + chartH + 4}"
                  stroke="#94a3b8" stroke-width="1" />
            <text x="${x}" y="${padT + chartH + 15}" font-size="${fs(8.4).toFixed(1)}"
                  fill="#64748b" text-anchor="middle">${t === 0 ? '0' : (pct > 0 ? '+' + pct + '%' : pct + '%')}</text>
        `;
    }).join('');

    const barsSvg = pairs.map((p, i) => {
        const y = padT + i * rowH + rowH * 0.18;
        const h = rowH * 0.64;
        const isGain = p.delta >= 0;
        const color = isGain ? '#16a34a' : '#dc2626';
        const xStart = isGain ? centerX : xToPx(p.delta);
        const xEnd = isGain ? xToPx(p.delta) : centerX;
        const w = Math.max(2, Math.abs(xEnd - xStart));
        const nameLab = fitLabel(`${p.icon} P${p.id} ${p.name}`, fs(10.2), padL - 16);
        const subLab = width >= 520
            ? fitLabel(`baseline ${(p.baseline * 100).toFixed(0)}% → ${(p.current * 100).toFixed(0)}%`, fs(8.4), padL - 16)
            : null;
        const dLab = `${isGain ? '+' : ''}${(p.delta * 100).toFixed(1)}%`;
        const dLabW = estTextWidth(dLab, fs(9.8));
        let dX, dAnchor, inside;
        if (isGain) {
            if (xEnd + 6 + dLabW <= width - 6) { dX = xEnd + 6; dAnchor = 'start'; inside = false; }
            else { dX = xEnd - 6; dAnchor = 'end'; inside = true; }
        } else {
            if (xStart - 6 - dLabW >= 6) { dX = xStart - 6; dAnchor = 'end'; inside = false; }
            else { dX = xStart + 6; dAnchor = 'start'; inside = true; }
        }
        const dFill = inside ? '#ffffff' : color;
        return `
            <g style="cursor: pointer;">
                <text x="${padL - 8}" y="${y + h / 2 + (subLab ? -1 : 3.5)}" font-size="${fs(10.2).toFixed(1)}"
                      font-weight="700" fill="#022c24" text-anchor="end">${nameLab}</text>
                ${subLab ? `<text x="${padL - 8}" y="${y + h / 2 + 11}" font-size="${fs(8.4).toFixed(1)}"
                      fill="#64748b" text-anchor="end">${subLab}</text>` : ''}
                <rect x="${xStart}" y="${y}" width="${w}" height="${h}" fill="${color}"
                      stroke="${isGain ? '#065f46' : '#7f1d1d'}" stroke-width="0.8" rx="3" opacity="0.88" />
                <text x="${dX}" y="${y + h / 2 + 3.5}" font-size="${fs(9.8).toFixed(1)}" font-weight="700"
                      fill="${dFill}" text-anchor="${dAnchor}">${dLab}</text>
            </g>
        `;
    }).join('');

    container.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto;">
            <line x1="${centerX}" y1="${padT}" x2="${centerX}" y2="${padT + chartH}"
                  stroke="#022c24" stroke-width="1.4" />
            ${headers}
            ${barsSvg}
            ${tickSvg}
            <text x="${centerX}" y="${height - 4}" font-size="${fs(9).toFixed(1)}" font-style="italic"
                  fill="#64748b" text-anchor="middle">Δ pillar capability (after − before)</text>
        </svg>
    `;
    container.dataset.lastRenderedWidth = String(width);
    registerResponsiveChart(containerId, () => renderButterflyChart(containerId, pillarDeltas));
}

// ─── Regional FFMI Distribution (Violin + Box) — Frontend SVG variant ──────
function renderRegionalViolin(containerId, currentRegion = 'Western Kenya') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Synthesised cohort samples per region (n ≈ 60-80) reproducing published regional FFMI averages.
    const seed = (s) => {
        // Simple deterministic PRNG (mulberry32-lite) so re-renders are stable.
        let t = s + 0x6D2B79F5;
        return () => {
            t = (t + 0x6D2B79F5) | 0;
            let x = Math.imul(t ^ (t >>> 15), 1 | t);
            x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
            return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
        };
    };

    const regionMeta = [
        { id: 'wk', label: 'Western\nKenya',       mean: 9.80, std: 3.4, seed: 7 },
        { id: 'rv', label: 'Rift\nValley',         mean: 11.20, std: 3.2, seed: 19 },
        { id: 'ch', label: 'Central\nHighlands',   mean: 12.40, std: 3.1, seed: 31 },
        { id: 'es', label: 'Eastern\nSemi-Arid',   mean: 8.50, std: 3.7, seed: 43 },
        { id: 'cl', label: 'Coastal\nLowlands',    mean: 8.10, std: 3.6, seed: 59 }
    ];

    const colors = { wk: '#16a34a', rv: '#0ea5e9', ch: '#f59e0b', es: '#dc2626', cl: '#7c3aed' };
    const regionKey = {
        'Western Kenya': 'wk', 'Rift Valley': 'rv', 'Central Kenya': 'ch',
        'Central Highlands': 'ch', 'Eastern Kenya': 'es', 'Eastern Semi-Arid': 'es',
        'Coast': 'cl', 'Coastal Lowlands': 'cl'
    };
    const highlighted = regionKey[currentRegion] || 'wk';

    const samples = regionMeta.map(rm => {
        const rng = seed(rm.seed);
        const pts = [];
        for (let i = 0; i < 64; i++) {
            // Box-Muller transform for normal samples
            const u1 = Math.max(rng(), 1e-9);
            const u2 = rng();
            const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            pts.push(Math.max(0.5, Math.min(24, rm.mean + z * rm.std)));
        }
        // Compute quartiles
        const sorted = [...pts].sort((a, b) => a - b);
        const q = (p) => sorted[Math.floor((sorted.length - 1) * p)];
        return {
            ...rm, points: sorted,
            min: sorted[0], q1: q(0.25), median: q(0.5), q3: q(0.75), max: sorted[sorted.length - 1],
            color: colors[rm.id]
        };
    });

    const width = measureChartWidth(containerId, 720, 320, 760);
    const k = Math.max(0.78, Math.min(1, width / 720));
    const fs = v => v * k;
    const height = 300;
    const padL = Math.max(40, 64 * k);
    const padR = 22;
    const padT = 16;
    const padB = 58;
    const chartW = width - padL - padR;
    const chartH = height - padT - padB;
    const maxFfmi = 24.0;

    // KDE kernel for each region (Gaussian, bandwidth = std / 2)
    const kde = (samples, x, bw) => {
        let s = 0;
        for (const v of samples) {
            const t = (x - v) / bw;
            s += Math.exp(-0.5 * t * t);
        }
        return s / (samples.length * bw * Math.sqrt(2 * Math.PI));
    };

    // Numeric y scale behind the tier guide lines
    const yAxisSvg = [0, 6, 12, 18, 24].map(v => {
        const y = padT + chartH - (v / maxFfmi) * chartH;
        return `
            <line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="#eef2f7" stroke-width="1" />
            <text x="${padL - 6}" y="${y + 3 * k}" font-size="${fs(8).toFixed(1)}" fill="#8ba398" text-anchor="end">${v}</text>
        `;
    }).join('');

    // Tier threshold lines
    const tierLines = [
        { val: 6.0, label: 'T2', color: '#94a3b8' },
        { val: 11.0, label: 'T3', color: '#0d9488' },
        { val: 16.0, label: 'T4', color: '#f59e0b' },
        { val: 21.0, label: 'T5', color: '#dc2626' }
    ];
    const tierSvg = tierLines.map(t => {
        const y = padT + chartH - (t.val / maxFfmi) * chartH;
        return `
            <line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}"
                  stroke="${t.color}" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.55" />
            <text x="${width - padR - 4}" y="${y - 3 * k}" font-size="${fs(8).toFixed(1)}"
                  font-weight="700" fill="${t.color}" opacity="0.9" text-anchor="end">${t.label}</text>
        `;
    }).join('');

    // For each region, build a symmetric violin silhouette by sampling the KDE
    const violinW = chartW / samples.length;
    const xGrid = [];
    for (let i = 0; i <= 60; i++) xGrid.push(0.5 + (i / 60) * (maxFfmi - 1));

    const violinSvg = samples.map((s, i) => {
        const cx = padL + (i + 0.5) * violinW;
        const halfViolinW = violinW * 0.42;
        const bw = s.std / 2.0;

        const top = [];
        const bot = [];
        let maxDensity = 0;
        for (const x of xGrid) {
            const d = kde(s.points, x, bw);
            if (d > maxDensity) maxDensity = d;
        }
        const scale = maxDensity > 0 ? (halfViolinW / maxDensity) : 0;

        for (let kk = 0; kk < xGrid.length; kk++) {
            const x = xGrid[kk];
            const yPx = padT + chartH - (x / maxFfmi) * chartH;
            const d = kde(s.points, x, bw);
            const halfW = d * scale;
            top.push([cx - halfW, yPx]);
            bot.push([cx + halfW, yPx]);
        }
        const polyPath = [...top, ...bot.reverse()].map(p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');

        // Box plot overlay
        const yMin = padT + chartH - (s.min / maxFfmi) * chartH;
        const yQ1 = padT + chartH - (s.q1 / maxFfmi) * chartH;
        const yMed = padT + chartH - (s.median / maxFfmi) * chartH;
        const yQ3 = padT + chartH - (s.q3 / maxFfmi) * chartH;
        const yMax = padT + chartH - (s.max / maxFfmi) * chartH;
        const boxW = Math.min(10, halfViolinW * 0.18);
        const isHi = s.id === highlighted;
        const muY = Math.max(padT + 9 * k, yMax - 5 * k);

        return `
            <g style="cursor: pointer;">
                <polygon points="${polyPath}" fill="${s.color}" opacity="${isHi ? 0.55 : 0.30}"
                         stroke="${s.color}" stroke-width="${isHi ? 1.8 : 1.0}" />
                <line x1="${cx}" y1="${yMin}" x2="${cx}" y2="${yMax}"
                      stroke="${s.color}" stroke-width="1.2" opacity="0.85" />
                <rect x="${cx - boxW}" y="${yQ3}" width="${boxW * 2}" height="${yQ1 - yQ3}"
                      fill="white" opacity="0.92" stroke="${s.color}" stroke-width="1.2" />
                <line x1="${cx - boxW}" y1="${yMed}" x2="${cx + boxW}" y2="${yMed}"
                      stroke="#022c24" stroke-width="2.2" />
                <text x="${cx}" y="${muY}" font-size="${fs(8.4).toFixed(1)}"
                      font-weight="700" fill="#022c24" text-anchor="middle"
                      stroke="#ffffff" stroke-width="2.5" paint-order="stroke">μ ${s.mean.toFixed(1)}</text>
                <text x="${cx}" y="${padT + chartH + 13 * k + 4}" font-size="${fs(9.4).toFixed(1)}"
                      font-weight="${isHi ? 800 : 600}"
                      fill="${isHi ? s.color : '#1e293b'}" text-anchor="middle">
                    ${s.label.split('\n')[0]}
                </text>
                ${violinW >= 56 ? `<text x="${cx}" y="${padT + chartH + 24 * k + 4}" font-size="${fs(8.4).toFixed(1)}"
                      font-weight="${isHi ? 800 : 500}"
                      fill="${isHi ? s.color : '#475569'}" text-anchor="middle">
                    ${s.label.split('\n')[1] || ''}
                </text>` : ''}
                ${isHi ? `<rect x="${cx - halfViolinW - 4}" y="${padT}" width="${halfViolinW * 2 + 8}"
                        height="${chartH}" fill="none" stroke="${s.color}"
                        stroke-width="2" stroke-dasharray="5,4" rx="6" opacity="0.65" />` : ''}
            </g>
        `;
    }).join('');

    container.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto;">
            ${yAxisSvg}
            ${tierSvg}
            ${violinSvg}
            <line x1="${padL}" y1="${padT + chartH}" x2="${padL + chartW}" y2="${padT + chartH}"
                  stroke="#022c24" stroke-width="1.4" />
            <text x="${padL}" y="${height - 6}" font-size="${fs(8.8).toFixed(1)}" fill="#475569">
                Highlighted: <tspan font-weight="700" fill="${colors[highlighted]}">${fitLabel(currentRegion, fs(8.8), 110)}</tspan><tspan fill="#94a3b8"> · </tspan>n = 64 farms / zone · violin = Gaussian-KDE density · box = IQR + median
            </text>
        </svg>
    `;
    container.dataset.lastRenderedWidth = String(width);
    registerResponsiveChart(containerId, () => renderRegionalViolin(containerId, currentRegion));
}

// ─── Results Screen Orchestrator ────────────────────────────────────────────
function renderResultsScreen(res) {
    const tierEl = document.getElementById('result-tier');
    const ffmiEl = document.getElementById('result-ffmi');
    const riskBadge = document.getElementById('result-risk-badge');
    const strongestEl = document.getElementById('result-strongest');
    const priorityGapEl = document.getElementById('result-priority-gap');

    const ffmi = res.ffmi_score || 0.0;
    const tier = res.tier || 1;
    const tierName = res.tier_name || 'Piloting Farm';

    if (tierEl) tierEl.textContent = `${tierName} (Tier ${tier})`;
    if (ffmiEl) ffmiEl.textContent = `${ffmi.toFixed(2)} / 24.00`;

    if (riskBadge) {
        if (tier >= 4) {
            riskBadge.textContent = '🟢 Low Trajectory Risk';
            riskBadge.className = 'badge badge-success';
        } else if (tier >= 2) {
            riskBadge.textContent = '🟡 Medium Trajectory Risk';
            riskBadge.className = 'badge badge-warning';
        } else {
            riskBadge.textContent = '🔴 High Trajectory Risk';
            riskBadge.className = 'badge badge-danger';
        }
    }

    if (strongestEl) strongestEl.textContent = res.strongest_pillar || 'Soil & Land Health';
    if (priorityGapEl) priorityGapEl.textContent = res.priority_gap_pillar || 'Water Stewardship';

    // Render 4 interactive results charts
    const pScores = res.pillar_scores || {};
    renderInteractiveRadarChart('result-radar-chart', pScores, null, 'result-radar-tooltip', true);
    renderTrajectoryRiskGauge('result-risk-gauge', 'result-risk-headline', 'result-risk-drivers', ffmi, pScores);
    renderTierMilestoneLadder('result-tier-ladder', ffmi, tier);
    renderPillarBars('result-pillar-bars', pScores);
    renderGapWaterfall('result-gap-waterfall', pScores, ffmi);
    renderPriorityMatrix('result-priority-matrix', pScores);

    // Toggle peer benchmark listener
    const togglePeer = document.getElementById('toggle-result-peer-benchmark');
    if (togglePeer) {
        togglePeer.onchange = () => {
            renderInteractiveRadarChart('result-radar-chart', pScores, null, 'result-radar-tooltip', togglePeer.checked);
        };
    }

    const recsList = document.getElementById('result-recommendations');
    if (recsList) {
        const recs = res.recommendations || [];
        if (recs.length === 0) {
            recsList.innerHTML = '<li class="muted">All answered capabilities meet established thresholds.</li>';
        } else {
            recsList.innerHTML = recs.slice(0, 5).map(r => `
                <li style="background: var(--color-canvas); padding: 1.1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border-light); box-shadow: var(--shadow-soft);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                        <span class="badge badge-success" style="font-size: 0.72rem;">${(r.priority || 'Action').toUpperCase().replace('_', ' ')}</span>
                        <strong style="font-size: 0.95rem;">${r.action}</strong>
                    </div>
                    <div class="small muted" style="padding-left: 0.25rem;">
                        <em>Why it matters:</em> ${r.why_it_matters || 'Improves farm capability score.'}
                    </div>
                </li>
            `).join('');
        }
    }

    initSectionTabs(state.assessment.id, res);

    const btnPdf = document.getElementById('btn-download-pdf');
    if (btnPdf) {
        btnPdf.onclick = () => {
            window.open(`/api/assessments/${state.assessment.id}/pdf`, '_blank');
        };
    }
}

function renderPillarBars(containerId, scoresMap) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = state.pillars.map(p => {
        const score = parseFloat(scoresMap[p.id] || scoresMap[String(p.id)] || 0.0);
        const pct = Math.round(score * 100);
        const points = (score * 3.0).toFixed(2);
        return `
            <div style="background: var(--color-canvas); padding: 0.75rem 1rem; border-radius: var(--radius-sm);">
                <div style="display: flex; justify-content: space-between; font-size: 0.84rem; font-weight: 700; margin-bottom: 0.35rem;">
                    <span>${p.icon} Pillar ${p.id}: ${p.name}</span>
                    <span style="color: var(--color-emerald-500);">${pct}% (${points}/3.00 pts)</span>
                </div>
                <div class="quest-progress-track" style="height: 6px;">
                    <div class="quest-progress-fill" style="width: ${pct}%;"></div>
                </div>
            </div>
        `;
    }).join('');
}

function initSectionTabs(assessmentId, res) {
    const tabsContainer = document.getElementById('section-tabs-container');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = state.pillars.map((p, idx) => `
        <button class="filter-pill ${idx === 0 ? 'active' : ''}" data-pillar-id="${p.id}" type="button">
            ${p.icon} P${p.id}
        </button>
    `).join('');

    tabsContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            tabsContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const pId = parseInt(btn.getAttribute('data-pillar-id'), 10);
            loadSectionDetail(assessmentId, pId);
        });
    });

    loadSectionDetail(assessmentId, 1);
}

async function loadSectionDetail(assessmentId, pillarId) {
    try {
        const data = await apiCall(`/api/assessments/${assessmentId}/sections/${pillarId}`);
        const pObj = state.pillars.find(p => p.id === pillarId) || {};

        document.getElementById('section-title').textContent = `Pillar ${pillarId}: ${data.pillar_name || pObj.name}`;
        document.getElementById('section-principle').textContent = data.pillar_principle || pObj.principle || '';
        document.getElementById('section-guiding-question').textContent = `❓ Guiding Question: "${data.pillar_guiding_question || ''}"`;
        document.getElementById('section-score-badge').textContent = `${Math.round((data.section_score || 0) * 100)}% (${(data.section_points || 0).toFixed(2)}/3.00 pts)`;
        
        const statusPill = document.getElementById('section-status-pill');
        if (statusPill) {
            statusPill.textContent = (data.status_band || 'Established').toUpperCase();
        }

        const capsList = document.getElementById('section-capabilities-list');
        if (capsList && data.capabilities) {
            capsList.innerHTML = data.capabilities.map(c => `
                <div class="card" style="padding: 1rem; background: var(--color-canvas);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                        <strong style="font-size: 0.88rem;">${c.capability_id}: ${c.capability_name}</strong>
                        <span class="badge badge-success">${(c.status || 'basic').replace('_', ' ')}</span>
                    </div>
                    <div class="small muted">
                        Score: ${c.yes_count}/${c.total_questions} Yes (${Math.round(c.score_fraction * 100)}%)
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        console.warn('Section detail error:', err);
    }
}

// ─── 5. History & Comparison ────────────────────────────────────────────────
async function loadAssessmentHistory() {
    const container = document.getElementById('history-list-container');
    const compareBtn = document.getElementById('btn-compare-selected');
    if (!container) return;

    state.selectedHistoryIds = [];
    if (compareBtn) compareBtn.disabled = true;

    try {
        const history = await apiCall('/api/assessments/history');
        state.history = history;

        // Render historical multi-cycle trajectory trend chart
        renderHistoricalTrendChart('history-trajectory-chart', history || []);

        // Render Before/After Butterfly if there are ≥2 comparable assessments
        if (history && history.length >= 2) {
            const baseline = history[history.length - 2];
            const current = history[history.length - 1];
            if (baseline && current && baseline.pillar_scores && current.pillar_scores) {
                const deltas = {};
                state.pillars.forEach(p => {
                    const b = baseline.pillar_scores[p.id] || baseline.pillar_scores[String(p.id)] || 0;
                    const c = current.pillar_scores[p.id] || current.pillar_scores[String(p.id)] || 0;
                    deltas[p.id] = { baseline: b, current: c, delta: c - b };
                });
                renderButterflyChart('history-butterfly-chart', deltas);
            }
        }

        // Render Regional FFMI distribution violin
        renderRegionalViolin('history-regional-violin', state.user.farm_region || 'Western Kenya');

        if (!history || history.length === 0) {
            container.innerHTML = '<p class="muted small">No previous assessments on record. Take an assessment to start your timeline.</p>';
            return;
        }

        container.innerHTML = `
            <table class="history-table">
                <thead>
                    <tr>
                        <th style="width: 40px;">Select</th>
                        <th>Date</th>
                        <th>Scope</th>
                        <th>FFMI Score</th>
                        <th>Maturity Status</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${history.map(item => `
                        <tr>
                            <td><input type="checkbox" class="history-checkbox" data-id="${item.id}"></td>
                            <td><strong>${item.submitted_at || item.started_at}</strong></td>
                            <td>${item.scope === 'pillar' ? `Single Pillar (P${item.target_pillar_id})` : '🚀 Full 8-Pillar'}</td>
                            <td>${item.ffmi_score !== null ? `${item.ffmi_score.toFixed(2)} / 24` : '—'}</td>
                            <td><span class="badge badge-success">${item.tier_classification || (item.tier ? `Tier ${item.tier}` : 'Draft')}</span></td>
                            <td><span class="badge ${item.status === 'completed' ? 'badge-success' : 'badge-warning'}">${item.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.querySelectorAll('.history-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                const id = cb.getAttribute('data-id');
                if (cb.checked) {
                    state.selectedHistoryIds.push(id);
                } else {
                    state.selectedHistoryIds = state.selectedHistoryIds.filter(x => x !== id);
                }
                if (compareBtn) {
                    compareBtn.disabled = state.selectedHistoryIds.length !== 2;
                }
            });
        });
    } catch (err) {
        container.innerHTML = `<p class="small" style="color: #dc2626;">Error loading history: ${err.message}</p>`;
    }
}

async function performComparison() {
    if (state.selectedHistoryIds.length !== 2) return;
    const [id1, id2] = state.selectedHistoryIds;

    showScreen('screen-loading');
    try {
        const comp = await apiCall(`/api/assessments/compare?baseline_id=${id1}&current_id=${id2}`);
        showScreen('screen-history');

        const card = document.getElementById('comparison-result-card');
        if (!card) return;
        card.hidden = false;

        document.getElementById('comp-summary-text').textContent = comp.summary_text;
        document.getElementById('comp-base-ffmi').textContent = comp.baseline_ffmi !== null ? comp.baseline_ffmi.toFixed(2) : '—';
        document.getElementById('comp-base-date').textContent = comp.baseline_date;
        document.getElementById('comp-curr-ffmi').textContent = comp.current_ffmi !== null ? comp.current_ffmi.toFixed(2) : '—';
        document.getElementById('comp-curr-date').textContent = comp.current_date;
        
        const deltaEl = document.getElementById('comp-delta-ffmi');
        if (deltaEl) {
            deltaEl.textContent = `${comp.ffmi_delta >= 0 ? '+' : ''}${comp.ffmi_delta.toFixed(2)} pts`;
        }

        const deltasTable = document.getElementById('comp-pillar-deltas-table');
        if (deltasTable && comp.pillar_deltas) {
            deltasTable.innerHTML = `
                <table class="history-table" style="margin-top: 0.5rem;">
                    <thead>
                        <tr>
                            <th>Pillar</th>
                            <th>Baseline</th>
                            <th>Current</th>
                            <th>Delta</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(comp.pillar_deltas).map(([pId, d]) => `
                            <tr>
                                <td><strong>Pillar ${pId}</strong></td>
                                <td>${(d.baseline * 100).toFixed(0)}%</td>
                                <td>${(d.current * 100).toFixed(0)}%</td>
                                <td style="font-weight: 700; color: ${d.delta >= 0 ? '#16a34a' : '#dc2626'};">
                                    ${d.delta >= 0 ? '+' : ''}${(d.delta * 100).toFixed(1)}% (${d.delta >= 0 ? '+' : ''}${d.delta.toFixed(2)})
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (err) {
        alert(`Error comparing assessments: ${err.message}`);
        showScreen('screen-history');
    }
}

// ─── 6. Services & Learning Portals ─────────────────────────────────────────
async function loadServicesPortal(filter = 'all') {
    const container = document.getElementById('services-catalogue-container');
    if (!container) return;

    try {
        const services = await apiCall('/api/portal/services');
        state.services = services;

        const filtered = filter === 'recommended' 
            ? services.filter(s => s.is_recommended)
            : services;

        if (filtered.length === 0) {
            container.innerHTML = '<p class="muted small">No services found for this filter.</p>';
            return;
        }

        container.innerHTML = filtered.map((s, idx) => `
            <div class="card" style="display: flex; flex-direction: column; position: relative;">
                <div class="watermark-numeral">0${idx + 1}</div>
                ${s.is_recommended ? '<span class="badge badge-success" style="position: absolute; top: 1rem; left: 1rem;">⭐ Recommended</span>' : ''}
                <div style="font-size: 2.2rem; margin-top: ${s.is_recommended ? '1.8rem' : '0'}; margin-bottom: 0.5rem;">${s.icon || '🚜'}</div>
                <div class="small" style="color: var(--color-emerald-500); font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">${s.provider}</div>
                <h3 style="font-size: 1.15rem; margin: 0.25rem 0 0.5rem 0;">${s.title}</h3>
                <p class="muted small" style="flex: 1; margin-bottom: 0.75rem;">${s.description}</p>
                <div class="small" style="font-weight: 700; color: var(--color-text-dark); margin-bottom: 0.25rem;">💰 ${s.cost_model}</div>
                <div class="small" style="font-weight: 600; color: var(--color-emerald-500); margin-bottom: 1.25rem;">🎯 ${s.estimated_impact}</div>
                <button class="btn btn-primary btn-sm btn-request-service" data-service-id="${s.id}" type="button">
                    Request Service (+30 XP)
                </button>
            </div>
        `).join('');

        container.querySelectorAll('.btn-request-service').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const sId = btn.getAttribute('data-service-id');
                btn.disabled = true;
                btn.textContent = 'Requesting…';
                try {
                    await apiCall('/api/portal/services/request', 'POST', { service_id: sId, notes: 'Requested from platform' });
                    btn.textContent = '✅ Requested!';
                    btn.className = 'btn btn-ghost btn-sm';
                    awardXP(30, 'Service Requested! 🚜', e);
                    refreshDashboard();
                } catch (err) {
                    alert(`Error requesting service: ${err.message}`);
                    btn.disabled = false;
                    btn.textContent = 'Request Service (+30 XP)';
                }
            });
        });
    } catch (err) {
        container.innerHTML = `<p class="small" style="color: #dc2626;">Error loading services: ${err.message}</p>`;
    }
}

async function loadLearningPortal(filter = 'all') {
    const container = document.getElementById('learning-catalogue-container');
    if (!container) return;

    try {
        const modules = await apiCall('/api/portal/learning');
        state.learning = modules;

        const filtered = filter === 'recommended' 
            ? modules.filter(m => m.is_recommended)
            : modules;

        if (filtered.length === 0) {
            container.innerHTML = '<p class="muted small">No learning modules found for this filter.</p>';
            return;
        }

        container.innerHTML = filtered.map((m, idx) => `
            <div class="card" style="display: flex; flex-direction: column; position: relative;">
                <div class="watermark-numeral">0${idx + 1}</div>
                ${m.is_recommended ? '<span class="badge badge-success" style="position: absolute; top: 1rem; left: 1rem;">⭐ Recommended</span>' : ''}
                <div style="font-size: 2.2rem; margin-top: ${m.is_recommended ? '1.8rem' : '0'}; margin-bottom: 0.5rem;">${m.icon || '📚'}</div>
                <div class="small" style="color: var(--color-emerald-500); font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">${m.category || 'Module'} · ${m.duration_minutes} Mins</div>
                <h3 style="font-size: 1.15rem; margin: 0.25rem 0 0.5rem 0;">${m.title}</h3>
                <p class="muted small" style="flex: 1; margin-bottom: 0.75rem;">${m.description || m.summary}</p>
                <div class="small" style="margin-bottom: 1.25rem;">
                    <strong>Takeaway:</strong> ${m.key_takeaways || 'Field best practices.'}
                </div>
                <button class="btn btn-primary btn-sm btn-complete-learning" data-module-id="${m.id}" type="button">
                    Mark Completed (+50 XP)
                </button>
            </div>
        `).join('');

        container.querySelectorAll('.btn-complete-learning').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const mId = btn.getAttribute('data-module-id');
                btn.disabled = true;
                btn.textContent = 'Saving…';
                try {
                    await apiCall(`/api/portal/learning/${mId}/complete`, 'POST');
                    btn.textContent = '🎓 Completed!';
                    btn.className = 'btn btn-ghost btn-sm';
                    awardXP(50, 'Course Completed! 📚', e);
                    refreshDashboard();
                } catch (err) {
                    alert(`Error completing module: ${err.message}`);
                    btn.disabled = false;
                    btn.textContent = 'Mark Completed (+50 XP)';
                }
            });
        });
    } catch (err) {
        container.innerHTML = `<p class="small" style="color: #dc2626;">Error loading learning modules: ${err.message}</p>`;
    }
}

// ─── 7. Scenario Simulator ──────────────────────────────────────────────────
function initSimulator() {
    const container = document.getElementById('sim-sliders-container');
    if (!container) return;

    container.innerHTML = state.pillars.map(p => `
        <div style="background: var(--color-canvas); padding: 0.75rem 1rem; border-radius: var(--radius-sm);">
            <div style="display: flex; justify-content: space-between; font-size: 0.84rem; font-weight: 700; margin-bottom: 0.25rem;">
                <span>${p.icon} P${p.id}: ${p.name}</span>
                <span id="sim-val-${p.id}" style="color: var(--color-emerald-500);">75%</span>
            </div>
            <input type="range" id="sim-slider-${p.id}" min="0" max="100" value="${(state.simScores[p.id] || 0.5) * 100}" style="width: 100%; accent-color: var(--color-emerald-500);">
        </div>
    `).join('');

    state.pillars.forEach(p => {
        const slider = document.getElementById(`sim-slider-${p.id}`);
        if (slider) {
            slider.addEventListener('input', () => {
                const val = parseInt(slider.value, 10) / 100.0;
                state.simScores[p.id] = val;
                document.getElementById(`sim-val-${p.id}`).textContent = `${Math.round(val * 100)}%`;
                recalcSimulation();
            });
        }
    });

    recalcSimulation();
}

function recalcSimulation() {
    let totalPoints = 0.0;
    Object.values(state.simScores).forEach(score => {
        totalPoints += score * 3.0;
    });

    const ffmi = Math.min(24.0, totalPoints);
    let tier = 1;
    let tierName = 'Piloting Farm';

    if (ffmi >= 21.0) { tier = 5; tierName = 'Commercial Lighthouse Farm'; }
    else if (ffmi >= 16.0) { tier = 4; tierName = 'Established Agribusiness'; }
    else if (ffmi >= 11.0) { tier = 3; tierName = 'Commercializing Farm'; }
    else if (ffmi >= 6.0) { tier = 2; tierName = 'Transitioning Smallholder'; }

    const simFfmi = document.getElementById('sim-result-ffmi');
    const simTier = document.getElementById('sim-result-tier');
    const simRisk = document.getElementById('sim-risk-badge');

    if (simFfmi) simFfmi.textContent = `${ffmi.toFixed(2)} / 24.00`;
    if (simTier) simTier.textContent = `${tierName} (Tier ${tier})`;

    if (simRisk) {
        if (tier >= 4) { simRisk.textContent = '🟢 Low Trajectory Risk'; simRisk.className = 'badge badge-success'; }
        else if (tier >= 2) { simRisk.textContent = '🟡 Medium Trajectory Risk'; simRisk.className = 'badge badge-warning'; }
        else { simRisk.textContent = '🔴 High Trajectory Risk'; simRisk.className = 'badge badge-danger'; }
    }

    renderInteractiveRadarChart('sim-radar-chart', state.simScores, null, null, false);
    renderEconomicDividendChart('sim-economic-dividend', state.simScores, (state.user && state.user.farm_crop_type) || 'Maize', (state.user && state.user.farm_size_acres) || 5.0);
    renderTierMilestoneLadder('sim-tier-ladder', ffmi, tier);
}

// ─── 8. Auth & Profile Handlers ─────────────────────────────────────────────
function initAuthAndProfile() {
    const tabLogin = document.getElementById('tab-auth-login');
    const tabReg = document.getElementById('tab-auth-register');
    const formLogin = document.getElementById('form-login-container');
    const formReg = document.getElementById('form-register-container');

    if (tabLogin && tabReg) {
        tabLogin.onclick = () => {
            tabLogin.classList.add('active');
            tabReg.classList.remove('active');
            formLogin.hidden = false;
            formReg.hidden = true;
        };
        tabReg.onclick = () => {
            tabReg.classList.add('active');
            tabLogin.classList.remove('active');
            formReg.hidden = false;
            formLogin.hidden = true;
        };
    }

    const btnLogin = document.getElementById('btn-do-login');
    if (btnLogin) {
        btnLogin.onclick = async () => {
            const email = document.getElementById('login-identifier').value.trim().toLowerCase();
            const pass = document.getElementById('login-password').value;
            if (!email) { alert('Please enter your email address'); return; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email address'); return; }
            if (!pass) { alert('Please enter your password'); return; }

            try {
                const res = await apiCall('/api/auth/login', 'POST', { email, password: pass });
                state.token = res.access_token;
                localStorage.setItem('fff_token', res.access_token);
                state.user = {
                    id: res.user_id,
                    name: res.name,
                    phone: res.phone,
                    email: res.email,
                    farm_name: res.farm_name,
                    farm_region: res.farm_region,
                    farm_crop_type: res.farm_crop_type,
                    farm_size_acres: res.farm_size_acres,
                    tier: res.tier,
                    tier_name: res.tier_name,
                    ffmi_score: res.ffmi_score
                };
                localStorage.setItem('fff_user', JSON.stringify(state.user));
                updateHeaderHUD();
                await syncGamificationState();
                refreshDashboard();
                showScreen('screen-dashboard');
            } catch (err) {
                alert(`Login failed: ${err.message}`);
            }
        };
    }

    const btnReg = document.getElementById('btn-do-register');
    if (btnReg) {
        btnReg.onclick = async () => {
            const name = document.getElementById('reg-name').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            const email = document.getElementById('reg-email').value.trim().toLowerCase();
            const pass = document.getElementById('reg-password').value;
            const farmName = document.getElementById('reg-farm-name').value.trim();
            const region = document.getElementById('reg-region').value;
            const size = parseFloat(document.getElementById('reg-size').value) || 5.0;
            const crop = document.getElementById('reg-crop').value.trim();

            if (!name) { alert('Full name is required'); return; }
            if (!email) { alert('Email address is required'); return; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email address'); return; }
            if (!pass || pass.length < 8) { alert('Password must be at least 8 characters'); return; }

            try {
                const res = await apiCall('/api/auth/register', 'POST', {
                    name, email, password: pass, phone: phone || null,
                    farm_name: farmName || 'My Demonstration Farm',
                    region, crop_type: crop, size_acres: size
                });
                state.token = res.access_token;
                localStorage.setItem('fff_token', res.access_token);
                state.user = {
                    id: res.user_id,
                    name: res.name,
                    phone: res.phone,
                    email: res.email,
                    farm_name: res.farm_name,
                    farm_region: res.farm_region,
                    farm_crop_type: res.farm_crop_type,
                    farm_size_acres: res.farm_size_acres,
                    tier: res.tier || 1,
                    tier_name: res.tier_name || 'Piloting Farm',
                    ffmi_score: res.ffmi_score || 0.0
                };
                localStorage.setItem('fff_user', JSON.stringify(state.user));
                updateHeaderHUD();
                awardXP(100, 'Welcome to Future Farms! 🌱');
                refreshDashboard();
                showScreen('screen-dashboard');
            } catch (err) {
                alert(`Registration failed: ${err.message}`);
            }
        };
    }

    const btnSaveProf = document.getElementById('btn-save-profile');
    if (btnSaveProf) {
        btnSaveProf.onclick = async () => {
            const name = document.getElementById('prof-name').value.trim();
            const phone = document.getElementById('prof-phone').value.trim();
            const email = document.getElementById('prof-email').value.trim();
            const farmName = document.getElementById('prof-farm-name').value.trim();
            const region = document.getElementById('prof-region').value;
            const size = parseFloat(document.getElementById('prof-size').value) || 5.0;
            const crop = document.getElementById('prof-crop').value.trim();

            state.user.name = name;
            state.user.phone = phone;
            state.user.email = email;
            state.user.farm_name = farmName;
            state.user.farm_region = region;
            state.user.farm_size_acres = size;
            state.user.farm_crop_type = crop;
            localStorage.setItem('fff_user', JSON.stringify(state.user));

            if (state.token) {
                try {
                    await apiCall('/api/auth/me', 'PUT', {
                        name, phone, email, farm_name: farmName, farm_region: region,
                        farm_crop_type: crop, size_acres: size
                    });
                } catch (e) {}
            }

            refreshDashboard();
            alert('Profile saved successfully!');
            showScreen('screen-dashboard');
        };
    }
}

// ─── DOM Ready ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Navigation bar tabs
    document.getElementById('nav-btn-dashboard').onclick = () => { refreshDashboard(); showScreen('screen-dashboard'); };
    document.getElementById('nav-btn-journey').onclick = () => { loadJourneyScreen(); showScreen('screen-journey'); };
    document.getElementById('nav-btn-assessment').onclick = () => { showScreen('screen-assessment-choice'); };
    document.getElementById('nav-btn-history').onclick = () => { loadAssessmentHistory(); showScreen('screen-history'); };
    document.getElementById('nav-btn-services').onclick = () => { loadServicesPortal(); showScreen('screen-services'); };
    document.getElementById('nav-btn-learning').onclick = () => { loadLearningPortal(); showScreen('screen-learning'); };
    document.getElementById('nav-btn-profile').onclick = () => { showScreen('screen-profile'); };
    document.getElementById('nav-btn-simulator').onclick = () => { showScreen('screen-simulator'); };
    document.getElementById('nav-btn-auth').onclick = () => {
        if (state.token) {
            clearSession();
            alert('Signed out.');
        }
        showScreen('screen-auth');
    };

    // Header HUD click -> Journey
    const hudPill = document.getElementById('header-hud-group');
    if (hudPill) {
        hudPill.style.cursor = 'pointer';
        hudPill.onclick = () => { loadJourneyScreen(); showScreen('screen-journey'); };
    }

    document.getElementById('user-profile-pill').onclick = () => showScreen('screen-profile');
    document.getElementById('brand-home-trigger').onclick = () => { refreshDashboard(); showScreen('screen-dashboard'); };

    // Dashboard CTAs
    document.getElementById('dash-btn-start-assess').onclick = () => showScreen('screen-assessment-choice');
    document.getElementById('dash-btn-view-journey').onclick = () => { loadJourneyScreen(); showScreen('screen-journey'); };
    const btnOpenQuests = document.getElementById('dash-btn-open-quests');
    if (btnOpenQuests) btnOpenQuests.onclick = () => { loadJourneyScreen(); showScreen('screen-journey'); };

    document.getElementById('dash-card-btn-full').onclick = () => startAssessmentFlow('full', null);
    document.getElementById('dash-card-btn-pillar').onclick = () => showScreen('screen-assessment-choice');
    document.getElementById('dash-card-btn-services').onclick = () => { loadServicesPortal(); showScreen('screen-services'); };
    document.getElementById('dash-card-btn-learning').onclick = () => { loadLearningPortal(); showScreen('screen-learning'); };
    document.getElementById('dash-btn-view-recs').onclick = () => { loadServicesPortal('recommended'); showScreen('screen-services'); };

    // Journey Screen Badge Filter Pills
    const filterAll = document.getElementById('filter-badges-all');
    const filterUnlocked = document.getElementById('filter-badges-unlocked');
    const filterProg = document.getElementById('filter-badges-progress');

    if (filterAll && filterUnlocked && filterProg) {
        filterAll.onclick = () => {
            [filterAll, filterUnlocked, filterProg].forEach(b => b.classList.remove('active'));
            filterAll.classList.add('active');
            renderBadges('all');
        };
        filterUnlocked.onclick = () => {
            [filterAll, filterUnlocked, filterProg].forEach(b => b.classList.remove('active'));
            filterUnlocked.classList.add('active');
            renderBadges('unlocked');
        };
        filterProg.onclick = () => {
            [filterAll, filterUnlocked, filterProg].forEach(b => b.classList.remove('active'));
            filterProg.classList.add('active');
            renderBadges('in_progress');
        };
    }

    // Leaderboard Region Filter Pills
    const lbW = document.getElementById('lb-filter-western');
    const lbR = document.getElementById('lb-filter-rift');
    const lbC = document.getElementById('lb-filter-central');
    const lbA = document.getElementById('lb-filter-all');

    if (lbW && lbR && lbC && lbA) {
        const lbPills = [lbW, lbR, lbC, lbA];
        lbPills.forEach(p => {
            p.onclick = () => {
                lbPills.forEach(b => b.classList.remove('active'));
                p.classList.add('active');
                renderLeaderboard(p.getAttribute('data-region'));
            };
        });
    }

    // Question answering buttons
    document.getElementById('btn-yes').onclick = (e) => handleAnswer('yes', e);
    document.getElementById('btn-no').onclick = (e) => handleAnswer('no', e);
    document.getElementById('btn-prev').onclick = () => {
        if (state.assessment.currentIndex > 0) {
            state.assessment.currentIndex--;
            renderCurrentQuestion();
        }
    };
    document.getElementById('btn-skip').onclick = (e) => {
        handleAnswer('no', e);
    };

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
        if (state.activeScreen !== 'screen-question') return;
        if (e.key === 'y' || e.key === 'Y') handleAnswer('yes');
        else if (e.key === 'n' || e.key === 'N') handleAnswer('no');
        else if (e.key === 'ArrowLeft' && state.assessment.currentIndex > 0) {
            state.assessment.currentIndex--;
            renderCurrentQuestion();
        }
    });

    const btnResJourney = document.getElementById('btn-result-view-journey');
    if (btnResJourney) btnResJourney.onclick = () => { loadJourneyScreen(); showScreen('screen-journey'); };

    document.getElementById('btn-compare-selected').onclick = () => performComparison();

    document.getElementById('btn-close-level-modal').onclick = () => {
        document.getElementById('modal-level-up').hidden = true;
    };
    document.getElementById('btn-close-badge-modal').onclick = () => {
        document.getElementById('modal-badge-unlocked').hidden = true;
    };

    document.getElementById('filter-services-all').onclick = (e) => {
        document.querySelectorAll('#screen-services .filter-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        loadServicesPortal('all');
    };
    document.getElementById('filter-services-rec').onclick = (e) => {
        document.querySelectorAll('#screen-services .filter-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        loadServicesPortal('recommended');
    };

    document.getElementById('filter-learning-all').onclick = (e) => {
        document.querySelectorAll('#screen-learning .filter-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        loadLearningPortal('all');
    };
    document.getElementById('filter-learning-rec').onclick = (e) => {
        document.querySelectorAll('#screen-learning .filter-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        loadLearningPortal('recommended');
    };

    // Corporate Footer Links
    const fDash = document.getElementById('footer-link-dashboard');
    if (fDash) fDash.onclick = (e) => { e.preventDefault(); refreshDashboard(); showScreen('screen-dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const fJour = document.getElementById('footer-link-journey');
    if (fJour) fJour.onclick = (e) => { e.preventDefault(); loadJourneyScreen(); showScreen('screen-journey'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const fAssess = document.getElementById('footer-link-assessment');
    if (fAssess) fAssess.onclick = (e) => { e.preventDefault(); showScreen('screen-assessment-choice'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const fServ = document.getElementById('footer-link-services');
    if (fServ) fServ.onclick = (e) => { e.preventDefault(); loadServicesPortal(); showScreen('screen-services'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const fLearn = document.getElementById('footer-link-learning');
    if (fLearn) fLearn.onclick = (e) => { e.preventDefault(); loadLearningPortal(); showScreen('screen-learning'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const fSim = document.getElementById('footer-link-simulator');
    if (fSim) fSim.onclick = (e) => { e.preventDefault(); showScreen('screen-simulator'); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    // Initialize platform
    initAssessmentPathChooser();
    initSimulator();
    initAuthAndProfile();
    if (isAuthenticated()) {
        syncGamificationState();
        refreshDashboard();
        showScreen('screen-dashboard');
    } else {
        showScreen('screen-auth');
    }
});
